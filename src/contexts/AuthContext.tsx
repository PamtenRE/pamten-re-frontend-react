"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../utils/api";

interface User {
  userId: string;
  email: string;
  role: string;
  profileCompleted: boolean;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean; // ✅ new
  profileProgress: number; // ✅ new
  login: (userId: string, password: string) => Promise<void>;
  register: (formData: any) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateProfileProgress: (progress: number) => void; // ✅ new
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // ✅ track auth
  const [profileProgress, setProfileProgress] = useState(0); // ✅ track profile progress
  const router = useRouter();

  // ✅ Load saved user/token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }

    // ✅ NEW: Load profile progress from localStorage
    const savedProgress = localStorage.getItem("profileProgress");
    if (savedProgress) {
      setProfileProgress(parseInt(savedProgress));
    }
  }, []);

  // ✅ Redirect effect (same logic)
  useEffect(() => {
    if (!user) return;

    const role = user.role.toLowerCase();
    const target =
      role === "recruiter" && !user.profileCompleted
        ? "/recruiter/profile"
        : role === "recruiter"
        ? "/recruiter/dashboard"
        : "/candidate/home";

    router.push(target);
  }, [user, router]);

  // ✅ Login updates user/token/isAuthenticated
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
  };

  const register = async (formData: any) => {
    await apiFetch("/api/auth/v1/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    router.push("/login?registered=1");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profileProgress"); // ✅ NEW
    localStorage.removeItem("profileFormData"); // ✅ NEW
    router.push("/login");
  };
  // ✅ NEW: Function to update profile progress
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
        profileProgress, // ✅ NEW
        login,
        register,
        logout,
        setUser,
        updateProfileProgress, // ✅ NEW
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
