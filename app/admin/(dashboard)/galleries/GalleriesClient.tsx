"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Camera,
  ExternalLink,
  Image as ImageIcon,
  Images,
  Loader2,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { uploadFileToSupabase } from "@/app/admin/upload-action";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaPreview } from "@/components/ui/media-preview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  GALLERY_CATEGORY_OPTIONS,
  type GalleryItemRecord,
  type GalleryRecord,
  getGalleryCategoryLabel,
  getGalleryCoverUrl,
  slugifyGalleryTitle,
} from "@/lib/gallery";
import {
  deleteGallery,
  deleteGalleryItem,
  deleteAllGalleries,
  toggleGalleryStatus,
  upsertGallery,
  upsertGalleryItem,
} from "./actions";

type GalleryFormState = {
  id: string | null;
  judul: string;
  slug: string;
  kategori: string;
  deskripsi: string;
  cover_url: string;
  nomor_urut: number;
  published: boolean;
  published_at: string | null;
};

type GalleryItemFormState = {
  id: string | null;
  gallery_id: string;
  image_url: string;
  caption: string;
  alt_text: string;
  nomor_urut: number;
  featured: boolean;
};

function createEmptyGalleryForm(nextOrder: number): GalleryFormState {
  return {
    id: null,
    judul: "",
    slug: "",
    kategori: GALLERY_CATEGORY_OPTIONS[0]?.value ?? "kegiatan-kantor",
    deskripsi: "",
    cover_url: "",
    nomor_urut: nextOrder,
    published: true,
    published_at: null,
  };
}

function createEmptyGalleryItemForm(galleryId: string, nextOrder: number): GalleryItemFormState {
  return {
    id: null,
    gallery_id: galleryId,
    image_url: "",
    caption: "",
    alt_text: "",
    nomor_urut: nextOrder,
    featured: false,
  };
}

function getNextAlbumOrder(galleries: GalleryRecord[]) {
  return galleries.length > 0 ? Math.max(...galleries.map((gallery) => gallery.nomor_urut || 0)) + 1 : 1;
}

function getNextPhotoOrder(gallery: GalleryRecord | null) {
  return gallery?.gallery_items.length
    ? Math.max(...gallery.gallery_items.map((item) => item.nomor_urut || 0)) + 1
    : 1;
}

function buildStoragePath(folder: "cover" | "item", file: File) {
  const fileExt = file.name.split(".").pop() || "jpg";
  return `galeri/${folder}/${crypto.randomUUID()}.${fileExt}`;
}

