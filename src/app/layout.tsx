import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";
import { LoginModalProvider } from "@/contexts/LoginModalContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RecruitEdge",
  description: "Your next big idea starts here!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
      <body className="bg-white dark:bg-[#0f0f10] text-gray-900 dark:text-white transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <LoginModalProvider>
              <div className="flex flex-col min-h-screen">
                {/* Background Blobs */}
                <div className="fixed inset-0 -z-20 overflow-hidden">
                  <div className="absolute top-[-5rem] left-[-5rem] w-[30rem] h-[30rem] bg-purple-500 opacity-20 blur-[100px] animate-blob1 rounded-full" />
                  <div className="absolute bottom-[-4rem] right-[-4rem] w-[25rem] h-[25rem] bg-pink-500 opacity-20 blur-[100px] animate-blob2 rounded-full" />
                </div>
                <Navbar />
                <main className="flex-1">{children}</main>
                <LoginModal />
              </div>
            </LoginModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
