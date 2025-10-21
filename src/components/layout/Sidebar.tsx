"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Briefcase, Users, ClipboardList, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const iconMap: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase size={20} strokeWidth={1.8} />,
  ClipboardList: <ClipboardList size={20} strokeWidth={1.8} />,
  Users: <Users size={20} strokeWidth={1.8} />,
};

interface NavLink {
  name: string;
  href: string;
  icon: keyof typeof iconMap;
}

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sidebar-links")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sidebar links");
        return res.json();
      })
      .then((data) => {
        // ✅ Add “Applications” here so it behaves the same as other links
        const allLinks = [
          ...(data.links || []),
          {
            name: "Applications",
            href: "/recruiter/applications",
            icon: "ClipboardList" as keyof typeof iconMap,
          },
        ];
        setNavLinks(allLinks);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <aside
      className={`fixed left-0 z-40 flex flex-col justify-between items-center 
      bg-gradient-to-b from-zinc-950/95 to-zinc-900/90 backdrop-blur-xl border-r border-zinc-800/60
      transition-all duration-500 ease-in-out shadow-[0_0_25px_rgba(0,0,0,0.25)]
      ${collapsed ? "w-20" : "w-60"}`}
      style={{ top: "70px", height: "calc(100vh - 70px)" }}
    >
      {/* Nav Section */}
      <nav className="flex flex-col items-center justify-start w-full mt-6 space-y-2 px-3">
        {loading ? (
          <div className="text-gray-400 py-4 text-sm">Loading...</div>
        ) : error ? (
          <div className="text-red-400 py-4 text-sm">{error}</div>
        ) : (
          navLinks.map((link) => {
            // ✅ Highlight current route and nested ones (e.g. /applications/123)
            const active = pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all duration-300
                  ${collapsed ? "justify-center" : "justify-start"} 
                  ${
                    active
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]"
                      : "hover:bg-white/10 text-gray-300 hover:text-white"
                  }`}
              >
                <span
                  className={`${
                    active
                      ? "text-white drop-shadow-[0_0_6px_rgba(147,51,234,0.8)]"
                      : "text-gray-400"
                  }`}
                >
                  {iconMap[link.icon]}
                </span>
                {!collapsed && (
                  <span className="text-sm font-medium tracking-wide">
                    {link.name}
                  </span>
                )}
              </Link>
            );
          })
        )}
      </nav>

      {/* Divider line above Logout */}
      <div className="w-[85%] border-t border-gray-800/80 mt-4 mb-3" />

      {/* Logout Button */}
      <button
        className={`flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-all mb-4 w-full ${
          collapsed ? "justify-center" : "justify-start px-4"
        }`}
        onClick={() => {
          logout();
          router.push("/");
        }}
      >
        <LogOut size={18} />
        {!collapsed && "Logout"}
      </button>
    </aside>
  );
}
