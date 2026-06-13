import React, { createContext, useContext, useState, useEffect } from 'react';
import { customerAccessTokenCreate, customerCreate, getCustomer } from '@/lib/shopify';

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

// Known admin emails since Shopify doesn't natively expose roles.
const ADMIN_EMAILS = ['admin@mythmanga.com'];

function isAdminEmail(email: string | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('shopify_customer_token');
        if (token) {
          const customer = await getCustomer(token);
          if (customer) {
            setUser({
              id: customer.id,
              email: customer.email,
              name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email.split('@')[0],
              role: isAdminEmail(customer.email) ? 'admin' : 'user'
            });
          } else {
            localStorage.removeItem('shopify_customer_token');
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('shopify_customer_token');
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    const token = await customerAccessTokenCreate(email, password);
    localStorage.setItem('shopify_customer_token', token);
    const customer = await getCustomer(token);
    if (customer) {
      setUser({
        id: customer.id,
        email: customer.email,
        name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email.split('@')[0],
        role: isAdminEmail(customer.email) ? 'admin' : 'user'
      });
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    await customerCreate(email, password, firstName, lastName);
    // Auto-login after signup
    await login(email, password);
  };

  const logout = async () => {
    localStorage.removeItem('shopify_customer_token');
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
