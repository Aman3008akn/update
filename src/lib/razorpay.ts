// Razorpay utility functions
// Note: This is for client-side integration. For production, you should move the server-side code to a secure backend.

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

export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount: number, currency: string = 'INR'): Promise<RazorpayOrder> => {
  // In a real implementation, this would call your backend to create an order.
  // For this client-side mock, we're simulating a call to a hypothetical backend endpoint.
  // You would need to implement a server-side endpoint (e.g., /api/create-razorpay-order)
  // that securely interacts with Razorpay's API to create a real order.
  try {
    const response = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to create Razorpay order on backend:', errorData);
      throw new Error(errorData.message || 'Failed to create Razorpay order');
    }

    const order = await response.json();
    console.log('Mock Razorpay order created:', order);
    return order; // Expecting { id: "order_...", amount: ..., currency: ..., status: "created" }
  } catch (error) {
    console.error('Error simulating Razorpay order creation:', error);
    // Fallback to a client-side mock if the API call fails or is not implemented
    return {
      id: `order_${Date.now()}`,
      amount,
      currency,
      status: 'created'
    };
  }
};

export const verifyPayment = async (orderId: string, paymentId: string, signature: string): Promise<boolean> => {
  // In a real implementation, this would call your backend to verify the payment signature.
  // You would need to implement a server-side endpoint (e.g., /api/verify-razorpay-payment)
  // that securely verifies the payment details with Razorpay's API.
  try {
    const response = await fetch('/api/verify-razorpay-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, paymentId, signature }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to verify Razorpay payment on backend:', errorData);
      return false;
    }

    const verificationResult = await response.json();
    console.log('Mock Razorpay payment verification result:', verificationResult);
    return verificationResult.verified; // Expecting { verified: true/false }
  } catch (error) {
    console.error('Error simulating Razorpay payment verification:', error);
    // Fallback to client-side mock verification if API call fails
    return true;
  }
};

export const openRazorpayCheckout = (options: RazorpayOptions) => {
  if (typeof window !== 'undefined' && window.Razorpay) {
    const rzp = new window.Razorpay(options);
    rzp.open();
    return rzp;
  } else {
    throw new Error('Razorpay SDK not loaded');
  }
};
