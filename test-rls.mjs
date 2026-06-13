import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://egoxtqrujcshfllgvkse.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3h0cXJ1amNzaGZsbGd2a3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODQzNzAsImV4cCI6MjA3OTU2MDM3MH0.pevbveZqiLP_cHGy-UFp_St7w3ov6BUNRc0ePx1MYsQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSyncProfile() {
  console.log('Testing select on users table...');
  const { data, error } = await supabase.from('users').select('*').limit(1);
  console.log('Select result:', { data, error });
  
  // Also try selecting a specific fake ID to see if it gives PGRST116 or an RLS error
  const { data: singleData, error: singleError } = await supabase
      .from('users')
      .select('name, role')
      .eq('id', '9ad6c008-94de-48a1-ad6e-922108735e85') // fake id
      .single();
      
  console.log('Single select result:', { singleData, error: singleError });
}

testSyncProfile();
