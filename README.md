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

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

src
-hooks
-utils
-components
-containers

---

api should be under app (that is sibling of components)

reducer - if we are using redux later for state management

middleware - if you are doing some kind of websocket logic (for real time communication, messages) - for future

## admin, dashboard, -
