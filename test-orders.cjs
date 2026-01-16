const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials
const supabaseUrl = "https://egoxtqrujcshfllgvkse.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3h0cXJ1amNzaGZsbGd2a3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODQzNzAsImV4cCI6MjA3OTU2MDM3MH0.pevbveZqiLP_cHGy-UFp_St7w3ov6BUNRc0ePx1MYsQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkOrders() {
  console.log('Checking orders in Supabase...');
  
  // Fetch all orders
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching orders:', error);
    return;
  }
  
  console.log(`Found ${orders.length} orders:`);
  orders.forEach((order, index) => {
    console.log(`${index + 1}. Order ID: ${order.id}, Customer: ${order.customer_name}, Total: ${order.total_amount}, Status: ${order.status}`);
  });
}

checkOrders();