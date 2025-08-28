# Database Setup Instructions for CineSage

## Your Supabase Project Details
- **Project ID**: `rentirjcncmgctbpylrm`
- **Dashboard URL**: https://supabase.com/dashboard/project/rentirjcncmgctbpylrm

## Step 1: Update Environment Variables

Update your `.env` file with these values:

```env
VITE_SUPABASE_URL=https://rentirjcncmgctbpylrm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-actual-anon-key-from-dashboard
VITE_SUPABASE_PROJECT_ID=rentirjcncmgctbpylrm
```

## Step 2: Get Your API Key

1. Go to: https://supabase.com/dashboard/project/rentirjcncmgctbpylrm/settings/api
2. Copy the **anon** **public** key (long JWT token)
3. Replace `your-actual-anon-key-from-dashboard` in your .env file

## Step 3: Run Database Migration

1. Go to: https://supabase.com/dashboard/project/rentirjcncmgctbpylrm/sql/new
2. Copy the entire contents of `supabase/migrations/20250819045436_067ec2d3-019a-4cbf-af72-92eeec9258ff.sql`
3. Paste it into the SQL Editor
4. Click **Run** to create all tables

## Step 4: Restart Development Server

After updating .env:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Verification

Once configured correctly, you should be able to:
- Sign up for new accounts
- Login with existing accounts
- Save user preferences
- View recommendations
- No console errors related to Supabase
