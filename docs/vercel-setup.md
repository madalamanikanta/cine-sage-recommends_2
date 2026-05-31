# Vercel Deployment Quick Reference

## Environment Variables Mapping

Copy these exact values to your Vercel project settings:

### Production Environment Variables

| Variable Name | Description | Where to Get It |
|---------------|-------------|-----------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key | Supabase Dashboard → Settings → API → Project API keys → anon public |

### Vercel Configuration

**Build Settings:**
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Root Directory: `./`

## Quick Deploy Commands

```bash
# Pre-deployment check
npm run check-all

# Build locally to test
npm run build

# Post-deployment validation
npm run deploy:check https://your-app.vercel.app

# Local deployment health check
npm run health-check -- https://your-app.vercel.app
```

## Deployment Health Monitor

This repository includes a GitHub Actions workflow that runs every 3 days and on manual dispatch.
It validates the deployed site, public API dependencies, and Supabase connectivity.
Upload the following GitHub secrets to use it:

- `WEBSITE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `PRODUCTION_URL` (optional)

## Common Issues & Solutions

**Build fails with TypeScript errors:**
```bash
npm run type-check
# Fix any TypeScript issues before deploying
```

**Environment variables not working:**
- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check Supabase project is active

**404 on page refresh:**
- Verify `vercel.json` exists with SPA rewrites
- Check deployment logs for routing issues
