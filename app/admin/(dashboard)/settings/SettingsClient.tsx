"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, ImageIcon, Loader2, PencilLine, Save, Search, Settings2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadFileToSupabase } from "@/app/admin/upload-action";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SafeImage } from "@/components/ui/safe-image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { updateSiteSettings } from "./actions";

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

const seoSchema = z.object({
  tab_title: z.string().min(1, "Judul tab wajib diisi"),
  tab_title_template: z.string().min(1, "Template judul tab wajib diisi"),
  google_verification: z.string().optional(),
});

type AssetKey = "logo_url" | "hero_image_url" | "og_image_default_url" | "favicon_url";

type PendingAsset = {
  file: File;
  previewUrl: string;
};

type PendingAssetMap = Partial<Record<AssetKey, PendingAsset>>;

const FAVICON_MIME_TYPES = ["", "image/x-icon", "image/vnd.microsoft.icon"];

const ASSET_CONFIGS: Record<
  AssetKey,
  {
    key: AssetKey;
    folder: string;
    label: string;
    maxSizeMb: number;
    accept: string;
  }
> = {
  logo_url: {
    key: "logo_url",
    folder: "logo",
    label: "Logo",
    maxSizeMb: 2,
    accept: "image/*",
  },
  hero_image_url: {
    key: "hero_image_url",
    folder: "hero",
    label: "Foto Hero",
    maxSizeMb: 4,
    accept: "image/*",
  },
  og_image_default_url: {
    key: "og_image_default_url",
    folder: "og-image",
    label: "OG Image",
    maxSizeMb: 4,
    accept: "image/*",
  },
  favicon_url: {
    key: "favicon_url",
    folder: "favicon",
    label: "Favicon",
    maxSizeMb: 2,
    accept: ".ico,image/x-icon,image/vnd.microsoft.icon",
  },
};

function revokePreviewUrl(url?: string | null) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function SettingsField({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value?: string;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</Label>
      <div
        className={`rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground shadow-sm ${
          multiline ? "min-h-[96px] whitespace-pre-wrap leading-relaxed" : "min-h-11 flex items-center"
        }`}
      >
        {value?.trim() || "-"}
      </div>
    </div>
  );
}

