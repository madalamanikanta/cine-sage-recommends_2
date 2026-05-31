# Deployment Guide - CineSage on Vercel

This guide walks you through deploying the CineSage anime recommendation app to Vercel with proper configuration and post-deployment validation.

## 📋 Pre-Deployment Checklist

- [ ] Supabase project is set up and configured
- [ ] Database migrations have been run
- [ ] Environment variables are documented
- [ ] Application builds successfully locally (`npm run build`)
- [ ] All tests pass (`npm run test`)
- [ ] Code quality checks pass (`npm run check-all`)

## 🚀 Vercel Deployment Steps

### Step 1: Prepare Your Repository

1. **Ensure your code is pushed to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "feat: prepare for Vercel deployment"
   git push origin main
   ```

2. **Verify Vercel configuration exists**
   - Check that `vercel.json` is in your project root
   - Verify build settings are correct

### Step 2: Create Vercel Project

1. **Go to [vercel.com](https://vercel.com) and sign in**

2. **Click "New Project"**
   ![Vercel New Project Button](https://vercel.com/docs/concepts/get-started/deploy#new-project)

3. **Import your Git repository**
   - Select your Git provider (GitHub, GitLab, Bitbucket)
   - Choose the `cine-sage-recommends` repository
   - Click "Import"

4. **Configure Project Settings**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### Step 3: Environment Variables Setup

**In Vercel Dashboard → Settings → Environment Variables, add:**

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `your-anon-key` | Production, Preview, Development |

**Getting Supabase Values:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy "Project URL" for `VITE_SUPABASE_URL`
4. Copy "anon/public" key for `VITE_SUPABASE_PUBLISHABLE_KEY`

![Supabase API Settings](https://supabase.com/docs/img/api/api-url-anon-key.png)

### Step 4: Deploy

1. **Click "Deploy"** - Vercel will automatically build and deploy your app
2. **Wait for deployment** - This typically takes 2-3 minutes
3. **Get your deployment URL** - Copy the provided URL (e.g., `https://cine-sage-recommends.vercel.app`)

## ✅ Post-Deployment Validation

### Automated Smoke Tests

Run the automated post-deployment checker:

```bash
# Install dependencies if running locally
npm install

# Run smoke tests against your deployed app
node scripts/post-deploy-check.js https://your-app.vercel.app
```

You can also run the new utility directly:

```bash
npm install
npm run health-check -- https://your-app.vercel.app
```

The GitHub Actions workflow uploads `health-report.json` and `health-check.log` as artifacts after every run. Use these artifacts to inspect exact route timings, API validation details, and Supabase connectivity results.

**Expected Output:**
```
🚀 Starting health checks for: https://your-app.vercel.app

✅ [timestamp] Route / returned 200 (page route)
✅ [timestamp] Route /auth returned 200 (page route)
✅ [timestamp] Route /dashboard returned 200 (page route)
✅ [timestamp] Route /preferences returned 200 (page route)
✅ [timestamp] Route /recommendations returned 200 (page route)
✅ [timestamp] Route /recent returned 200 (page route)
✅ [timestamp] Route /trending returned 200 (page route)
✅ [timestamp] Route /login returned 200 (page route)
✅ [timestamp] Route /register returned 200 (page route)
✅ [timestamp] Route /non-existent-route returned 200 (SPA fallback)

📦 Asset checks:
✅ [timestamp] Asset loaded: https://your-app.example.com/assets/... (.js/.css)
✅ [timestamp] Asset loaded: https://your-app.example.com/robots.txt

✅ [timestamp] Supabase REST API /rest/v1/profiles?select=id&limit=1 returned 200
✅ [timestamp] Supabase client query succeeded with 1 item(s)

===== HEALTH CHECK SUMMARY =====
Website status: PASS
API status: PASS
Supabase status: PASS
Overall result: PASS
```

🔒 Security Headers Check...
ℹ️ [timestamp] Optional header not set: x-frame-options
ℹ️ [timestamp] Optional header not set: x-content-type-options
ℹ️ [timestamp] Optional header not set: referrer-policy

