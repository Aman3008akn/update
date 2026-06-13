// Verify Razorpay payment function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Simple HMAC SHA256 implementation for signature verification
async function createHmacSha256(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: { ...corsHeaders, "Access-Control-Allow-Methods": "POST, OPTIONS" },
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
          headers: { ...corsHeaders, "Content-Type": "application/json", "Access-Control-Allow-Methods": "POST, OPTIONS" },
          status: 400,
        }
      );
    }

    // Get Razorpay key secret from environment variables
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeySecret) {
      console.error('Razorpay key secret not configured');
      return new Response(
        JSON.stringify({ error: 'Razorpay credentials not configured' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json", "Access-Control-Allow-Methods": "POST, OPTIONS" },
          status: 500,
        }
      );
    }

    console.log('Verifying payment signature');

    // Create the expected signature
    const expectedSignature = await createHmacSha256(
      razorpayKeySecret,
      `${order_id}|${payment_id}`
    );

    console.log('Expected signature:', expectedSignature);
    console.log('Received signature:', signature);

    // Verify the signature
    const verified = expectedSignature === signature.toLowerCase();

    if (verified) {
      console.log('Payment verified successfully');
      return new Response(
        JSON.stringify({
          verified: true,
          message: 'Payment verified successfully'
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json", "Access-Control-Allow-Methods": "POST, OPTIONS" },
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
          headers: { ...corsHeaders, "Content-Type": "application/json", "Access-Control-Allow-Methods": "POST, OPTIONS" },
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error('Error in verify-razorpay-payment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Access-Control-Allow-Methods": "POST, OPTIONS" },
        status: 500,
      }
    );
  }
});