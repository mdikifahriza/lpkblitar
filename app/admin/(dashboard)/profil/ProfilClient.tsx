"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Camera,
  Eye,
  EyeOff,
  Loader2,
  PencilLine,
  Save,
  Shield,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { uploadFileToSupabase } from "@/app/admin/upload-action";
import { updateOwnProfile } from "./actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Nama lengkap wajib diisi."),
  username: z
    .string()
    .trim()
    .min(3, "Username minimal 3 karakter.")
    .regex(/^[a-z0-9._-]+$/, "Username hanya boleh berisi huruf kecil, angka, titik, garis bawah, atau strip."),
  email: z.string().trim().email("Email tidak valid."),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^[0-9+\-\s]+$/.test(value), {
      message: "Nomor HP hanya boleh berisi angka dan simbol umum telepon.",
    }),
  password: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || value.length >= 6, {
      message: "Kata sandi minimal 6 karakter.",
    }),
});

type ProfileState = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl: string;
};

function ProfileField({
  label,
  value,
  className,
  children,
}: {
  label: string;
  value?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </Label>
      {children || (
        <div className="flex min-h-11 items-center rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground shadow-sm">
          {value || "-"}
        </div>
      )}
    </div>
  );
}

const getRoleLabel = (role: string) => {
  return role === "superadmin" ? "Superadmin" : "Admin";
};

export function ProfilClient({ initialProfile }: { initialProfile: ProfileState }) {
  const router = useRouter();
  const previewUrlRef = useRef<string | null>(null);

  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [formData, setFormData] = useState({
    ...initialProfile,
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(initialProfile.avatarUrl || "");

  const revokePreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const resetForm = (nextProfile: ProfileState) => {
    revokePreviewUrl();
    setFormData({
      ...nextProfile,
      password: "",
    });
    setPhotoPreview(nextProfile.avatarUrl || "");
    setSelectedFile(null);
    setShowPassword(false);
  };

  useEffect(() => {
    return () => {
      revokePreviewUrl();
    };
  }, []);

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format file harus gambar.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB.");
      return;
    }

    revokePreviewUrl();
    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setSelectedFile(file);
    setPhotoPreview(objectUrl);
  };

  const handleCancel = () => {
    resetForm(savedProfile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const parsed = profileSchema.safeParse({
      fullName: formData.fullName,
      username: formData.username.toLowerCase(),
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Data profil tidak valid.");
      return;
    }

    setIsSaving(true);

      try {
        let finalAvatarUrl = savedProfile.avatarUrl || "";

        if (selectedFile) {
          setIsUploading(true);
          const fileExt = selectedFile.name.split(".").pop();
          const fileName = `profil/admin-avatar-${crypto.randomUUID()}.${fileExt}`;

          const uploadFormData = new FormData();
          uploadFormData.append("file", selectedFile);
          uploadFormData.append("path", fileName);

        const uploadResult = await uploadFileToSupabase(uploadFormData);

        if ("error" in uploadResult) {
          throw new Error(uploadResult.error);
        }

        finalAvatarUrl = uploadResult.url;
      }

      const result = await updateOwnProfile({
        nama_lengkap: parsed.data.fullName,
        username: parsed.data.username,
        email: parsed.data.email,
        no_hp: parsed.data.phone || "",
        password: parsed.data.password || "",
        foto_url: finalAvatarUrl,
        previous_foto_url: savedProfile.avatarUrl || "",
      });

      if (result.error) {
        throw new Error(result.error);
      }

      const nextProfile = {
        ...savedProfile,
        fullName: parsed.data.fullName,
        username: parsed.data.username,
        email: parsed.data.email,
        phone: parsed.data.phone || "",
        avatarUrl: finalAvatarUrl,
      };

      setSavedProfile(nextProfile);
      resetForm(nextProfile);
      setIsEditing(false);
      toast.success("Profil berhasil diperbarui.");
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Gagal memperbarui profil.");
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-8">
      <AdminPageHeader title="Profil Administrator" />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <section className="rounded-[1.5rem] border border-border/70 bg-card p-6 shadow-lg">
          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-muted shadow-[0_18px_45px_-30px_rgba(0,0,0,0.45)]">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt={formData.fullName || "Avatar"}
                    fill
                    sizes="144px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>

              {isEditing ? (
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-1 right-1 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-[1.04]"
                >
                  {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                </label>
              ) : null}

              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoSelect}
                disabled={isUploading || isSaving}
              />
            </div>

            <div className="space-y-3 text-center">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  {(isEditing ? formData.fullName : savedProfile.fullName) || "Administrator"}
                </h2>
                <div className="mt-3 flex justify-center">
                  <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1">
                    <Shield className="h-3.5 w-3.5" />
                    {getRoleLabel(savedProfile.role)}
                  </Badge>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 pt-2">
                <Button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  disabled={isSaving || isUploading}
                  className="w-full rounded-xl font-semibold"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditing ? <Save className="h-4 w-4" /> : <PencilLine className="h-4 w-4" />}
                  {isEditing ? "Simpan" : "Edit"}
                </Button>
                {isEditing ? (
                  <Button variant="ghost" onClick={handleCancel} className="w-full rounded-xl">
                    Batal
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border/70 bg-card p-6 shadow-lg">
          <div className="grid gap-5 md:grid-cols-2">
            <ProfileField label="Nama Lengkap" value={isEditing ? undefined : savedProfile.fullName}>
              {isEditing ? (
                <Input
                  value={formData.fullName}
                  onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))}
                  placeholder="Nama lengkap"
                />
              ) : null}
            </ProfileField>

            <ProfileField
              label="Username"
              value={isEditing ? undefined : savedProfile.username ? `@${savedProfile.username}` : "-"}
            >
              {isEditing ? (
                <Input
                  value={formData.username}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      username: event.target.value.toLowerCase().replace(/\s/g, ""),
                    }))
                  }
                  placeholder="username"
                />
              ) : null}
            </ProfileField>

            <ProfileField label="Email" value={isEditing ? undefined : savedProfile.email}>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  placeholder="Email"
                />
              ) : null}
            </ProfileField>

            <ProfileField label="Nomor HP" value={isEditing ? undefined : savedProfile.phone || "-"}>
              {isEditing ? (
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="Nomor HP"
                />
              ) : null}
            </ProfileField>

            <ProfileField label="Hak Akses">
              <div className="flex min-h-11 items-center rounded-xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm">
                {getRoleLabel(savedProfile.role)}
              </div>
            </ProfileField>

            <ProfileField label="Kata Sandi">
              {isEditing ? (
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                    placeholder="Kosongkan jika tidak ingin mengubah"
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              ) : (
                <div className="flex min-h-11 items-center rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground shadow-sm">
                  ********
                </div>
              )}
            </ProfileField>
          </div>
        </section>
      </div>
    </div>
  );
}
