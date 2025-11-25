// Simple test to verify admin dashboard can fetch orders
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials
const supabaseUrl = "https://egoxtqrujcshfllgvkse.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3h0cXJ1amNzaGZsbGd2a3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODQzNzAsImV4cCI6MjA3OTU2MDM3MH0.pevbveZqiLP_cHGy-UFp_St7w3ov6BUNRc0ePx1MYsQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminOrders() {
  console.log('Testing admin orders fetch...');
  
  // Test fetching orders
  console.log('Fetching orders...');
  const { data: orders, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (fetchError) {
    console.error('Error fetching orders:', fetchError);
    return;
  }
  
  console.log('Fetched orders:', orders);
}

testAdminOrders();