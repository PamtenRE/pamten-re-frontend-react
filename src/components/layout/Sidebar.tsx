'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Briefcase, Users, ClipboardList, LogOut } from 'lucide-react';
import RecruitEdgeLogo from '@/components/RecruitEdgeLogo'; // Added import for RecruitEdgeLogo
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const iconMap: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase size={20} />,
  ClipboardList: <ClipboardList size={20} />,
  Users: <Users size={20} />,
};

interface NavLink {
  name: string;
  href: string;
  icon: keyof typeof iconMap;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/sidebar-links')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch sidebar links');
        return res.json();
      })
      .then((data) => {
        setNavLinks(data.links || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-r border-gray-200 dark:border-zinc-800 p-6 flex flex-col justify-between transition-colors duration-300">
      <div>
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white mb-8 block">
          <span className="inline-block align-middle"><RecruitEdgeLogo className="w-8 h-8" /></span>
          RecruitEdge
        </Link>
        <nav className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-900 dark:text-white py-4">Loading links...</div>
          ) : error ? (
            <div className="text-center text-red-400 py-4">{error}</div>
          ) : navLinks.length === 0 ? (
            <div className="text-center text-gray-900 dark:text-white py-4">No links found.</div>
          ) : (
            navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 text-gray-900 dark:text-white px-3 py-2 rounded-lg transition ${
                  pathname === link.href ? 'bg-purple-100 dark:bg-zinc-800' : 'hover:bg-purple-50 dark:hover:bg-zinc-800/60'
                }`}
              >
                {iconMap[link.icon]}
                {link.name}
              </Link>
            ))
          )}
          <Link
            href="/recruiter/applications"
            className="flex items-center gap-3 text-gray-900 dark:text-white px-3 py-2 rounded-lg transition hover:bg-purple-50 dark:hover:bg-zinc-800/60 hover:text-purple-600 dark:hover:text-purple-400"
          >
            <span role="img" aria-label="Applications">📋</span> Applications
          </Link>
        </nav>
      </div>

      <button
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
        onClick={() => {
          logout();
          router.push('/');
        }}
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
