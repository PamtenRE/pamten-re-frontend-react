"use client";

import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoginModalProvider } from "@/contexts/LoginModalContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <LoginModalProvider>{children}</LoginModalProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
