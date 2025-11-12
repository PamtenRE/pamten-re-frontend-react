"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  ClipboardList,
  ClipboardCheck,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const iconMap: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase size={20} strokeWidth={1.8} />,
  ClipboardList: <ClipboardList size={20} strokeWidth={1.8} />,
  ClipboardCheck: <ClipboardCheck size={20} strokeWidth={1.8} />,
  Users: <Users size={20} strokeWidth={1.8} />,
};

interface NavLink {
  name: string;
  href: string;
  icon: keyof typeof iconMap;
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
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
        const filtered = (data.links || []).filter(
          (link: any) => link.name.toLowerCase() !== "recruitedge"
        );
        const allLinks = [
          ...filtered,
          {
            name: "Applications",
            href: "/recruiter/applications",
            icon: "ClipboardCheck" as keyof typeof iconMap,
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
      className={`fixed left-0 z-40 flex flex-col justify-between
      backdrop-blur-xl transition-all duration-300 ease-in-out
      shadow-[var(--sidebar-shadow)]
      ${collapsed ? "w-20" : "w-60"}
      border-r border-[var(--sidebar-border)]`}
      style={{
        background: "var(--sidebar-bg)",
        top: "70px",
        height: "calc(100vh - 70px)",
      }}
    >
      {/* Header with Logo + Collapse Button */}
      <div
        className={`flex items-center justify-between w-full px-4 pt-4 ${
          collapsed ? "flex-col gap-2" : ""
        }`}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-[var(--sidebar-hover)] transition-all text-[var(--sidebar-text)]"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen size={28} />
          ) : (
            <PanelLeftClose size={28} />
          )}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col items-center justify-start w-full mt-6 space-y-2 px-3 flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-[var(--sidebar-text)]/60 py-4 text-sm">
            Loading...
          </div>
        ) : error ? (
          <div className="text-red-500 py-4 text-sm">{error}</div>
        ) : (
          navLinks.map((link) => {
            const active = pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all duration-300
                  ${collapsed ? "justify-center" : "justify-start"}
                  ${
                    active
                      ? "bg-gradient-to-r from-[#9f6eff] to-[#6e49ff] text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                      : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-active-text)]"
                  }`}
              >
                <span
                  className={`${
                    active
                      ? "text-white drop-shadow-[0_0_6px_rgba(147,51,234,0.8)]"
                      : "opacity-80"
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

      {/* Logout */}
      <button
        className={`flex items-center gap-2 text-sm transition-all mb-6 w-full ${
          collapsed ? "justify-center" : "justify-start px-4"
        }`}
        style={{
          color: "var(--sidebar-text)",
        }}
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
