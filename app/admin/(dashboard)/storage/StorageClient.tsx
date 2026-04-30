"use client";

import { HardDrive, RefreshCw } from "lucide-react";
import { formatBytes } from "@/lib/storage-limit";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface StorageData {
  allowed: boolean;
  currentBytes: number;
  maxBytes: number;
}

export function StorageClient({ storageData }: { storageData: StorageData }) {
  const router = useRouter();
  const percentage = (storageData.currentBytes / storageData.maxBytes) * 100;
  const isDanger = percentage >= 90;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Penyimpanan"
        action={
          <Button onClick={() => router.refresh()} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-6">
        <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Kapasitas Penyimpanan Supabase</h3>
          
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Penggunaan Saat Ini</span>
            <span className="text-sm font-medium text-foreground">
              {formatBytes(storageData.currentBytes)} / {formatBytes(storageData.maxBytes)}
            </span>
          </div>

          <Progress value={percentage} className="h-3" />
          
          <div className="mt-4 flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${isDanger ? 'bg-destructive' : 'bg-primary'}`} />
            <p className="text-sm text-muted-foreground">
              Telah digunakan {percentage.toFixed(2)}% dari total kapasitas.
              {isDanger && " Kapasitas hampir penuh. Harap hapus file yang tidak digunakan."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}