📊 DEPLOYMENT HEALTH REPORT
==================================================
Total Checks: 12
✅ Passed: 12
ℹ️ Failed: 0
ℹ️ Errors: 0

✅ DEPLOYMENT HEALTHY
All critical checks passed!
```

### Manual Validation Checklist

**🌐 Basic Functionality**
- [ ] Home page loads without errors
- [ ] Navigation works between all pages
- [ ] No console errors in browser dev tools
- [ ] Responsive design works on mobile/tablet

**🔐 Authentication Flow**
- [ ] Sign up form appears and functions
- [ ] Sign in form appears and functions
- [ ] Password reset flow works
- [ ] OAuth providers work (if configured)
- [ ] User session persists across page refreshes

**📊 Supabase Integration**
- [ ] User registration creates profile in database
- [ ] Preferences can be saved and loaded
- [ ] Dashboard displays user-specific data
- [ ] No Supabase connection errors in console

**🎬 Anime Features**
- [ ] Anime catalog loads (even if using mock data)
- [ ] Search functionality works
- [ ] Recommendations page displays content
- [ ] User can interact with anime cards

**📱 Performance & UX**
- [ ] Initial page load < 3 seconds
- [ ] Navigation is smooth and responsive
- [ ] Loading states display appropriately
- [ ] Error states handle gracefully

## 🔧 Troubleshooting Common Issues

### Build Failures

**Issue: "Module not found" errors**
```bash
# Solution: Check import paths and dependencies
npm run type-check
npm run lint
```

**Issue: Environment variables not available**
- Verify variables are set in Vercel dashboard
- Ensure variable names start with `VITE_`
- Redeploy after adding variables

### Runtime Errors

**Issue: "Configuration Error" on deployed app**
- Check Supabase URL and key are correctly set
- Verify Supabase project is active and accessible
- Test Supabase connection in local development

**Issue: 404 errors on page refresh**
- Verify `vercel.json` has correct rewrite rules
- Check SPA routing configuration

**Issue: Slow loading times**
- Enable Vercel Analytics to identify bottlenecks
- Optimize bundle size with `npm run build -- --analyze`
- Consider implementing code splitting

### Supabase Connection Issues

**Issue: "Failed to fetch" errors**
- Verify CORS settings in Supabase dashboard
- Check RLS policies allow public access where needed
- Ensure API keys have correct permissions

## 📊 Monitoring & Maintenance

### Vercel Analytics
1. Go to your Vercel project dashboard
2. Navigate to "Analytics" tab
3. Monitor Core Web Vitals and user metrics

### Error Tracking
- Check Vercel Function logs for server-side errors
- Monitor browser console for client-side errors
- Set up error tracking service (Sentry, LogRocket) if needed

### Performance Monitoring
```bash
# Analyze bundle size
npm run build -- --analyze

# Check lighthouse scores
npx lighthouse https://your-app.vercel.app --view
```

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel automatically builds and deploys
# Check deployment status at https://vercel.com/dashboard
```

### Branch Previews
- Every pull request gets a preview deployment
- Preview URLs are automatically generated
- Perfect for testing before merging

## 🚨 Rollback Procedure

If deployment issues occur:

1. **Immediate Rollback**
   - Go to Vercel dashboard → Deployments
   - Find the last working deployment
   - Click "..." → "Promote to Production"

2. **Fix and Redeploy**
   ```bash
   # Fix the issue locally
   git add .
   git commit -m "fix: resolve deployment issue"
   git push origin main
   ```

## 📞 Support Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Project Issues**: Check GitHub Issues for known problems
- **Community Support**: Vercel Discord, Supabase Discord

---

## 🎉 Deployment Complete!

Your CineSage app is now live on Vercel! Share your deployment URL and start getting user feedback.

**Next Steps:**
- Set up custom domain (optional)
- Configure analytics and monitoring
- Plan feature updates and improvements
- Monitor user feedback and performance metrics
