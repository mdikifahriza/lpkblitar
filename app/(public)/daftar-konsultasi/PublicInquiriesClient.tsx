"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ListFilter,
  MailOpen,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InquiryItem = {
  id: string;
  nama: string;
  layanan_id: string | null;
  status: "baru" | "diproses" | "selesai";
  created_at: string;
};

type ServiceOption = {
  id: string;
  nama: string;
};

const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "baru", label: "Baru" },
  { value: "diproses", label: "Diproses" },
  { value: "selesai", label: "Selesai" },
] as const;

export function PublicInquiriesClient({
  inquiries,
  services,
}: {
  inquiries: InquiryItem[];
  services: ServiceOption[];
}) {
  const [page, setPage] = useState(1);
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const itemsPerPage = 10;

  const serviceOptions = useMemo(
    () => services.map((service) => ({ value: service.id, label: service.nama })),
    [services]
  );

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      const matchesService =
        serviceFilter === "all" ||
        (serviceFilter === "general" ? !inquiry.layanan_id : inquiry.layanan_id === serviceFilter);
      const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;

      return matchesService && matchesStatus;
    });
  }, [inquiries, serviceFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedInquiries = filteredInquiries.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: InquiryItem["status"]) => {
    switch (status) {
      case "baru":
        return (
          <Badge className="border-red-500/20 bg-red-500/10 px-2 py-1 text-red-500">
            <MailOpen className="mr-1 h-3 w-3" />
            Baru
          </Badge>
        );
      case "diproses":
        return (
          <Badge className="border-amber-500/20 bg-amber-500/10 px-2 py-1 text-amber-500">
            <Clock className="mr-1 h-3 w-3" />
            Diproses
          </Badge>
        );
      case "selesai":
        return (
          <Badge className="border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-emerald-500">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Selesai
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getServiceName = (id: string | null) => {
    if (!id) return "Konsultasi Umum / Lainnya";
    return services.find((service) => service.id === id)?.nama || "Konsultasi Umum / Lainnya";
  };

  if (inquiries.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-background py-20 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mb-2 font-serif text-2xl font-bold text-foreground">Belum ada data masuk</h3>
        <p className="text-muted-foreground">Belum ada antrean konsultasi saat ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <ListFilter className="h-4 w-4 text-primary" />
              Filter daftar konsultasi
            </div>
            <p className="text-sm text-muted-foreground">
              Tampilkan antrean berdasarkan jenis layanan dan status penanganannya.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setServiceFilter("all");
              setStatusFilter("all");
            }}
            disabled={serviceFilter === "all" && statusFilter === "all"}
            className="justify-start text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset filter
          </Button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Jenis Layanan
            </div>
            <Select
              value={serviceFilter}
              onValueChange={(value) => {
                setServiceFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="bg-card">
                <SelectValue placeholder="Semua layanan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua layanan</SelectItem>
                <SelectItem value="general">Konsultasi Umum / Lainnya</SelectItem>
                {serviceOptions.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Status
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="bg-card">
                <SelectValue placeholder="Semua status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          Menampilkan {filteredInquiries.length} dari {inquiries.length} data laporan
        </p>
      </div>

      {filteredInquiries.length === 0 ? (
        <div className="rounded-xl border border-border bg-background py-20 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mb-2 font-serif text-2xl font-bold text-foreground">Tidak ada data yang cocok</h3>
          <p className="text-muted-foreground">Ubah filter untuk melihat antrean konsultasi lainnya.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {paginatedInquiries.map((inquiry, index) => (
            <div
              key={inquiry.id}
              className="pointer-events-none flex flex-col justify-between gap-4 rounded-xl border border-border bg-background p-5 shadow-sm transition-colors hover:border-primary/50 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-4 sm:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                  <span className="font-serif text-xl font-bold text-primary opacity-80">
                    {startIndex + index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold text-foreground">{inquiry.nama}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded bg-secondary px-2 py-0.5 font-medium text-foreground">
                      {getServiceName(inquiry.layanan_id)}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span>{format(new Date(inquiry.created_at), "dd MMM yyyy, HH:mm")} WIB</span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 pl-16 sm:justify-end sm:pl-0">
                {getStatusBadge(inquiry.status)}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredInquiries.length > 0 && totalPages > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-2 border-t border-border pt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="border-border text-foreground hover:bg-secondary"
          >
            Sebelumnya
          </Button>

          <div className="mx-4 flex items-center gap-1">
            <span className="text-sm font-medium text-foreground">
              Halaman {page} dari {totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="border-border text-foreground hover:bg-secondary"
          >
            Selanjutnya
          </Button>
        </div>
      ) : null}
    </div>
  );
}
