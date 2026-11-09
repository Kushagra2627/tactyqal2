"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Tags,
  Image as ImageIcon,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { getCurrentUser, logout } from "@/lib/api";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}

export default function AdminLayout({ children, title, action }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((currUser) => {
        if (!currUser && mounted) {
          router.push("/admin/login");
        } else if (mounted) {
          setUser(currUser);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) router.push("/admin/login");
      });
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/posts", label: "Posts", icon: FileText },
    { href: "/admin/posts/new", label: "New Post", icon: PlusCircle },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/tags", label: "Tags", icon: Tags },
    { href: "/admin/media", label: "Media Library", icon: ImageIcon }
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-lagoon border-t-transparent" />
          <span>Verifying admin authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
          <Link href="/admin" className="flex items-center gap-2.5 font-display text-base font-bold text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-lagoon text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>Tactyqal <span className="text-lagoon text-xs font-mono uppercase bg-lagoon/20 px-1.5 py-0.5 rounded">Admin</span></span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 space-y-1 px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Publishing & Content
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-lagoon text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Navigation
            </p>
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-100 transition-colors"
            >
              <span className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4" />
                Public Website
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            </Link>
          </div>
        </div>

        {/* User Card & Sign Out */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-8 w-8 shrink-0 rounded-full bg-lagoon/20 text-lagoon font-bold flex items-center justify-center text-xs">
                {user?.name?.[0] || "A"}
              </div>
              <div className="truncate">
                <p className="truncate text-xs font-semibold text-white">{user?.name || "Admin"}</p>
                <p className="truncate text-[11px] text-slate-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="text-slate-400 hover:text-red-400 transition-colors p-1"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-500 hover:text-slate-800 lg:hidden p-1"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-display text-xl font-bold text-slate-900">
              {title}
            </h1>
          </div>
          {action && <div>{action}</div>}
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
