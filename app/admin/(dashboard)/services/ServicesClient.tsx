"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { upsertService, deleteService, toggleServiceStatus } from "./actions";

export function ServicesClient({ initialServices }: { initialServices: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    id: null,
    nama: "",
    slug: "",
    kategori: "litigasi",
    deskripsi_singkat: "",
    deskripsi_lengkap: "",
    nomor_urut: 1,
    aktif: true
  });
  
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredServices = initialServices.filter((srv) => 
    srv.nama?.toLowerCase().includes(search.toLowerCase()) || 
    srv.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({
      id: null,
      nama: "",
      slug: "",
      kategori: "litigasi",
      deskripsi_singkat: "",
      deskripsi_lengkap: "",
      nomor_urut: initialServices.length + 1,
      aktif: true
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (service: any) => {
    setFormData({ ...service });
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const { error } = await upsertService(formData);
    if (error) {
      toast.error(error);
    } else {
      toast.success(formData.id ? "Layanan diperbarui" : "Layanan ditambahkan");
      setIsDialogOpen(false);
      router.refresh();
    }
    setIsLoading(false);
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    const { error } = await deleteService(deleteId);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Layanan dihapus");
      setIsDeleteDialogOpen(false);
      router.refresh();
    }
    setIsLoading(false);
  };

  const onToggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await toggleServiceStatus(id, !currentStatus);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Status diubah");
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Layanan Hukum</h1>
          <p className="text-muted-foreground">Kelola daftar layanan dan keahlian firma hukum.</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
          <Plus className="w-4 h-4 mr-2" /> Tambah Layanan
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        <div className="mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari layanan..."
              className="pl-9 bg-background border-border text-foreground focus-visible:ring-[#c9a84c]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-background">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium w-[50px]">No</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[30%]">Layanan</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[20%]">Kategori</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[15%]">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Tidak ada layanan ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((srv) => (
                  <TableRow key={srv.id} className="border-border hover:bg-muted transition-colors">
                    <TableCell className="text-muted-foreground">{srv.nomor_urut}</TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground mb-1">{srv.nama}</div>
                      <div className="text-xs text-muted-foreground font-mono">/{srv.slug}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 uppercase text-[10px] tracking-wider">
                        {srv.kategori.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={srv.aktif}
                          onCheckedChange={() => onToggleStatus(srv.id, srv.aktif)}
                          className="data-[state=checked]:bg-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          {srv.aktif ? "Aktif" : "Draft"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(srv)} className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteConfirm(srv.id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400 hover:bg-red-400/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-primary">
              {formData.id ? "Edit Layanan" : "Tambah Layanan Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Nama Layanan</Label>
              <Input className="col-span-3 bg-background border-border text-foreground focus-visible:ring-[#c9a84c]" 
                value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Slug URL</Label>
              <Input className="col-span-3 bg-background border-border text-foreground focus-visible:ring-[#c9a84c]" 
                placeholder="Kosongkan untuk otomatis dari nama"
                value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Kategori</Label>
              <div className="col-span-3">
                <Select value={formData.kategori} onValueChange={(val) => setFormData({...formData, kategori: val})}>
                  <SelectTrigger className="bg-background border-border text-foreground focus:ring-[#c9a84c]">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border text-foreground">
                    <SelectItem value="litigasi" className="focus:bg-primary/20 focus:text-primary">Litigasi</SelectItem>
                    <SelectItem value="non-litigasi" className="focus:bg-primary/20 focus:text-primary">Non Litigasi</SelectItem>
                    <SelectItem value="perlindungan-konsumen" className="focus:bg-primary/20 focus:text-primary">Perlindungan Konsumen</SelectItem>
                    <SelectItem value="konsultasi-usaha" className="focus:bg-primary/20 focus:text-primary">Konsultasi Usaha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right text-muted-foreground mt-3">Deskripsi Singkat</Label>
              <Textarea className="col-span-3 bg-background border-border text-foreground focus-visible:ring-[#c9a84c]" 
                value={formData.deskripsi_singkat} onChange={(e) => setFormData({...formData, deskripsi_singkat: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right text-muted-foreground mt-3">Deskripsi Lengkap</Label>
              <Textarea className="col-span-3 bg-background border-border text-foreground min-h-[150px] focus-visible:ring-[#c9a84c]" 
                value={formData.deskripsi_lengkap} onChange={(e) => setFormData({...formData, deskripsi_lengkap: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Nomor Urut</Label>
              <Input type="number" className="col-span-1 bg-background border-border text-foreground focus-visible:ring-[#c9a84c]" 
                value={formData.nomor_urut} onChange={(e) => setFormData({...formData, nomor_urut: parseInt(e.target.value) || 0})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Status</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  checked={formData.aktif}
                  onCheckedChange={(val) => setFormData({...formData, aktif: val})}
                  className="data-[state=checked]:bg-primary"
                />
                <span className="text-muted-foreground">{formData.aktif ? 'Tampilkan' : 'Sembunyikan'}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Batal</Button>
            </DialogClose>
            <Button onClick={onSubmit} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-red-400">Hapus Layanan</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Apakah Anda yakin ingin menghapus layanan ini secara permanen? Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Batal</Button>
            </DialogClose>
            <Button onClick={onConfirmDelete} disabled={isLoading} className="bg-red-500 hover:bg-red-600 text-white font-bold">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

