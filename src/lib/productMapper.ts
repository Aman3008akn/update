// ============================================================
// Shopify Product -> App Product Interface Mapper
// ============================================================
// Converts Shopify GraphQL product data into the existing
// Product interface used by all UI components.
// ============================================================

import type { Product } from '@/data/products';
import type { ShopifyProduct, ShopifyAdminProduct, ShopifyAdminOrder, ShopifyOrder } from '@/types/shopify';

// ── Badge Mapping ─────────────────────────────────────────────
// Maps Shopify product tags to the app's badge system.

const TAG_TO_BADGE: Record<string, Product['badges'] extends (infer T)[] | undefined ? string : never> = {
  'new': 'new',
  'bestseller': 'bestseller',
  'best-seller': 'bestseller',
  'limited': 'limited',
  'limited-edition': 'limited',
  'grail': 'grail',
  'premium': 'premium',
  'classic': 'classic',
  'sold-out': 'sold-out',
  'kawaii': 'kawaii',
};

function mapTagsToBadges(tags: string[]): Product['badges'] {
  const badges: NonNullable<Product['badges']> = [];
  for (const tag of tags) {
    const normalized = tag.toLowerCase().trim();
    const badge = TAG_TO_BADGE[normalized];
    if (badge && !badges.includes(badge as any)) {
      badges.push(badge as any);
    }
  }
  return badges.length > 0 ? badges : undefined;
}

// ── Subcategory Mapping ────────────────────────────────────────
// Derives a subcategory from Shopify product type or tags.

function deriveSubcategory(productType: string, tags: string[]): string {
  // Try to find a subcategory tag
  const subcategoryTag = tags.find(t => t.startsWith('subcategory:'));
  if (subcategoryTag) return subcategoryTag.split(':')[1];

  // Fallback to product type
  return productType || 'General';
}

// ── Main Mapper: ShopifyProduct -> Product ─────────────────────

/**
 * Convert a Shopify Storefront API product to the app's Product interface.
 */
export function mapShopifyProductToProduct(shopifyProduct: ShopifyProduct): Product {
  const firstVariant = shopifyProduct.variants.edges[0]?.node;
  const price = firstVariant ? parseFloat(firstVariant.price.amount) : 0;
  const compareAtPrice = firstVariant?.compareAtPrice
    ? parseFloat(firstVariant.compareAtPrice.amount)
    : undefined;

  const images = shopifyProduct.images.edges.map(e => e.node.url);
  const mainImage = shopifyProduct.featuredImage?.url || images[0] || '';

  // Extract size and material from options/tags
  const sizeOption = shopifyProduct.options.find(o => o.name.toLowerCase() === 'size');
  const materialOption = shopifyProduct.options.find(o => o.name.toLowerCase() === 'material');
  const sizes = sizeOption ? sizeOption.values.filter(v => v !== 'Default Title') : undefined;
  const materials = materialOption ? materialOption.values.filter(v => v !== 'Default Title') : undefined;

  // Calculate stock
  const stock = shopifyProduct.totalInventory ?? (shopifyProduct.availableForSale ? 10 : 0);
  const inStock = shopifyProduct.availableForSale;

  // Determine if featured (from tags)
  const isFeatured = shopifyProduct.tags.some(t => t.toLowerCase() === 'featured');

  // Map tags to badges
  const badges = mapTagsToBadges(shopifyProduct.tags);

  // Calculate rating from tags if available (e.g., "rating:4.8")
  const ratingTag = shopifyProduct.tags.find(t => t.startsWith('rating:'));
  const rating = ratingTag ? parseFloat(ratingTag.split(':')[1]) : 4.5;

  // Calculate review count from tags if available (e.g., "reviews:234")
  const reviewsTag = shopifyProduct.tags.find(t => t.startsWith('reviews:'));
  const reviews = reviewsTag ? parseInt(reviewsTag.split(':')[1], 10) : 0;

  return {
    id: shopifyProduct.handle, // Use handle as the product ID for URL routing
    variantId: firstVariant?.id,
    name: shopifyProduct.title,
    price,
    originalPrice: compareAtPrice && compareAtPrice > price ? compareAtPrice : undefined,
    image: mainImage,
    images: images.length > 0 ? images : [mainImage],
    category: shopifyProduct.productType || 'General',
    subcategory: deriveSubcategory(shopifyProduct.productType, shopifyProduct.tags),
    rating,
    reviews,
    description: shopifyProduct.description || '',
    inStock,
    stock,
    badges,
    featured: isFeatured || badges?.includes('bestseller'),
    size: sizes,
    material: materials,
    brand: shopifyProduct.vendor,
  };
}

