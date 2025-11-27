import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment or use hardcoded values
const supabaseUrl = "https://egoxtqrujcshfllgvkse.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3h0cXJ1amNzaGZsbGd2a3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODQzNzAsImV4cCI6MjA3OTU2MDM3MH0.pevbveZqiLP_cHGy-UFp_St7w3ov6BUNRc0ePx1MYsQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUsersTable() {
  try {
    console.log('Checking users table structure...');
    
    // Get table info
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error fetching users table:', error);
      return;
    }
    
    console.log('Sample user data:', data);
    
    // Check if role column exists by trying to select it
    const { data: roleData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .limit(1);
    
    if (roleError) {
      console.log('Role column does not exist:', roleError.message);
    } else {
      console.log('Role column exists:', roleData);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsersTable();