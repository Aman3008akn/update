// ============================================================
// Shopify Hybrid API Client (Storefront + Admin)
// ============================================================
// Storefront API: Products, Cart, Checkout (public-facing)
// Admin REST API: Orders, Admin Dashboard, Product CRUD
//
// REQUIRED ENVIRONMENT VARIABLES:
//   VITE_SHOPIFY_STORE_DOMAIN             - e.g. "your-store.myshopify.com"
//   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN  - Headless channel public token
//   VITE_SHOPIFY_ADMIN_API_ACCESS_TOKEN   - Admin API access token (shpat_...)
// ============================================================

import type {
  ShopifyGraphQLResponse,
  ShopifyProductsResponse,
  ShopifyProductByHandleResponse,
  ShopifyProductByIdResponse,
  ShopifyCartCreateResponse,
  ShopifyCartResponse,
  ShopifyCartLinesAddResponse,
  ShopifyCartLinesRemoveResponse,
  ShopifyCartLinesUpdateResponse,
  ShopifyCartDiscountCodesUpdateResponse,
  ShopifyCartBuyerIdentityUpdateResponse,
  ShopifyProduct,
  ShopifyCart,
  ShopifyAdminOrder,
  ShopifyAdminProduct,
} from '@/types/shopify';

// ── Configuration ─────────────────────────────────────────────

const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '';
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const ADMIN_TOKEN = import.meta.env.VITE_SHOPIFY_ADMIN_API_ACCESS_TOKEN || '';
const API_VERSION = '2025-04';
const STOREFRONT_URL = `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;
const ADMIN_URL = import.meta.env.DEV ? `/admin/api/${API_VERSION}` : `https://${STORE_DOMAIN}/admin/api/${API_VERSION}`;

export function isConfigured(): boolean {
  return !!(STORE_DOMAIN && STOREFRONT_TOKEN);
}

function isAdminConfigured(): boolean {
  return !!(STORE_DOMAIN && ADMIN_TOKEN);
}

export const isShopifyAdminConfigured = isAdminConfigured;

// ── Storefront GraphQL Fetch ──────────────────────────────────

