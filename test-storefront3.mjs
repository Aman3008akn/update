import fs from 'fs';

const domain = 'g2r1t1-mx.myshopify.com';
const token = '55e356ac23d69ee0b7bbf89e13e0c2ee';

const query = `
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

  query GetAllProducts($first: Int!) {
    products(first: $first) { edges { node { ...ProductFields } } pageInfo { hasNextPage hasPreviousPage } }
  }
`;

fetch(`https://${domain}/api/2025-04/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': token,
  },
  body: JSON.stringify({ query, variables: { first: 10 } })
})
.then(res => res.json())
.then(res => {
  console.log(JSON.stringify(res, null, 2));
})
.catch(console.error);
