// ============================================================
// Shopify Storefront API TypeScript Interfaces
// ============================================================

// --- Image ---
export interface ShopifyImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

// --- Money ---
export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

// --- Product Variant ---
export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: { name: string; value: string }[];
  image: ShopifyImage | null;
  sku: string | null;
}

// --- Product ---
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  vendor: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  availableForSale: boolean;
  totalInventory: number | null;
  featuredImage: ShopifyImage | null;
  images: {
    edges: { node: ShopifyImage }[];
  };
  variants: {
    edges: { node: ShopifyProductVariant }[];
  };
  options: {
    name: string;
    values: string[];
  }[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  collections: {
    edges: { node: { id: string; title: string; handle: string } }[];
  };
}

// --- Collection ---
export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    edges: { node: ShopifyProduct }[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

// --- Cart Line ---
export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    __typename: string;
    id: string;
    title: string;
    price: ShopifyMoney;
    compareAtPrice: ShopifyMoney | null;
    product: {
      id: string;
      title: string;
      handle: string;
      vendor: string;
      featuredImage: ShopifyImage | null;
      productType: string;
    };
    selectedOptions: { name: string; value: string }[];
  };
  cost: {
    totalAmount: ShopifyMoney;
    amountPerQuantity: ShopifyMoney;
    compareAtAmountPerQuantity: ShopifyMoney | null;
  };
}

// --- Cart ---
export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  createdAt: string;
  updatedAt: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
    totalTaxAmount: ShopifyMoney | null;
    totalDutyAmount: ShopifyMoney | null;
  };
  lines: {
    edges: { node: ShopifyCartLine }[];
  };
  discountCodes: {
    code: string;
    applicable: boolean;
  }[];
  buyerIdentity: {
    email: string | null;
    phone: string | null;
    customer: { id: string; email: string } | null;
  };
}

// --- Customer ---
export interface ShopifyCustomer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  orders: {
    edges: { node: ShopifyOrder }[];
  };
}

// --- Order ---
export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: ShopifyMoney;
  subtotalPrice: ShopifyMoney;
  totalShippingPrice: ShopifyMoney;
  lineItems: {
    edges: {
      node: {
        title: string;
        quantity: number;
        variant: ShopifyProductVariant | null;
        originalTotalPrice: ShopifyMoney;
      };
    }[];
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string | null;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone: string | null;
  } | null;
  statusUrl: string;
  successfulFulfillments: {
    trackingCompany: string | null;
    trackingInfo: { number: string; url: string | null }[];
  }[];
}

// --- API Response Types ---
export interface ShopifyGraphQLResponse<T> {
  data: T;
  errors?: { message: string; locations?: { line: number; column: number }[] }[];
}

export interface ShopifyProductsResponse {
  products: {
    edges: { node: ShopifyProduct; cursor: string }[];
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
  };
}

export interface ShopifyProductByHandleResponse {
  product: ShopifyProduct | null;
}

export interface ShopifyProductByIdResponse {
  node: ShopifyProduct | null;
}

export interface ShopifyCartCreateResponse {
  cartCreate: {
    cart: ShopifyCart;
    userErrors: { code: string; field: string[]; message: string }[];
  };
}

export interface ShopifyCartResponse {
  cart: ShopifyCart | null;
}

export interface ShopifyCartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart;
    userErrors: { code: string; field: string[]; message: string }[];
  };
}

export interface ShopifyCartLinesRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyCart;
    userErrors: { code: string; field: string[]; message: string }[];
  };
}

export interface ShopifyCartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyCart;
    userErrors: { code: string; field: string[]; message: string }[];
  };
}

export interface ShopifyCartDiscountCodesUpdateResponse {
  cartDiscountCodesUpdate: {
    cart: ShopifyCart;
    userErrors: { code: string; field: string[]; message: string }[];
  };
}

export interface ShopifyCartBuyerIdentityUpdateResponse {
  cartBuyerIdentityUpdate: {
    cart: ShopifyCart;
    userErrors: { code: string; field: string[]; message: string }[];
  };
}

export interface ShopifyCartDeliveryAddressUpdateResponse {
  cartDeliveryAddressUpdate: {
    cart: ShopifyCart;
    userErrors: { code: string; field: string[]; message: string }[];
  };
}

export interface ShopifyCustomerOrdersResponse {
  customer: {
    orders: {
      edges: { node: ShopifyOrder }[];
    };
  } | null;
}

// --- Admin API Response Types ---
export interface ShopifyAdminOrder {
  id: string;
  name: string;
  order_number: number;
  created_at: string;
  updated_at: string;
  total_price: string;
  subtotal_price: string;
  financial_status: string;
  fulfillment_status: string | null;
  email: string;
  phone: string | null;
  customer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  line_items: {
    id: number;
    title: string;
    quantity: number;
    price: string;
    product_id: number;
    variant_id: number;
    sku: string;
    image: string | null;
  }[];
  shipping_address: {
    name: string;
    first_name?: string;
    last_name?: string;
    address1: string;
    address2: string | null;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone: string | null;
  } | null;
  note: string | null;
}

export interface ShopifyAdminOrdersResponse {
  orders: ShopifyAdminOrder[];
}

export interface ShopifyAdminProduct {
  id: number;
  title: string;
  handle: string;
  body_html?: string;
  product_type: string;
  vendor: string;
  status: string;
  tags?: string;
  created_at: string;
  updated_at: string;
  total_inventory?: number;
  image?: { id?: number; src: string; alt?: string; width?: number; height?: number } | null;
  images?: { id: number; src: string; alt?: string; width?: number; height?: number }[];
  options?: { id?: number; name: string; values: string[] }[];
  variants: {
    id: number;
    title: string;
    price: string;
    compare_at_price: string | null;
    inventory_quantity?: number;
    sku?: string;
    available?: boolean;
    option1?: string;
    option2?: string;
    option3?: string;
  }[];
}

export interface ShopifyAdminProductsResponse {
  products: ShopifyAdminProduct[];
}
