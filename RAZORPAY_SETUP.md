# Razorpay Integration Setup with Existing Supabase Database

This document explains how to set up Razorpay payment integration with your existing Supabase database that already has an orders table.

## Prerequisites

1. You already have an orders table in your Supabase database
2. You have a working React/Vite frontend
3. You have Razorpay account credentials (Key ID and Secret)

## Setup Steps

### 1. Update Your Database Schema

Run the SQL scripts in the following order:

1. First, update your existing orders table structure:
   ```sql
   -- Run this in your Supabase SQL editor
   \i update-orders-table-for-razorpay.sql
   ```

2. Then migrate your existing data:
   ```sql
   -- Run this in your Supabase SQL editor
   \i migrate-existing-orders.sql
   ```

### 2. Environment Configuration

Update your `.env` file with your actual Razorpay credentials:

```env
VITE_RAZORPAY_KEY_ID=your_actual_razorpay_key_id
VITE_RAZORPAY_KEY_SECRET=your_actual_razorpay_secret
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the checkout page
3. Select Razorpay as your payment method
4. Complete a test payment using Razorpay's test card numbers

### 4. Verify the Setup

After a successful payment:
1. Check that the order appears in your Supabase orders table
2. Verify that the Razorpay fields (order_id, payment_id, signature) are populated
3. Confirm that the payment_status is updated to 'paid'

## Troubleshooting

### "Relation orders already exists" Error

This error occurs because you already have an orders table. The solution is to use the `update-orders-table-for-razorpay.sql` script instead of trying to create a new table.

### Payment Verification Fails

If you're getting "Payment verification failed" errors:

1. Check that your Razorpay secret key is correct in the `.env` file
2. Verify that the webhook signature verification is working properly
3. Check the browser console and Supabase logs for specific error messages

### Orders Not Saving to Database

If orders are not being saved to the database:

1. Check your Supabase connection settings
2. Verify that Row Level Security (RLS) policies allow the operations
3. Ensure that the user has proper permissions to insert/update orders

## Security Considerations

### Protecting Your Keys

Never expose your Razorpay secret key in client-side code. In this implementation:
- The key ID is in the `.env` file as `VITE_RAZORPAY_KEY_ID` (safe for client-side)
- The secret key is in the `.env` file as `VITE_RAZORPAY_KEY_SECRET` (should be moved to backend in production)

### For Production Deployment

For a production environment, you should:

1. Move the secret key to a secure backend service
2. Implement proper webhook handling for payment confirmations
3. Use Supabase Edge Functions or a separate API server for payment processing
4. Implement proper error handling and logging

## Moving to Production

### 1. Secure Your Keys

Create a separate backend service (Node.js, Supabase Edge Functions, etc.) to handle:
- Razorpay order creation
- Payment verification
- Database updates

### 2. Update Frontend Calls

Modify the frontend to call your backend endpoints instead of importing functions directly.

### 3. Implement Webhooks

Set up Razorpay webhooks to handle payment events:
1. In your Razorpay dashboard, go to Settings > Webhooks
2. Add a new webhook with your backend endpoint URL
3. Subscribe to relevant events (payment.captured, payment.failed, etc.)

## Support

For issues with this integration:
1. Check the browser console for JavaScript errors
2. Check Supabase logs for database errors
3. Verify your Razorpay dashboard for payment records
4. Review this documentation for setup steps