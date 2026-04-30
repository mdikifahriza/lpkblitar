"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Eye,
  FileText,
  MessageSquare,
  MousePointer2,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AnalyticsOverview } from "@/lib/api/analytics";

export function DashboardClient({
  stats,
  analytics,
}: {
  stats: { inquiries: number; articles: number; services: number; team: number };
  analytics: AnalyticsOverview;
}) {
  const cards = [
    { title: "Total Pesan Masuk", value: stats.inquiries, icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Total Artikel", value: stats.articles, icon: FileText, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { title: "Total Layanan", value: stats.services, icon: Briefcase, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Anggota Tim", value: stats.team, icon: Users, color: "text-primary", bg: "bg-primary/10" },
  ];
  const analyticsRange = analytics.ranges["30d"];
  const analyticsCards = [
    {
      title: "View 30 Hari",
      value: analyticsRange.totalViews.toLocaleString("id-ID"),
      icon: Eye,
      color: "text-sky-600 dark:text-sky-300",
      bg: "bg-sky-500/10",
    },
    {
      title: "Sesi Unik",
      value: analyticsRange.uniqueSessions.toLocaleString("id-ID"),
      icon: MousePointer2,
      color: "text-indigo-700 dark:text-indigo-200",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Halaman Aktif",
      value: analyticsRange.uniquePages.toLocaleString("id-ID"),
      icon: BarChart3,
      color: "text-cyan-700 dark:text-cyan-200",
      bg: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Dashboard Admin" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-6 rounded-xl border border-border bg-card p-6 shadow-lg"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.bg}`}>
              <card.icon className={`h-7 w-7 ${card.color}`} />
            </div>
            <div>
              <p className="mb-1 text-sm uppercase tracking-wider text-muted-foreground">{card.title}</p>
              <h3 className="font-serif text-3xl font-bold text-foreground">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">Ringkasan Analytics</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Gambaran cepat performa halaman publik untuk 30 hari terakhir.
              </p>
            </div>
            <Link href="/admin/analytics">
              <Button variant="outline" className="gap-2 border-border bg-background text-foreground hover:bg-muted">
                Buka Analytics
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {!analytics.tableReady ? (
            <div className="rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground">
              Tabel analytics belum siap. Jalankan migration <code>page_visits</code> untuk mulai melihat data.
            </div>
          ) : !analytics.hasData ? (
            <div className="rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground">
              Tracker sudah dipasang, tapi belum ada kunjungan publik yang terekam.
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                {analyticsCards.map((card) => (
                  <div key={card.title} className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          {card.title}
                        </p>
                        <p className="mt-2 font-serif text-3xl font-semibold text-foreground">{card.value}</p>
                      </div>
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.bg}`}>
                        <card.icon className={`h-5 w-5 ${card.color}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-border bg-background p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">Halaman Publik Teratas</h3>
                    <p className="text-sm text-muted-foreground">3 halaman dengan view tertinggi dalam 30 hari.</p>
                  </div>
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                    {analyticsRange.totalViews.toLocaleString("id-ID")} view
                  </Badge>
                </div>
                <div className="space-y-3">
                  {analyticsRange.topPages.slice(0, 3).map((page) => (
                    <div
                      key={page.path}
                      className="flex flex-col gap-3 rounded-xl border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{page.label}</p>
                        <p className="text-xs text-muted-foreground">{page.path}</p>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Badge variant="outline" className="border-border bg-card text-foreground">
                          {page.pageTypeLabel}
                        </Badge>
                        <span className="font-medium text-foreground">{page.views.toLocaleString("id-ID")} view</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
      </div>
    </div>
  );
}
