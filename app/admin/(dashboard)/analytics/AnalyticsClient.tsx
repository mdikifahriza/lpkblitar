"use client";

import { Fragment, type ComponentType, useMemo, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { id as indonesianLocale } from "date-fns/locale";
import { AlertCircle, ChevronDown, ChevronRight, Clock3, Eye, Layers3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { resetAnalytics } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AnalyticsOverview, AnalyticsRangeKey, AnalyticsSlugSummary } from "@/lib/api/analytics";

const RANGE_OPTIONS: Array<{ key: AnalyticsRangeKey; label: string }> = [
  { key: "7d", label: "7 hari" },
  { key: "30d", label: "30 hari" },
  { key: "90d", label: "90 hari" },
];

const chartConfig = {
  views: {
    label: "View",
    theme: {
      light: "#5B8DEF",
      dark: "#8FB8FF",
    },
  },
};

function formatDateTime(value: string) {
  return format(new Date(value), "dd MMM yyyy, HH:mm", {
    locale: indonesianLocale,
  });
}

function formatOptionalDateTime(value: string | null) {
  if (!value) {
    return "Belum ada view";
  }

  return formatDateTime(value);
}

function formatRelativeTime(value: string) {
  return formatDistanceToNow(new Date(value), {
    addSuffix: true,
    locale: indonesianLocale,
  });
}

function formatNumber(value: number) {
  return value.toLocaleString("id-ID");
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function StatCard({
  title,
  value,
  helper,
  icon: Icon,
  surfaceClassName,
  iconClassName,
}: {
  title: string;
  value: string;
  helper: string;
  icon: ComponentType<{ className?: string }>;
  surfaceClassName: string;
  iconClassName: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{helper}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${surfaceClassName}`}>
          <Icon className={`h-5 w-5 ${iconClassName}`} />
        </div>
      </div>
    </section>
  );
}

function SlugDetails({
  title,
  items,
  basePathLabel,
}: {
  title: string;
  items: AnalyticsSlugSummary[];
  basePathLabel: string;
}) {
  if (!items.length) {
    return <EmptyPanel message={`Belum ada slug ${basePathLabel.toLowerCase()} yang bisa ditampilkan.`} />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">
          Jumlah view untuk tiap slug {basePathLabel.toLowerCase()}, termasuk yang masih 0 view.
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border md:block">
        <Table>
          <TableHeader className="bg-background">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">View</TableHead>
              <TableHead className="text-right">Terakhir dibuka</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.path} className="border-border hover:bg-muted/40">
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{item.slug}</p>
                    <p className="text-xs text-muted-foreground">{item.path}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-foreground">{formatNumber(item.views)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatOptionalDateTime(item.lastVisitedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <div key={item.path} className="rounded-2xl border border-border bg-background p-4">
            <div className="space-y-1">
              <p className="font-medium text-foreground">{item.slug}</p>
              <p className="text-xs text-muted-foreground">{item.path}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">View</p>
                <p className="font-medium text-foreground">{formatNumber(item.views)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Terakhir</p>
                <p className="font-medium text-foreground">{formatOptionalDateTime(item.lastVisitedAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsClient({ analytics }: { analytics: AnalyticsOverview }) {
  const router = useRouter();
  const [activeRange, setActiveRange] = useState<AnalyticsRangeKey>("30d");
  const [expandedGroupKey, setExpandedGroupKey] = useState<string | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    const { error } = await resetAnalytics();
    if (error) {
      toast.error(error);
    } else {
      toast.success("Data analitik berhasil direset.");
      setIsResetDialogOpen(false);
      router.refresh();
    }
    setIsResetting(false);
  };

  const selectedRange = useMemo(() => analytics.ranges[activeRange], [analytics.ranges, activeRange]);
  const pageGroups = selectedRange.pageGroups;
  const expandedGroup = pageGroups.find((group) => group.key === expandedGroupKey && group.detailType !== null) ?? null;
  const expandedItems = useMemo(() => {
    if (expandedGroup?.detailType === "service") {
      return selectedRange.serviceSlugSummaries;
    }

    if (expandedGroup?.detailType === "article") {
      return selectedRange.articleSlugSummaries;
    }

    return [];
  }, [expandedGroup, selectedRange]);

  const summaryCards = [
    {
      title: "View",
      value: formatNumber(selectedRange.totalViews),
      helper: `${selectedRange.label} terakhir`,
      icon: Eye,
      surfaceClassName: "bg-sky-500/10",
      iconClassName: "text-sky-600 dark:text-sky-300",
    },
    {
      title: "Halaman Aktif",
      value: formatNumber(selectedRange.uniquePages),
      helper: "URL publik yang menerima kunjungan",
      icon: Layers3,
      surfaceClassName: "bg-cyan-500/10",
      iconClassName: "text-cyan-700 dark:text-cyan-200",
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Analytics" 
        action={
          <Button onClick={() => setIsResetDialogOpen(true)} variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" /> Reset Analitik
          </Button>
        }
      />

      {!analytics.tableReady ? (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Tabel analytics belum siap</AlertTitle>
          <AlertDescription>
            Jalankan migration <code>20260430_103000_create_page_visits.sql</code> dulu supaya tracker dan panel
            analytics bisa mulai menyimpan data.
          </AlertDescription>
        </Alert>
      ) : null}

      {analytics.tableReady && !analytics.hasData ? (
        <Alert className="border-border bg-card text-foreground">
          <Clock3 className="h-4 w-4" />
          <AlertTitle>Tracker sudah dipasang</AlertTitle>
          <AlertDescription>
            Belum ada kunjungan yang terekam. Begitu halaman publik dibuka, data view akan muncul di sini otomatis.
          </AlertDescription>
        </Alert>
      ) : null}

      <section className="rounded-2xl border border-border bg-card px-5 py-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Trafik halaman publik</p>
            <p className="text-sm text-muted-foreground">
              Ringkasan sederhana untuk melihat view, halaman aktif, tren kunjungan, dan halaman yang terakhir dibuka.
            </p>
            {analytics.tableReady ? (
              <p className="text-sm text-muted-foreground">
                Update terakhir:{" "}
                <span className="font-medium text-foreground">
                  {analytics.lastVisitedAt ? formatRelativeTime(analytics.lastVisitedAt) : "Belum ada data"}
                </span>
              </p>
            ) : null}
          </div>

          <div className="w-full md:w-44">
            <Select
              value={activeRange}
              onValueChange={(value) => {
                setActiveRange(value as AnalyticsRangeKey);
                setExpandedGroupKey(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih rentang hari" />
              </SelectTrigger>
              <SelectContent>
                {RANGE_OPTIONS.map((range) => (
                  <SelectItem key={range.key} value={range.key}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {summaryCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {analytics.tableReady && analytics.hasData ? (
        <>
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
            <div className="mb-5 space-y-1">
              <p className="text-sm font-semibold text-foreground">Tren kunjungan</p>
              <p className="text-sm text-muted-foreground">View harian untuk rentang {selectedRange.label.toLowerCase()}.</p>
            </div>

            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart data={selectedRange.dailyViews} margin={{ left: -12, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={18} />
                <YAxis tickLine={false} axisLine={false} width={36} allowDecimals={false} />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelKey="label"
                      formatter={(value: number | string) => (
                        <div className="flex min-w-[8rem] items-center justify-between gap-4">
                          <span className="text-muted-foreground">View</span>
                          <span className="font-mono font-medium text-foreground">{formatNumber(Number(value))}</span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="views" name="View" fill="var(--color-views)" radius={[8, 8, 0, 0]} barSize={24} />
              </BarChart>
            </ChartContainer>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
            <div className="mb-5 space-y-1">
              <p className="text-sm font-semibold text-foreground">Daftar halaman yang baru dibuka</p>
              <p className="text-sm text-muted-foreground">
                Diurutkan dari aktivitas terbaru. Untuk layanan dan artikel, buka detail untuk melihat view per slug.
              </p>
            </div>

            <div className="hidden overflow-hidden rounded-2xl border border-border md:block">
              <Table>
                <TableHeader className="bg-background">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Halaman</TableHead>
                    <TableHead className="text-right">View</TableHead>
                    <TableHead className="text-right">Terakhir dibuka</TableHead>
                    <TableHead className="w-[140px] text-right">Detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageGroups.length ? (
                    pageGroups.map((group) => {
                      const isExpanded = expandedGroupKey === group.key;
                      const isExpandable = group.detailType !== null;
                      const detailLabel =
                        group.detailType === "service"
                          ? "Lihat layanan"
                          : group.detailType === "article"
                            ? "Lihat artikel"
                            : "";

                      return (
                        <Fragment key={group.key}>
                          <TableRow className="border-border hover:bg-muted/40">
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium text-foreground">{group.label}</p>
                                <p className="text-xs text-muted-foreground">{group.uniquePages} URL aktif</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium text-foreground">{formatNumber(group.views)}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{formatDateTime(group.lastVisitedAt)}</TableCell>
                            <TableCell className="text-right">
                              {isExpandable ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => setExpandedGroupKey(isExpanded ? null : group.key)}
                                >
                                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                  {detailLabel}
                                </Button>
                              ) : (
                                <span className="text-sm text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>

                          {isExpanded && isExpandable ? (
                            <TableRow className="border-border bg-background/70 hover:bg-background/70">
                              <TableCell colSpan={4} className="p-4">
                                <SlugDetails
                                  title={group.detailType === "service" ? "Detail slug layanan" : "Detail slug artikel"}
                                  items={expandedItems}
                                  basePathLabel={group.label}
                                />
                              </TableCell>
                            </TableRow>
                          ) : null}
                        </Fragment>
                      );
                    })
                  ) : (
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        Belum ada data halaman.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-3 md:hidden">
              {pageGroups.length ? (
                pageGroups.map((group) => {
                  const isExpanded = expandedGroupKey === group.key;
                  const isExpandable = group.detailType !== null;

                  return (
                    <div key={group.key} className="rounded-2xl border border-border bg-background p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{group.label}</p>
                          <p className="text-xs text-muted-foreground">{group.uniquePages} URL aktif</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{formatNumber(group.views)}</p>
                          <p className="text-xs text-muted-foreground">view</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <p className="text-sm text-muted-foreground">Terakhir dibuka {formatDateTime(group.lastVisitedAt)}</p>

                        {isExpandable ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full justify-between"
                            onClick={() => setExpandedGroupKey(isExpanded ? null : group.key)}
                          >
                            <span>{group.detailType === "service" ? "Lihat detail layanan" : "Lihat detail artikel"}</span>
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </Button>
                        ) : null}

                        {isExpanded && isExpandable ? (
                          <SlugDetails
                            title={group.detailType === "service" ? "Detail slug layanan" : "Detail slug artikel"}
                            items={expandedItems}
                            basePathLabel={group.label}
                          />
                        ) : null}
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyPanel message="Belum ada data halaman." />
              )}
            </div>
          </section>
        </>
      ) : null}

      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-red-500">Reset Analitik</DialogTitle>
          </DialogHeader>

          <div className="py-2 text-sm leading-relaxed text-muted-foreground">
            Apakah Anda yakin ingin menghapus <b>semua riwayat kunjungan</b> dan pesan konsultasi? Tindakan ini tidak dapat dibatalkan.
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Batal
              </Button>
            </DialogClose>
            <Button
              onClick={handleReset}
              disabled={isResetting}
              className="bg-red-500 font-bold text-white hover:bg-red-600"
            >
              {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Reset Semua
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