export async function storefrontFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (!isConfigured()) {
    throw new Error('Shopify Storefront API is not configured. Check VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN.');
  }

  const response = await fetch(STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify Storefront API error (${response.status}): ${text}`);
  }

  const json: ShopifyGraphQLResponse<T> = await response.json();
  if (json.errors && json.errors.length > 0) {
    console.error('Shopify GraphQL errors:', json.errors);
    throw new Error(`Shopify GraphQL error: ${json.errors.map(e => e.message).join(', ')}`);
  }

  return json.data;
}

// ── Admin REST Fetch ──────────────────────────────────────────

export async function adminFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!isConfigured()) {
    throw new Error('Shopify Admin API is not configured. Set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_ADMIN_API_ACCESS_TOKEN.');
  }

  const response = await fetch(`${ADMIN_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify Admin API error (${response.status}): ${text}`);
  }

  return response.json();
}

// ── Admin GraphQL Fetch ───────────────────────────────────────

export async function adminGraphQLFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (!isConfigured()) {
    throw new Error('Shopify Admin API is not configured.');
  }

  const response = await fetch(`${ADMIN_URL}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify Admin GraphQL error (${response.status}): ${text}`);
  }

  const json = await response.json();
  if (json.errors && json.errors.length > 0) {
    throw new Error(`Shopify Admin GraphQL error: ${json.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return json.data;
}

// ================================================================
//  ADMIN REST PRODUCT → Storefront Product FORMAT CONVERTER
// ================================================================
// Converts Admin REST API product responses into the ShopifyProduct
// (Storefront GraphQL) format so existing mappers work unchanged.

function adminProductToShopifyProduct(p: ShopifyAdminProduct): ShopifyProduct {
  // Use images array if available, otherwise fall back to single image
  const rawImages = p.images || (p.image ? [p.image] : []);
  const images = rawImages.map((img, idx) => ({
    id: String(img.id || idx),
    url: img.src,
    altText: img.alt || '',
    width: img.width || 0,
    height: img.height || 0,
  }));

  const variants = (p.variants || []).map((v) => ({
    id: `gid://shopify/ProductVariant/${v.id}`,
    title: v.title,
    price: { amount: String(v.price), currencyCode: 'INR' },
    compareAtPrice: v.compare_at_price
      ? { amount: String(v.compare_at_price), currencyCode: 'INR' }
      : null,
    availableForSale: v.available ?? true,
    quantityAvailable: v.inventory_quantity ?? 0,
    selectedOptions: v.option1
      ? [
          { name: 'Title', value: v.title },
          ...(p.options || []).map((opt, i) => ({
            name: opt.name,
            value: [v.option1, v.option2, v.option3][i] || '',
          })),
        ]
      : [],
    image: images[0] || null,
    sku: v.sku || '',
  }));

  const prices = variants.map((v) => parseFloat(v.price.amount) || 0);
  const comparePrices = variants
    .map((v) => (v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : 0))
    .filter(Boolean);

  return {
    id: `gid://shopify/Product/${p.id}`,
    title: p.title,
    handle: p.handle,
    description: p.body_html?.replace(/<[^>]*>/g, '') || '',
    descriptionHtml: p.body_html || '',
    productType: p.product_type || '',
    vendor: p.vendor || '',
    tags: (p.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    availableForSale: p.status === 'active' && variants.some((v) => v.availableForSale),
    totalInventory: p.total_inventory ?? variants.reduce((s, v) => s + v.quantityAvailable, 0),
    featuredImage: images[0] || null,
    images: { edges: images.map((node) => ({ node })) },
    variants: { edges: variants.map((node) => ({ node })) },
    options: (p.options || []).map((o) => ({ name: o.name, values: o.values })),
    priceRange: {
      minVariantPrice: {
        amount: String(Math.min(...(prices.length ? prices : [0]))),
        currencyCode: 'INR',
      },
      maxVariantPrice: {
        amount: String(Math.max(...(prices.length ? prices : [0]))),
        currencyCode: 'INR',
      },
    },
    compareAtPriceRange: {
      minVariantPrice: {
        amount: String(Math.min(...(comparePrices.length ? comparePrices : [0]))),
        currencyCode: 'INR',
      },
      maxVariantPrice: {
        amount: String(Math.max(...(comparePrices.length ? comparePrices : [0]))),
        currencyCode: 'INR',
      },
    },
    collections: { edges: [] },
  };
}

// ================================================================
//  STOREFRONT API PRODUCT QUERIES (Primary - used by frontend)
// ================================================================

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    productType
    vendor
    tags
    createdAt
    updatedAt
    availableForSale
    featuredImage { id url altText width height }
    images(first: 10) {
      edges { node { id url altText width height } }
    }
    variants(first: 20) {
      edges {
        node {
          id title price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          availableForSale
          selectedOptions { name value }
          image { id url altText width height }
          sku
        }
      }
    }
    options { name values }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    collections(first: 5) {
      edges { node { id title handle } }
    }
  }
`;

export async function getAllProducts(first = 250): Promise<ShopifyProduct[]> {
  const query = `${PRODUCT_FRAGMENT}
    query GetAllProducts($first: Int!) {
      products(first: $first) { edges { node { ...ProductFields } } pageInfo { hasNextPage hasPreviousPage } }
    }`;
  const data = await storefrontFetch<ShopifyProductsResponse>(query, { first });
  return data.products.edges.map(e => e.node);
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `${PRODUCT_FRAGMENT}
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) { ...ProductFields }
    }`;
  const data = await storefrontFetch<ShopifyProductByHandleResponse>(query, { handle });
  return data.product;
}

export async function getProductById(id: string): Promise<ShopifyProduct | null> {
  const query = `${PRODUCT_FRAGMENT}
    query GetProductById($id: ID!) { node(id: $id) { ...ProductFields } }`;
  const data = await storefrontFetch<ShopifyProductByIdResponse>(query, { id });
  return data.node;
}

export async function getProductsByCollection(collectionHandle: string, first = 250): Promise<ShopifyProduct[]> {
  const query = `${PRODUCT_FRAGMENT}
    query GetCollectionProducts($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        products(first: $first) { edges { node { ...ProductFields } } pageInfo { hasNextPage hasPreviousPage } }
      }
    }`;
  const data = await storefrontFetch<{ collection: { products: { edges: { node: ShopifyProduct }[] } } | null }>(
    query, { handle: collectionHandle, first }
  );
  return data.collection?.products.edges.map(e => e.node) || [];
}

export async function searchProducts(searchQuery: string, first = 50): Promise<ShopifyProduct[]> {
  const query = `${PRODUCT_FRAGMENT}
    query SearchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) { edges { node { ...ProductFields } } pageInfo { hasNextPage hasPreviousPage } }
    }`;
  const data = await storefrontFetch<ShopifyProductsResponse>(query, { query: searchQuery, first });
  return data.products.edges.map(e => e.node);
}

export async function getAllCollections(): Promise<{ id: string; title: string; handle: string; description: string; image: { url: string } | null }[]> {
  const query = `query GetCollections {
    collections(first: 50) { edges { node { id title handle description image { url } } } }
  }`;
  const data = await storefrontFetch<{ collections: { edges: { node: { id: string; title: string; handle: string; description: string; image: { url: string } | null } }[] } }>(query);
  return data.collections.edges.map(e => e.node);
}

// ================================================================
//  CART MUTATIONS (Storefront API)
// ================================================================

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id checkoutUrl createdAt updatedAt totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
      totalTaxAmount { amount currencyCode }
      totalDutyAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id quantity
          merchandise {
            ... on ProductVariant {
              id title price { amount currencyCode } compareAtPrice { amount currencyCode }
              product { id title handle vendor featuredImage { id url altText width height } productType }
              selectedOptions { name value }
            }
          }
          cost {
            totalAmount { amount currencyCode }
            amountPerQuantity { amount currencyCode }
            compareAtAmountPerQuantity { amount currencyCode }
          }
        }
      }
    }
    discountCodes { code applicable }
    buyerIdentity { email phone }
  }
`;

