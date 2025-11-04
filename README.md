# Pamten Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Performance Optimizations

### 1. Data Fetching & Caching

- Implemented React Query for efficient data management and caching
- Added centralized API service layer with type safety
- Created combined API endpoints to reduce network requests
- Implemented intelligent caching strategies:
  - Static data: 1 hour cache, 24 hours stale-while-revalidate----?
  - Dynamic data: 5 minutes cache, 1 hour stale-while-revalidate----?
  - Real-time data: No caching----?

### 2. API Route Improvements

- Added middleware for consistent caching across routes
- Implemented proper error handling and status codes // are we using Error boundaries?
- Optimized response payloads // are we adding cache encoding that is br, gzip in the response? - if not in response header we need to set it
- Added type safety with TypeScript

### 3. Component Optimization

- Implemented React Query in all data-fetching components
- Added proper loading states and error handling
- Created reusable loading and error components // custom hooks, utility functions
- Optimized re-renders with proper state management // useMemo, useCallback, React.memo
- Added type safety to all data interactions

### 4. Project Structure

```
src/
├── lib/
│   └── api/
│       ├── core.ts          # Base API utilities and error handling
│       └── services.ts      # Service layer for business logic
├── hooks/
│   └── queries.ts          # React Query hooks for data fetching
├── types/
│   └── index.ts           # TypeScript type definitions
├── utils/
│   └── helpers.ts         # Common utility functions
├── config/
│   └── constants.ts       # Application constants and config
└── providers/
    └── QueryProvider.tsx  # React Query provider setup
```

### 3. Key Features

- **Automatic Caching**: Data is cached and reused across components
- **Type Safety**: Full TypeScript support throughout the application
- **Error Handling**: Centralized error handling and retry logic
- **Performance**: Optimized data fetching and reduced network calls

### 4. Cache Configuration // in app the data we are getting how often we are refreshing

//suppose if recruiter adds new job post how soon it gets added in UI

- Short-term cache: 5 minutes
- Medium-term cache: 30 minutes
- Long-term cache: 24 hours

## Getting Started

### Prerequisites

- Node.js 22 or higher
- npm or yarn package manager
- Backend API running (default: `http://localhost:8080`)

### Local Development

First, run the development server:

```bash
npm install          # Install dependencies
npm run dev          # Start dev server on port 3000
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

### Azure App Service Deployment

This project uses GitHub Actions for automated deployment to Azure App Service:

**Branch Strategy:**
- `develop` → Deploys to Dev environment
- `feature/**` → Deploys to Dev environment
- `master` → Deploys to Production environment

**Required GitHub Secrets:**
- `CLIENT_ID` - Azure Service Principal Client ID
- `TENANT_ID` - Azure Tenant ID
- `SUBSCRIPTION_ID` - Azure Subscription ID
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL

**Deployment Process:**
1. Push to `develop` or `feature/*` branch
2. GitHub Actions builds Next.js app
3. Creates deployment package with `nextjs/`, `node_modules/`, and config files
4. Deploys to Azure Web App using web.config for IIS routing

**Files Required for Azure:**
- `web.config` - IIS configuration for Next.js routing
- `server.js` - Custom server for Azure App Service
- `package.json` - Must include `"start": "next start -p ${PORT:-3000}"`

### Manual Deployment

```bash
npm run build        # Build production bundle
npm start           # Start production server
```

### Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Troubleshooting Deployment

### `nextjs` Build Folder Missing After Deployment

If the `nextjs` folder is missing in Azure:

1. **Verify Build Success**: Check GitHub Actions logs for build errors
2. **Check Package Contents**: The workflow logs show deployment package contents
3. **Hidden Folders**: Azure's zip deploy can skip folders prefixed with `.`. Using `nextjs/` avoids this.
4. **Azure Configuration**: Ensure Azure App Service is set to Node.js 22
5. **Startup Command**: Set in Azure Portal → Configuration → General Settings:
   ```
   node server.js
   ```

### Common Issues

**Issue**: Application won't start on Azure
- **Solution**: Check Azure logs in Portal → Monitoring → Log Stream
- Verify `web.config` and `server.js` are deployed
- Ensure PORT environment variable is being used

**Issue**: Static files not loading
- **Solution**: Verify `public/` folder is included in deployment package
- Check `web.config` allows static file serving

**Issue**: API calls failing
- **Solution**: Set `NEXT_PUBLIC_API_BASE_URL` in Azure App Service → Configuration → Application Settings

## Project Structure

```
src/
├── app/                    # Next.js 15 App Router pages
│   ├── api/               # API routes (proxies to backend)
│   ├── candidate/         # Candidate role pages
│   └── recruiter/         # Recruiter role pages
├── components/            # Shared React components
│   ├── layout/           # Layout components (Sidebar, RecruiterLayout)
│   └── recruiter/        # Role-specific components
├── contexts/             # React contexts (Auth, Theme, LoginModal)
├── hooks/                # Custom React hooks (useQueries, useAuth)
├── lib/api/              # API client utilities
├── providers/            # Provider wrappers (React Query, Theme)
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```
