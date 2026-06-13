import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
}

interface WishlistDBRow {
  id: string;
  user_id: string;
  product_handle: string;
  product_data: {
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    rating: number;
  };
  created_at: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist from Supabase when user changes
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      // For non-authenticated users, fall back to localStorage
      try {
        const saved = localStorage.getItem('wishlist');
        setItems(saved ? JSON.parse(saved) : []);
      } catch {
        setItems([]);
      }
      return;
    }

    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          // If table doesn't exist, fall back to localStorage
          console.warn('Wishlist table may not exist, using localStorage fallback');
          const saved = localStorage.getItem('wishlist');
          setItems(saved ? JSON.parse(saved) : []);
          return;
        }

        if (data) {
          const mappedItems: WishlistItem[] = data.map((row: WishlistDBRow) => ({
            id: row.product_handle,
            name: row.product_data.name,
            price: row.product_data.price,
            originalPrice: row.product_data.originalPrice,
            image: row.product_data.image,
            category: row.product_data.category,
            rating: row.product_data.rating,
          }));
          setItems(mappedItems);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        // Fallback to localStorage
        try {
          const saved = localStorage.getItem('wishlist');
          setItems(saved ? JSON.parse(saved) : []);
        } catch {
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user?.id, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const addToWishlist = useCallback(async (item: WishlistItem) => {
    // Prevent duplicates
    if (items.find(i => i.id === item.id)) return;

    // Optimistic update
    setItems(prev => [...prev, item]);

    if (isAuthenticated && user?.id) {
      try {
        await supabase.from('wishlists').insert({
          user_id: user.id,
          product_handle: item.id,
          product_data: {
            name: item.name,
            price: item.price,
            originalPrice: item.originalPrice,
            image: item.image,
            category: item.category,
            rating: item.rating,
          },
        });
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        // Revert optimistic update on error
        setItems(prev => prev.filter(i => i.id !== item.id));
      }
    } else {
      // Fallback to localStorage for non-authenticated users
      try {
        const currentItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
        currentItems.push(item);
        localStorage.setItem('wishlist', JSON.stringify(currentItems));
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [items, isAuthenticated, user?.id]);

  const removeFromWishlist = useCallback(async (id: string) => {
    const prevItems = [...items];

    // Optimistic update
    setItems(prev => prev.filter(i => i.id !== id));

    if (isAuthenticated && user?.id) {
      try {
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_handle', id);
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        // Revert optimistic update on error
        setItems(prevItems);
      }
    } else {
      // Fallback to localStorage
      try {
        const currentItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const filtered = currentItems.filter((i: WishlistItem) => i.id !== id);
        localStorage.setItem('wishlist', JSON.stringify(filtered));
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [items, isAuthenticated, user?.id]);

  const isInWishlist = useCallback((id: string) => {
    return items.some(i => i.id === id);
  }, [items]);

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
