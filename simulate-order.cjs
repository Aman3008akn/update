const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials
const supabaseUrl = "https://egoxtqrujcshfllgvkse.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3h0cXJ1amNzaGZsbGd2a3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODQzNzAsImV4cCI6MjA3OTU2MDM3MH0.pevbveZqiLP_cHGy-UFp_St7w3ov6BUNRc0ePx1MYsQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function simulateOrder() {
  console.log('Simulating order placement...');
  
  // Order data similar to what would be created in the checkout
  const orderData = {
    id: `ORD-${Date.now()}`,
    items: [
      {
        id: 1,
        name: "Test Product",
        price: 29.99,
        quantity: 2
      }
    ],
    total_amount: 59.98,
    status: 'Pending',
    customer_name: 'Test Customer',
    customer_email: 'test@example.com',
    customer_phone: '123-456-7890',
    user_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  console.log('Inserting order:', orderData);
  
  // Insert the order
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData]);
    
  if (error) {
    console.error('Error inserting order:', error);
    return;
  }
  
  console.log('Order inserted successfully:', data);
  
  // Fetch the order to verify it was saved
  const { data: fetchedOrders, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderData.id);
    
  if (fetchError) {
    console.error('Error fetching order:', fetchError);
    return;
  }
  
  console.log('Fetched order:', fetchedOrders);
}

simulateOrder();