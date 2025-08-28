# CineSage Smoke Test Checklist

## 🚀 App Startup & Build
- [ ] Dependencies install without errors
- [ ] Development server starts on port 8080
- [ ] Environment variables load correctly
- [ ] No TypeScript compilation errors
- [ ] Vite build completes successfully

## 🛣️ Route Rendering
- [ ] `/` (Index/Landing) - renders without errors
- [ ] `/auth` (Authentication) - renders login/signup forms
- [ ] `/dashboard` - renders user dashboard
- [ ] `/preferences` - renders preference settings
- [ ] `/recommendations` - renders recommendation list
- [ ] `/recent` - renders recent activity
- [ ] `/trending` - renders trending anime
- [ ] `/404` - renders not found page
- [ ] Route navigation works (no white screens)

## 🧩 Component Mounting
- [ ] ErrorBoundary wraps app correctly
- [ ] Navbar renders and shows correct auth state
- [ ] Cards and UI components render properly
- [ ] Icons (Lucide) load and display
- [ ] Gradients and animations work
- [ ] Forms render with proper validation
- [ ] Toasts/notifications system works

## 🔐 Supabase Integration
- [ ] Supabase client initializes without errors
- [ ] Environment variables are read correctly
- [ ] Database connection established
- [ ] Authentication context loads
- [ ] User signup flow works
- [ ] User login flow works
- [ ] Profile creation trigger fires
- [ ] Row Level Security policies work
- [ ] Database queries execute successfully

## 🐛 Console & Error Checking
- [ ] No JavaScript errors in console
- [ ] No React warnings or deprecations
- [ ] No network request failures
- [ ] No 404s for assets (images, fonts)
- [ ] No CORS errors
- [ ] No authentication errors
- [ ] No database connection errors
- [ ] Performance warnings acceptable

## 📱 Basic Functionality
- [ ] Landing page loads and looks good
- [ ] Auth forms accept input
- [ ] Navigation between pages works
- [ ] User preferences can be set
- [ ] Mock recommendations display
- [ ] Recent activity tracks actions
- [ ] Logout functionality works

## 🎨 UI/UX Basics
- [ ] Responsive design works on different screen sizes
- [ ] Dark/light theme elements render correctly
- [ ] Loading states show appropriately
- [ ] Error states display user-friendly messages
- [ ] Animations don't cause layout shifts
- [ ] Text is readable and properly styled
