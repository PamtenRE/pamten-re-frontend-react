import { apiFetch } from "@/utils/api";

// Types based on API documentation
export interface RegisterRequest {
  email: string;
  password: string;
  phone: string;
  roleName: "Candidate" | "Recruiter";
  fullName: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  fullName: string;
  roleName: string;
  profileCompleted: boolean;
  message: string;
}

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  email: string;
  userId: string;
  profileCompleted: boolean;
}

export interface UserProfile {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  roleName: string;
  profileCompleted: boolean;
  isActive: boolean;
}

export interface UpdatePasswordRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  userId: string;
  fullName?: string;
  phone?: string;
}

export interface Gender {
  genderId: number;
  genderName: string;
}

// Auth API Services
export const authAPI = {
  // User Registration
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return apiFetch("/api/auth/v1/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // User Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiFetch("/api/auth/v1/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  // Get User Profile
  async getUserProfile(userId: string, token: string): Promise<UserProfile> {
    return apiFetch(`/api/auth/v1/profile/${userId}`, {}, token);
  },

  // Update Password
  async updatePassword(passwordData: UpdatePasswordRequest, token: string): Promise<string> {
    return apiFetch("/api/auth/v1/update-password", {
      method: "POST",
      body: JSON.stringify(passwordData),
    }, token);
  },

  // Forgot Password
  async forgotPassword(email: string): Promise<string> {
    return apiFetch("/api/auth/v1/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Reset Password
  async resetPassword(resetData: ResetPasswordRequest): Promise<string> {
    return apiFetch("/api/auth/v1/reset-password", {
      method: "POST",
      body: JSON.stringify(resetData),
    });
  },

  // Update Profile
  async updateProfile(profileData: UpdateProfileRequest, token: string): Promise<string> {
    return apiFetch("/api/auth/v1/update-profile", {
      method: "POST",
      body: JSON.stringify(profileData),
    }, token);
  },

  // Get All Genders
  async getGenders(token: string): Promise<Gender[]> {
    return apiFetch("/api/auth/v1/genders", {}, token);
  },

  // Logout
  async logout(token: string): Promise<string> {
    return apiFetch("/api/auth/v1/logout", {
      method: "POST",
    }, token);
  },
};
