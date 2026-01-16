import { supabase } from './src/lib/supabase.ts';

async function testRealtime() {
  console.log('Testing Supabase real-time functionality...');
  
  // Set up a real-time subscription
  const subscription = supabase
    .channel('test-products-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'products',
      },
      (payload) => {
        console.log('New product added:', payload);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'products',
      },
      (payload) => {
        console.log('Product updated:', payload);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'products',
      },
      (payload) => {
        console.log('Product deleted:', payload);
      }
    )
    .subscribe((status) => {
      console.log('Subscription status:', status);
    });

  // Wait a moment for subscription to establish
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('Real-time subscription established. Testing insert...');
  
  // Test insert
  const testProduct = {
    id: 'test-' + Date.now(),
    name: 'Test Product',
    price: 100,
    image: 'https://example.com/test.jpg',
    images: ['https://example.com/test.jpg'],
    category: 'Test',
    subcategory: 'Test Items',
    rating: 4.5,
    reviews: 0,
    description: 'Test product for real-time functionality',
    "inStock": true,
    stock: 10,
    badges: [],
    featured: false,
    size: ['Medium'],
    material: ['Test Material'],
    brand: 'Test Brand'
  };
  
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([testProduct]);
      
    if (error) {
      console.error('Insert error:', error);
    } else {
      console.log('Insert successful');
    }
    
    // Wait a moment to see real-time update
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clean up - delete the test product
    console.log('Cleaning up test product...');
    await supabase
      .from('products')
      .delete()
      .eq('id', testProduct.id);
      
    console.log('Cleanup complete');
  } catch (err) {
    console.error('Test error:', err);
  }
  
  // Remove subscription
  supabase.removeChannel(subscription);
  console.log('Test complete');
}

testRealtime();