import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://egoxtqrujcshfllgvkse.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3h0cXJ1amNzaGZsbGd2a3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODQzNzAsImV4cCI6MjA3OTU2MDM3MH0.pevbveZqiLP_cHGy-UFp_St7w3ov6BUNRc0ePx1MYsQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseAuth() {
  console.log('Testing Supabase auth...');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@mythmanga.com',
      password: 'admin' // Guessing password or just checking if it fails gracefully
    });
    console.log('Auth result:', { error: error?.message, user: data?.user?.email });
  } catch (err) {
    console.error('Exception during Supabase auth:', err);
  }
}

testSupabaseAuth();
