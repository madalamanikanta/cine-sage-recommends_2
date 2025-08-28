# Contributing to CineSage

Welcome to CineSage! This guide will help you set up the development environment and understand our development workflow.

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**
- **Supabase account** (for database)

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cine-sage-recommends
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

**Getting Supabase Credentials:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing one
3. Go to Settings → API
4. Copy the Project URL and anon/public key

### 4. Database Setup

Run the database migration in your Supabase SQL editor:

```sql
-- See supabase/migrations/ for the complete schema
-- Key tables: profiles, anime, recommendations, reviews, user_anime
```

### 5. Verify Setup

```bash
npm run dev
```

Visit `http://localhost:8080` to ensure the app loads correctly.

## Development Workflow

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run type-check` | Run TypeScript type checking |
| `npm run check-all` | Run all checks (lint + type-check + test) |
| `npm run format` | Format code with Prettier |

### Code Quality

We use several tools to maintain code quality:

- **ESLint** - Linting with TypeScript and React rules
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Vitest** - Unit testing
- **Husky** - Pre-commit hooks

### Pre-commit Hooks

Pre-commit hooks automatically run:
- TypeScript type checking
- ESLint on staged files
- Prettier formatting

If any check fails, the commit will be blocked.

### Testing

We use **Vitest** and **React Testing Library** for testing:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage
```

**Testing Guidelines:**
- Write tests for all new components and hooks
- Use MSW for mocking API calls
- Test user interactions, not implementation details
- Aim for meaningful test descriptions

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ErrorBoundary.tsx
├── hooks/              # Custom React hooks
├── pages/              # Route components
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
├── integrations/       # External service integrations
└── test/               # Test utilities and mocks
```

### Component Guidelines

1. **Use TypeScript** - All components must be typed
2. **Follow naming conventions** - PascalCase for components
3. **Use shadcn/ui components** - Prefer existing UI components
4. **Responsive design** - Use Tailwind CSS classes
5. **Accessibility** - Include proper ARIA labels and keyboard navigation

### State Management

- **React Query** - Server state management
- **React Context** - Global client state (auth, theme)
- **useState/useReducer** - Local component state

### Styling

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Pre-built accessible components
- **CSS Variables** - Theme customization

### API Integration

- **Supabase** - Database and authentication
- **Jikan API** - Anime data
- **React Query** - Data fetching and caching

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Follow the coding standards
- Write tests for new functionality
- Update documentation if needed

### 3. Run Quality Checks

```bash
npm run check-all
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

Use conventional commit messages:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/tooling changes

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

## Troubleshooting

### Common Issues

**Environment Variables Not Loading:**
- Ensure `.env` file is in root directory
- Restart development server after changes
- Check variable names start with `VITE_`

**Supabase Connection Issues:**
- Verify URL and key in `.env`
- Check Supabase project is active
- Ensure database schema is migrated

**Build Errors:**
- Run `npm run type-check` to identify TypeScript issues
- Check for missing dependencies
- Clear node_modules and reinstall if needed

**Test Failures:**
- Ensure MSW mocks are properly configured
- Check test environment setup
- Verify component imports and exports

### Getting Help

- Check existing issues in the repository
- Review documentation and code comments
- Ask questions in team discussions
- Consult the README for additional setup information

## Code Review Process

1. **Self-review** - Review your own changes first
2. **Automated checks** - Ensure all CI checks pass
3. **Peer review** - Request review from team members
4. **Address feedback** - Make requested changes
5. **Merge** - Squash and merge when approved

Thank you for contributing to CineSage! 🎬
