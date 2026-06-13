import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from .env file
const supabaseUrl = "https://egoxtqrujcshfllgvkse.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3h0cXJ1amNzaGZsbGd2a3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODQzNzAsImV4cCI6MjA3OTU2MDM3MH0.pevbveZqiLP_cHGy-UFp_St7w3ov6BUNRc0ePx1MYsQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAdminUser() {
  try {
    console.log('Checking for admin user...');
    
    // Check if the user exists in auth.users
    const { data: authUsers, error: authError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@mythmanga.com');
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return;
    }
    
    console.log('Auth users found:', authUsers);
    
    if (authUsers && authUsers.length > 0) {
      console.log('User exists with role:', authUsers[0].role);
      
      // If role is not admin, update it
      if (authUsers[0].role !== 'admin') {
        console.log('Updating user role to admin...');
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', authUsers[0].id);
        
        if (updateError) {
          console.error('Error updating user role:', updateError);
        } else {
          console.log('User role updated to admin successfully');
        }
      }
    } else {
      console.log('Admin user not found in users table. Creating admin user...');
      
      // Create admin user
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@mythmanga.com',
        password: 'admin123',
        options: {
          data: {
            name: 'Admin User'
          }
        }
      });
      
      if (error) {
        console.error('Error creating admin user:', error);
      } else {
        console.log('Admin user created:', data);
        
        // Insert user data into users table with admin role
        if (data.user) {
          const { error: insertError } = await supabase.from('users').insert([
            {
              id: data.user.id,
              email: data.user.email,
              name: 'Admin User',
              role: 'admin'
            }
          ]);
          
          if (insertError) {
            console.error('Error inserting admin user into users table:', insertError);
          } else {
            console.log('Admin user inserted into users table with admin role');
          }
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAdminUser();