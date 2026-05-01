"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  CircleHelp,
  FileText,
  HardDrive,
  Images,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Settings,
  User as UserIcon,
  Users,
  X,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { SafeImage } from "@/components/ui/safe-image";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ThemeToggle";

const isPathActive = (pathname: string, href: string) => {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export function AdminLayoutClient({
  children,
  user,
  userRole,
  userProfile,
}: {
  children: React.ReactNode;
  user: User;
  userRole: string;
  userProfile?: { nama_lengkap?: string | null; foto_url?: string | null } | null;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Pesan Konsultasi", href: "/admin/inquiries", icon: MessageSquare },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Insight & Artikel", href: "/admin/articles", icon: FileText },
    { name: "Galeri", href: "/admin/galleries", icon: Images },
    { name: "Layanan Hukum", href: "/admin/services", icon: Briefcase },
    { name: "FAQ", href: "/admin/faqs", icon: CircleHelp },
    { name: "Kontak", href: "/admin/contact", icon: MapPin },
    { name: "Manajemen Tim", href: "/admin/team", icon: Users },
  ];

  if (userRole === "superadmin") {
    navItems.push({ name: "Pengaturan Global", href: "/admin/settings", icon: Settings });
    navItems.push({ name: "Penyimpanan", href: "/admin/storage", icon: HardDrive });
    navItems.push({ name: "Manajemen Pengguna", href: "/admin/users", icon: UserIcon });
  }

  const currentPageTitle =
    [...navItems, { name: "Profil Administrator", href: "/admin/profil", icon: UserIcon }]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => isPathActive(pathname, item.href))?.name || "Admin";

  const metadata = (user.user_metadata ?? {}) as {
    full_name?: string;
    avatar_url?: string;
  };
  const userName =
    userProfile?.nama_lengkap ||
    metadata.full_name ||
    user.email ||
    "Administrator";
  const avatarUrl = userProfile?.foto_url || metadata.avatar_url || "";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;

      if (
        target &&
        !sidebarRef.current?.contains(target) &&
        !menuButtonRef.current?.contains(target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isSidebarOpen]);

  return (
    <div className="theme-admin min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen overflow-hidden">
        <aside
          ref={sidebarRef}
          className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-border/70 bg-card/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out md:static md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setIsSidebarOpen(false)}
            className={`absolute -right-12 top-4 h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground md:hidden ${
              isSidebarOpen ? "inline-flex" : "hidden"
            }`}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex h-full min-h-0 flex-col px-4 py-6">
            <ScrollArea className="min-h-0 flex-1 pt-12 md:pt-2">
              <nav className="space-y-2 pr-3">
                {navItems.map((item) => {
                  const isActive = isPathActive(pathname, item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      }`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </ScrollArea>

            <div className="pt-6">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
                <span>Keluar</span>
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border/70 bg-background/88 px-4 backdrop-blur-xl lg:px-8">
            <div className="flex min-w-0 items-center gap-4">
              <button
                ref={menuButtonRef}
                onClick={() => setIsSidebarOpen((current) => !current)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card text-foreground shadow-sm transition-colors hover:bg-muted md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h2 className="truncate font-serif text-2xl font-semibold text-foreground">
                {currentPageTitle}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle showLabel className="hidden sm:inline-flex" />
              <ThemeToggle className="sm:hidden" />
              <Link
                href="/admin/profil"
                className="group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                title={userName}
              >
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-muted shadow-sm transition-transform group-hover:scale-[1.02]">
                  {avatarUrl ? (
                    <SafeImage src={avatarUrl} alt={userName} className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-4 pb-6 pt-6 lg:px-8 lg:pb-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
