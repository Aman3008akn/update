# MythManga Store

An anime merchandise e-commerce store built with React, Vite, and Supabase.

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

## Environment Variables

Make sure to set the following environment variables in Netlify:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

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