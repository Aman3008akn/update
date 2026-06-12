# MythManga Store

An anime merchandise e-commerce store built with React, Vite, and Supabase.

## 🚀 New Features

- **Complete Admin Dashboard Control** - Every single element of the website is now controllable from the admin panel
- **Dynamic Settings** - All content, colors, features, and functionality can be changed in real-time
- **15+ Admin Tabs** - Comprehensive settings for Basic Info, Hero Section, Announcements, Colors, Navbar, Footer, Contact, Social, WhatsApp, Notifications, Products, Checkout, Popups, SEO, and Advanced settings
- **Real-time Updates** - Changes in admin panel reflect immediately on the website without page refresh
- **Professional Email Notifications** - Automated order lifecycle emails (received, shipped, delivered, cancelled) with premium designs

## Deployment to Netlify

To deploy this site to Netlify:

1. Push your code to a GitHub repository
2. Go to [Netlify](https://app.netlify.com/)
3. Click "New site from Git"
4. Select your repository
5. Configure the following settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

## Email Configuration Instructions

To enable email notifications for order lifecycle events:

1. **Configure Gmail SMTP Settings**:
   - Enable 2-Factor Authentication on your Gmail account
   - Generate an App Password in Google Account Settings
   - Update the following environment variables:
     - `SMTP_USER`: your Gmail address (mythmangastores@gmail.com)
     - `SMTP_PASS`: your Gmail App Password (not your regular password)

2. **Set up Supabase Environment Variables**:
   - Go to your Supabase Dashboard
   - Navigate to Settings > Database > Environment Variables
   - Add these variables:
     - `SMTP_HOST`: "smtp.gmail.com"
     - `SMTP_PORT`: "587"
     - `SMTP_USER`: "mythmangastores@gmail.com"
     - `SMTP_PASS`: "your_gmail_app_password"
     - `SITE_URL`: your deployed site URL

3. **Enable the Email Function**:
   - In your Supabase Dashboard
   - Go to Functions and ensure the `send-email-notification` function is deployed
   - The function will handle sending order lifecycle emails

## Environment Variables

Make sure to set the following environment variables in Netlify:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SMTP_HOST` - SMTP server host (smtp.gmail.com for Gmail)
- `SMTP_PORT` - SMTP server port (587 for TLS)
- `SMTP_USER` - Your email address
- `SMTP_PASS` - Your email app password
- `SITE_URL` - Your deployed site URL

## Development

To run locally:
```bash
npm install
npm run dev
```

To build for production:
```bash
npm run build
```