export async function createCart(
  lines?: { merchandiseId: string; quantity: number }[],
  buyerIdentity?: { email?: string; phone?: string }
): Promise<ShopifyCart> {
  const query = `${CART_FRAGMENT}
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) { cart { ...CartFields } userErrors { code field message } }
    }`;
  const input: Record<string, unknown> = {};
  if (lines && lines.length > 0) input.lines = lines;
  if (buyerIdentity) input.buyerIdentity = buyerIdentity;
  const data = await storefrontFetch<ShopifyCartCreateResponse>(query, { input });
  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(`Cart create error: ${data.cartCreate.userErrors.map(e => e.message).join(', ')}`);
  }
  return data.cartCreate.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `${CART_FRAGMENT} query GetCart($id: ID!) { cart(id: $id) { ...CartFields } }`;
  const data = await storefrontFetch<ShopifyCartResponse>(query, { id: cartId });
  return data.cart;
}

export async function addCartLines(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<ShopifyCart> {
  const query = `${CART_FRAGMENT}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { code field message } }
    }`;
  const data = await storefrontFetch<ShopifyCartLinesAddResponse>(query, { cartId, lines });
  if (data.cartLinesAdd.userErrors.length > 0) throw new Error(`Cart add error: ${data.cartLinesAdd.userErrors.map(e => e.message).join(', ')}`);
  return data.cartLinesAdd.cart;
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const query = `${CART_FRAGMENT}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { code field message } }
    }`;
  const data = await storefrontFetch<ShopifyCartLinesRemoveResponse>(query, { cartId, lineIds });
  if (data.cartLinesRemove.userErrors.length > 0) throw new Error(`Cart remove error: ${data.cartLinesRemove.userErrors.map(e => e.message).join(', ')}`);
  return data.cartLinesRemove.cart;
}

export async function updateCartLines(cartId: string, lines: { id: string; quantity: number }[]): Promise<ShopifyCart> {
  const query = `${CART_FRAGMENT}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { code field message } }
    }`;
  const data = await storefrontFetch<ShopifyCartLinesUpdateResponse>(query, { cartId, lines });
  if (data.cartLinesUpdate.userErrors.length > 0) throw new Error(`Cart update error: ${data.cartLinesUpdate.userErrors.map(e => e.message).join(', ')}`);
  return data.cartLinesUpdate.cart;
}

export async function updateCartDiscountCodes(cartId: string, discountCodes: string[]): Promise<ShopifyCart> {
  const query = `${CART_FRAGMENT}
    mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) { cart { ...CartFields } userErrors { code field message } }
    }`;
  const data = await storefrontFetch<ShopifyCartDiscountCodesUpdateResponse>(query, { cartId, discountCodes });
  if (data.cartDiscountCodesUpdate.userErrors.length > 0) throw new Error(`Cart discount error: ${data.cartDiscountCodesUpdate.userErrors.map(e => e.message).join(', ')}`);
  return data.cartDiscountCodesUpdate.cart;
}

export async function updateCartBuyerIdentity(cartId: string, buyerIdentity: { email?: string; phone?: string; deliveryAddressPreferences?: any[] }): Promise<ShopifyCart> {
  const query = `${CART_FRAGMENT}
    mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) { cart { ...CartFields } userErrors { code field message } }
    }`;
  const data = await storefrontFetch<ShopifyCartBuyerIdentityUpdateResponse>(query, { cartId, buyerIdentity });
  if (data.cartBuyerIdentityUpdate.userErrors.length > 0) throw new Error(`Cart buyer error: ${data.cartBuyerIdentityUpdate.userErrors.map(e => e.message).join(', ')}`);
  return data.cartBuyerIdentityUpdate.cart;
}
// Admin dashboard uses getAllAdminProducts() which returns raw ShopifyAdminProduct[].

// ================================================================
//  CHECKOUT - Draft Order Creation (Admin REST API)
// ================================================================

export interface DraftOrderLineItem {
  variant_id: number;
  quantity: number;
}

export interface DraftOrderShippingAddress {
  first_name?: string;
  last_name?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
  phone?: string;
}

/**
 * Create a draft order and return the invoice/checkout URL.
 */
export async function createDraftOrder(params: {
  line_items: DraftOrderLineItem[];
  shipping_address?: DraftOrderShippingAddress;
  email?: string;
  note?: string;
  discount_code?: string;
}): Promise<{ draftOrderId: string; invoiceUrl: string } | null> {
  try {
    const draftOrder: Record<string, unknown> = {
      line_items: params.line_items,
    };

    if (params.shipping_address) {
      draftOrder.shipping_address = params.shipping_address;
    }
    if (params.email) {
      draftOrder.email = params.email;
    }
    if (params.note) {
      draftOrder.note = params.note;
    }
    if (params.discount_code) {
      draftOrder.applied_discount = {
        discount_type: 'percentage',
        value: 0,
        description: `Discount: ${params.discount_code}`,
      };
    }

    const data = await adminFetch<{
      draft_order: { id: number; invoice_url: string; name: string };
    }>('/draft_orders.json', {
      method: 'POST',
      body: JSON.stringify({ draft_order: draftOrder }),
    });

    if (!data.draft_order) return null;

    return {
      draftOrderId: String(data.draft_order.id),
      invoiceUrl: data.draft_order.invoice_url,
    };
  } catch (error) {
    console.error('Error creating draft order:', error);
    return null;
  }
}

/**
 * Complete a draft order (convert to real order after payment).
 */
export async function completeDraftOrder(draftOrderId: string): Promise<boolean> {
  try {
    await adminFetch(`/draft_orders/${draftOrderId}/complete.json`, {
      method: 'PUT',
    });
    return true;
  } catch (error) {
    console.error('Error completing draft order:', error);
    return false;
  }
}

// ================================================================
//  ORDERS (Admin API)
// ================================================================

/**
 * Get customer orders by email.
 */
export async function getCustomerOrdersByEmail(email: string): Promise<ShopifyAdminOrder[]> {
  if (!isConfigured()) {
    console.warn('Shopify Admin API not configured, cannot fetch orders');
    return [];
  }

  try {
    const data = await adminFetch<{ orders: ShopifyAdminOrder[] }>(
      `/orders.json?status=any&email=${encodeURIComponent(email)}&limit=50`
    );
    return data.orders || [];
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return [];
  }
}

/**
 * Get all orders (admin only).
 */
export async function getAllAdminOrders(limit = 50): Promise<ShopifyAdminOrder[]> {
  if (!isConfigured()) {
    console.warn('Shopify Admin API not configured, cannot fetch orders');
    return [];
  }

  try {
    const data = await adminFetch<{ orders: ShopifyAdminOrder[] }>(
      `/orders.json?status=any&limit=${limit}`
    );
    return data.orders || [];
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return [];
  }
}

/**
 * Update order status (admin only) via Admin GraphQL API.
 */
export async function updateAdminOrderStatus(
  orderId: string,
  fulfillmentStatus: string
): Promise<boolean> {
  if (!isConfigured()) return false;

  try {
    const query = `
      mutation OrderUpdate($input: OrderInput!) {
        orderUpdate(input: $input) {
          order { id fulfillmentStatus }
          userErrors { field message }
        }
      }
    `;

    await adminGraphQLFetch<{
      orderUpdate: { order: { id: string }; userErrors: { field: string[]; message: string }[] };
    }>(query, { input: { id: orderId, fulfillmentStatus } });

    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}

// ================================================================
//  ADMIN PRODUCTS CRUD
// ================================================================

/**
 * Get all admin products (raw Admin REST format).
 */
export async function getAllAdminProducts(limit = 250): Promise<ShopifyAdminProduct[]> {
  if (!isConfigured()) return [];

  try {
    const data = await adminFetch<{ products: ShopifyAdminProduct[] }>(
      `/products.json?limit=${limit}`
    );
    return data.products || [];
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return [];
  }
}

/**
 * Delete a product (admin only).
 */
export async function deleteAdminProduct(productId: number): Promise<boolean> {
  if (!isConfigured()) return false;

  try {
    await adminFetch(`/products/${productId}.json`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

// ================================================================
//  UTILITY EXPORTS
// ================================================================

export { isConfigured as isShopifyConfigured };

// ================================================================
//  CUSTOMER AUTHENTICATION (Storefront API)
// ================================================================

export async function customerCreate(email: string, password: string, firstName?: string, lastName?: string): Promise<{ id: string }> {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id }
        customerUserErrors { code field message }
      }
    }
  `;
  const input: any = { email, password };
  if (firstName) input.firstName = firstName;
  if (lastName) input.lastName = lastName;

  const data = await storefrontFetch<any>(query, { input });
  if (data.customerCreate?.customerUserErrors?.length > 0) {
    throw new Error(data.customerCreate.customerUserErrors.map((e: any) => e.message).join(', '));
  }
  return data.customerCreate.customer;
}

export async function customerAccessTokenCreate(email: string, password: string): Promise<string> {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { code field message }
      }
    }
  `;
  const data = await storefrontFetch<any>(query, { input: { email, password } });
  if (data.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
    throw new Error(data.customerAccessTokenCreate.customerUserErrors.map((e: any) => e.message).join(', '));
  }
  return data.customerAccessTokenCreate.customerAccessToken.accessToken;
}

export async function getCustomer(customerAccessToken: string): Promise<{ id: string, email: string, firstName: string, lastName: string } | null> {
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        email
        firstName
        lastName
      }
    }
  `;
  const data = await storefrontFetch<any>(query, { customerAccessToken });
  return data.customer || null;
}
