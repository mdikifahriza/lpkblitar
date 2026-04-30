"use client";

import { useState } from "react";
import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MobileCard, MobileCardList } from "@/components/ui/mobile-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { deleteFaq, toggleFaqStatus, upsertFaq, deleteAllFaqs } from "./actions";

export type FaqItem = {
  id: string;
  pertanyaan: string;
  jawaban: string;
  layanan_id: string | null;
  nomor_urut: number;
  aktif: boolean;
};

export type ServiceOption = {
  id: string;
  nama: string;
  slug: string | null;
};

type FaqFormState = {
  id: string | null;
  pertanyaan: string;
  jawaban: string;
  layanan_id: string;
  nomor_urut: number;
  aktif: boolean;
};

const GENERAL_SERVICE_VALUE = "__general__";

const createEmptyForm = (nextOrder: number): FaqFormState => ({
  id: null,
  pertanyaan: "",
  jawaban: "",
  layanan_id: GENERAL_SERVICE_VALUE,
  nomor_urut: nextOrder,
  aktif: true,
});

export function FaqsClient({
  initialFaqs,
  services,
  userRole,
}: {
  initialFaqs: FaqItem[];
  services: any[];
  userRole: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FaqFormState>(createEmptyForm(initialFaqs.length + 1));

  const getServiceName = (serviceId: string | null) => {
    if (!serviceId) return "Umum";
    return services.find((service) => service.id === serviceId)?.nama || "Layanan tidak ditemukan";
  };

  const filteredFaqs = initialFaqs.filter((faq) => {
    const searchTerm = search.toLowerCase();
    return (
      faq.pertanyaan.toLowerCase().includes(searchTerm) ||
      faq.jawaban.toLowerCase().includes(searchTerm) ||
      getServiceName(faq.layanan_id).toLowerCase().includes(searchTerm)
    );
  });

  const handleAdd = () => {
    const nextOrder =
      initialFaqs.length > 0
        ? Math.max(...initialFaqs.map((faq) => faq.nomor_urut || 0)) + 1
        : 1;

    setFormData(createEmptyForm(nextOrder));
    setIsDialogOpen(true);
  };

  const handleEdit = (faq: FaqItem) => {
    setFormData({
      id: faq.id,
      pertanyaan: faq.pertanyaan,
      jawaban: faq.jawaban,
      layanan_id: faq.layanan_id ?? GENERAL_SERVICE_VALUE,
      nomor_urut: faq.nomor_urut,
      aktif: faq.aktif,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const { error } = await upsertFaq({
      id: formData.id ?? undefined,
      pertanyaan: formData.pertanyaan,
      jawaban: formData.jawaban,
      layanan_id: formData.layanan_id === GENERAL_SERVICE_VALUE ? null : formData.layanan_id,
      nomor_urut: Number(formData.nomor_urut),
      aktif: formData.aktif,
    });

    if (error) {
      toast.error(error);
    } else {
      toast.success(formData.id ? "FAQ diperbarui" : "FAQ ditambahkan");
      setIsDialogOpen(false);
      router.refresh();
    }

    setIsLoading(false);
  };

  const handleDeleteAll = async () => {
    setIsLoading(true);
    const { error } = await deleteAllFaqs();
    if (error) {
      toast.error(error);
    } else {
      toast.success("Semua FAQ dihapus");
      setIsDeleteAllDialogOpen(false);
      router.refresh();
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsLoading(true);
    const { error } = await deleteFaq(deleteId);

    if (error) {
      toast.error(error);
    } else {
      toast.success("FAQ dihapus");
      setIsDeleteDialogOpen(false);
      router.refresh();
    }

    setIsLoading(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await toggleFaqStatus(id, !currentStatus);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Status FAQ diubah");
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="FAQ"
        description="Kelola pertanyaan yang sering diajukan klien."
        icon={CircleHelp}
        action={
          <div className="flex gap-2">
            <Button onClick={() => {
              if (userRole !== 'superadmin') {
                toast.error("Akses ditolak: Hanya superadmin yang dapat menghapus semua FAQ.");
                return;
              }
              setIsDeleteAllDialogOpen(true);
            }} variant="destructive" className="font-bold" disabled={initialFaqs.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus Semua
            </Button>
            <Button onClick={handleAdd} className="bg-primary font-bold text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Tambah FAQ
            </Button>
          </div>
        }
      />

      <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
        <div className="mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari pertanyaan, jawaban, atau layanan..."
              className="pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-lg border border-border md:block">
          <Table>
            <TableHeader className="bg-background">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-[72px]">Urut</TableHead>
                <TableHead className="w-[42%]">Pertanyaan</TableHead>
                <TableHead className="w-[20%]">Layanan</TableHead>
                <TableHead className="w-[16%]">Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFaqs.length === 0 ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Tidak ada FAQ ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredFaqs.map((faq) => (
                  <TableRow key={faq.id} className="border-border transition-colors hover:bg-muted">
                    <TableCell className="font-medium text-muted-foreground">{faq.nomor_urut}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="line-clamp-1 font-bold text-foreground">{faq.pertanyaan}</div>
                        <div className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {faq.jawaban}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-background">
                        {getServiceName(faq.layanan_id)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={faq.aktif}
                          onCheckedChange={() => handleToggleStatus(faq.id, faq.aktif)}
                          className="data-[state=checked]:bg-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          {faq.aktif ? "Aktif" : "Draft"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(faq)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteConfirm(faq.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <MobileCardList>
          {filteredFaqs.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-10 text-center text-muted-foreground">
              Tidak ada FAQ ditemukan
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <MobileCard
                key={faq.id}
                title={<span className="line-clamp-2">{faq.pertanyaan}</span>}
                subtitle={<span>Urutan {faq.nomor_urut}</span>}
                badges={
                  <Badge variant="outline" className={faq.aktif ? "text-primary" : "text-muted-foreground"}>
                    {faq.aktif ? "Aktif" : "Draft"}
                  </Badge>
                }
                viewTitle="Detail FAQ"
                viewContent={
                  <div className="space-y-4">
                    <div className="space-y-2 rounded-xl border border-border bg-background p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Pertanyaan
                      </div>
                      <div className="font-medium text-foreground">{faq.pertanyaan}</div>
                    </div>
                    <div className="space-y-2 rounded-xl border border-border bg-background p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Jawaban
                      </div>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                        {faq.jawaban}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-border bg-background p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          Layanan
                        </div>
                        <div className="mt-2 text-sm font-medium text-foreground">
                          {getServiceName(faq.layanan_id)}
                        </div>
                      </div>
                      <div className="rounded-xl border border-border bg-background p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          Status
                        </div>
                        <div className="mt-2 text-sm font-medium text-foreground">
                          {faq.aktif ? "Aktif" : "Draft"}
                        </div>
                      </div>
                    </div>
                  </div>
                }
                actions={
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(faq)}
                      className="border-border bg-background text-muted-foreground hover:text-primary"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteConfirm(faq.id)}
                      className="border-border bg-background text-muted-foreground hover:border-red-500 hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </Button>
                  </>
                }
              />
            ))
          )}
        </MobileCardList>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-primary">
              {formData.id ? "Edit FAQ" : "Tambah FAQ"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="faq-pertanyaan" className="text-muted-foreground">
                Pertanyaan
              </Label>
              <Textarea
                id="faq-pertanyaan"
                value={formData.pertanyaan}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, pertanyaan: event.target.value }))
                }
                className="min-h-[96px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="faq-jawaban" className="text-muted-foreground">
                Jawaban
              </Label>
              <Textarea
                id="faq-jawaban"
                value={formData.jawaban}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, jawaban: event.target.value }))
                }
                className="min-h-[180px]"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Layanan</Label>
                <Select
                  value={formData.layanan_id}
                  onValueChange={(value) =>
                    setFormData((current) => ({ ...current, layanan_id: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih layanan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={GENERAL_SERVICE_VALUE}>Umum</SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="faq-order" className="text-muted-foreground">
                  Nomor Urut
                </Label>
                <Input
                  id="faq-order"
                  type="number"
                  min={1}
                  value={formData.nomor_urut}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      nomor_urut: Number(event.target.value) || 1,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
              <div className="text-sm font-medium text-foreground">Status Tampil</div>
              <Switch
                checked={formData.aktif}
                onCheckedChange={(checked) =>
                  setFormData((current) => ({ ...current, aktif: checked }))
                }
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Batal
              </Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={isLoading} className="font-bold">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-red-500">Hapus FAQ</DialogTitle>
          </DialogHeader>

          <div className="py-2 text-sm leading-relaxed text-muted-foreground">
            FAQ yang dipilih akan dihapus permanen.
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Batal
              </Button>
            </DialogClose>
            <Button
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-500 font-bold text-white hover:bg-red-600"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-red-500">Hapus Semua FAQ</DialogTitle>
          </DialogHeader>

          <div className="py-2 text-sm leading-relaxed text-muted-foreground">
            Apakah Anda yakin ingin menghapus <b>semua</b> pertanyaan FAQ secara permanen?
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Batal
              </Button>
            </DialogClose>
            <Button
              onClick={handleDeleteAll}
              disabled={isLoading}
              className="bg-red-500 font-bold text-white hover:bg-red-600"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Hapus Semua
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