/**
 * Convert an array of Shopify products to the app's Product interface.
 */
export function mapShopifyProductsToProducts(shopifyProducts: ShopifyProduct[]): Product[] {
  return shopifyProducts.map(mapShopifyProductToProduct);
}

// ── Admin Product Mapper ──────────────────────────────────────

/**
 * Convert a Shopify Admin API product to the app's Product interface.
 */
export function mapAdminProductToProduct(adminProduct: ShopifyAdminProduct): Product {
  const firstVariant = adminProduct.variants[0];
  const price = firstVariant ? parseFloat(firstVariant.price) : 0;
  const compareAtPrice = firstVariant?.compare_at_price
    ? parseFloat(firstVariant.compare_at_price)
    : undefined;

  const mainImage = adminProduct.image?.src || '';
  const stock = adminProduct.total_inventory ?? 0;
  const inStock = adminProduct.status === 'active' && stock > 0;

  return {
    id: String(adminProduct.id),
    name: adminProduct.title,
    price,
    originalPrice: compareAtPrice && compareAtPrice > price ? compareAtPrice : undefined,
    image: mainImage,
    images: mainImage ? [mainImage] : [],
    category: adminProduct.product_type || 'General',
    subcategory: 'General',
    rating: 4.5,
    reviews: 0,
    description: '',
    inStock,
    stock,
    brand: adminProduct.vendor,
  };
}

// ── Order Mapper ──────────────────────────────────────────────

export interface MappedOrder {
  id: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
  }[];
  total_amount: number;
  status: string;
  payment_status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  user_id: string | null;
  shipping_name: string;
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  created_at: string;
  updated_at: string;
}

/**
 * Convert a Shopify Admin API order to the app's Order interface.
 */
export function mapAdminOrderToOrder(adminOrder: ShopifyAdminOrder): MappedOrder {
  const items = adminOrder.line_items.map(item => ({
    id: String(item.variant_id || item.id),
    name: item.title,
    price: parseFloat(item.price),
    quantity: item.quantity,
    image: item.image || '',
    category: '',
  }));

  const shippingAddr = adminOrder.shipping_address;

  // Map Shopify financial_status to payment_status
  let paymentStatus = 'pending';
  switch (adminOrder.financial_status) {
    case 'paid':
    case 'authorized':
      paymentStatus = 'paid';
      break;
    case 'pending':
      paymentStatus = 'pending';
      break;
    case 'refunded':
    case 'partially_refunded':
      paymentStatus = 'refunded';
      break;
    case 'voided':
      paymentStatus = 'voided';
      break;
  }

  // Map Shopify fulfillment_status to order status
  let status = 'pending';
  switch (adminOrder.fulfillment_status) {
    case 'fulfilled':
      status = 'delivered';
      break;
    case 'partial':
      status = 'shipped';
      break;
    case null:
    case 'unfulfilled':
      status = 'pending';
      break;
    default:
      status = adminOrder.fulfillment_status || 'pending';
  }

  return {
    id: adminOrder.name || String(adminOrder.id),
    items,
    total_amount: parseFloat(adminOrder.total_price),
    status,
    payment_status: paymentStatus,
    customer_name: shippingAddr
      ? (shippingAddr.first_name || shippingAddr.last_name
          ? `${shippingAddr.first_name || ''} ${shippingAddr.last_name || ''}`.trim()
          : shippingAddr.name || '')
      : adminOrder.customer
        ? `${adminOrder.customer.first_name || ''} ${adminOrder.customer.last_name || ''}`.trim()
        : '',
    customer_email: adminOrder.email || '',
    customer_phone: adminOrder.phone || shippingAddr?.phone || '',
    user_id: null,
    shipping_name: shippingAddr
      ? (shippingAddr.first_name || shippingAddr.last_name
          ? `${shippingAddr.first_name || ''} ${shippingAddr.last_name || ''}`.trim()
          : shippingAddr.name || '')
      : '',
    shipping_street: shippingAddr?.address1 || '',
    shipping_city: shippingAddr?.city || '',
    shipping_state: shippingAddr?.province || '',
    shipping_zip: shippingAddr?.zip || '',
    created_at: adminOrder.created_at,
    updated_at: adminOrder.updated_at,
  };
}
