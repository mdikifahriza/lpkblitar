"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, CheckCircle2, XCircle, Loader2, User, Camera } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SafeImage } from "@/components/ui/safe-image";
import { upsertTeamMember, deleteTeamMember, toggleTeamStatus } from "./actions";

export function TeamClient({ initialTeam }: { initialTeam: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [formData, setFormData] = useState<any>({
    id: null,
    nama: "",
    jabatan: "",
    spesialisasi: "",
    bio: "",
    foto_url: "",
    is_pimpinan: false,
    nomor_urut: 1,
    aktif: true
  });
  
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredTeam = initialTeam.filter((m) => 
    m.nama?.toLowerCase().includes(search.toLowerCase()) || 
    m.jabatan?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({
      id: null,
      nama: "",
      jabatan: "",
      spesialisasi: "",
      bio: "",
      foto_url: "",
      is_pimpinan: false,
      nomor_urut: initialTeam.length + 1,
      aktif: true
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (member: any) => {
    setFormData({ ...member });
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format file harus gambar");
      return;
    }

    setIsUploading(true);
    toast.info("Mengunggah foto...");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `team/team-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public-assets")
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public-assets")
        .getPublicUrl(fileName);

      setFormData({ ...formData, foto_url: publicUrlData.publicUrl });
      toast.success("Foto berhasil diunggah");
    } catch (error: any) {
      toast.error(error.message || "Gagal mengunggah foto.");
    } finally {
      setIsUploading(false);
    }
  }

  const onSubmit = async () => {
    setIsLoading(true);
    const { error } = await upsertTeamMember(formData);
    if (error) {
      toast.error(error);
    } else {
      toast.success(formData.id ? "Data anggota diperbarui" : "Anggota ditambahkan");
      setIsDialogOpen(false);
      router.refresh();
    }
    setIsLoading(false);
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    const { error } = await deleteTeamMember(deleteId);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Anggota tim dihapus");
      setIsDeleteDialogOpen(false);
      router.refresh();
    }
    setIsLoading(false);
  };

  const onToggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await toggleTeamStatus(id, !currentStatus);
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
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Manajemen Tim</h1>
          <p className="text-muted-foreground">Kelola daftar pengacara dan staf ahli.</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
          <Plus className="w-4 h-4 mr-2" /> Tambah Anggota
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        <div className="mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau jabatan..."
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
                <TableHead className="text-muted-foreground font-medium w-[80px]">Foto</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[25%]">Nama Lengkap</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[25%]">Jabatan / Spesialisasi</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[15%]">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeam.length === 0 ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Tidak ada data tim ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeam.map((member) => (
                  <TableRow key={member.id} className="border-border hover:bg-muted transition-colors">
                    <TableCell>
                      <div className="w-10 h-10 rounded-full border border-border bg-background overflow-hidden flex items-center justify-center">
                        {member.foto_url ? (
                          <SafeImage src={member.foto_url} alt={member.nama} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground mb-1 flex items-center gap-2">
                        {member.nama}
                        {member.is_pimpinan && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] px-1.5 py-0">Pimpinan</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">Urutan: {member.nomor_urut}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground mb-1">{member.jabatan}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[250px]">{member.spesialisasi}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={member.aktif}
                          onCheckedChange={() => onToggleStatus(member.id, member.aktif)}
                          className="data-[state=checked]:bg-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          {member.aktif ? "Aktif" : "Draft"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(member)} className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteConfirm(member.id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400 hover:bg-red-400/10">
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
              {formData.id ? "Edit Anggota Tim" : "Tambah Anggota Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            
            <div className="flex items-center gap-6 pb-6 border-b border-border">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-full border border-border bg-background overflow-hidden flex items-center justify-center">
                  {formData.foto_url ? (
                    <SafeImage src={formData.foto_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <label 
                  htmlFor="photo-upload" 
                  className={`absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-foreground animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-foreground" />
                  )}
                </label>
                <input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Klik ikon kamera untuk mengunggah foto. Rekomendasi ukuran: 400x500px portrait.
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Nama Lengkap</Label>
              <Input className="col-span-3 bg-background border-border text-foreground focus-visible:ring-[#c9a84c]" 
                value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Jabatan</Label>
              <Input className="col-span-3 bg-background border-border text-foreground focus-visible:ring-[#c9a84c]" 
                placeholder="Contoh: Lawyer Litigasi"
                value={formData.jabatan} onChange={(e) => setFormData({...formData, jabatan: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Spesialisasi</Label>
              <Input className="col-span-3 bg-background border-border text-foreground focus-visible:ring-[#c9a84c]" 
                placeholder="Contoh: Gugatan PMH, Wanprestasi"
                value={formData.spesialisasi} onChange={(e) => setFormData({...formData, spesialisasi: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right text-muted-foreground mt-3">Bio Singkat</Label>
              <Textarea className="col-span-3 bg-background border-border text-foreground min-h-[100px] focus-visible:ring-[#c9a84c]" 
                value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Tandai Pimpinan</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  checked={formData.is_pimpinan}
                  onCheckedChange={(val) => setFormData({...formData, is_pimpinan: val})}
                  className="data-[state=checked]:bg-primary"
                />
                <span className="text-muted-foreground text-sm">Jika Ya, akan ditampilkan lebih besar di atas grid tim.</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-3 items-center gap-4 col-span-2 md:col-span-1">
                <Label className="text-right text-muted-foreground">Nomor Urut</Label>
                <Input type="number" className="col-span-2 bg-background border-border text-foreground focus-visible:ring-[#c9a84c]" 
                  value={formData.nomor_urut} onChange={(e) => setFormData({...formData, nomor_urut: parseInt(e.target.value) || 0})} />
              </div>
              <div className="grid grid-cols-3 items-center gap-4 col-span-2 md:col-span-1">
                <Label className="text-right text-muted-foreground">Status Publikasi</Label>
                <div className="col-span-2 flex items-center space-x-2">
                  <Switch
                    checked={formData.aktif}
                    onCheckedChange={(val) => setFormData({...formData, aktif: val})}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Batal</Button>
            </DialogClose>
            <Button onClick={onSubmit} disabled={isLoading || isUploading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-red-400">Hapus Anggota</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Apakah Anda yakin ingin menghapus data anggota ini? Tindakan ini tidak dapat dibatalkan.</p>
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


