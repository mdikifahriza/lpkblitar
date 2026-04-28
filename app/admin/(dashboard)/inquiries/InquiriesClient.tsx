"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { format } from "date-fns";
import { toast } from "sonner";
import { Search, Filter, Loader2, CheckCircle2, Clock, MailOpen, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function InquiriesClient({ initialInquiries }: { initialInquiries: any[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = inq.nama.toLowerCase().includes(search.toLowerCase()) || 
                          inq.pesan.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || inq.status === filter;
    return matchesSearch && matchesFilter;
  });

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        if (error.code === 'PGRST205') {
          // Dummy mode
          setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
          toast.success("Status diperbarui (Dummy Mode)");
        } else {
          throw error;
        }
      } else {
        setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
        toast.success("Status berhasil diperbarui");
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "baru":
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20 px-2 py-1"><MailOpen className="w-3 h-3 mr-1"/> Baru</Badge>;
      case "diproses":
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 px-2 py-1"><Clock className="w-3 h-3 mr-1"/> Diproses</Badge>;
      case "selesai":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-2 py-1"><CheckCircle2 className="w-3 h-3 mr-1"/> Selesai</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Pesan Konsultasi</h1>
        <p className="text-muted-foreground">Kelola dan pantau pesan masuk dari calon klien</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau isi pesan..."
              className="pl-9 bg-background border-border text-foreground focus-visible:ring-[#c9a84c]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {["all", "baru", "diproses", "selesai"].map((f) => (
              <Button
                key={f}
                variant="outline"
                size="sm"
                onClick={() => setFilter(f)}
                className={`border-border ${
                  filter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-background">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium w-[20%]">Pengirim</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[45%]">Pesan Masuk</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[15%]">Waktu</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[10%]">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right w-[10%]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.length === 0 ? (
                <TableRow className="hover:bg-transparent border-border">
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Tidak ada pesan konsultasi ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredInquiries.map((inq) => (
                  <TableRow key={inq.id} className="border-border hover:bg-muted transition-colors">
                    <TableCell>
                      <div className="font-bold text-foreground mb-1">{inq.nama}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <Phone className="w-3 h-3" /> {inq.no_hp}
                      </div>
                      {inq.email && <div className="text-xs text-muted-foreground truncate max-w-[150px]">{inq.email}</div>}
                    </TableCell>
                    <TableCell>
                      <div className="text-foreground text-sm whitespace-pre-wrap line-clamp-3 leading-relaxed">
                        {inq.pesan}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-muted-foreground text-sm">
                        {format(new Date(inq.created_at), "dd MMM yyyy")}
                        <br />
                        <span className="text-xs">{format(new Date(inq.created_at), "HH:mm")} WIB</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(inq.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted">{updatingId === inq.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="font-serif text-lg leading-none mb-2">...</div>}</Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-secondary border-border text-foreground">
                          <DropdownMenuItem className="focus:bg-primary/20 focus:text-primary cursor-pointer" onClick={() => updateStatus(inq.id, "baru")}>
                            Tandai Baru
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-primary/20 focus:text-primary cursor-pointer" onClick={() => updateStatus(inq.id, "diproses")}>
                            Tandai Diproses
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-primary/20 focus:text-primary cursor-pointer" onClick={() => updateStatus(inq.id, "selesai")}>
                            Tandai Selesai
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}


