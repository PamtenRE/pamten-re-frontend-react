"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  LayoutDashboard,
  Briefcase,
  FileText,
  FileCheck,
  Bell,
  Menu,
  X,
} from "lucide-react";


/**
 * CandidateSidebar Component
 *
 * Fixed left sidebar navigation for candidate dashboard.
 * Responsive: Full sidebar on desktop, hamburger menu on mobile.
 */

export default function CandidateSidebar() {
  const pathname = usePathname();
  //console.log("Current pathname:", pathname);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items matching wireframe
  const navItems = [
    { name: "Home", href: "/candidate/home", icon: Home },
    {
      name: "My Dashboard",
      href: "/candidate/dashboard",
      icon: LayoutDashboard,
    },
    { name: "Browse Jobs", href: "/candidate/jobs", icon: Briefcase },
    {
      name: "My Applications",
      href: "/candidate/applications",
      icon: FileText,
    },
    { name: "ATS Resume", href: "/candidate/ats-resume", icon: FileCheck },
    { name: "Notifications", href: "/candidate/notifications", icon: Bell },
  ];

  return (
    <>
      {/* Mobile Hamburger Button - Only visible on mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile - closes menu when clicked */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile unless menu is open */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-44 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-r border-gray-200 dark:border-zinc-800 p-6 transition-transform duration-300 z-40 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        

        {/* Navigation Menu */}
        <nav className="space-y-3 mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Home is active only on exact '/', other routes use exact match
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  //console.log(`Clicked ${item.name}, going to: ${item.href}`);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex flex-col items-center justify-center gap-2 px-1 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-purple-100 dark:bg-zinc-800 text-purple-600 dark:text-purple-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800/60"
                }`}
              >
                <Icon size={24} />
                <span className="text-xs font-medium text-center">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
