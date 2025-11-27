// Verify Razorpay payment function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('Received request to verify Razorpay payment');
    
    // Get the request body
    const body = await req.json();
    console.log('Request body:', body);
    
    const { order_id, payment_id, signature } = body;

    // Validate required fields
    if (!order_id || !payment_id || !signature) {
      console.error('Validation failed: Order ID, Payment ID, and Signature are required');
      return new Response(
        JSON.stringify({ error: 'Order ID, Payment ID, and Signature are required' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // For now, we'll return a mock verification result
    console.log('Mock verifying payment');
    const verified = true;

    if (verified) {
      console.log('Payment verified successfully');
      return new Response(
        JSON.stringify({
          verified: true,
          message: 'Payment verified successfully'
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      console.log('Payment verification failed');
      return new Response(
        JSON.stringify({
          verified: false,
          message: 'Payment verification failed'
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error('Error in verify-razorpay-payment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});