"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, CheckCircle2, XCircle, Loader2, Image as ImageIcon, Camera } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SafeImage } from "@/components/ui/safe-image";
import { upsertArticle, deleteArticle, toggleArticleStatus } from "./actions";

export function ArticlesClient({ initialArticles }: { initialArticles: any[] }) {
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
    judul: "",
    slug: "",
    kategori: "panduan-hukum",
    konten: "",
    thumbnail_url: "",
    estimasi_baca: 5,
    published: true
  });
  
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredArticles = initialArticles.filter((art) => 
    art.judul?.toLowerCase().includes(search.toLowerCase()) || 
    art.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({
      id: null,
      judul: "",
      slug: "",
      kategori: "panduan-hukum",
      konten: "",
      thumbnail_url: "",
      estimasi_baca: 5,
      published: true
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (article: any) => {
    setFormData({ ...article });
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format file harus gambar");
      return;
    }

    setIsUploading(true);
    toast.info("Mengunggah thumbnail...");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `artikel/article-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public-assets")
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public-assets")
        .getPublicUrl(fileName);

      setFormData({ ...formData, thumbnail_url: publicUrlData.publicUrl });
      toast.success("Thumbnail berhasil diunggah");
    } catch (error: any) {
      toast.error(error.message || "Gagal mengunggah gambar.");
    } finally {
      setIsUploading(false);
    }
  }

  const onSubmit = async () => {
    setIsLoading(true);
    const dataToSave = { ...formData };
    if (!dataToSave.id && dataToSave.published) {
       dataToSave.published_at = new Date().toISOString();
    }
    const { error } = await upsertArticle(dataToSave);
    if (error) {
      toast.error(error);
    } else {
      toast.success(formData.id ? "Artikel diperbarui" : "Artikel diterbitkan");
      setIsDialogOpen(false);
      router.refresh();
    }
    setIsLoading(false);
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    const { error } = await deleteArticle(deleteId);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Artikel dihapus");
      setIsDeleteDialogOpen(true);
      router.refresh();
    }
    setIsLoading(false);
  };

  const onToggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await toggleArticleStatus(id, !currentStatus);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Status artikel diubah");
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Insight & Artikel</h1>
          <p className="text-muted-foreground">Kelola konten edukasi hukum untuk pengguna.</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
          <Plus className="w-4 h-4 mr-2" /> Tulis Artikel Baru
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        <div className="mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari judul artikel..."
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
                <TableHead className="text-muted-foreground font-medium w-[80px]">Thumbnail</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[40%]">Judul Artikel</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[15%]">Kategori</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[15%]">Visibilitas</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.length === 0 ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Tidak ada artikel ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((art) => (
                  <TableRow key={art.id} className="border-border hover:bg-muted transition-colors">
                    <TableCell>
                      <div className="w-16 h-10 rounded overflow-hidden bg-background border border-border flex items-center justify-center">
                        {art.thumbnail_url ? (
                          <SafeImage src={art.thumbnail_url} alt={art.judul} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground mb-1 line-clamp-1">{art.judul}</div>
                      <div className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">/{art.slug}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 uppercase text-[10px] tracking-wider">
                        {art.kategori.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={art.published}
                          onCheckedChange={() => onToggleStatus(art.id, art.published)}
                          className="data-[state=checked]:bg-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          {art.published ? "Publik" : "Draft"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(art)} className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteConfirm(art.id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400 hover:bg-red-400/10">
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
        <DialogContent className="bg-card border-border text-foreground max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-primary">
              {formData.id ? "Edit Artikel" : "Tulis Artikel Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            
            <div className="flex items-start gap-6 pb-6 border-b border-border">
              <div className="w-1/3 space-y-3">
                <Label className="text-muted-foreground">Thumbnail (Gambar Cover)</Label>
                <div className="relative group w-full aspect-video rounded-xl border border-border bg-background overflow-hidden flex items-center justify-center">
                  {formData.thumbnail_url ? (
                    <SafeImage src={formData.thumbnail_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Upload 16:9 Image</span>
                    </div>
                  )}
                  <label 
                    htmlFor="thumb-upload" 
                    className={`absolute inset-0 flex items-center justify-center bg-black/60 cursor-pointer transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-foreground animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-foreground" />
                    )}
                  </label>
                  <input 
                    id="thumb-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleThumbnailUpload}
                    disabled={isUploading}
                  />
                </div>
              </div>
              <div className="w-2/3 space-y-4">
                <div>
                  <Label className="text-muted-foreground">Judul Artikel *</Label>
                  <Input className="mt-1 bg-background border-border text-foreground focus-visible:ring-[#c9a84c]" 
                    value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Slug URL</Label>
                    <Input className="mt-1 bg-background border-border text-foreground focus-visible:ring-[#c9a84c]" 
                      placeholder="otomatis-dari-judul"
                      value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Estimasi Baca (menit)</Label>
                    <Input type="number" className="mt-1 bg-background border-border text-foreground focus-visible:ring-[#c9a84c]" 
                      value={formData.estimasi_baca} onChange={(e) => setFormData({...formData, estimasi_baca: parseInt(e.target.value) || 5})} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <Label className="text-muted-foreground block mb-1">Kategori</Label>
                <Select value={formData.kategori} onValueChange={(val) => setFormData({...formData, kategori: val})}>
                  <SelectTrigger className="bg-background border-border text-foreground focus:ring-[#c9a84c]">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border text-foreground">
                    <SelectItem value="finance-perbankan" className="focus:bg-primary/20 focus:text-primary">Finance & Perbankan</SelectItem>
                    <SelectItem value="perlindungan-konsumen" className="focus:bg-primary/20 focus:text-primary">Perlindungan Konsumen</SelectItem>
                    <SelectItem value="sengketa-bisnis" className="focus:bg-primary/20 focus:text-primary">Sengketa Bisnis</SelectItem>
                    <SelectItem value="panduan-hukum" className="focus:bg-primary/20 focus:text-primary">Panduan Hukum</SelectItem>
                    <SelectItem value="konsultasi-usaha" className="focus:bg-primary/20 focus:text-primary">Konsultasi Usaha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1 items-start ml-4">
                <Label className="text-muted-foreground">Visibilitas</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(val) => setFormData({...formData, published: val})}
                    className="data-[state=checked]:bg-primary"
                  />
                  <span className="text-foreground font-medium">{formData.published ? 'Publik' : 'Draft Tersimpan'}</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground block mb-2">Konten / Isi Artikel</Label>
              <Textarea 
                className="bg-background border-border text-foreground min-h-[300px] resize-y focus-visible:ring-[#c9a84c] leading-relaxed" 
                placeholder="Gunakan pemisahan baris (Enter dua kali) untuk memisahkan paragraf."
                value={formData.konten} 
                onChange={(e) => setFormData({...formData, konten: e.target.value})} 
              />
              <p className="text-xs text-muted-foreground mt-2">
                Tip: Artikel ini dibaca secara otomatis menggunakan pemisah baris untuk membuat paragraf.
              </p>
            </div>

          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Batal</Button>
            </DialogClose>
            <Button onClick={onSubmit} disabled={isLoading || isUploading || !formData.judul} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} {formData.id ? "Simpan Perubahan" : "Terbitkan Artikel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-red-400">Hapus Artikel</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Apakah Anda yakin ingin menghapus artikel ini secara permanen? Tindakan ini tidak dapat dibatalkan.</p>
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


