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
  // In a real implementation, this would call your backend to create an order
  // For testing purposes, we're returning a mock response
  return {
    id: `order_${Date.now()}`,
    amount,
    currency,
    status: 'created'
  };
};

export const verifyPayment = async (orderId: string, paymentId: string, signature: string): Promise<boolean> => {
  // In a real implementation, this would call your backend to verify the payment
  // For testing purposes, we're returning true
  console.log('Verifying payment:', { orderId, paymentId, signature });
  return true;
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