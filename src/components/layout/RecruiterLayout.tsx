"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";

interface RecruiterLayoutProps {
  children: React.ReactNode;
}

export default function RecruiterLayout({ children }: RecruiterLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-[#0a0a0a] overflow-hidden transition-all duration-300">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 overflow-auto transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-60"
        }`}
      >
        <main className="p-6 pt-24 bg-white dark:bg-[#0a0a0a] min-h-screen text-gray-900 dark:text-white transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
