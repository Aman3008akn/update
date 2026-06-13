import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials
const supabaseUrl = "https://egoxtqrujcshfllgvkse.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3h0cXJ1amNzaGZsbGd2a3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODQzNzAsImV4cCI6MjA3OTU2MDM3MH0.pevbveZqiLP_cHGy-UFp_St7w3ov6BUNRc0ePx1MYsQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testOrders() {
  console.log('Testing orders functionality...');
  
  // First, let's check the structure of the orders table
  console.log('Checking orders table structure...');
  const { data: columns, error: columnsError } = await supabase
    .from('information_schema.columns')
    .select('column_name, data_type')
    .eq('table_name', 'orders')
    .order('ordinal_position');
    
  if (columnsError) {
    console.error('Error fetching table structure:', columnsError);
  } else {
    console.log('Orders table structure:', columns);
  }
  
  // Test inserting an order with minimal fields
  const testOrder = {
    id: 'TEST-ORDER-' + Date.now(),
    total_amount: 200,
    status: 'Pending',
    customer_name: 'Test Customer',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  console.log('Inserting test order...');
  const { data, error } = await supabase
    .from('orders')
    .insert([testOrder]);
    
  if (error) {
    console.error('Error inserting order:', error);
    return;
  }
  
  console.log('Order inserted successfully:', data);
  
  // Test fetching orders
  console.log('Fetching orders...');
  const { data: orders, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
    
  if (fetchError) {
    console.error('Error fetching orders:', fetchError);
    return;
  }
  
  console.log('Fetched orders:', orders);
  
  // Test real-time subscription
  console.log('Setting up real-time subscription...');
  const subscription = supabase
    .channel('test-orders-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
      },
      (payload) => {
        console.log('New order received via real-time:', payload);
      }
    )
    .subscribe((status) => {
      console.log('Subscription status:', status);
    });
    
  // Wait a bit to see if real-time works
  setTimeout(() => {
    console.log('Test completed');
    supabase.removeChannel(subscription);
  }, 5000);
}

testOrders();