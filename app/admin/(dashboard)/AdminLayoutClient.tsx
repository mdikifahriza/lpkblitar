"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  Settings,
  MessageSquare,
  LogOut,
  Menu,
  User as UserIcon,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { SafeImage } from "@/components/ui/safe-image";
import { Button } from "@/components/ui/button";

export function AdminLayoutClient({ children, user }: { children: React.ReactNode; user: any }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Konsultasi (Pesan)", href: "/admin/inquiries", icon: MessageSquare },
    { name: "Artikel", href: "/admin/articles", icon: FileText },
    { name: "Layanan", href: "/admin/services", icon: Briefcase },
    { name: "Tim", href: "/admin/team", icon: Users },
    { name: "Pengaturan Global", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const userName = user?.user_metadata?.full_name || "Admin Hutabarat";
  const avatarUrl = user?.user_metadata?.avatar_url || "";

  return (
    <div className="min-h-screen bg-background flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-secondary border-r border-border transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
          <Link href="/admin" className="font-serif text-xl font-bold text-primary tracking-wider">
            HUTABARAT <span className="text-foreground">ADMIN</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border shrink-0">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-3 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 px-3 py-2.5 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-secondary border-b border-border flex items-center justify-between px-4 lg:px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-foreground font-serif font-medium hidden sm:block">
              Sistem Manajemen Konten
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin/profil" className="flex items-center gap-3 hover:bg-muted p-1.5 pr-3 rounded-full border border-border transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                  <SafeImage src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-primary" />
                )}
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {userName}
              </span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#000000]/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

