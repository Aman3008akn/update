import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Get user metadata for name
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('name, role')
            .eq('id', session.user.id)
            .single();
          
          // Special case: ensure admin@mythmanga.com always has admin role
          let role = (profile?.role as 'user' | 'admin') || 'user';
          if (session.user.email === 'admin@mythmanga.com' && role !== 'admin') {
            // Update the role in the database
            await supabase
              .from('users')
              .update({ role: 'admin' })
              .eq('id', session.user.id);
            role = 'admin';
          }
          
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || session.user.email?.split('@')[0] || 'User',
            role: role
          };
          
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Get user metadata for name
        supabase
          .from('users')
          .select('name, role')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            const userData: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: profile?.name || session.user.email?.split('@')[0] || 'User',
              role: (profile?.role as 'user' | 'admin') || 'user'
            };
            setUser(userData);
          });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Get user metadata for name
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('name, role')
        .eq('id', data.user.id)
        .single();

      // Special case: ensure admin@mythmanga.com always has admin role
      let role = (profile?.role as 'user' | 'admin') || 'user';
      if (data.user.email === 'admin@mythmanga.com' && role !== 'admin') {
        // Update the role in the database
        await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', data.user.id);
        role = 'admin';
      }

      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: profile?.name || email.split('@')[0] || 'User',
        role: role
      };

      setUser(userData);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      // Determine role based on email
      const role = email === 'admin@mythmanga.com' ? 'admin' : 'user';
      
      // Insert user data into users table
      await supabase.from('users').insert([
        {
          id: data.user.id,
          email: data.user.email,
          name: name,
          role: role
        }
      ]);

      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: name,
        role: role as 'user' | 'admin'
      };

      setUser(userData);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}