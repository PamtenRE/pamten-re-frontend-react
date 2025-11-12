// Common Types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Feature Types
export interface Feature {
  icon: string;
  text: string;
}

// Testimonial Types
export interface Testimonial extends BaseEntity {
  quote: string;
  name: string;
  title: string;
  emoji: string;
}

// Benefit Types
export interface Benefit extends BaseEntity {
  title: string;
  description: string;
  icon: string;
}

// User Types
export interface User extends BaseEntity {
  email: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  role: "candidate" | "recruiter" | "admin";
  avatar?: string;
}

// Auth Types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

