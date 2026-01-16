import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Get Supabase credentials from environment or use hardcoded values
const supabaseUrl = "https://egoxtqrujcshfllgvkse.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3h0cXJ1amNzaGZsbGd2a3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODQzNzAsImV4cCI6MjA3OTU2MDM3MH0.pevbveZqiLP_cHGy-UFp_St7w3ov6BUNRc0ePx1MYsQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupAdminUser() {
  try {
    console.log('Setting up admin user...');
    
    // First, let's try to add the role column by attempting to update a user with a role field
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@mythmanga.com');
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }
    
    if (users && users.length > 0) {
      const adminUser = users[0];
      console.log('Found admin user:', adminUser);
      
      // Try to update the user with a role - this will fail if the column doesn't exist
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', adminUser.id);
      
      if (updateError && updateError.message.includes("column") && updateError.message.includes("does not exist")) {
        console.log('Role column does not exist. You need to run the SQL script manually in Supabase dashboard.');
        console.log('Please run the following SQL in your Supabase SQL editor:');
        
        // Read and display the SQL content
        const sqlContent = readFileSync('./add-role-column.sql', 'utf8');
        console.log(sqlContent);
      } else if (updateError) {
        console.error('Error updating user:', updateError);
      } else {
        console.log('Successfully updated admin user role to admin');
      }
    } else {
      console.log('Admin user not found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

setupAdminUser();