import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment or use hardcoded values
const supabaseUrl = "https://egoxtqrujcshfllgvkse.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3h0cXJ1amNzaGZsbGd2a3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODQzNzAsImV4cCI6MjA3OTU2MDM3MH0.pevbveZqiLP_cHGy-UFp_St7w3ov6BUNRc0ePx1MYsQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAndFixAdminUser() {
  try {
    console.log('Checking for admin user...');
    
    // Check if the user exists in users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@mythmanga.com');
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }
    
    console.log('Users found:', users);
    
    if (users && users.length > 0) {
      const user = users[0];
      console.log('User exists with role:', user.role);
      
      // If role is not admin, update it
      if (user.role !== 'admin') {
        console.log('Updating user role to admin...');
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', user.id);
        
        if (updateError) {
          console.error('Error updating user role:', updateError);
        } else {
          console.log('Successfully updated user role to admin');
        }
      } else {
        console.log('User already has admin role');
      }
    } else {
      console.log('Admin user not found in users table');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAndFixAdminUser();