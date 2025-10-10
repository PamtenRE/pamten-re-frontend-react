import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cache configuration based on route patterns
const CACHE_PATTERNS = {
  // Static data that changes infrequently
  STATIC: {
    "public, s-maxage=3600, stale-while-revalidate=86400": [
      "/api/benefits",
      "/api/features",
    ],
  },
  // Dynamic data that changes more frequently
  DYNAMIC: {
    "public, s-maxage=300, stale-while-revalidate=3600": [
      "/api/testimonials",
      "/api/initial-data",
    ],
  },
  // Real-time data that shouldn't be cached
  REALTIME: {
    "no-store": ["/api/dashboard-nav", "/api/sidebar-links"],
  },
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = new URL(request.url).pathname;

  // Find matching cache pattern
  for (const [cacheHeader, paths] of Object.entries(CACHE_PATTERNS.STATIC)) {
    if (paths.some((path) => pathname.startsWith(path))) {
      response.headers.set("Cache-Control", cacheHeader);
      return response;
    }
  }

  for (const [cacheHeader, paths] of Object.entries(CACHE_PATTERNS.DYNAMIC)) {
    if (paths.some((path) => pathname.startsWith(path))) {
      response.headers.set("Cache-Control", cacheHeader);
      return response;
    }
  }

  for (const [cacheHeader, paths] of Object.entries(CACHE_PATTERNS.REALTIME)) {
    if (paths.some((path) => pathname.startsWith(path))) {
      response.headers.set("Cache-Control", cacheHeader);
      return response;
    }
  }

  // Default to no caching if no pattern matches
  response.headers.set("Cache-Control", "no-store");
  return response;
}
