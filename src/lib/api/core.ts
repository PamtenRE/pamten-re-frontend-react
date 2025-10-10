// Type definitions for API responses
export interface APIResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T> {
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

// Base API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Common headers and request configuration
export const defaultHeaders = {
  "Content-Type": "application/json",
};

// API request helper with error handling
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
}
