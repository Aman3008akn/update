// Create Razorpay order function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: { ...corsHeaders, "Access-Control-Allow-Methods": "POST, OPTIONS" },
    });
  }

  try {
    console.log('Received request to create Razorpay order');

    // Get the request body
    const body = await req.json();
    console.log('Request body:', body);

    const { amount, currency } = body;

    // Validate required fields
    if (!amount || !currency) {
      console.error('Validation failed: Amount and currency are required');
      return new Response(
        JSON.stringify({ error: 'Amount and currency are required' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json", "Access-Control-Allow-Methods": "POST, OPTIONS" },
          status: 400,
        }
      );
    }

    // Get Razorpay credentials from environment variables
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Razorpay credentials not configured' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json", "Access-Control-Allow-Methods": "POST, OPTIONS" },
          status: 500,
        }
      );
    }

    console.log('Creating Razorpay order with amount:', amount, 'currency:', currency);

    // Create order using Razorpay API
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        payment_capture: 1, // Auto capture payment
      }),
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.text();
      console.error('Razorpay API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to create Razorpay order' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json", "Access-Control-Allow-Methods": "POST, OPTIONS" },
          status: 500,
        }
      );
    }

    const orderData = await razorpayResponse.json();
    console.log('Razorpay order created:', orderData);

    return new Response(
      JSON.stringify(orderData),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Access-Control-Allow-Methods": "POST, OPTIONS" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-razorpay-order function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Access-Control-Allow-Methods": "POST, OPTIONS" },
        status: 500,
      }
    );
  }
});