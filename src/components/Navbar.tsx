// ✅ /components/Navbar.tsx
'use client';

import { useContext, useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ModalContext } from '@/contexts/LoginModalContext';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import RecruitEdgeLogo from '@/components/RecruitEdgeLogo';

export default function Navbar() {
  const { openModal } = useContext(ModalContext);
  const { user, logout, isAuthenticated } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    router.push('/');
  };

  const handleProfileClick = () => {
    if (user?.role === 'recruiter') {
      router.push('/recruiter/profile');
    } else {
      // Handle candidate profile route
      router.push('/candidate/profile');
    }
    setShowProfileMenu(false);
  };

  const handleDashboardClick = () => {
    if (user?.role === 'recruiter') {
      router.push('/recruiter/dashboard');
    } else {
      // Handle candidate dashboard route
      router.push('/candidate/dashboard');
    }
    setShowProfileMenu(false);
  };

  // Check if we're on a dashboard page
  const isOnDashboard = pathname.includes('/recruiter/') || pathname.includes('/candidate/');

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center bg-white/80 dark:bg-black/70 backdrop-blur-md border-b border-gray-200/50 dark:border-white/10 relative z-[9999]">
      <div 
        className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleLogoClick}
      >
        <RecruitEdgeLogo className="w-8 h-8" />
        RecruitEdge
      </div>
      
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        
        {isAuthenticated ? (
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {(user?.email?.charAt(0).toUpperCase() || 'U')}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.email}
              </span>
              <svg 
                className={`w-4 h-4 text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-[9999]">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 capitalize">{user?.role}</p>
                </div>
                
                {!isOnDashboard && (
                  <button
                    onClick={handleDashboardClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Dashboard
                  </button>
                )}
                
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Manage Profile
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={() => openModal('signup')}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-white hover:opacity-90"
            >
              Try it Free
            </button>
            <button
              onClick={() => openModal('login')}
              className="px-4 py-2 bg-transparent border border-gray-300 dark:border-white rounded text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white hover:text-black dark:hover:text-black transition"
            >
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
