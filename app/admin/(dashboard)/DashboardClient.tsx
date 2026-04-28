"use client";

import { LayoutDashboard, FileText, Briefcase, Users, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function DashboardClient({ stats }: { stats: { inquiries: number, articles: number, services: number, team: number } }) {
  const cards = [
    { title: "Total Pesan Masuk", value: stats.inquiries, icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Total Artikel", value: stats.articles, icon: FileText, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { title: "Total Layanan", value: stats.services, icon: Briefcase, color: "text-purple-400", bg: "bg-purple-400/10" },
    { title: "Anggota Tim", value: stats.team, icon: Users, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Dashboard Admin</h1>
        <p className="text-muted-foreground">Ringkasan statistik website Hutabarat Law</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="bg-card border border-border rounded-xl p-6 shadow-lg flex items-center gap-6"
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg}`}>
              <card.icon className={`w-7 h-7 ${card.color}`} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">{card.title}</p>
              <h3 className="font-serif text-3xl text-foreground font-bold">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Placeholder for future charts or recent inquiries table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">Pesan Masuk Terbaru</h2>
          <div className="text-center py-10 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Fitur ini akan segera tersedia</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">Artikel Terbaru</h2>
          <div className="text-center py-10 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Belum ada artikel terbaru</p>
          </div>
        </div>
      </div>
    </div>
  );
}

