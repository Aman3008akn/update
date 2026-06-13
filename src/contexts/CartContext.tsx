import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  createCart,
  getCart,
  addCartLines,
  removeCartLines,
  updateCartLines,
} from '@/lib/shopify';
import type { ShopifyCart } from '@/types/shopify';

// ── Public Interface ──────────────────────────────────────────

export interface CartItem {
  id: string;
  variantId?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  cartId: string | null;
  checkoutUrl: string | null;
  cartLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ── Helpers ───────────────────────────────────────────────────

const CART_ID_KEY = 'shopify_cart_id';

function shopifyCartToItems(cart: ShopifyCart): CartItem[] {
  return cart.lines.edges.map(edge => {
    const line = edge.node;
    const variant = line.merchandise;
    return {
      id: line.id,
      variantId: variant.id,
      name: variant.product.title,
      price: parseFloat(variant.price.amount),
      originalPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : undefined,
      image: variant.product.featuredImage?.url || '',
      quantity: line.quantity,
      category: variant.product.productType || '',
    };
  });
}

// ── Provider ──────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [cartId, setCartId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CART_ID_KEY) || null;
    } catch {
      return null;
    }
  });
  const [cartLoading, setCartLoading] = useState(false);
  const mutationQueue = useRef<Promise<ShopifyCart | null>>(Promise.resolve(null));

  // ── Restore cart on mount ──
  useEffect(() => {
    if (!cartId) return;

    const restoreCart = async () => {
      try {
        const existingCart = await getCart(cartId);
        if (existingCart) {
          setCart(existingCart);
        } else {
          localStorage.removeItem(CART_ID_KEY);
          setCartId(null);
        }
      } catch (error) {
        console.error('Error restoring cart:', error);
        localStorage.removeItem(CART_ID_KEY);
        setCartId(null);
      }
    };

    restoreCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Ensure cart exists ──
  const ensureCart = useCallback(async (): Promise<string> => {
    if (cartId) return cartId;
    const newCart = await createCart();
    setCart(newCart);
    setCartId(newCart.id);
    localStorage.setItem(CART_ID_KEY, newCart.id);
    return newCart.id;
  }, [cartId]);

  // ── Add to cart ──
  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCartLoading(true);
    mutationQueue.current = mutationQueue.current.then(async () => {
      try {
        const currentCartId = await ensureCart();
        const existingLine = cart?.lines.edges.find(edge => {
          return edge.node.merchandise.product.title === item.name;
        });

        if (existingLine) {
          const updatedCart = await updateCartLines(currentCartId, [
            { id: existingLine.node.id, quantity: existingLine.node.quantity + 1 },
          ]);
          setCart(updatedCart);
        } else {
          const merchandiseId = item.variantId || (item.id.startsWith('gid://') ? item.id : `gid://shopify/ProductVariant/${item.id}`);
          const newCart = await addCartLines(currentCartId, [
            { merchandiseId, quantity: 1 },
          ]);
          setCart(newCart);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setCartLoading(false);
      }
      return cart;
    });
  }, [cart, ensureCart]);

  // ── Remove from cart ──
  const removeFromCart = useCallback((lineId: string) => {
    if (!cartId) return;
    setCartLoading(true);
    mutationQueue.current = mutationQueue.current.then(async () => {
      try {
        const updatedCart = await removeCartLines(cartId, [lineId]);
        setCart(updatedCart);
      } catch (error) {
        console.error('Error removing from cart:', error);
      } finally {
        setCartLoading(false);
      }
      return cart;
    });
  }, [cartId, cart]);

  // ── Update quantity ──
  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (!cartId) return;
    if (quantity <= 0) { removeFromCart(lineId); return; }
    setCartLoading(true);
    mutationQueue.current = mutationQueue.current.then(async () => {
      try {
        const updatedCart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
        setCart(updatedCart);
      } catch (error) {
        console.error('Error updating cart quantity:', error);
      } finally {
        setCartLoading(false);
      }
      return cart;
    });
  }, [cartId, cart, removeFromCart]);

  // ── Clear cart ──
  const clearCart = useCallback(() => {
    if (cartId && cart) {
      const allLineIds = cart.lines.edges.map(e => e.node.id);
      if (allLineIds.length > 0) {
        setCartLoading(true);
        mutationQueue.current = mutationQueue.current.then(async () => {
          try {
            const updatedCart = await removeCartLines(cartId, allLineIds);
            setCart(updatedCart);
          } catch (error) {
            console.error('Error clearing cart:', error);
          } finally {
            setCartLoading(false);
          }
          return cart;
        });
      }
    }
    setCart(null);
    setCartId(null);
    localStorage.removeItem(CART_ID_KEY);
  }, [cartId, cart]);

  // ── Derived values ──
  const items = useMemo(() => (cart ? shopifyCartToItems(cart) : []), [cart]);
  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const checkoutUrl = cart?.checkoutUrl || null;

  const value = useMemo(
    () => ({ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, cartId, checkoutUrl, cartLoading }),
    [items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, cartId, checkoutUrl, cartLoading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
