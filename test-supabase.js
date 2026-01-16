import { supabase } from './src/lib/supabase.ts';

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Try to fetch products table
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    if (error) {
      console.log('Products table does not exist or is inaccessible:', error.message);
      
      // Try to list all tables
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
        
      if (tablesError) {
        console.log('Could not list tables:', tablesError.message);
      } else {
        console.log('Available tables:', tables.map(t => t.table_name));
      }
    } else {
      console.log('Products table exists and is accessible');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testConnection();