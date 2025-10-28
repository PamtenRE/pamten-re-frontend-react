"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../utils/api";

interface User {
  userId: string;
  email: string;
  role: string;
  profileCompleted: boolean;
  fullName?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthReady: boolean; // ✅ NEW
  isLoading: boolean; // ✅ NEW
  profileProgress: number;
  login: (userId: string, password: string) => Promise<void>;
  register: (formData: any) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateProfileProgress: (progress: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileProgress, setProfileProgress] = useState(0);
  const [isAuthReady, setIsAuthReady] = useState(false); // ✅ NEW
  const [isLoading, setIsLoading] = useState(true); // ✅ NEW
  const router = useRouter();

  // ✅ Load user & token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const savedProgress = localStorage.getItem("profileProgress");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      if (savedProgress) {
        setProfileProgress(parseInt(savedProgress));
      }

      setIsAuthReady(true); // ✅ Mark ready after loading everything
      setIsLoading(false); // ✅ Mark loading as complete
    };

    initializeAuth();
  }, []);

  const login = async (userId: string, password: string) => {
    const data = await apiFetch("/api/auth/v1/login", {
      method: "POST",
      body: JSON.stringify({ userId, password }),
    });

    const newUser: User = {
      userId: data.userId,
      email: data.email,
      role: data.role,
      profileCompleted: data.profileCompleted,
      token: data.token,
    };

    setToken(data.token);
    setUser(newUser);
    setIsAuthenticated(true);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(newUser));

    // Redirect based on role
    if (data.role?.toLowerCase() === "candidate") {
      router.push("/candidate/home");
    } else if (data.role?.toLowerCase() === "recruiter") {
      router.push("/recruiter/dashboard");
    } else {
      router.push("/");
    }
  };

  const register = async (formData: any) => {
    await apiFetch("/api/auth/v1/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    router.push("/?registered=1");
  };

  const logout = async () => {
    try {
      // Call logout API if token exists
      if (token) {
        await apiFetch(
          "/api/auth/v1/logout",
          {
            method: "POST",
          },
          token
        );
      }
    } catch {
      // Continue with local logout even if API fails
    } finally {
      // Clear local state regardless of API success
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("profileProgress");
      localStorage.removeItem("profileFormData");
      router.push("/");
    }
  };

  // ✅ Update and persist profile progress
  const updateProfileProgress = (progress: number) => {
    setProfileProgress(progress);
    localStorage.setItem("profileProgress", progress.toString());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAuthReady, // ✅ ADDED
        isLoading, // ✅ ADDED
        profileProgress,
        login,
        register,
        logout,
        setUser,
        updateProfileProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
