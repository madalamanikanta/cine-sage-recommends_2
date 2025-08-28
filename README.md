# CineSage - Anime Recommendation App

CineSage is a modern anime recommendation platform that helps users discover new anime based on their preferences, viewing history, and personalized recommendations.

## ✨ Features

### 🎯 Core Features
- **Personalized Recommendations** - AI-powered suggestions based on your preferences
- **Anime Discovery** - Browse extensive anime catalog with detailed information
- **User Profiles** - Track your watching progress and favorites
- **Advanced Search** - Find anime by genre, year, rating, and more
- **Reviews & Ratings** - Share your thoughts and read community reviews

### 🔐 Authentication
- **Email/Password** - Traditional sign-up and login
- **Magic Links** - Passwordless authentication via email OTP
- **OAuth Integration** - Sign in with Google, GitHub, or Discord
- **Session Management** - Secure user sessions with automatic refresh

### 📱 User Experience
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Dark/Light Theme** - Customizable appearance
- **Real-time Updates** - Live notifications and data synchronization
- **Accessibility** - WCAG compliant with keyboard navigation
- **Progressive Web App** - Install and use offline

### 🛠️ Developer Experience
- **TypeScript** - Full type safety and IntelliSense
- **Component Library** - Reusable shadcn/ui components
- **Testing Suite** - Comprehensive unit and integration tests
- **Code Quality** - ESLint, Prettier, and pre-commit hooks
- **Error Handling** - Global error boundary and logging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Supabase account for database

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cine-sage-recommends

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

### Environment Setup

Create a `.env` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Optional: External API Keys
VITE_JIKAN_API_URL=https://api.jikan.moe/v4
```

**Getting Supabase Credentials:**
1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy your Project URL and anon/public key
4. Run the database migration from `supabase/migrations/`

### Development

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint

# Run all quality checks
npm run check-all
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at http://localhost:8080 |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run unit tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint linter |
| `npm run lint:fix` | Fix auto-fixable lint issues |
| `npm run type-check` | Run TypeScript type checking |
| `npm run check-all` | Run all quality checks (lint + type + test) |
| `npm run format` | Format code with Prettier |

## 🚢 Deployment

### Netlify (Recommended)

```bash
# Build the project
npm run build

# Deploy to Netlify
# The dist/ folder contains the built application
```

**Environment Variables for Production:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### Manual Deployment

1. Run `npm run build` to create production bundle
2. Upload `dist/` folder to your hosting provider
3. Configure environment variables in your hosting dashboard
4. Set up redirects for SPA routing (redirect all routes to `/index.html`)

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview"]
```

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript with enhanced developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library built on Radix UI

### Backend & Database
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Supabase Auth** - Authentication with multiple providers
- **Row Level Security** - Database-level authorization

### Data Fetching
- **React Query** - Server state management and caching
- **Jikan API** - MyAnimeList data integration
- **Real-time subscriptions** - Live data updates via Supabase

### Development Tools
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **MSW** - API mocking for tests
- **ESLint** - Code linting with TypeScript rules
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality gates

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   └── ErrorBoundary.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication hook
│   └── useAsync.tsx    # Async operations with error handling
├── pages/              # Route components (Index, Dashboard, etc.)
├── lib/                # Utilities and configurations
│   ├── logger.ts       # Logging utilities
│   └── supabase-logger.ts
├── types/              # TypeScript type definitions
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── test/               # Test utilities and mocks
    ├── mocks/          # MSW API mocks
    └── utils/          # Test helpers
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on:

- Setting up the development environment
- Code style and conventions
- Testing requirements
- Pull request process

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation** - Check [CONTRIBUTING.md](./CONTRIBUTING.md) for setup help
- **Issues** - Report bugs or request features via GitHub Issues
- **Discussions** - Join community discussions for questions and ideas

---

Built with ❤️ using modern web technologies
