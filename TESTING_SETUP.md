# Testing and Linting Setup for CineSage

## 🚀 Installation Commands

Run these commands to install all testing and linting dependencies:

```bash
# Install all new dependencies
npm install

# Initialize Husky for git hooks
npm run prepare
```

## 📁 Files Added/Modified

### Package.json Changes
- **Added dependencies**: vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, msw, jsdom, husky, lint-staged, prettier
- **Added scripts**: test, test:ui, test:run, test:coverage, type-check, lint:fix, check-all, prepare
- **Added lint-staged configuration** for pre-commit formatting

### New Configuration Files
- `vitest.config.ts` - Vitest configuration with jsdom environment
- `.prettierrc` - Code formatting rules
- `.husky/pre-commit` - Pre-commit hook for type-check and linting
- `src/vite-env.d.ts` - Added vitest globals types

### Enhanced ESLint Configuration
- Added TypeScript strict rules
- Added testing-library plugin for test files
- Configured globals for vitest functions (vi, describe, it, etc.)

### Test Infrastructure
- `src/test/setup.ts` - Test setup with mocks and global configurations
- `src/test/mocks/server.ts` - MSW server for mocking Supabase API calls
- `src/test/utils/test-utils.tsx` - Custom render function with providers
- `src/hooks/__tests__/useAuth.test.tsx` - Comprehensive auth hook tests
- `src/test/__tests__/components/Preferences.test.tsx` - Preferences component tests

## 🔧 Available Commands

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production

# Testing
npm run test               # Run tests in watch mode
npm run test:ui            # Run tests with UI interface
npm run test:run           # Run tests once
npm run test:coverage      # Run tests with coverage report

# Code Quality
npm run lint               # Check for linting errors
npm run lint:fix           # Fix auto-fixable linting errors
npm run type-check         # Run TypeScript type checking

# All Checks (CI/CD ready)
npm run check-all          # Run type-check + lint + test:run
```

## 🔍 Pre-commit Hook

The pre-commit hook automatically runs:
1. **Type checking** (`tsc --noEmit`)
2. **Lint-staged** - ESLint + Prettier on staged files

To bypass pre-commit hooks (not recommended):
```bash
git commit --no-verify
```

## 🧪 Test Coverage

Tests include:
- **useAuth hook** - All authentication methods with mocked Supabase
- **Preferences component** - User interactions, form submission, error handling
- **MSW mocks** - Supabase API endpoints, external APIs (AniList)

## 📊 ESLint Rules Summary

### TypeScript Rules
- `@typescript-eslint/no-unused-vars`: Error (with underscore prefix ignore)
- `@typescript-eslint/no-explicit-any`: Warning
- `@typescript-eslint/prefer-const`: Error
- `@typescript-eslint/no-non-null-assertion`: Warning

### React Rules
- `react-hooks/exhaustive-deps`: Warning
- `react-refresh/only-export-components`: Warning

### General Rules
- `no-console`: Warning (allows warn/error)
- `prefer-const`: Error
- `no-var`: Error

### Test Files
- Relaxed rules for test files
- Testing Library best practices enforced
- Console logging allowed in tests

## 🚨 Current Status

After running `npm install`, all TypeScript errors should be resolved. The setup includes:

✅ Vitest + React Testing Library
✅ Enhanced ESLint configuration
✅ Prettier code formatting
✅ Pre-commit hooks (type-check + lint)
✅ MSW for API mocking
✅ Comprehensive test examples
✅ Coverage reporting

## 🎯 Next Steps

1. Run `npm install` to install dependencies
2. Run `npm run check-all` to verify everything works
3. Run `npm run test:ui` to see the test interface
4. Make a commit to test the pre-commit hook
