// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 30, // 30 minutes
  LONG: 1000 * 60 * 60 * 24, // 24 hours
} as const;

// Route Configuration
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  RECRUITER: {
    DASHBOARD: "/recruiter/dashboard",
    CANDIDATES: "/recruiter/candidates",
    REQUISITIONS: "/recruiter/requisitions",
  },
  CANDIDATE: {
    DASHBOARD: "/candidate/home",
    PROFILE: "/candidate/profile",
  },
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_AUTH: true,
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: false,
} as const;
