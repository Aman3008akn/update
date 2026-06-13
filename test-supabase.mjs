import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://egoxtqrujcshfllgvkse.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3h0cXJ1amNzaGZsbGd2a3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODQzNzAsImV4cCI6MjA3OTU2MDM3MH0.pevbveZqiLP_cHGy-UFp_St7w3ov6BUNRc0ePx1MYsQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log('Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      console.error('Supabase error:', error);
    } else {
      console.log('Supabase connection successful! Data:', data);
    }
  } catch (err) {
    console.error('Exception during Supabase call:', err);
  }
}

testSupabase();
