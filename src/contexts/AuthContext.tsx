"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../utils/api";

interface User {
  userId: string;
  email: string;
  role: string;
  location?: string;
  profileCompleted: boolean;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  token?: string;
  profileProgress?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isLoading: boolean;
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
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ✅ Load saved session on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
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
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        setIsAuthReady(true);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ✅ Login (shared for both recruiter & candidate)
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

    // ✅ Role-based redirect (fully safe)
    const role = newUser.role?.toLowerCase();
    if (role === "candidate") {
      router.push("/candidate/home");
    } else if (role === "recruiter") {
      if (!newUser.profileCompleted) router.push("/recruiter/profile");
      else router.push("/recruiter/dashboard");
    } else {
      router.push("/");
    }
  };

  // ✅ Register
  const register = async (formData: any) => {
    await apiFetch("/api/auth/v1/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    router.push("/login?registered=1");
  };

  // ✅ Logout (safe for both roles)
  const logout = async () => {
    try {
      if (token) {
        await apiFetch("/api/auth/v1/logout", { method: "POST" }, token);
      }
    } catch (error) {
      console.warn("Logout API failed:", error);
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("profileProgress");
      localStorage.removeItem("profileFormData");
      router.push("/login");
    }
  };

  // ✅ Candidate-only helper (safe even if recruiter never calls it)
  const updateProfileProgress = (progress: number) => {
    try {
      setProfileProgress(progress);
      localStorage.setItem("profileProgress", progress.toString());
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, profileProgress: progress };
        localStorage.setItem("user", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Error updating profile progress:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAuthReady,
        isLoading,
        profileProgress,
        login,
        register,
        logout,
        setUser,
        updateProfileProgress, // safe for candidate pages only
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
