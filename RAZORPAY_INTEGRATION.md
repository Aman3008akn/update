# Razorpay Integration with Supabase

This document explains how to set up and use the Razorpay payment integration with Supabase in your e-commerce application.

## Table of Contents
1. [Overview](#overview)
2. [Setup Instructions](#setup-instructions)
3. [Key Files and Structure](#key-files-and-structure)
4. [Payment Flow](#payment-flow)
5. [Security Considerations](#security-considerations)
6. [Testing](#testing)
7. [Switching to Production](#switching-to-production)

## Overview

This integration provides a complete Razorpay payment flow with Supabase as the backend. It includes:
- Creating Razorpay orders
- Processing payments through the Razorpay checkout
- Verifying payment signatures
- Storing order information in Supabase
- Updating order status after successful payment

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For development, you can use test keys from your Razorpay dashboard. For production, use your live keys.

### 2. Supabase Setup

Run the SQL script in `supabase-orders-schema.sql` to create the orders table:

```sql
-- Create the orders table with all necessary fields
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  user_id UUID REFERENCES users(id),
  user_identifier TEXT,
  shipping_name TEXT,
  shipping_street TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_zip TEXT,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Install Dependencies

Make sure you have the required dependencies in your `package.json`:

```json
{
  "dependencies": {
    "razorpay": "^2.9.6",
    "crypto": "^1.0.1"
  }
}
```

Install them with:
```bash
npm install razorpay crypto
```

## Key Files and Structure

### Frontend Files
- `src/lib/razorpay.ts` - Utility functions for Razorpay integration
- `src/lib/config.ts` - Configuration with environment variables
- `src/pages/CheckoutPage.tsx` - Checkout page with Razorpay payment option
- `src/api/create-razorpay-order.ts` - API function to create Razorpay orders
- `src/api/verify-razorpay-payment.ts` - API function to verify payments

### Backend Files (Vite-based)
- Since we're using Vite, the API functions are imported directly rather than called via HTTP endpoints

## Payment Flow

1. **User initiates payment**: On the checkout page, user selects Razorpay as payment method
2. **Create order**: The frontend calls `createRazorpayOrder()` which creates an order with Razorpay
3. **Open checkout**: The frontend opens the Razorpay checkout modal with the order ID
4. **Process payment**: User completes payment in the Razorpay modal
5. **Handle success**: On successful payment, Razorpay calls the handler function
6. **Verify payment**: The handler calls `verifyPayment()` to verify the payment signature
7. **Update database**: If verification succeeds, the order status is updated in Supabase
8. **Complete**: User is redirected to the orders page with a success message

## Security Considerations

### Key Storage
- Never expose your Razorpay secret key in client-side code
- In this implementation, we're using Vite's environment variables which are only available at build time
- For production, you should move the API functions to a secure backend (Node.js API, Supabase Functions, etc.)

### Signature Verification
- Always verify the payment signature returned by Razorpay
- The signature is generated using HMAC SHA256 with your secret key
- Never trust payment data without verification

### Database Security
- The orders table uses Row Level Security (RLS) to protect data
- Users can only view, insert, and update their own orders
- Use service role keys only in secure backend environments

## Testing

### Test Keys
1. Log in to your Razorpay dashboard
2. Go to Settings > API Keys
3. Generate test keys if you don't have them
4. Update your `.env` file with test keys

### Test Payments
1. Use test card numbers provided by Razorpay:
   - Card Number: 4111 1111 1111 1111
   - Expiry: Any future date
   - CVV: 123
   - Name: Any name
   - Email: Any email

2. Test different scenarios:
   - Successful payment
   - Failed payment
   - Cancelled payment

## Switching to Production

### 1. Update Keys
Replace your test keys in `.env` with live keys from your Razorpay dashboard.

### 2. Move to Secure Backend
For production, move the API functions to a secure backend:

#### Option A: Supabase Edge Functions
Create proper Edge Functions that can access environment variables securely:

```typescript
// supabase/functions/create-razorpay-order/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (_req) => {
  // Your secure implementation here
  // Access keys via Deno.env.get('RAZORPAY_KEY_ID')
});
```

#### Option B: Node.js API Routes
Create API routes in a separate Node.js server:

```javascript
// api/create-razorpay-order.js
const express = require('express');
const Razorpay = require('razorpay');

const app = express();
app.use(express.json());

app.post('/create-razorpay-order', (req, res) => {
  // Your secure implementation here
});

module.exports = app;
```

### 3. Update Frontend Calls
Update the frontend to call your backend endpoints instead of importing the functions directly:

```typescript
// In src/lib/razorpay.ts
export const createRazorpayOrder = async (amount: number, currency: string = 'INR'): Promise<RazorpayOrder> => {
  try {
    const response = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency })
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};
```

## Troubleshooting

### "Oops! Something went wrong. Payment Failed"
This error typically occurs due to:
1. Incorrect Razorpay keys
2. Failed signature verification
3. Network issues
4. Database connection problems

Check the browser console and server logs for specific error messages.

### Payment Verification Fails
1. Ensure your Razorpay secret key is correct
2. Check that the order ID and payment ID match
3. Verify the signature generation algorithm matches Razorpay's specification

### Order Not Saved to Database
1. Check Supabase connection settings
2. Verify RLS policies allow the operation
3. Ensure the user has proper permissions

## Support

For issues with this integration, please check:
1. Razorpay documentation: https://razorpay.com/docs/
2. Supabase documentation: https://supabase.com/docs
3. This project's issue tracker