export function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAsset, setUploadingAsset] = useState<AssetKey | null>(null);
  const [pendingAssets, setPendingAssets] = useState<PendingAssetMap>({});
  const pendingAssetsRef = useRef<PendingAssetMap>({});
  const logoUrl = pendingAssets.logo_url?.previewUrl ?? initialSettings.logo_url ?? "";
  const heroImageUrl = pendingAssets.hero_image_url?.previewUrl ?? initialSettings.hero_image_url ?? "";
  const ogImageUrl = pendingAssets.og_image_default_url?.previewUrl ?? initialSettings.og_image_default_url ?? "";
  const faviconUrl = pendingAssets.favicon_url?.previewUrl ?? initialSettings.favicon_url ?? "";

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

  const seoForm = useForm<z.infer<typeof seoSchema>>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      tab_title: initialSettings.tab_title || "",
      tab_title_template: initialSettings.tab_title_template || "",
      google_verification: initialSettings.google_verification || "",
    },
  });

  useEffect(() => {
    pendingAssetsRef.current = pendingAssets;
  }, [pendingAssets]);

  useEffect(() => {
    identitasForm.reset({
      site_name: initialSettings.site_name || "",
      site_tagline: initialSettings.site_tagline || "",
      site_description: initialSettings.site_description || "",
    });

    heroForm.reset({
      hero_badge: initialSettings.hero_badge || "",
      hero_heading: initialSettings.hero_heading || "",
      hero_subheading: initialSettings.hero_subheading || "",
      hero_cta_primary: initialSettings.hero_cta_primary || "",
      hero_cta_secondary: initialSettings.hero_cta_secondary || "",
    });

    seoForm.reset({
      tab_title: initialSettings.tab_title || "",
      tab_title_template: initialSettings.tab_title_template || "",
      google_verification: initialSettings.google_verification || "",
    });
  }, [heroForm, identitasForm, initialSettings, seoForm]);

  useEffect(() => {
    return () => {
      Object.values(pendingAssetsRef.current).forEach((asset) => revokePreviewUrl(asset?.previewUrl));
    };
  }, []);

  function clearPendingAssets(keys?: AssetKey[]) {
    setPendingAssets((current) => {
      const nextState = { ...current };
      const targetKeys = keys ?? (Object.keys(current) as AssetKey[]);

      targetKeys.forEach((key) => {
        const asset = current[key];

        if (asset) {
          revokePreviewUrl(asset.previewUrl);
          delete nextState[key];
        }
      });

      return nextState;
    });
  }

  function handleCancelEdit() {
    identitasForm.reset({
      site_name: initialSettings.site_name || "",
      site_tagline: initialSettings.site_tagline || "",
      site_description: initialSettings.site_description || "",
    });

    heroForm.reset({
      hero_badge: initialSettings.hero_badge || "",
      hero_heading: initialSettings.hero_heading || "",
      hero_subheading: initialSettings.hero_subheading || "",
      hero_cta_primary: initialSettings.hero_cta_primary || "",
      hero_cta_secondary: initialSettings.hero_cta_secondary || "",
    });

    seoForm.reset({
      tab_title: initialSettings.tab_title || "",
      tab_title_template: initialSettings.tab_title_template || "",
      google_verification: initialSettings.google_verification || "",
    });

    clearPendingAssets();
    setIsEditing(false);
  }

  async function uploadPendingAsset(assetKey: AssetKey) {
    const pendingAsset = pendingAssetsRef.current[assetKey];

    if (!pendingAsset) {
      return null;
    }

    const config = ASSET_CONFIGS[assetKey];
    const lowerFileName = pendingAsset.file.name.toLowerCase();
    const fileExt = lowerFileName.split(".").pop() || (assetKey === "favicon_url" ? "ico" : "bin");
    const fileName = `site-settings/${config.folder}-${crypto.randomUUID()}.${fileExt}`;
    const uploadFormData = new FormData();

    uploadFormData.append("file", pendingAsset.file);
    uploadFormData.append("path", fileName);
    uploadFormData.append("assetKey", assetKey);

    setUploadingAsset(assetKey);
    const uploadResult = await uploadFileToSupabase(uploadFormData);

    if ("error" in uploadResult) {
      throw new Error(uploadResult.error);
    }

    return uploadResult.url;
  }

  async function onSubmit(values: Record<string, string>, formName: string, assetKeys: AssetKey[] = []) {
    setIsLoading(true);

    try {
      const payload: Record<string, string> = { ...values };

      for (const assetKey of assetKeys) {
        const uploadedUrl = await uploadPendingAsset(assetKey);

        if (uploadedUrl) {
          payload[assetKey] = uploadedUrl;
          payload[`previous_${assetKey}`] = initialSettings[assetKey] || "";
        }
      }

      const { error } = await updateSiteSettings(payload);

      if (error) {
        toast.error(error);
      } else {
        toast.success(`Pengaturan ${formName} berhasil disimpan`);
        clearPendingAssets();
        setIsEditing(false);
        router.refresh();
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setUploadingAsset(null);
      setIsLoading(false);
    }
  }

  function handleAssetSelect(
    event: React.ChangeEvent<HTMLInputElement>,
    config: {
      key: AssetKey;
      label: string;
      maxSizeMb: number;
    }
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const isFaviconUpload = config.key === "favicon_url";
    const lowerFileName = file.name.toLowerCase();
    const isIcoFile = lowerFileName.endsWith(".ico");
    const isIcoMimeType = FAVICON_MIME_TYPES.includes(file.type);

    if (isFaviconUpload && (!isIcoFile || !isIcoMimeType)) {
      toast.error("Favicon hanya menerima file .ico");
      event.target.value = "";
      return;
    }

    if (!isFaviconUpload && !file.type.startsWith("image/")) {
      toast.error("Format file harus gambar");
      event.target.value = "";
      return;
    }

    if (file.size > config.maxSizeMb * 1024 * 1024) {
      toast.error(`Ukuran file maksimal ${config.maxSizeMb}MB`);
      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setPendingAssets((current) => {
      revokePreviewUrl(current[config.key]?.previewUrl);

      return {
        ...current,
        [config.key]: {
          file,
          previewUrl,
        },
      };
    });

    event.target.value = "";
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Pengaturan Global"
        action={
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            {isEditing ? (
              <Button variant="outline" onClick={handleCancelEdit} disabled={isLoading || Boolean(uploadingAsset)}>
                <X className="mr-2 h-4 w-4" />
                Batal
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="font-bold">
                <PencilLine className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        }
      />

      <Tabs defaultValue="identitas" className="space-y-6">
        <TabsList className="grid h-auto grid-cols-1 border border-border bg-card p-1 md:grid-cols-3">
          <TabsTrigger
            value="identitas"
            className="py-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Globe className="mr-2 h-4 w-4" />
            Identitas
          </TabsTrigger>
          <TabsTrigger
            value="hero"
            className="py-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Settings2 className="mr-2 h-4 w-4" />
            Hero
          </TabsTrigger>
          <TabsTrigger
            value="seo"
            className="py-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Search className="mr-2 h-4 w-4" />
            SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identitas">
          <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
            <div className="space-y-5 border-b border-border pb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground">Logo</h2>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex h-24 w-56 items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-3">
                  {logoUrl ? (
                    <SafeImage src={logoUrl} alt="Logo Web" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-sm text-muted-foreground">Belum ada logo</span>
                  )}
                </div>

                <div className="space-y-3">
                  {isEditing ? (
                    <label htmlFor="logo-upload">
                      <Button
                        asChild
                        variant="outline"
                        disabled={isLoading}
                        className="cursor-pointer"
                      >
                        <span>
                          {pendingAssets.logo_url ? <ImageIcon className="mr-2 h-4 w-4" /> : null}
                          {pendingAssets.logo_url ? "Ganti Logo" : "Pilih Logo"}
                        </span>
                      </Button>
                    </label>
                  ) : null}
                  <input
                    id="logo-upload"
                    type="file"
                    accept={ASSET_CONFIGS.logo_url.accept}
                    className="hidden"
                    onChange={(event) => handleAssetSelect(event, ASSET_CONFIGS.logo_url)}
                    disabled={isLoading}
                  />
                  {pendingAssets.logo_url ? (
                    <p className="text-xs text-muted-foreground">Logo baru akan diunggah saat Anda menekan Simpan.</p>
                  ) : null}
                </div>
              </div>
            </div>

            <Form {...identitasForm}>
              <form
                onSubmit={identitasForm.handleSubmit((values) => onSubmit(values, "Identitas", ["logo_url"]))}
                className="space-y-6"
              >
                {isEditing ? (
                  <>
                    <FormField
                      control={identitasForm.control}
                      name="site_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Kantor</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={identitasForm.control}
                      name="site_tagline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tagline</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={identitasForm.control}
                      name="site_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deskripsi Singkat</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-[110px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isLoading} className="font-bold">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Simpan
                    </Button>
                  </>
                ) : (
                  <div className="space-y-6">
                    <SettingsField label="Nama Kantor" value={identitasForm.getValues("site_name")} />
                    <SettingsField label="Tagline" value={identitasForm.getValues("site_tagline")} />
                    <SettingsField
                      label="Deskripsi Singkat"
                      value={identitasForm.getValues("site_description")}
                      multiline
                    />
                  </div>
                )}
              </form>
            </Form>
          </div>
        </TabsContent>

        <TabsContent value="hero">
          <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
            <div className="space-y-5 border-b border-border pb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground">Foto Hero</h2>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="flex h-72 w-full max-w-xs items-center justify-center overflow-hidden rounded-2xl border border-border bg-background">
                  {heroImageUrl ? (
                    <SafeImage src={heroImageUrl} alt="Foto Hero" className="h-full w-full object-cover object-top" />
                  ) : (
                    <span className="text-sm text-muted-foreground">Belum ada foto hero</span>
                  )}
                </div>

                <div className="space-y-3">
                  {isEditing ? (
                    <label htmlFor="hero-image-upload">
                      <Button
                        asChild
                        variant="outline"
                        disabled={isLoading}
                        className="cursor-pointer"
                      >
                        <span>
                          <ImageIcon className="mr-2 h-4 w-4" />
                          {pendingAssets.hero_image_url ? "Ganti Foto Hero" : "Pilih Foto Hero"}
                        </span>
                      </Button>
                    </label>
                  ) : null}
                  <input
                    id="hero-image-upload"
                    type="file"
                    accept={ASSET_CONFIGS.hero_image_url.accept}
                    className="hidden"
                    onChange={(event) => handleAssetSelect(event, ASSET_CONFIGS.hero_image_url)}
                    disabled={isLoading}
                  />
                  {pendingAssets.hero_image_url ? (
                    <p className="text-xs text-muted-foreground">
                      Foto hero baru akan diunggah saat Anda menekan Simpan.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <Form {...heroForm}>
              <form
                onSubmit={heroForm.handleSubmit((values) => onSubmit(values, "Hero", ["hero_image_url"]))}
                className="space-y-6"
              >
                {isEditing ? (
                  <>
                    <FormField
                      control={heroForm.control}
                      name="hero_badge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Badge</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={heroForm.control}
                      name="hero_heading"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heading</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-[90px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={heroForm.control}
                      name="hero_subheading"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subheading</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-[120px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={heroForm.control}
                        name="hero_cta_primary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CTA Utama</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={heroForm.control}
                        name="hero_cta_secondary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CTA Kedua</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" disabled={isLoading} className="font-bold">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Simpan
                    </Button>
                  </>
                ) : (
                  <div className="space-y-6">
                    <SettingsField label="Badge" value={heroForm.getValues("hero_badge")} />
                    <SettingsField label="Heading" value={heroForm.getValues("hero_heading")} multiline />
                    <SettingsField label="Subheading" value={heroForm.getValues("hero_subheading")} multiline />
                    <div className="grid gap-6 md:grid-cols-2">
                      <SettingsField label="CTA Utama" value={heroForm.getValues("hero_cta_primary")} />
                      <SettingsField label="CTA Kedua" value={heroForm.getValues("hero_cta_secondary")} />
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
            <Form {...seoForm}>
              <form
                onSubmit={seoForm.handleSubmit((values) =>
                  onSubmit(values, "SEO", ["og_image_default_url", "favicon_url"])
                )}
                className="space-y-6"
              >
                {isEditing ? (
                  <>
                    <FormField
                      control={seoForm.control}
                      name="tab_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Judul Tab</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-6">
                      <FormField
                        control={seoForm.control}
                        name="tab_title_template"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Template Judul Halaman</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={seoForm.control}
                        name="google_verification"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Google Verification</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <SettingsField label="Judul Tab" value={seoForm.getValues("tab_title")} />
                    <SettingsField
                      label="Template Judul Halaman"
                      value={seoForm.getValues("tab_title_template")}
                    />
                    <SettingsField
                      label="Google Verification"
                      value={seoForm.getValues("google_verification")}
                    />
                  </div>
                )}

                <div className="grid gap-6 border-t border-border pt-6 lg:grid-cols-2">
                  <div className="space-y-4 rounded-2xl border border-border bg-background p-4">
                    <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
                      {ogImageUrl ? (
                        <SafeImage
                          src={ogImageUrl}
                          alt="OG Image Default"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">Belum ada OG image</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">OG Image Default</p>
                      <p className="text-sm text-muted-foreground">
                        Dipakai untuk preview saat halaman dibagikan jika halaman itu tidak punya gambar sendiri.
                      </p>
                    </div>
                    {isEditing ? (
                      <label htmlFor="og-image-upload">
                        <Button
                          asChild
                          variant="outline"
                          disabled={isLoading}
                          className="w-full cursor-pointer"
                        >
                          <span>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            {pendingAssets.og_image_default_url ? "Ganti OG Image" : "Pilih OG Image"}
                          </span>
                        </Button>
                      </label>
                    ) : null}
                    <input
                      id="og-image-upload"
                      type="file"
                      accept={ASSET_CONFIGS.og_image_default_url.accept}
                      className="hidden"
                      onChange={(event) => handleAssetSelect(event, ASSET_CONFIGS.og_image_default_url)}
                      disabled={isLoading}
                    />
                    {pendingAssets.og_image_default_url ? (
                      <p className="text-xs text-muted-foreground">
                        OG image baru akan diunggah saat Anda menekan Simpan.
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-4 rounded-2xl border border-border bg-background p-4">
                    <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
                      {faviconUrl ? (
                        <SafeImage
                          src={faviconUrl}
                          alt="Favicon"
                          className="h-16 w-16 rounded-xl object-contain"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">Belum ada favicon</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">Favicon</p>
                      <p className="text-sm text-muted-foreground">
                        Ikon kecil di tab browser. Upload dibatasi hanya untuk file ICO.
                      </p>
                    </div>
                    {isEditing ? (
                      <label htmlFor="favicon-upload">
                        <Button
                          asChild
                          variant="outline"
                          disabled={isLoading}
                          className="w-full cursor-pointer"
                        >
                          <span>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            {pendingAssets.favicon_url ? "Ganti Favicon" : "Pilih Favicon"}
                          </span>
                        </Button>
                      </label>
                    ) : null}
                    <input
                      id="favicon-upload"
                      type="file"
                      accept={ASSET_CONFIGS.favicon_url.accept}
                      className="hidden"
                      onChange={(event) => handleAssetSelect(event, ASSET_CONFIGS.favicon_url)}
                      disabled={isLoading}
                    />
                    {pendingAssets.favicon_url ? (
                      <p className="text-xs text-muted-foreground">
                        Favicon baru akan diunggah saat Anda menekan Simpan.
                      </p>
                    ) : null}
                  </div>
                </div>

                {isEditing ? (
                  <Button type="submit" disabled={isLoading} className="font-bold">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Simpan
                  </Button>
                ) : null}
              </form>
            </Form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
