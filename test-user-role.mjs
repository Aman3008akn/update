import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment or use hardcoded values
const supabaseUrl = "https://egoxtqrujcshfllgvkse.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3h0cXJ1amNzaGZsbGd2a3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODQzNzAsImV4cCI6MjA3OTU2MDM3MH0.pevbveZqiLP_cHGy-UFp_St7w3ov6BUNRc0ePx1MYsQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUserRole() {
  try {
    console.log('Testing user role...');
    
    // Check the admin user's role
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('email', 'admin@mythmanga.com');
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }
    
    console.log('Admin user data:', users);
    
    if (users && users.length > 0) {
      const adminUser = users[0];
      console.log('Admin user role:', adminUser.role);
      
      if (adminUser.role === 'admin') {
        console.log('SUCCESS: Admin user has the correct role!');
      } else {
        console.log('ISSUE: Admin user does not have admin role');
      }
    } else {
      console.log('Admin user not found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testUserRole();