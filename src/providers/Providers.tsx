"use client";

import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoginModalProvider } from "@/contexts/LoginModalContext";
import { ToastProvider } from "@/components/ui/Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <LoginModalProvider>
            <ToastProvider>{children}</ToastProvider>
          </LoginModalProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
