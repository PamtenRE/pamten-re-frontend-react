# Pamten RecruitEdge Frontend - AI Coding Agent Instructions

## Architecture Overview

This is a **Next.js 15 App Router** recruitment platform with dual role support (Recruiter/Candidate). The backend API runs at `https://pamten-re-backend-java-dev.azurewebsites.net` by default.

### Key Architectural Patterns

1. **Hierarchical Provider Wrapping** (`src/providers/Providers.tsx`):
   - QueryProvider → ThemeProvider → AuthProvider → LoginModalProvider
   - Always wrap new context providers in this order

2. **Dual Layout System**:
   - Public pages: Use root layout with `Navbar` + animated blobs background
   - Recruiter pages: Use `RecruiterLayout` (Sidebar + main content, no Navbar)
   - Candidate pages: Standard layout (to be implemented)

3. **Role-Based Routing**:
   - Auth redirects happen in `AuthContext.tsx` after login based on role & `profileCompleted`
   - Client-side guards in page components check `user.role` before rendering
   - Pattern: Show loading → check auth → redirect if unauthorized

## State Management & Data Fetching

### React Query Setup
- **Provider**: `QueryProvider` wraps app in `src/providers/QueryProvider.tsx`
- **Hooks**: Create custom hooks in `src/hooks/useQueries.ts` for all data fetching
- **Pattern**: Use `useQuery` with descriptive `queryKey` arrays (e.g., `["features", type]`)
- **Caching**: Handled via `src/app/api/middleware.ts` with three tiers:
  - Static data (benefits, features): 1hr cache, 24hr stale-while-revalidate
  - Dynamic data (testimonials, initial-data): 5min cache, 1hr stale-while-revalidate
  - Real-time data (dashboard-nav, sidebar-links): no-store

### Auth Pattern
- `AuthContext` stores `user`, `token`, `isAuthenticated` in state + localStorage
- Use `useAuth()` hook to access auth state in components
- API calls: Pass token via `apiFetch(path, options, token)` from `src/utils/api.ts`
- **Critical**: Always check `if (!hydrated || user === null)` before rendering protected content

## API Integration

### Backend Communication
```typescript
// Use apiFetch wrapper from src/utils/api.ts
import { apiFetch } from '@/utils/api';
const data = await apiFetch('/api/auth/v1/login', {
  method: 'POST',
  body: JSON.stringify({ userId, password })
}, token);
```

### API Routes (Next.js)
- Location: `src/app/api/*/route.ts`
- Middleware applies cache headers automatically
- Always return `NextResponse.json(data, { headers: { 'Cache-Control': '...' } })`
- Combine related endpoints to reduce network requests (see `initial-data/route.ts`)

## Component Conventions

### File Organization
- **Components**: `src/components/` for shared UI (Hero, Navbar, etc.)
- **Layout Components**: `src/components/layout/` for structural wrappers
- **Role-specific**: `src/components/recruiter/`, `src/components/candidate/`

### Styling
- **Tailwind**: Use utility classes; dark mode via `dark:` prefix (class-based)
- **Glass effect**: `className="glass"` (defined in `globals.css`)
- **Animations**: Framer Motion for complex, CSS animations for simple (see `globals.css` blob animations)

### Client Components
- Mark `'use client'` for components using hooks, context, or interactivity
- Server components by default in App Router

## Development Workflow

### Commands
```bash
npm install      # Install dependencies
npm run dev      # Start dev server on port 3000
npm run build    # Production build
npm start        # Start production server (uses server.js for Azure)
npm run lint     # ESLint (currently disabled in builds via next.config.ts)
```

### Deployment (Azure App Service)
- **GitHub Actions**: Automated on push to `develop`, `feature/*`, or `master` branches
- **Build Output**: `nextjs/` folder (custom distDir) MUST be included in deployment package
- **Required Files**: `server.js`, `web.config`, `package.json`, `node_modules/`, `nextjs/`, `public/`
- **Azure Quirk**: Hidden folders (like `.next`) are skipped by Zip Deploy; `nextjs/` avoids this.
- **Azure Config**: Set startup command to `node server.js` in App Service settings

### Path Aliases
- `@/*` maps to `src/*` (configured in `tsconfig.json`)
- Always use absolute imports: `import { Component } from '@/components/Component'`

## Type Safety

### Type Definitions
- Central types: `src/types/index.ts`
- All interfaces extend `BaseEntity { id: string; createdAt: string; updatedAt: string; }`
- API responses wrap data: `APIResponse<T> = { data: T; error?: string }`

### Common Interfaces
```typescript
User: { userId, email, role, profileCompleted, token }
Feature: { title, description, icon, type: 'candidate' | 'recruiter' }
Testimonial: extends BaseEntity, adds { quote, author, role, company, avatar }
```

## Critical Gotchas

1. **Hydration Mismatch**: Always use `const [hydrated, setHydrated] = useState(false)` + `useEffect(() => setHydrated(true), [])` before accessing localStorage
2. **Auth Guards**: Check `user === null` (loading) vs `!user` (not authenticated)
3. **Dynamic Routes**: Use `[id]` folder naming for dynamic segments (Next.js 15)
4. **Environment Variables**: Backend URL via `NEXT_PUBLIC_API_BASE_URL` (defaults to `https://pamten-re-backend-java-dev.azurewebsites.net`)

## Integration Points

- **External API**: Java Spring Boot backend (separate service)
- **Authentication**: JWT tokens stored in localStorage, passed as Bearer tokens
- **Theming**: `ThemeContext` manages dark/light mode via `class` toggle on `<html>`

## Future Considerations (from README comments)

- Error boundaries not yet implemented
- Response compression (br, gzip) should be added to API headers
- Custom hooks for common patterns need expansion
- Redux may be added for complex state management
- WebSocket middleware planned for real-time features
