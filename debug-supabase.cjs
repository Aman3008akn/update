const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials
const supabaseUrl = "https://egoxtqrujcshfllgvkse.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3h0cXJ1amNzaGZsbGd2a3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODQzNzAsImV4cCI6MjA3OTU2MDM3MH0.pevbveZqiLP_cHGy-UFp_St7w3ov6BUNRc0ePx1MYsQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugSupabase() {
  console.log('Debugging Supabase connection and orders table...');
  
  // Check if we can connect to Supabase by fetching existing orders
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('Supabase connection error:', error);
      return;
    }
    
    console.log('Supabase connection successful. Sample orders:', data);
  } catch (err) {
    console.error('Unexpected error connecting to Supabase:', err);
    return;
  }
  
  // Try to insert a test order
  console.log('\n--- Testing order insertion ---');
  const testOrder = {
    id: `DEBUG-ORDER-${Date.now()}`,
    items: [{ id: 1, name: 'Debug Product', price: 10.99, quantity: 1 }],
    total_amount: 10.99,
    status: 'Debug',
    customer_name: 'Debug Customer',
    customer_email: 'debug@example.com',
    customer_phone: '000-000-0000',
    user_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  console.log('Inserting test order:', testOrder);
  
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([testOrder]);
      
    if (error) {
      console.error('Error inserting test order:', error);
      return;
    }
    
    console.log('Test order inserted successfully:', data);
  } catch (err) {
    console.error('Unexpected error inserting test order:', err);
    return;
  }
  
  // Try to fetch the test order
  console.log('\n--- Testing order retrieval ---');
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', testOrder.id);
      
    if (error) {
      console.error('Error fetching test order:', error);
      return;
    }
    
    console.log('Test order fetched successfully:', data);
  } catch (err) {
    console.error('Unexpected error fetching test order:', err);
    return;
  }
  
  console.log('\n--- Debug complete ---');
}

debugSupabase();