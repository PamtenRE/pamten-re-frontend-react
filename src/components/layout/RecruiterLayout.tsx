// src/components/layout/RecruiterLayout.tsx
'use client';

import Sidebar from './Sidebar';
import React from 'react';

interface RecruiterLayoutProps {
  children: React.ReactNode;
}

export default function RecruiterLayout({ children }: RecruiterLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-auto ml-60">
        <main className="p-6 bg-gradient-to-b from-black to-neutral-900 min-h-full text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
