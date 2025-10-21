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

  firstName?: string;
  lastName?: string;
  username?: string;
  fullName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userId: string, password: string) => Promise<void>;
  register: (formData: any) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // ✅ Load saved session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ Redirect only from login/register/home
  useEffect(() => {
    if (!user) return;

    const role = user.role.toLowerCase();
    const currentPath = window.location.pathname;

    // Redirect only if user is coming from login, register, or home
    if (
      currentPath === "/login" ||
      currentPath === "/register" ||
      currentPath === "/"
    ) {
      const target =
        role === "recruiter" && !user.profileCompleted
          ? "/recruiter/profile"
          : role === "recruiter"
          ? "/recruiter/dashboard"
          : "/candidate/dashboard";

      router.push(target);
    }
  }, [user, router]);

  // ✅ Login
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

    const role = newUser.role.toLowerCase();
    const target =
      role === "recruiter" && !newUser.profileCompleted
        ? "/recruiter/profile"
        : role === "recruiter"
        ? "/recruiter/dashboard"
        : "/candidate/dashboard";
    router.push(target);
  };

  // ✅ Register
  const register = async (formData: any) => {
    await apiFetch("/api/auth/v1/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    router.push("/login?registered=1");
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // ✅ Auto logout on token expiry
  useEffect(() => {
    const handleUnauthorized = (event: CustomEvent) => {
      if (event.detail?.status === 401) {
        console.warn("Session expired. Logging out...");
        logout();
      }
    };
    window.addEventListener(
      "unauthorized",
      handleUnauthorized as EventListener
    );
    return () => {
      window.removeEventListener(
        "unauthorized",
        handleUnauthorized as EventListener
      );
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
        setUser,
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
