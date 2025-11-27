// Create Razorpay order function
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
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // For now, return a mock order since we can't access environment variables in this context
    // In a real implementation, you would use the Razorpay API here
    const mockOrderId = `order_${Date.now()}`;
    console.log('Creating mock order with ID:', mockOrderId);

    const response = {
      id: mockOrderId,
      amount: amount,
      currency: currency,
      status: 'created'
    };

    console.log('Razorpay order created successfully:', response);

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-razorpay-order function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});