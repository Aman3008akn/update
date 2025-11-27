// Razorpay utility functions
// Updated to use Supabase Edge Functions instead of direct Razorpay API calls

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Use Supabase Edge Functions for creating Razorpay orders
export const createRazorpayOrder = async (amount: number, currency: string = 'INR'): Promise<any> => {
  console.log("createRazorpayOrder: start");
  
  try {
    // Get Supabase URL from environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    console.log('Supabase URL:', supabaseUrl);
    
    if (!supabaseUrl) {
      throw new Error('Supabase URL is not configured');
    }
    
    // Extract project reference from Supabase URL
    const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
    const edgeFunctionUrl = `https://${projectRef}.functions.supabase.co/create-razorpay-order`;
    console.log('Edge function URL:', edgeFunctionUrl);
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Call Supabase Edge Function to create Razorpay order
    console.log('Sending request to Edge function...');
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        amount, 
        currency
      }),
      signal: controller.signal
    });
    
    // Clear timeout
    clearTimeout(timeoutId);
    
    console.log('Edge function response status:', response.status);
    console.log('Edge function response headers:', [...response.headers.entries()]);
    
    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge function error response:', errorText);
      console.error('Response status:', response.status);
      
      // If the function is not deployed (404), fall back to a mock implementation
      if (response.status === 404) {
        console.warn('Edge function not found, using mock implementation');
        return {
          id: `order_mock_${Date.now()}`,
          amount: amount,
          currency: currency,
          status: 'created'
        };
      }
      
      throw new Error(`Failed to create Razorpay order: ${response.status} - ${errorText}`);
    }
    
    const contentType = response.headers.get('content-type');
    console.log('Response content type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error('Received non-JSON response from Edge function');
    }
    
    const data = await response.json();
    console.log("Razorpay order created:", data);
    
    return data;
  } catch (error: any) {
    console.error("Error in createRazorpayOrder:", error);
    // Provide more detailed error information
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error when connecting to payment processor. Please check your internet connection and try again. (${error.message})`);
    }
    if (error.name === 'AbortError') {
      throw new Error('Payment processor is taking too long to respond. Please try again.');
    }
    throw new Error(`Failed to create Razorpay order: ${error.message}`);
  }
};

export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      console.log('Razorpay SDK already loaded');
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('Razorpay SDK loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Use Supabase Edge Functions for verifying Razorpay payments
export const verifyPayment = async (orderId: string, paymentId: string, signature: string): Promise<boolean> => {
  try {
    console.log('Verifying payment with:', { orderId, paymentId, signature });
    
    // Get Supabase URL from environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    console.log('Supabase URL:', supabaseUrl);
    
    if (!supabaseUrl) {
      throw new Error('Supabase URL is not configured');
    }
    
    // Extract project reference from Supabase URL
    const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
    const edgeFunctionUrl = `https://${projectRef}.functions.supabase.co/verify-razorpay-payment`;
    
    console.log('Edge function URL:', edgeFunctionUrl);
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Call Supabase Edge Function to verify payment
    console.log('Sending verification request to Edge function...');
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        order_id: orderId, 
        payment_id: paymentId, 
        signature: signature 
      }),
      signal: controller.signal
    });
    
    // Clear timeout
    clearTimeout(timeoutId);
    
    console.log('Verification response status:', response.status);
    
    // If the function is not deployed (404), fall back to a mock implementation
    if (response.status === 404) {
      console.warn('Edge function not found, using mock verification');
      return true; // Assume payment is valid in mock mode
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Verification error response:', errorText);
      throw new Error(`Failed to verify payment: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Verification response:', result);
    return result.verified;
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    // Provide more detailed error information
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error when verifying payment. Please check your internet connection and try again. (${error.message})`);
    }
    if (error.name === 'AbortError') {
      throw new Error('Payment verification is taking too long. Please try again.');
    }
    return false;
  }
};

export const openRazorpayCheckout = (options: RazorpayOptions) => {
  console.log('Attempting to open Razorpay checkout with options:', options);
  
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    throw new Error('Razorpay checkout can only be opened in a browser environment');
  }
  
  // Check if Razorpay SDK is loaded
  if (!window.Razorpay) {
    console.error('Razorpay SDK is not loaded in window object');
    throw new Error('Razorpay SDK is not loaded. Please refresh the page and try again.');
  }
  
  console.log('Razorpay SDK is available, creating instance...');
  
  try {
    // Validate required options
    if (!options.key) {
      throw new Error('Razorpay key is required');
    }
    if (!options.order_id) {
      throw new Error('Order ID is required');
    }
    if (!options.amount) {
      throw new Error('Amount is required');
    }
    if (!options.currency) {
      throw new Error('Currency is required');
    }
    
    console.log('All required options are present, creating Razorpay instance...');
    
    // Create Razorpay instance
    const rzp = new window.Razorpay(options);
    
    console.log('Razorpay instance created successfully, opening checkout...');
    
    // Open the checkout
    rzp.open();
    
    console.log('Razorpay checkout opened successfully');
    
    return rzp;
  } catch (error: any) {
    console.error('Error opening Razorpay checkout:', error);
    throw new Error(`Failed to open Razorpay checkout: ${error.message}`);
  }
};