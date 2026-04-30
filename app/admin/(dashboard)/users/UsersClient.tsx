"use client";

import { useState, useRef } from "react";
import { Plus, Search, Edit, Trash2, Loader2, User, Eye, EyeOff, Camera } from "lucide-react";
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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SafeImage } from "@/components/ui/safe-image";
import { MobileCard, MobileCardList } from "@/components/ui/mobile-card";
import { upsertUser, deleteUser } from "./actions";
import { uploadFileToSupabase } from "@/app/admin/upload-action";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

type UserItem = {
  id: string;
  nama_lengkap: string;
  username: string;
  email: string;
  role: string;
  no_hp?: string | null;
  foto_url?: string | null;
};

type UserFormState = {
  id: string | null;
  nama_lengkap: string;
  username: string;
  email: string;
  password: string;
  role: string;
  no_hp: string;
  foto_url: string;
};

export function UsersClient({
  initialUsers,
  currentUserId,
}: {
  initialUsers: UserItem[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // States for handling photo preview and upload separately
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<UserFormState>({
    id: null,
    nama_lengkap: "",
    username: "",
    email: "",
    password: "",
    role: "admin",
    no_hp: "",
    foto_url: ""
  });
  
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredUsers = initialUsers.filter((u) => 
    u.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) || 
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const resetPhotoState = () => {
    setPhotoPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      nama_lengkap: "",
      username: "",
      email: "",
      password: "",
      role: "admin",
      no_hp: "",
      foto_url: ""
    });
    setShowPassword(false);
    resetPhotoState();
    setIsDialogOpen(true);
  };

  const handleEdit = (user: UserItem) => {
    setFormData({
      ...user,
      no_hp: user.no_hp || "",
      foto_url: user.foto_url || "",
      password: "",
    });
    setShowPassword(false);
    resetPhotoState();
    setPhotoPreview(user.foto_url || null);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format file harus gambar");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);
  };

  const onSubmit = async () => {
    setIsLoading(true);

    if (!formData.id && (!formData.password || !formData.email)) {
      toast.error("Email dan Kata Sandi wajib diisi untuk pengguna baru!");
      setIsLoading(false);
      return;
    }

    let finalFotoUrl = formData.foto_url;

    // 1. Upload photo if selected
    if (selectedFile) {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `users/user-${Date.now()}.${fileExt}`;
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);
      uploadFormData.append("path", fileName);

      toast.info("Mengunggah foto...");
      const result = await uploadFileToSupabase(uploadFormData);

      if ("error" in result) {
        toast.error("Gagal mengunggah foto: " + result.error);
        setIsLoading(false);
        return;
      }
      finalFotoUrl = result.url;
    }

    // 2. Save user data
    const dataToSave = {
      ...formData,
      foto_url: finalFotoUrl,
      previous_foto_url: formData.id ? formData.foto_url || "" : "",
    };
    
    const { error } = await upsertUser(dataToSave);
    if (error) {
      toast.error(error);
    } else {
      toast.success(formData.id ? "Data pengguna diperbarui" : "Pengguna baru ditambahkan");
      setIsDialogOpen(false);
      router.refresh();
    }
    
    // Revoke object url to avoid memory leaks
    if (selectedFile && photoPreview) {
       URL.revokeObjectURL(photoPreview);
    }
    setIsLoading(false);
  };

  const onConfirmDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    const { error } = await deleteUser(deleteId);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Pengguna beserta foto profil berhasil dihapus");
      setIsDeleteDialogOpen(false);
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Manajemen Pengguna"
        action={
          <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
            <Plus className="w-4 h-4 mr-2" /> Tambah Pengguna
          </Button>
        }
      />

      <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        <div className="mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama, email, atau username..."
              className="pl-9 bg-background border-border text-foreground focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="hidden md:block rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-background">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium w-[80px]">Foto</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[30%]">Nama Lengkap & Username</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[25%]">Email & Kontak</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[15%]">Role / Hak Akses</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Tidak ada data pengguna ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => (
                  <TableRow key={u.id} className="border-border hover:bg-muted transition-colors">
                    <TableCell>
                      <div className="w-10 h-10 rounded-full border border-border bg-background overflow-hidden flex items-center justify-center">
                        {u.foto_url ? (
                          <SafeImage src={u.foto_url} alt={u.nama_lengkap} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground mb-1 flex items-center gap-2">
                        {u.nama_lengkap}
                        {u.id === currentUserId && (
                          <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-[9px] px-1.5 py-0">Anda</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">@{u.username}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground mb-1">{u.email}</div>
                      <div className="text-xs text-muted-foreground">{u.no_hp || "-"}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${u.role === 'superadmin' ? 'text-primary border-primary/30 bg-primary/10' : 'text-foreground border-border bg-muted'}`}>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(u)} className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteConfirm(u.id)} 
                          disabled={u.id === currentUserId}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                        >
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

        {/* Mobile View */}
        <MobileCardList>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground border border-border rounded-xl bg-card">
              Tidak ada data pengguna ditemukan
            </div>
          ) : (
            filteredUsers.map((u) => (
              <MobileCard
                key={u.id}
                avatar={
                  <div className="w-12 h-12 rounded-full border border-border bg-background overflow-hidden flex items-center justify-center">
                    {u.foto_url ? (
                      <SafeImage src={u.foto_url} alt={u.nama_lengkap} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                }
                title={
                  <div className="flex items-center gap-2">
                    <span className="truncate">{u.nama_lengkap}</span>
                    {u.id === currentUserId && (
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-[9px] px-1.5 py-0 shrink-0">Anda</Badge>
                    )}
                  </div>
                }
                subtitle={`@${u.username}`}
                badges={
                  <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${u.role === "superadmin" ? "text-primary border-primary/30 bg-primary/10" : "text-foreground border-border bg-muted"}`}>
                    {u.role}
                  </Badge>
                }
                viewTitle="Detail Pengguna"
                viewContent={
                  <div className="space-y-4">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-24 h-24 rounded-full border-2 border-border bg-background overflow-hidden flex items-center justify-center">
                        {u.foto_url ? (
                          <SafeImage src={u.foto_url} alt={u.nama_lengkap} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 border-b border-border">
                      <span className="text-muted-foreground text-sm">Nama</span>
                      <span className="col-span-2 text-foreground font-medium">{u.nama_lengkap}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 border-b border-border">
                      <span className="text-muted-foreground text-sm">Username</span>
                      <span className="col-span-2 text-foreground font-medium">@{u.username}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 border-b border-border">
                      <span className="text-muted-foreground text-sm">Email</span>
                      <span className="col-span-2 text-foreground font-medium break-all">{u.email}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 border-b border-border">
                      <span className="text-muted-foreground text-sm">No. HP</span>
                      <span className="col-span-2 text-foreground font-medium">{u.no_hp || "-"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2 border-b border-border">
                      <span className="text-muted-foreground text-sm">Hak Akses</span>
                      <span className="col-span-2 text-foreground font-medium uppercase">{u.role}</span>
                    </div>
                  </div>
                }
                actions={
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(u)} className="text-muted-foreground hover:text-primary border-border bg-background">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteConfirm(u.id)} 
                      disabled={u.id === currentUserId}
                      className="text-muted-foreground hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 border-border bg-background disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus
                    </Button>
                  </>
                }
              />
            ))
          )}
        </MobileCardList>
      </div>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-primary">
              {formData.id ? "Edit Pengguna" : "Tambah Pengguna Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">

            {/* Photo Preview & Selection */}
            <div className="flex items-center gap-6 pb-6 border-b border-border">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-full border border-border bg-background overflow-hidden flex items-center justify-center">
                  {photoPreview ? (
                    <SafeImage src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <label 
                  htmlFor="user-photo-upload" 
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <Camera className="w-6 h-6 text-white" />
                </label>
                <input 
                  id="user-photo-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handlePhotoSelect}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Klik ikon kamera untuk memilih foto. Rekomendasi ukuran 1:1.<br/>
                Foto baru akan diunggah saat Anda menyimpan perubahan.
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Nama Lengkap *</Label>
              <Input className="col-span-3 bg-background border-border text-foreground focus-visible:ring-primary" 
                value={formData.nama_lengkap} onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Username *</Label>
              <Input className="col-span-3 bg-background border-border text-foreground focus-visible:ring-primary font-mono" 
                disabled={!!formData.id} // Cannot change username after creation easily without breaking unique constraints securely
                placeholder="misal: admin1"
                value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Email Pribadi *</Label>
              <Input type="email" className="col-span-3 bg-background border-border text-foreground focus-visible:ring-primary" 
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Nomor HP</Label>
              <Input type="tel" className="col-span-3 bg-background border-border text-foreground focus-visible:ring-primary" 
                value={formData.no_hp} onChange={(e) => setFormData({...formData, no_hp: e.target.value})} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Kata Sandi {formData.id ? '(Opsional)' : '*'}</Label>
              <div className="col-span-3 relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  className="bg-background border-border text-foreground focus-visible:ring-primary pr-10" 
                  placeholder={formData.id ? "Kosongkan jika tidak ingin mengubah sandi" : "Minimal 6 karakter"}
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-muted-foreground">Hak Akses</Label>
              <div className="col-span-3">
                <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                  <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary">
                    <SelectValue placeholder="Pilih hak akses" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border text-foreground">
                    <SelectItem value="admin" className="focus:bg-primary/20 focus:text-primary">Admin Biasa</SelectItem>
                    <SelectItem value="superadmin" className="focus:bg-primary/20 focus:text-primary font-bold">Superadmin</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong className="text-primary">Superadmin:</strong> Memiliki kontrol penuh terhadap pengaturan website dan pengguna lain.<br/>
                  <strong>Admin:</strong> Hanya dapat mengelola konten (Artikel, Layanan, Tim) tanpa akses ke pengaturan pengguna dan web global.
                </p>
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
            <DialogTitle className="font-serif text-2xl text-red-500">Hapus Pengguna</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Apakah Anda yakin ingin menghapus pengguna ini? Semua akses login pengguna tersebut dan data foto profilnya akan dicabut dan dihapus secara permanen.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Batal</Button>
            </DialogClose>
            <Button onClick={onConfirmDelete} disabled={isLoading} className="bg-red-500 hover:bg-red-600 text-white font-bold">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Hapus Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


