"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Settings2, Globe, MessageCircle, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { createBrowserClient } from "@supabase/ssr";
import { SafeImage } from "@/components/ui/safe-image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateSiteSettings } from "./actions";

// Zod schemas for different tabs
const identitasSchema = z.object({
  site_name: z.string().min(1, "Nama wajib diisi"),
  site_tagline: z.string().optional(),
  site_description: z.string().optional(),
});

const heroSchema = z.object({
  hero_badge: z.string().optional(),
  hero_heading: z.string().min(1, "Heading hero wajib diisi"),
  hero_subheading: z.string().optional(),
  hero_cta_primary: z.string().optional(),
  hero_cta_secondary: z.string().optional(),
});

const kontakSchema = z.object({
  whatsapp_number: z.string().min(1, "Nomor WhatsApp wajib diisi"),
  whatsapp_message_default: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  alamat: z.string().optional(),
  jam_operasional: z.string().optional(),
});

const seoSchema = z.object({
  tab_title: z.string().min(1, "Judul tab wajib diisi"),
  google_analytics_id: z.string().optional(),
  google_verification: z.string().optional(),
});

export function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(initialSettings.logo_url || "");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Forms
  const identitasForm = useForm<z.infer<typeof identitasSchema>>({
    resolver: zodResolver(identitasSchema),
    defaultValues: {
      site_name: initialSettings.site_name || "",
      site_tagline: initialSettings.site_tagline || "",
      site_description: initialSettings.site_description || "",
    },
  });

  const heroForm = useForm<z.infer<typeof heroSchema>>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      hero_badge: initialSettings.hero_badge || "",
      hero_heading: initialSettings.hero_heading || "",
      hero_subheading: initialSettings.hero_subheading || "",
      hero_cta_primary: initialSettings.hero_cta_primary || "",
      hero_cta_secondary: initialSettings.hero_cta_secondary || "",
    },
  });

  const kontakForm = useForm<z.infer<typeof kontakSchema>>({
    resolver: zodResolver(kontakSchema),
    defaultValues: {
      whatsapp_number: initialSettings.whatsapp_number || "",
      whatsapp_message_default: initialSettings.whatsapp_message_default || "",
      phone_number: initialSettings.phone_number || "",
      email: initialSettings.email || "",
      alamat: initialSettings.alamat || "",
      jam_operasional: initialSettings.jam_operasional || "",
    },
  });

  const seoForm = useForm<z.infer<typeof seoSchema>>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      tab_title: initialSettings.tab_title || "",
      google_analytics_id: initialSettings.google_analytics_id || "",
      google_verification: initialSettings.google_verification || "",
    },
  });

  // Handle Form Submit
  async function onSubmit(values: any, formName: string) {
    setIsLoading(true);
    try {
      const { error } = await updateSiteSettings(values);
      if (error) {
        toast.error(error);
      } else {
        toast.success(`Pengaturan ${formName} berhasil disimpan`);
        router.refresh();
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }

  // Logo Upload
  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
    toast.info("Mengunggah logo...");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `site-settings/logo-${Date.now()}.${fileExt}`;

      // We'll use the 'avatars' or 'public-assets' bucket depending on what's available
      const { data, error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public-assets")
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public-assets")
        .getPublicUrl(fileName);

      setLogoUrl(publicUrlData.publicUrl);
      
      // Update site_settings
      await updateSiteSettings({ logo_url: publicUrlData.publicUrl });
      toast.success("Logo berhasil diperbarui");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Gagal mengunggah logo. Pastikan storage bucket sudah siap.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Pengaturan Global</h1>
        <p className="text-muted-foreground">Kelola tampilan, konten hero, informasi kontak, dan SEO utama website.</p>
      </div>

      <Tabs defaultValue="identitas" className="space-y-6">
        <TabsList className="bg-card border border-border h-auto p-1 grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="identitas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 text-sm">
            <Globe className="w-4 h-4 mr-2" /> Identitas
          </TabsTrigger>
          <TabsTrigger value="hero" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 text-sm">
            <Settings2 className="w-4 h-4 mr-2" /> Hero Section
          </TabsTrigger>
          <TabsTrigger value="kontak" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 text-sm">
            <MapPin className="w-4 h-4 mr-2" /> Kontak & Info
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 text-sm">
            <Search className="w-4 h-4 mr-2" /> SEO
          </TabsTrigger>
        </TabsList>

        {/* IDENTITAS TAB */}
        <TabsContent value="identitas" className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg">
            <div className="mb-8 pb-8 border-b border-border">
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">Logo Utama</h3>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-48 h-20 bg-background border border-border rounded-md flex items-center justify-center p-2 overflow-hidden">
                  {logoUrl ? (
                    <SafeImage src={logoUrl} alt="Logo Web" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="text-muted-foreground text-sm">Belum ada logo</span>
                  )}
                </div>
                <div>
                  <label htmlFor="logo-upload">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-[#0d1117] cursor-pointer asChild" asChild disabled={isUploading}>
                      <span>{isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Unggah Logo Baru"}</span>
                    </Button>
                  </label>
                  <input 
                    id="logo-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                  />
                  <p className="text-xs text-muted-foreground mt-3">Direkomendasikan format PNG transparan berukuran 200x60px.</p>
                </div>
              </div>
            </div>

            <Form {...identitasForm}>
              <form onSubmit={identitasForm.handleSubmit((values) => onSubmit(values, "Identitas"))} className="space-y-6">
                <FormField
                  control={identitasForm.control}
                  name="site_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Nama Website / Kantor *</FormLabel>
                      <FormControl>
                        <Input className="bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]" {...field} />
                      </FormControl>
                      <FormDescription className="text-muted-foreground">Nama yang muncul di footer dan metadata.</FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={identitasForm.control}
                  name="site_tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Tagline Kantor</FormLabel>
                      <FormControl>
                        <Input className="bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={identitasForm.control}
                  name="site_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Deskripsi Singkat Kantor</FormLabel>
                      <FormControl>
                        <Textarea className="bg-background border-border text-foreground min-h-[100px] focus-visible:ring-[#c9a84c]" {...field} />
                      </FormControl>
                      <FormDescription className="text-muted-foreground">Deskripsi untuk footer dan meta description global.</FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider">
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Simpan Identitas
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>

        {/* HERO SECTION TAB */}
        <TabsContent value="hero">
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg">
            <Form {...heroForm}>
              <form onSubmit={heroForm.handleSubmit((values) => onSubmit(values, "Hero"))} className="space-y-6">
                <FormField
                  control={heroForm.control}
                  name="hero_badge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Teks Badge / Label Kecil (Atas)</FormLabel>
                      <FormControl>
                        <Input placeholder="Konsultan Hukum & Perlindungan Konsumen" className="bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={heroForm.control}
                  name="hero_heading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Headline Utama (Besar) *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Analisa Tajam. Tim Kuat. Sengketa Tuntas." className="bg-background border-border text-foreground min-h-[80px] text-lg font-serif focus-visible:ring-[#c9a84c]" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={heroForm.control}
                  name="hero_subheading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Sub-heading (Paragraf Hero)</FormLabel>
                      <FormControl>
                        <Textarea className="bg-background border-border text-foreground min-h-[100px] focus-visible:ring-[#c9a84c]" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={heroForm.control}
                    name="hero_cta_primary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Teks Tombol Aksi Utama (WhatsApp)</FormLabel>
                        <FormControl>
                          <Input className="bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={heroForm.control}
                    name="hero_cta_secondary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Teks Tombol Kedua (Link Layanan)</FormLabel>
                        <FormControl>
                          <Input className="bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider">
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Simpan Hero
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>

        {/* KONTAK TAB */}
        <TabsContent value="kontak">
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg">
            <Form {...kontakForm}>
              <form onSubmit={kontakForm.handleSubmit((values) => onSubmit(values, "Kontak"))} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={kontakForm.control}
                    name="whatsapp_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Nomor WhatsApp Panggilan *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MessageCircle className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Input placeholder="6281234567890" className="pl-10 bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription className="text-muted-foreground">Gunakan kode negara tanpa +, contoh: 628...</FormDescription>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={kontakForm.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Nomor Telepon Kantor</FormLabel>
                        <FormControl>
                          <Input className="bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={kontakForm.control}
                  name="whatsapp_message_default"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Pesan WhatsApp Default (Pre-filled)</FormLabel>
                      <FormControl>
                        <Input className="bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={kontakForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Email Kantor</FormLabel>
                        <FormControl>
                          <Input type="email" className="bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={kontakForm.control}
                    name="jam_operasional"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Jam Operasional</FormLabel>
                        <FormControl>
                          <Input placeholder="Senin - Jumat: 08.00 - 17.00 WIB" className="bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={kontakForm.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Textarea className="bg-background border-border text-foreground min-h-[100px] focus-visible:ring-[#c9a84c]" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider">
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Simpan Kontak
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>

        {/* SEO TAB */}
        <TabsContent value="seo">
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg">
            <Form {...seoForm}>
              <form onSubmit={seoForm.handleSubmit((values) => onSubmit(values, "SEO"))} className="space-y-6">
                <FormField
                  control={seoForm.control}
                  name="tab_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Format Judul Browser (Tab Title) *</FormLabel>
                      <FormControl>
                        <Input className="bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]" {...field} />
                      </FormControl>
                      <FormDescription className="text-muted-foreground">Muncul di hasil pencarian Google dan title tab browser.</FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={seoForm.control}
                    name="google_analytics_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Google Analytics ID</FormLabel>
                        <FormControl>
                          <Input placeholder="G-XXXXXXXXXX" className="bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={seoForm.control}
                    name="google_verification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Google Search Console Meta</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: v8kdsj4..." className="bg-background border-border text-foreground h-12 focus-visible:ring-[#c9a84c]" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider">
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Simpan Pengaturan SEO
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


