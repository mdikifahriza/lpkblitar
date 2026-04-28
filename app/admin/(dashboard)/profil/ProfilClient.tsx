"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Loader2, Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import { SafeImage } from "@/components/ui/safe-image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Nama lengkap wajib diisi" }),
});

export function ProfilClient({ user }: { user: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || "",
    },
  });

  const avatarUrl = user?.user_metadata?.avatar_url || "";

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: values.fullName }
      });

      if (error) throw error;
      toast.success("Profil berhasil diperbarui");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
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

    setIsUploading(true);
    toast.info("Mengunggah foto...");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `profil/admin-avatar-${Date.now()}.${fileExt}`;

      // Upload to 'avatars' bucket
      const { data, error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public-assets")
        .upload(fileName, file);

      if (error) {
        // If the bucket doesn't exist, it will throw an error
        throw error;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public-assets")
        .getPublicUrl(fileName);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrlData.publicUrl }
      });

      if (updateError) throw updateError;

      toast.success("Foto profil berhasil diperbarui");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal mengunggah foto. Pastikan bucket 'avatars' sudah ada di Supabase Storage.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Profil Administrator</h1>
        <p className="text-muted-foreground">Kelola identitas akun admin Anda (data ini tidak tampil di publik)</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10 pb-10 border-b border-border">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-[#11151e] bg-background overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <SafeImage src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            <label 
              htmlFor="avatar-upload" 
              className={`absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-foreground animate-spin" />
              ) : (
                <div className="flex flex-col items-center">
                  <Camera className="w-6 h-6 text-foreground mb-1" />
                  <span className="text-[10px] text-foreground uppercase tracking-wider font-bold">Ubah</span>
                </div>
              )}
            </label>
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>
          <div className="flex flex-col justify-center text-center sm:text-left h-full py-2">
            <h3 className="font-serif text-2xl text-foreground font-bold mb-1">{user?.user_metadata?.full_name || "Admin Hutabarat"}</h3>
            <p className="text-muted-foreground font-mono text-sm">{user?.email}</p>
            <p className="text-primary text-xs uppercase tracking-wider font-bold mt-4">Super Administrator</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Nama Tampilan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama lengkap"
                      className="bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-2">Nama ini akan tampil di pojok kanan atas halaman admin.</p>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Profil"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}


