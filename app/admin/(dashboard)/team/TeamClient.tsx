"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Edit, Loader2, Plus, Search, Trash2, User } from "lucide-react";
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
import { SafeImage } from "@/components/ui/safe-image";
import { deleteTeamMember, toggleTeamStatus, upsertTeamMember } from "./actions";

type TeamMember = {
  id: string;
  nama: string;
  jabatan: string;
  spesialisasi?: string | null;
  bio?: string | null;
  foto_url?: string | null;
  is_pimpinan: boolean;
  nomor_urut: number;
  aktif: boolean;
};

type TeamMemberForm = {
  id: string | null;
  nama: string;
  jabatan: string;
  spesialisasi: string;
  bio: string;
  foto_url: string;
  is_pimpinan: boolean;
  nomor_urut: number;
  aktif: boolean;
};

export function TeamClient({ initialTeam }: { initialTeam: TeamMember[] }) {
  const router = useRouter();
  const previewUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<TeamMemberForm>({
    id: null,
    nama: "",
    jabatan: "",
    spesialisasi: "",
    bio: "",
    foto_url: "",
    is_pimpinan: false,
    nomor_urut: 1,
    aktif: true,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredTeam = initialTeam.filter(
    (member) =>
      member.nama?.toLowerCase().includes(search.toLowerCase()) ||
      member.jabatan?.toLowerCase().includes(search.toLowerCase())
  );

  const revokePreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const resetPhotoState = () => {
    revokePreviewUrl();
    setPhotoPreview(null);
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
      nama: "",
      jabatan: "",
      spesialisasi: "",
      bio: "",
      foto_url: "",
      is_pimpinan: false,
      nomor_urut: initialTeam.length + 1,
      aktif: true,
    });
    resetPhotoState();
    setIsDialogOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setFormData({
      id: member.id,
      nama: member.nama,
      jabatan: member.jabatan,
      spesialisasi: member.spesialisasi || "",
      bio: member.bio || "",
      foto_url: member.foto_url || "",
      is_pimpinan: member.is_pimpinan,
      nomor_urut: member.nomor_urut,
      aktif: member.aktif,
    });
    resetPhotoState();
    setPhotoPreview(member.foto_url || null);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    setPhotoPreview(objectUrl);
  };

  const onSubmit = async () => {
    setIsLoading(true);

      try {
        let finalFotoUrl = formData.foto_url || "";

        if (selectedFile) {
          setIsUploading(true);
          const fileExt = selectedFile.name.split(".").pop();
          const fileName = `team/team-${crypto.randomUUID()}.${fileExt}`;
          const uploadFormData = new FormData();
          uploadFormData.append("file", selectedFile);
          uploadFormData.append("path", fileName);

        const uploadResult = await uploadFileToSupabase(uploadFormData);

        if ("error" in uploadResult) {
          throw new Error(uploadResult.error);
        }

        finalFotoUrl = uploadResult.url;
      }

      const { error } = await upsertTeamMember({
        ...formData,
        foto_url: finalFotoUrl,
        previous_foto_url: formData.id ? formData.foto_url || "" : "",
      });

      if (error) {
        toast.error(error);
      } else {
        toast.success(formData.id ? "Data anggota diperbarui" : "Anggota ditambahkan");
        setIsDialogOpen(false);
        resetPhotoState();
        router.refresh();
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan anggota tim.");
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
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
      <AdminPageHeader
        title="Manajemen Tim"
        action={
          <Button onClick={handleAdd} className="bg-primary font-bold text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Tambah Anggota
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
        <div className="mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau jabatan..."
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
                <TableHead className="w-[80px] font-medium text-muted-foreground">Foto</TableHead>
                <TableHead className="w-[25%] font-medium text-muted-foreground">Nama Lengkap</TableHead>
                <TableHead className="w-[25%] font-medium text-muted-foreground">Jabatan / Spesialisasi</TableHead>
                <TableHead className="w-[15%] font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-right font-medium text-muted-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeam.length === 0 ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Tidak ada data tim ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeam.map((member) => (
                  <TableRow key={member.id} className="border-border transition-colors hover:bg-muted">
                    <TableCell>
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
                        {member.foto_url ? (
                          <SafeImage src={member.foto_url} alt={member.nama} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="mb-1 flex items-center gap-2 font-bold text-foreground">
                        {member.nama}
                        {member.is_pimpinan ? (
                          <Badge className="border-primary/30 bg-primary/20 px-1.5 py-0 text-[9px] text-primary">
                            Pimpinan
                          </Badge>
                        ) : null}
                      </div>
                      <div className="text-xs text-muted-foreground">Urutan: {member.nomor_urut}</div>
                    </TableCell>
                    <TableCell>
                      <div className="mb-1 text-sm text-foreground">{member.jabatan}</div>
                      <div className="max-w-[250px] truncate text-xs text-muted-foreground">
                        {member.spesialisasi}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={member.aktif}
                          onCheckedChange={() => onToggleStatus(member.id, member.aktif)}
                          className="data-[state=checked]:bg-primary"
                        />
                        <span className="text-sm text-muted-foreground">{member.aktif ? "Aktif" : "Draft"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(member)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteConfirm(member.id)}
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
          {filteredTeam.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-10 text-center text-muted-foreground">
              Tidak ada anggota tim ditemukan
            </div>
          ) : (
            filteredTeam.map((member) => (
              <MobileCard
                key={member.id}
                avatar={
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
                    {member.foto_url ? (
                      <SafeImage src={member.foto_url} alt={member.nama} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                }
                title={
                  <div className="flex items-center gap-2">
                    <span className="line-clamp-1 font-bold text-foreground">{member.nama}</span>
                    {member.is_pimpinan ? (
                      <Badge className="shrink-0 border-primary/30 bg-primary/20 px-1.5 py-0 text-[9px] text-primary">
                        Pimpinan
                      </Badge>
                    ) : null}
                  </div>
                }
                subtitle={<div className="truncate text-xs text-muted-foreground">{member.jabatan}</div>}
                badges={
                  <Badge
                    variant="outline"
                    className={`shrink-0 uppercase tracking-wider ${
                      member.aktif
                        ? "border-green-500/30 bg-green-500/10 text-[9px] text-green-500"
                        : "border-border bg-muted text-[9px] text-muted-foreground"
                    }`}
                  >
                    {member.aktif ? "Aktif" : "Draft"}
                  </Badge>
                }
                viewTitle="Detail Tim Hukum"
                viewContent={
                  <div className="space-y-4">
                    <div className="mb-6 flex items-center justify-center">
                      <div className="flex h-40 w-32 items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
                        {member.foto_url ? (
                          <SafeImage src={member.foto_url} alt={member.nama} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-b border-border py-2">
                      <span className="text-sm text-muted-foreground">Nama Lengkap</span>
                      <span className="col-span-2 flex items-center gap-2 font-bold text-foreground">
                        {member.nama}
                        {member.is_pimpinan ? (
                          <Badge className="shrink-0 border-primary/30 bg-primary/20 px-1.5 py-0 text-[9px] text-primary">
                            Pimpinan
                          </Badge>
                        ) : null}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-b border-border py-2">
                      <span className="text-sm text-muted-foreground">Jabatan</span>
                      <span className="col-span-2 font-medium text-foreground">{member.jabatan}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-b border-border py-2">
                      <span className="text-sm text-muted-foreground">No. Urut</span>
                      <span className="col-span-2 font-medium text-foreground">{member.nomor_urut}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-b border-border py-2">
                      <span className="text-sm text-muted-foreground">Status Publikasi</span>
                      <span className="col-span-2">{member.aktif ? "Aktif (Tampil di Web)" : "Draft (Tersimpan)"}</span>
                    </div>
                    <div className="pt-4">
                      <span className="mb-2 block text-sm text-muted-foreground">Spesialisasi:</span>
                      <div className="rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-foreground">
                        {member.spesialisasi || <span className="italic text-muted-foreground">Kosong</span>}
                      </div>
                    </div>
                    <div className="pt-4">
                      <span className="mb-2 block text-sm text-muted-foreground">Bio Singkat:</span>
                      <div className="max-h-[300px] overflow-y-auto whitespace-pre-wrap rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-foreground">
                        {member.bio || <span className="italic text-muted-foreground">Kosong</span>}
                      </div>
                    </div>
                  </div>
                }
                actions={
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(member)}
                      className="border-border bg-background text-muted-foreground hover:text-primary"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteConfirm(member.id)}
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
            resetPhotoState();
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-primary">
              {formData.id ? "Edit Anggota Tim" : "Tambah Anggota Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex items-center gap-6 border-b border-border pb-6">
              <div className="relative shrink-0 group">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
                  {photoPreview ? (
                    <SafeImage src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <label
                  htmlFor="photo-upload"
                  className={`absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/60 transition-opacity ${
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
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handlePhotoSelect}
                  disabled={isUploading || isLoading}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Klik ikon kamera untuk memilih foto. Foto baru akan diunggah saat Anda menyimpan perubahan.
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Nama Lengkap</Label>
              <Input
                className="col-span-3 bg-background text-foreground focus-visible:ring-primary"
                value={formData.nama}
                onChange={(event) => setFormData({ ...formData, nama: event.target.value })}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Jabatan</Label>
              <Input
                className="col-span-3 bg-background text-foreground focus-visible:ring-primary"
                placeholder="Contoh: Lawyer Litigasi"
                value={formData.jabatan}
                onChange={(event) => setFormData({ ...formData, jabatan: event.target.value })}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Spesialisasi</Label>
              <Input
                className="col-span-3 bg-background text-foreground focus-visible:ring-primary"
                placeholder="Contoh: Gugatan PMH, Wanprestasi"
                value={formData.spesialisasi}
                onChange={(event) => setFormData({ ...formData, spesialisasi: event.target.value })}
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="mt-3 text-right text-muted-foreground">Bio Singkat</Label>
              <Textarea
                className="col-span-3 min-h-[100px] bg-background text-foreground focus-visible:ring-primary"
                value={formData.bio}
                onChange={(event) => setFormData({ ...formData, bio: event.target.value })}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Tandai Pimpinan</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  checked={formData.is_pimpinan}
                  onCheckedChange={(value) => setFormData({ ...formData, is_pimpinan: value })}
                  className="data-[state=checked]:bg-primary"
                />
                <span className="text-sm text-muted-foreground">
                  Jika Ya, akan ditampilkan lebih besar di atas grid tim.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 grid grid-cols-3 items-center gap-4 md:col-span-1">
                <Label className="text-right text-muted-foreground">Nomor Urut</Label>
                <Input
                  type="number"
                  className="col-span-2 bg-background text-foreground focus-visible:ring-primary"
                  value={formData.nomor_urut}
                  onChange={(event) =>
                    setFormData({ ...formData, nomor_urut: parseInt(event.target.value, 10) || 0 })
                  }
                />
              </div>
              <div className="col-span-2 grid grid-cols-3 items-center gap-4 md:col-span-1">
                <Label className="text-right text-muted-foreground">Status Publikasi</Label>
                <div className="col-span-2 flex items-center space-x-2">
                  <Switch
                    checked={formData.aktif}
                    onCheckedChange={(value) => setFormData({ ...formData, aktif: value })}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
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
              disabled={isLoading || isUploading}
              className="bg-primary font-bold text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="border-border bg-card text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-red-400">Hapus Anggota</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Apakah Anda yakin ingin menghapus data anggota ini? Tindakan ini tidak dapat dibatalkan.
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
    </div>
  );
}
