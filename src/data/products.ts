// ============================================================
// Product Interface & Data Layer
// ============================================================
// Products are now fetched from Shopify Storefront API.
// The Product interface is kept unchanged for UI compatibility.
// The hardcoded product array has been removed.
// ============================================================

import { getAllProducts, getProductsByCollection, searchProducts as shopifySearch, getProductByHandle, getProductById } from '@/lib/shopify';
import { mapShopifyProductsToProducts, mapShopifyProductToProduct } from '@/lib/productMapper';

export interface Product {
  id: string;
  variantId?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  subcategory: string;
  rating: number;
  reviews: number;
  description: string;
  inStock: boolean;
  stock: number;
  badges?: ('new' | 'bestseller' | 'limited' | 'grail' | 'premium' | 'classic' | 'sold-out' | 'kawaii')[];
  featured?: boolean;
  size?: string[];
  material?: string[];
  brand?: string;
}

/**
 * Fetch all products from Shopify.
 * Returns an empty array if Shopify is not configured.
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const shopifyProducts = await getAllProducts();
    return mapShopifyProductsToProducts(shopifyProducts);
  } catch (error) {
    console.error('Error fetching products from Shopify:', error);
    return [];
  }
}

/**
 * Fetch products by category (collection handle).
 */
export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  try {
    const shopifyProducts = await getProductsByCollection(category);
    return mapShopifyProductsToProducts(shopifyProducts);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

/**
 * Fetch a single product by handle (URL slug).
 */
export async function fetchProductByHandle(handle: string): Promise<Product | null> {
  try {
    const shopifyProduct = await getProductByHandle(handle);
    return shopifyProduct ? mapShopifyProductToProduct(shopifyProduct) : null;
  } catch (error) {
    console.error('Error fetching product by handle:', error);
    return null;
  }
}

/**
 * Fetch a single product by ID (Shopify GID).
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const shopifyProduct = await getProductById(id);
    return shopifyProduct ? mapShopifyProductToProduct(shopifyProduct) : null;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

/**
 * Search products via Shopify.
 */
export async function fetchSearchProducts(query: string): Promise<Product[]> {
  try {
    const shopifyProducts = await shopifySearch(query);
    return mapShopifyProductsToProducts(shopifyProducts);
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

/**
 * Fallback empty product list (used when Shopify is not configured).
 */
export const products: Product[] = [];

export const categories = [
  'Figurines',
  'Manga',
  'Posters',
  'Accessories',
  'Tech Gadgets',
  'Apparel',
  'Mystery Boxes',
];