export function GalleriesClient({
  initialGalleries,
  tableReady,
}: {
  initialGalleries: GalleryRecord[];
  tableReady: boolean;
}) {
  const router = useRouter();
  const coverPreviewUrlRef = useRef<string | null>(null);
  const itemPreviewUrlRef = useRef<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const itemInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedGalleryId, setSelectedGalleryId] = useState(initialGalleries[0]?.id ?? "");
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [isGalleryDeleteDialogOpen, setIsGalleryDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isItemDeleteDialogOpen, setIsItemDeleteDialogOpen] = useState(false);
  const [isSavingGallery, setIsSavingGallery] = useState(false);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [itemPreview, setItemPreview] = useState<string | null>(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [selectedItemFile, setSelectedItemFile] = useState<File | null>(null);
  const [deleteGalleryId, setDeleteGalleryId] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [galleryFormData, setGalleryFormData] = useState<GalleryFormState>(createEmptyGalleryForm(getNextAlbumOrder(initialGalleries)));
  const [itemFormData, setItemFormData] = useState<GalleryItemFormState>(
    createEmptyGalleryItemForm(initialGalleries[0]?.id ?? "", getNextPhotoOrder(initialGalleries[0] ?? null))
  );

  useEffect(() => {
    return () => {
      if (coverPreviewUrlRef.current) {
        URL.revokeObjectURL(coverPreviewUrlRef.current);
      }

      if (itemPreviewUrlRef.current) {
        URL.revokeObjectURL(itemPreviewUrlRef.current);
      }
    };
  }, []);

  const filteredGalleries = useMemo(() => {
    return initialGalleries.filter((gallery) => {
      const matchesSearch =
        gallery.judul.toLowerCase().includes(search.toLowerCase()) ||
        gallery.slug.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || gallery.kategori === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [categoryFilter, initialGalleries, search]);

  const selectedGallery =
    initialGalleries.find((gallery) => gallery.id === selectedGalleryId) ?? initialGalleries[0] ?? null;

  const totalPhotos = useMemo(
    () => initialGalleries.reduce((total, gallery) => total + gallery.gallery_items.length, 0),
    [initialGalleries]
  );

  const publishedCount = useMemo(
    () => initialGalleries.filter((gallery) => gallery.published).length,
    [initialGalleries]
  );

  const resetCoverState = () => {
    if (coverPreviewUrlRef.current) {
      URL.revokeObjectURL(coverPreviewUrlRef.current);
      coverPreviewUrlRef.current = null;
    }

    setCoverPreview(null);
    setSelectedCoverFile(null);

    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const resetItemState = () => {
    if (itemPreviewUrlRef.current) {
      URL.revokeObjectURL(itemPreviewUrlRef.current);
      itemPreviewUrlRef.current = null;
    }

    setItemPreview(null);
    setSelectedItemFile(null);

    if (itemInputRef.current) {
      itemInputRef.current.value = "";
    }
  };

  const handleAddGallery = () => {
    setGalleryFormData(createEmptyGalleryForm(getNextAlbumOrder(initialGalleries)));
    resetCoverState();
    setIsGalleryDialogOpen(true);
  };

  const handleEditGallery = (gallery: GalleryRecord) => {
    setGalleryFormData({
      id: gallery.id,
      judul: gallery.judul,
      slug: gallery.slug,
      kategori: gallery.kategori,
      deskripsi: gallery.deskripsi || "",
      cover_url: gallery.cover_url || "",
      nomor_urut: gallery.nomor_urut,
      published: gallery.published,
      published_at: gallery.published_at,
    });
    resetCoverState();
    setCoverPreview(gallery.cover_url || getGalleryCoverUrl(gallery));
    setIsGalleryDialogOpen(true);
  };

  const handleCoverSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Format cover harus berupa gambar.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Ukuran cover maksimal 3MB.");
      return;
    }

    if (coverPreviewUrlRef.current) {
      URL.revokeObjectURL(coverPreviewUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    coverPreviewUrlRef.current = objectUrl;
    setSelectedCoverFile(file);
    setCoverPreview(objectUrl);
  };

  const handleSaveGallery = async () => {
    setIsSavingGallery(true);

    try {
      let finalCoverUrl = galleryFormData.cover_url || "";

      if (selectedCoverFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedCoverFile);
        uploadFormData.append("path", buildStoragePath("cover", selectedCoverFile));

        const uploadResult = await uploadFileToSupabase(uploadFormData);

        if ("error" in uploadResult) {
          throw new Error(uploadResult.error);
        }

        finalCoverUrl = uploadResult.url;
      }

      const { error } = await upsertGallery({
        ...galleryFormData,
        cover_url: finalCoverUrl,
        previous_cover_url: galleryFormData.id ? galleryFormData.cover_url || "" : "",
        previous_slug: galleryFormData.id ? galleryFormData.slug : "",
      });

      if (error) {
        toast.error(error);
        return;
      }

      toast.success(galleryFormData.id ? "Album galeri diperbarui." : "Album galeri ditambahkan.");
      setIsGalleryDialogOpen(false);
      resetCoverState();
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan album galeri.");
    } finally {
      setIsSavingGallery(false);
    }
  };

  const handleDeleteGalleryConfirm = (galleryId: string) => {
    setDeleteGalleryId(galleryId);
    setIsGalleryDeleteDialogOpen(true);
  };

  const handleDeleteGallery = async () => {
    if (!deleteGalleryId) {
      return;
    }

    setIsSavingGallery(true);
    const { error } = await deleteGallery(deleteGalleryId);

    setIsSavingGallery(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Album galeri dihapus.");
      setIsGalleryDeleteDialogOpen(false);
      setDeleteGalleryId(null);
      if (selectedGalleryId === deleteGalleryId) {
         setSelectedGalleryId(initialGalleries[0]?.id ?? "");
      }
      router.refresh();
    }
  };

  const handleDeleteAllGalleries = async () => {
    setIsSavingGallery(true);
    const { error } = await deleteAllGalleries();
    setIsSavingGallery(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Semua album galeri dihapus.");
      setIsDeleteAllDialogOpen(false);
      setSelectedGalleryId("");
      router.refresh();
    }
  };

  const handleToggleGalleryStatus = async (galleryId: string, currentStatus: boolean) => {
    const { error } = await toggleGalleryStatus(galleryId, !currentStatus);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Status album diperbarui.");
    router.refresh();
  };

  const handleAddItem = () => {
    if (!selectedGallery) {
      toast.error("Pilih album galeri terlebih dahulu.");
      return;
    }

    setItemFormData(createEmptyGalleryItemForm(selectedGallery.id, getNextPhotoOrder(selectedGallery)));
    resetItemState();
    setIsItemDialogOpen(true);
  };

  const handleEditItem = (item: GalleryItemRecord) => {
    setItemFormData({
      id: item.id,
      gallery_id: item.gallery_id,
      image_url: item.image_url,
      caption: item.caption || "",
      alt_text: item.alt_text || "",
      nomor_urut: item.nomor_urut,
      featured: item.featured,
    });
    resetItemState();
    setItemPreview(item.image_url);
    setIsItemDialogOpen(true);
  };

  const handleItemSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Format foto harus berupa gambar.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 4MB.");
      return;
    }

    if (itemPreviewUrlRef.current) {
      URL.revokeObjectURL(itemPreviewUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    itemPreviewUrlRef.current = objectUrl;
    setSelectedItemFile(file);
    setItemPreview(objectUrl);
  };

  const handleSaveItem = async () => {
    if (!selectedGallery) {
      toast.error("Album galeri tidak ditemukan.");
      return;
    }

    setIsSavingItem(true);

    try {
      let finalImageUrl = itemFormData.image_url || "";

      if (selectedItemFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedItemFile);
        uploadFormData.append("path", buildStoragePath("item", selectedItemFile));

        const uploadResult = await uploadFileToSupabase(uploadFormData);

        if ("error" in uploadResult) {
          throw new Error(uploadResult.error);
        }

        finalImageUrl = uploadResult.url;
      }

      const { error } = await upsertGalleryItem({
        ...itemFormData,
        gallery_id: selectedGallery.id,
        image_url: finalImageUrl,
        previous_image_url: itemFormData.id ? itemFormData.image_url || "" : "",
      });

      if (error) {
        toast.error(error);
        return;
      }

      toast.success(itemFormData.id ? "Foto galeri diperbarui." : "Foto galeri ditambahkan.");
      setIsItemDialogOpen(false);
      resetItemState();
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan foto galeri.");
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleDeleteItemConfirm = (itemId: string) => {
    setDeleteItemId(itemId);
    setIsItemDeleteDialogOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!deleteItemId) {
      return;
    }

    setIsSavingItem(true);
    const { error } = await deleteGalleryItem(deleteItemId);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Foto galeri dihapus.");
      setIsItemDeleteDialogOpen(false);
      router.refresh();
    }

    setIsSavingItem(false);
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Galeri"
          action={
            <div className="flex gap-2">
              <Button onClick={() => setIsDeleteAllDialogOpen(true)} variant="destructive" className="font-bold" disabled={initialGalleries.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Semua
              </Button>
              <Button onClick={handleAddGallery} className="font-bold">
                <Plus className="mr-2 h-4 w-4" />
                Album Baru
              </Button>
            </div>
          }
      />

      {!tableReady ? (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Tabel galeri belum siap</AlertTitle>
          <AlertDescription>
            Jalankan migration <code>20260430_163000_create_galleries.sql</code> dulu supaya modul galeri bisa dipakai.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Images className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Album</p>
              <h2 className="text-2xl font-semibold text-foreground">{initialGalleries.length}</h2>
            </div>
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Foto</p>
              <h2 className="text-2xl font-semibold text-foreground">{totalPhotos}</h2>
            </div>
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Album Publik</p>
              <h2 className="text-2xl font-semibold text-foreground">{publishedCount}</h2>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari judul atau slug album..."
                className="pl-9"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-56">
                <SelectValue placeholder="Semua kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua kategori</SelectItem>
                {GALLERY_CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Album</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Foto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGalleries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                      Belum ada album yang cocok dengan filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGalleries.map((gallery) => (
                    <TableRow
                      key={gallery.id}
                      className={selectedGallery?.id === gallery.id ? "bg-primary/5" : undefined}
                    >
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => setSelectedGalleryId(gallery.id)}
                          className="flex items-center gap-4 text-left"
                        >
                            <div className="h-14 w-20 overflow-hidden rounded-xl border border-border bg-muted">
                              <MediaPreview
                                key={getGalleryCoverUrl(gallery)}
                                src={getGalleryCoverUrl(gallery)}
                                alt={gallery.judul}
                                className="h-full w-full object-cover"
                                showPlayIcon={true}
                              />
                            </div>
                          <div>
                            <p className="font-medium text-foreground">{gallery.judul}</p>
                            <p className="text-xs text-muted-foreground">/{gallery.slug}</p>
                          </div>
                        </button>
                      </TableCell>
                      <TableCell>{getGalleryCategoryLabel(gallery.kategori)}</TableCell>
                      <TableCell>{gallery.gallery_items.length}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            gallery.published
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                              : "border-border bg-muted text-muted-foreground"
                          }
                        >
                          {gallery.published ? "Publik" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedGalleryId(gallery.id)}
                          >
                            Kelola Foto
                          </Button>
                          <Button type="button" variant="outline" size="icon" onClick={() => handleEditGallery(gallery)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleGalleryStatus(gallery.id, gallery.published)}
                          >
                            {gallery.published ? "Jadikan Draft" : "Publikasikan"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-500"
                            onClick={() => handleDeleteGalleryConfirm(gallery.id)}
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
            {filteredGalleries.map((gallery) => (
              <MobileCard
                key={gallery.id}
                  avatar={
                    <div className="h-14 w-14 overflow-hidden rounded-xl border border-border bg-muted group relative">
                      <MediaPreview
                        key={getGalleryCoverUrl(gallery)}
                        src={getGalleryCoverUrl(gallery)}
                        alt={gallery.judul}
                        className="h-full w-full object-cover"
                        showPlayIcon={true}
                      />
                    </div>
                  }
                title={gallery.judul}
                subtitle={`${getGalleryCategoryLabel(gallery.kategori)} • ${gallery.gallery_items.length} foto`}
                badges={
                  <Badge
                    className={
                      gallery.published
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-border bg-muted text-muted-foreground"
                    }
                  >
                    {gallery.published ? "Publik" : "Draft"}
                  </Badge>
                }
                actions={
                  <>
                    <Button type="button" variant="outline" size="sm" onClick={() => setSelectedGalleryId(gallery.id)}>
                      Kelola
                    </Button>
                    <Button type="button" variant="outline" size="icon" onClick={() => handleEditGallery(gallery)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-500"
                      onClick={() => handleDeleteGalleryConfirm(gallery.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                }
              />
            ))}
          </MobileCardList>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {selectedGallery ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{getGalleryCategoryLabel(selectedGallery.kategori)}</Badge>
                    <Badge variant="outline">{selectedGallery.gallery_items.length} foto</Badge>
                    {selectedGallery.gallery_items.some((item) => item.featured) ? (
                      <Badge className="border-primary/30 bg-primary/10 text-primary">Featured siap</Badge>
                    ) : null}
                  </div>
                  <h2 className="font-serif text-2xl font-semibold text-foreground">{selectedGallery.judul}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {selectedGallery.deskripsi || "Belum ada deskripsi album."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedGallery.published ? (
                    <Button asChild variant="outline">
                      <Link href={`/galeri/${selectedGallery.slug}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Lihat Publik
                      </Link>
                    </Button>
                  ) : null}
                  <Button onClick={handleAddItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Foto
                  </Button>
                </div>
              </div>

                <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                  <MediaPreview
                    key={getGalleryCoverUrl(selectedGallery)}
                    src={getGalleryCoverUrl(selectedGallery)}
                    alt={selectedGallery.judul}
                    className="aspect-[16/8] w-full object-cover"
                  />
                </div>

              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Foto</TableHead>
                      <TableHead>Caption</TableHead>
                      <TableHead>Alt</TableHead>
                      <TableHead>Urut</TableHead>
                      <TableHead>Flag</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedGallery.gallery_items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                          Album ini belum punya foto.
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedGallery.gallery_items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                              <div className="h-16 w-20 overflow-hidden rounded-xl border border-border bg-muted">
                                <MediaPreview
                                  key={item.image_url}
                                  src={item.image_url}
                                  alt={item.alt_text || item.caption || selectedGallery.judul}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </TableCell>
                          <TableCell className="max-w-[220px]">
                            <p className="line-clamp-2 text-sm text-foreground">{item.caption || "-"}</p>
                          </TableCell>
                          <TableCell className="max-w-[220px]">
                            <p className="line-clamp-2 text-sm text-muted-foreground">{item.alt_text || "-"}</p>
                          </TableCell>
                          <TableCell>{item.nomor_urut}</TableCell>
                          <TableCell>
                            {item.featured ? (
                              <Badge className="border-primary/30 bg-primary/10 text-primary">Featured</Badge>
                            ) : (
                              <Badge variant="outline">Normal</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button type="button" variant="outline" size="icon" onClick={() => handleEditItem(item)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="text-red-500 hover:text-red-500"
                                onClick={() => handleDeleteItemConfirm(item.id)}
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
                {selectedGallery.gallery_items.map((item) => (
                  <MobileCard
                    key={item.id}
                      avatar={
                        <div className="h-14 w-14 overflow-hidden rounded-xl border border-border bg-muted group relative">
                          <MediaPreview
                            key={item.image_url}
                            src={item.image_url}
                            alt={item.alt_text || item.caption || selectedGallery.judul}
                            className="h-full w-full object-cover"
                            showPlayIcon={true}
                          />
                        </div>
                      }
                    title={item.caption || "Foto galeri"}
                    subtitle={item.alt_text || "Belum ada alt text"}
                    badges={
                      item.featured ? (
                        <Badge className="border-primary/30 bg-primary/10 text-primary">Featured</Badge>
                      ) : (
                        <Badge variant="outline">Urut {item.nomor_urut}</Badge>
                      )
                    }
                    actions={
                      <>
                        <Button type="button" variant="outline" size="icon" onClick={() => handleEditItem(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-500"
                          onClick={() => handleDeleteItemConfirm(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    }
                  />
                ))}
              </MobileCardList>
            </div>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 text-center">
              <ImageIcon className="mb-4 h-10 w-10 text-muted-foreground" />
              <h2 className="font-serif text-2xl font-semibold text-foreground">Belum ada album dipilih</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Pilih album dari daftar di kiri atau buat album baru untuk mulai mengelola foto galeri.
              </p>
            </div>
          )}
        </section>
      </div>

      <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{galleryFormData.id ? "Edit Album Galeri" : "Album Galeri Baru"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-2 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="gallery-judul">Judul Album</Label>
                <Input
                  id="gallery-judul"
                  value={galleryFormData.judul}
                  onChange={(event) => {
                    const judul = event.target.value;

                    setGalleryFormData((current) => ({
                      ...current,
                      judul,
                      slug: current.id ? current.slug : slugifyGalleryTitle(judul),
                    }));
                  }}
                  placeholder="Contoh: Kegiatan Konsultasi & Edukasi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gallery-slug">Slug</Label>
                <Input
                  id="gallery-slug"
                  value={galleryFormData.slug}
                  onChange={(event) =>
                    setGalleryFormData((current) => ({
                      ...current,
                      slug: slugifyGalleryTitle(event.target.value),
                    }))
                  }
                  placeholder="kegiatan-konsultasi-edukasi"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select
                    value={galleryFormData.kategori}
                    onValueChange={(value) => setGalleryFormData((current) => ({ ...current, kategori: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {GALLERY_CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gallery-order">Nomor Urut</Label>
                  <Input
                    id="gallery-order"
                    type="number"
                    value={galleryFormData.nomor_urut}
                    onChange={(event) =>
                      setGalleryFormData((current) => ({
                        ...current,
                        nomor_urut: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gallery-description">Deskripsi</Label>
                <Textarea
                  id="gallery-description"
                  value={galleryFormData.deskripsi}
                  onChange={(event) =>
                    setGalleryFormData((current) => ({
                      ...current,
                      deskripsi: event.target.value,
                    }))
                  }
                  rows={7}
                  placeholder="Deskripsi singkat album untuk halaman detail publik."
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3">
                <div>
                  <p className="font-medium text-foreground">Tampilkan ke publik</p>
                  <p className="text-sm text-muted-foreground">
                    Jika dimatikan, album tetap tersimpan tapi tidak tampil di halaman publik.
                  </p>
                </div>
                <Switch
                  checked={galleryFormData.published}
                  onCheckedChange={(checked) =>
                    setGalleryFormData((current) => ({
                      ...current,
                      published: checked,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                  {coverPreview ? (
                    <MediaPreview
                      key={coverPreview}
                      src={coverPreview}
                      alt="Preview cover album"
                      className="aspect-[4/5] w-full object-cover"
                    />
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <ImageIcon className="mx-auto mb-3 h-8 w-8" />
                      <p className="text-sm">Belum ada cover</p>
                    </div>
                  </div>
                )}
              </div>

              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
              <Button type="button" variant="outline" className="w-full" onClick={() => coverInputRef.current?.click()}>
                <Camera className="mr-2 h-4 w-4" />
                Upload Cover
              </Button>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Jika cover kosong, halaman publik otomatis memakai foto featured atau foto pertama dalam album.
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveGallery} disabled={isSavingGallery}>
              {isSavingGallery ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {galleryFormData.id ? "Simpan Perubahan" : "Simpan Album"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{itemFormData.id ? "Edit Foto Galeri" : "Tambah Foto Galeri"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-2 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                  {itemPreview ? (
                    <MediaPreview
                      key={itemPreview}
                      src={itemPreview}
                      alt="Preview foto galeri"
                      className="aspect-[4/5] w-full object-cover"
                    />
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <ImageIcon className="mx-auto mb-3 h-8 w-8" />
                      <p className="text-sm">Belum ada foto</p>
                    </div>
                  </div>
                )}
              </div>

              <input ref={itemInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleItemSelect} />
              <Button type="button" variant="outline" className="w-full" onClick={() => itemInputRef.current?.click()}>
                <Camera className="mr-2 h-4 w-4" />
                Upload Foto
              </Button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="gallery-item-caption">Caption</Label>
                <Input
                  id="gallery-item-caption"
                  value={itemFormData.caption}
                  onChange={(event) =>
                    setItemFormData((current) => ({
                      ...current,
                      caption: event.target.value,
                    }))
                  }
                  placeholder="Contoh: Sesi pendampingan dan diskusi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gallery-item-alt">Alt Text</Label>
                <Textarea
                  id="gallery-item-alt"
                  value={itemFormData.alt_text}
                  onChange={(event) =>
                    setItemFormData((current) => ({
                      ...current,
                      alt_text: event.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Deskripsi ringkas isi foto untuk aksesibilitas dan SEO gambar."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gallery-item-order">Nomor Urut</Label>
                <Input
                  id="gallery-item-order"
                  type="number"
                  value={itemFormData.nomor_urut}
                  onChange={(event) =>
                    setItemFormData((current) => ({
                      ...current,
                      nomor_urut: Number(event.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3">
                <div>
                  <p className="font-medium text-foreground">Jadikan foto utama</p>
                  <p className="text-sm text-muted-foreground">
                    Foto utama diprioritaskan untuk tampilan album dan halaman detail.
                  </p>
                </div>
                <Switch
                  checked={itemFormData.featured}
                  onCheckedChange={(checked) =>
                    setItemFormData((current) => ({
                      ...current,
                      featured: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveItem} disabled={isSavingItem}>
              {isSavingItem ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {itemFormData.id ? "Simpan Perubahan" : "Simpan Foto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isGalleryDeleteDialogOpen} onOpenChange={setIsGalleryDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Album Galeri</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Album, seluruh foto di dalamnya, dan file gambar terkait akan ikut dihapus.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={handleDeleteGallery} disabled={isSavingGallery}>
              {isSavingGallery ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Hapus Album
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isItemDeleteDialogOpen} onOpenChange={setIsItemDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Foto Galeri</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Foto akan dihapus dari album dan file gambar juga ikut dibersihkan dari storage.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={handleDeleteItem} disabled={isSavingItem}>
              {isSavingItem ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Hapus Foto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Semua Album</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Apakah Anda yakin ingin menghapus <b>seluruh</b> album galeri beserta semua foto dan filenya dari storage? Tindakan ini tidak dapat dibatalkan.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={handleDeleteAllGalleries} disabled={isSavingGallery}>
              {isSavingGallery ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Hapus Semua Album
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
