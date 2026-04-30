"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Edit, Image as ImageIcon, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { uploadFileToSupabase } from "@/app/admin/upload-action";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
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
import { MobileCard, MobileCardList } from "@/components/ui/mobile-card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SafeImage } from "@/components/ui/safe-image";
import { deleteArticle, deleteAllArticles, toggleArticleStatus, upsertArticle } from "./actions";

type ArticleItem = {
  id: string;
  judul: string;
  slug: string;
  kategori: string;
  konten?: string | null;
  thumbnail_url?: string | null;
  estimasi_baca: number;
  published: boolean;
  published_at?: string | null;
};

type ArticleForm = {
  id: string | null;
  judul: string;
  slug: string;
  kategori: string;
  konten: string;
  thumbnail_url: string;
  estimasi_baca: number;
  published: boolean;
  published_at?: string | null;
};

export function ArticlesClient({ initialArticles, userRole }: { initialArticles: ArticleItem[], userRole: string }) {
  const router = useRouter();
  const previewUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ArticleForm>({
    id: null,
    judul: "",
    slug: "",
    kategori: "panduan-hukum",
    konten: "",
    thumbnail_url: "",
    estimasi_baca: 5,
    published: true,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredArticles = initialArticles.filter(
    (article) =>
      article.judul?.toLowerCase().includes(search.toLowerCase()) ||
      article.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const revokePreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const resetThumbnailState = () => {
    revokePreviewUrl();
    setThumbnailPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      revokePreviewUrl();
    };
  }, []);

  const handleAdd = () => {
    setFormData({
      id: null,
      judul: "",
      slug: "",
      kategori: "panduan-hukum",
      konten: "",
      thumbnail_url: "",
      estimasi_baca: 5,
      published: true,
    });
    resetThumbnailState();
    setIsDialogOpen(true);
  };

  const handleEdit = (article: ArticleItem) => {
    setFormData({
      id: article.id,
      judul: article.judul,
      slug: article.slug,
      kategori: article.kategori,
      konten: article.konten || "",
      thumbnail_url: article.thumbnail_url || "",
      estimasi_baca: article.estimasi_baca,
      published: article.published,
      published_at: article.published_at || null,
    });
    resetThumbnailState();
    setThumbnailPreview(article.thumbnail_url || null);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format file harus gambar");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    revokePreviewUrl();
    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setSelectedFile(file);
    setThumbnailPreview(objectUrl);
  };

  const onSubmit = async () => {
    setIsLoading(true);

      try {
        let finalThumbnailUrl = formData.thumbnail_url || "";

        if (selectedFile) {
          setIsUploading(true);
          const fileExt = selectedFile.name.split(".").pop();
          const fileName = `artikel/article-${crypto.randomUUID()}.${fileExt}`;
          const uploadFormData = new FormData();
          uploadFormData.append("file", selectedFile);
          uploadFormData.append("path", fileName);

        const uploadResult = await uploadFileToSupabase(uploadFormData);

        if ("error" in uploadResult) {
          throw new Error(uploadResult.error);
        }

        finalThumbnailUrl = uploadResult.url;
      }

      const dataToSave = {
        ...formData,
        thumbnail_url: finalThumbnailUrl,
        previous_thumbnail_url: formData.id ? formData.thumbnail_url || "" : "",
      };

      if (!dataToSave.id && dataToSave.published) {
        dataToSave.published_at = new Date().toISOString();
      }

      const { error } = await upsertArticle(dataToSave);

      if (error) {
        toast.error(error);
      } else {
        toast.success(formData.id ? "Artikel diperbarui" : "Artikel diterbitkan");
        setIsDialogOpen(false);
        resetThumbnailState();
        router.refresh();
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan artikel.");
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    const { error } = await deleteArticle(deleteId);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Artikel dihapus");
      setIsDeleteDialogOpen(false);
      router.refresh();
    }
    setIsLoading(false);
  };

  const onConfirmDeleteAll = async () => {
    setIsLoading(true);
    const { error } = await deleteAllArticles();
    if (error) {
      toast.error(error);
    } else {
      toast.success("Semua artikel dihapus");
      setIsDeleteAllDialogOpen(false);
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
      <AdminPageHeader
        title="Artikel & Insight"
        description="Kelola artikel edukasi hukum dan insight terkini."
        action={
          <div className="flex gap-2">
            <Button onClick={() => {
              if (userRole !== 'superadmin') {
                toast.error("Akses ditolak: Hanya superadmin yang dapat menghapus semua artikel.");
                return;
              }
              setIsDeleteAllDialogOpen(true);
            }} variant="destructive" className="font-bold" disabled={initialArticles.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus Semua
            </Button>
            <Button onClick={handleAdd} className="bg-primary font-bold text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Artikel Baru
            </Button>
          </div>
        }
      />

      <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
        <div className="mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari judul artikel..."
              className="bg-background pl-9 text-foreground focus-visible:ring-primary"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-lg border border-border md:block">
          <Table>
            <TableHeader className="bg-background">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-[80px] font-medium text-muted-foreground">Thumbnail</TableHead>
                <TableHead className="w-[40%] font-medium text-muted-foreground">Judul Artikel</TableHead>
                <TableHead className="w-[15%] font-medium text-muted-foreground">Kategori</TableHead>
                <TableHead className="w-[15%] font-medium text-muted-foreground">Visibilitas</TableHead>
                <TableHead className="text-right font-medium text-muted-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.length === 0 ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Tidak ada artikel ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((article) => (
                  <TableRow key={article.id} className="border-border transition-colors hover:bg-muted">
                    <TableCell>
                      <div className="flex h-10 w-16 items-center justify-center overflow-hidden rounded border border-border bg-background">
                        {article.thumbnail_url ? (
                          <SafeImage
                            src={article.thumbnail_url}
                            alt={article.judul}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="mb-1 line-clamp-1 font-bold text-foreground">{article.judul}</div>
                      <div className="max-w-[200px] truncate font-mono text-xs text-muted-foreground">
                        /{article.slug}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary/30 bg-primary/10 text-[10px] uppercase tracking-wider text-primary">
                        {article.kategori.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={article.published}
                          onCheckedChange={() => onToggleStatus(article.id, article.published)}
                          className="data-[state=checked]:bg-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          {article.published ? "Publik" : "Draft"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(article)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteConfirm(article.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-red-400/10 hover:text-red-400"
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
          {filteredArticles.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-10 text-center text-muted-foreground">
              Tidak ada artikel ditemukan
            </div>
          ) : (
            filteredArticles.map((article) => (
              <MobileCard
                key={article.id}
                avatar={
                  <div className="flex h-10 w-16 items-center justify-center overflow-hidden rounded border border-border bg-background">
                    {article.thumbnail_url ? (
                      <SafeImage src={article.thumbnail_url} alt={article.judul} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                }
                title={<div className="line-clamp-1 font-bold text-foreground">{article.judul}</div>}
                subtitle={<div className="truncate font-mono text-xs text-muted-foreground">/{article.slug}</div>}
                badges={
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="shrink-0 border-primary/30 bg-primary/10 text-[9px] uppercase tracking-wider text-primary">
                      {article.kategori.replace("-", " ")}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`shrink-0 uppercase tracking-wider ${
                        article.published
                          ? "border-green-500/30 bg-green-500/10 text-[9px] text-green-500"
                          : "border-border bg-muted text-[9px] text-muted-foreground"
                      }`}
                    >
                      {article.published ? "Publik" : "Draft"}
                    </Badge>
                  </div>
                }
                viewTitle="Detail Artikel"
                viewContent={
                  <div className="space-y-4">
                    <div className="relative mb-6 flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
                      <div className="absolute left-2 top-2 z-10">
                        <Badge
                          variant="outline"
                          className="border-primary/30 bg-primary/10 text-[10px] uppercase tracking-wider text-primary backdrop-blur-md"
                        >
                          {article.kategori.replace("-", " ")}
                        </Badge>
                      </div>
                      {article.thumbnail_url ? (
                        <SafeImage
                          src={article.thumbnail_url}
                          alt={article.judul}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-b border-border py-2">
                      <span className="text-sm text-muted-foreground">Judul</span>
                      <span className="col-span-2 font-bold text-foreground">{article.judul}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-b border-border py-2">
                      <span className="text-sm text-muted-foreground">Slug URL</span>
                      <span className="col-span-2 break-all font-mono text-sm text-foreground">/{article.slug}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-b border-border py-2">
                      <span className="text-sm text-muted-foreground">Visibilitas</span>
                      <span className="col-span-2">
                        {article.published ? "Publik (Tampil di Web)" : "Draft (Tersimpan)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-b border-border py-2">
                      <span className="text-sm text-muted-foreground">Waktu Baca</span>
                      <span className="col-span-2 font-medium text-foreground">{article.estimasi_baca} Menit</span>
                    </div>
                    <div className="pt-4">
                      <span className="mb-2 block text-sm text-muted-foreground">Cuplikan Konten:</span>
                      <div className="max-h-[300px] overflow-y-auto whitespace-pre-wrap rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-foreground">
                        {article.konten || <span className="italic text-muted-foreground">Tidak ada konten...</span>}
                      </div>
                    </div>
                  </div>
                }
                actions={
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(article)}
                      className="border-border bg-background text-muted-foreground hover:text-primary"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteConfirm(article.id)}
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

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            resetThumbnailState();
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-border bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-primary">
              {formData.id ? "Edit Artikel" : "Tulis Artikel Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex items-start gap-6 border-b border-border pb-6">
              <div className="w-1/3 space-y-3">
                <Label className="text-muted-foreground">Thumbnail (Gambar Cover)</Label>
                <div className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
                  {thumbnailPreview ? (
                    <SafeImage src={thumbnailPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Upload 16:9 Image</span>
                    </div>
                  )}
                  <label
                    htmlFor="thumb-upload"
                    className={`absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 transition-opacity ${
                      isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-foreground" />
                    ) : (
                      <Camera className="h-6 w-6 text-foreground" />
                    )}
                  </label>
                  <input
                    id="thumb-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleThumbnailSelect}
                    disabled={isUploading || isLoading}
                  />
                </div>
              </div>
              <div className="w-2/3 space-y-4">
                <div>
                  <Label className="text-muted-foreground">Judul Artikel *</Label>
                  <Input
                    className="mt-1 bg-background text-foreground focus-visible:ring-primary"
                    value={formData.judul}
                    onChange={(event) => setFormData({ ...formData, judul: event.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Slug URL</Label>
                    <Input
                      className="mt-1 bg-background text-foreground focus-visible:ring-primary"
                      placeholder="otomatis-dari-judul"
                      value={formData.slug}
                      onChange={(event) => setFormData({ ...formData, slug: event.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Estimasi Baca (menit)</Label>
                    <Input
                      type="number"
                      className="mt-1 bg-background text-foreground focus-visible:ring-primary"
                      value={formData.estimasi_baca}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          estimasi_baca: parseInt(event.target.value, 10) || 5,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <div>
                <Label className="mb-1 block text-muted-foreground">Kategori</Label>
                <Select
                  value={formData.kategori}
                  onValueChange={(value) => setFormData({ ...formData, kategori: value })}
                >
                  <SelectTrigger className="bg-background text-foreground focus:ring-primary">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-secondary text-foreground">
                    <SelectItem value="finance-perbankan" className="focus:bg-primary/20 focus:text-primary">
                      Finance & Perbankan
                    </SelectItem>
                    <SelectItem value="perlindungan-konsumen" className="focus:bg-primary/20 focus:text-primary">
                      Perlindungan Konsumen
                    </SelectItem>
                    <SelectItem value="sengketa-bisnis" className="focus:bg-primary/20 focus:text-primary">
                      Sengketa Bisnis
                    </SelectItem>
                    <SelectItem value="panduan-hukum" className="focus:bg-primary/20 focus:text-primary">
                      Panduan Hukum
                    </SelectItem>
                    <SelectItem value="konsultasi-usaha" className="focus:bg-primary/20 focus:text-primary">
                      Konsultasi Usaha
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="ml-4 flex flex-col items-start gap-1">
                <Label className="text-muted-foreground">Visibilitas</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(value) => setFormData({ ...formData, published: value })}
                    className="data-[state=checked]:bg-primary"
                  />
                  <span className="font-medium text-foreground">
                    {formData.published ? "Publik" : "Draft Tersimpan"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-muted-foreground">Konten / Isi Artikel</Label>
              <Textarea
                className="min-h-[300px] resize-y bg-background leading-relaxed text-foreground focus-visible:ring-primary"
                placeholder="Gunakan pemisahan baris (Enter dua kali) untuk memisahkan paragraf."
                value={formData.konten}
                onChange={(event) => setFormData({ ...formData, konten: event.target.value })}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Tip: Artikel ini dibaca secara otomatis menggunakan pemisah baris untuk membuat paragraf.
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Batal
              </Button>
            </DialogClose>
            <Button
              onClick={onSubmit}
              disabled={isLoading || isUploading || !formData.judul}
              className="bg-primary font-bold text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {formData.id ? "Simpan Perubahan" : "Terbitkan Artikel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="border-border bg-card text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-red-400">Hapus Artikel</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Apakah Anda yakin ingin menghapus artikel ini secara permanen? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Batal
              </Button>
            </DialogClose>
            <Button onClick={onConfirmDelete} disabled={isLoading} className="bg-red-500 font-bold text-white hover:bg-red-600">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <DialogContent className="border-border bg-card text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-red-400">Hapus Semua Artikel</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Apakah Anda yakin ingin menghapus <b>semua</b> artikel secara permanen? Seluruh data dan foto thumbnail juga akan dihapus. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Batal
              </Button>
            </DialogClose>
            <Button onClick={onConfirmDeleteAll} disabled={isLoading} className="bg-red-500 font-bold text-white hover:bg-red-600">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Hapus Semua
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
