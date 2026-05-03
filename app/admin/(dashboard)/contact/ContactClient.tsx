"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  ExternalLink,
  Globe2,
  Loader2,
  MapPinned,
  Pencil,
  PencilLine,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SocialPlatformIcon } from "@/components/contact/SocialPlatformIcon";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import type {
  ContactSettingsRecord,
  ContactSocialLink,
  SocialPlatformOption,
} from "@/lib/api/contact";
import { buildGoogleMapsEmbedUrlSync, isGoogleMapsShortUrl } from "@/lib/google-maps";
import {
  deleteContactSocialLink,
  toggleContactSocialLinkStatus,
  upsertContactSettings,
  upsertContactSocialLink,
} from "./actions";

const contactSchema = z.object({
  whatsapp_number: z.string().trim().min(1, "Nomor WhatsApp wajib diisi."),
  whatsapp_message_default: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("Email tidak valid.").optional().or(z.literal("")),
  alamat: z.string().trim().optional().or(z.literal("")),
  jam_operasional: z.string().trim().optional().or(z.literal("")),
  maps_embed_url: z.string().trim().optional().or(z.literal("")),
  maps_link_url: z.string().trim().optional().or(z.literal("")),
});

type SocialLinkFormState = {
  id: string | null;
  platform_id: string;
  url: string;
  nomor_urut: number;
  aktif: boolean;
};

function ContactField({
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
      <Label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </Label>
      <div
        className={`rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground shadow-sm ${
          multiline
            ? "min-h-[96px] whitespace-pre-wrap leading-relaxed [overflow-wrap:anywhere]"
            : "min-h-11 flex items-center"
        }`}
      >
        {value?.trim() || "-"}
      </div>
    </div>
  );
}

function createEmptySocialForm(
  nextOrder: number,
  platformOptions: SocialPlatformOption[]
): SocialLinkFormState {
  return {
    id: null,
    platform_id: platformOptions[0]?.id ?? "",
    url: "",
    nomor_urut: nextOrder,
    aktif: true,
  };
}

function createContactFormValues(contact: ContactSettingsRecord) {
  return {
    whatsapp_number: contact.whatsapp_number,
    whatsapp_message_default: contact.whatsapp_message_default,
    email: contact.email,
    alamat: contact.alamat,
    jam_operasional: contact.jam_operasional,
    maps_embed_url: contact.maps_embed_url,
    maps_link_url: contact.maps_link_url,
  };
}

export function ContactClient({
  initialContact,
  initialSocialLinks,
  platformOptions,
}: {
  initialContact: ContactSettingsRecord;
  initialSocialLinks: ContactSocialLink[];
  platformOptions: SocialPlatformOption[];
}) {
  const router = useRouter();
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResolvingMapsEmbed, setIsResolvingMapsEmbed] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [socialFormData, setSocialFormData] = useState<SocialLinkFormState>(
    createEmptySocialForm(initialSocialLinks.length + 1, platformOptions)
  );

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: createContactFormValues(initialContact),
  });

  const platformMap = useMemo(
    () => new Map(platformOptions.map((platform) => [platform.id, platform])),
    [platformOptions]
  );
  const canManageSocialLinks = initialContact.tablesReady;
  const editingMapsEmbedUrl = useWatch({ control: form.control, name: "maps_embed_url" });
  const editingMapsLinkUrl = useWatch({ control: form.control, name: "maps_link_url" });
  const mapsLinkDirty = Boolean(form.formState.dirtyFields.maps_link_url);

  const getPlatformByCode = (code: string) =>
    platformOptions.find((platform) => platform.code === code) ?? null;

  useEffect(() => {
    form.reset(createContactFormValues(initialContact));
  }, [form, initialContact]);

  useEffect(() => {
    const sourceLink = editingMapsLinkUrl?.trim() ?? "";

    if (!sourceLink) {
      if (mapsLinkDirty) {
        form.setValue("maps_embed_url", "");
      }

      return;
    }

    const immediatePreviewUrl = isGoogleMapsShortUrl(sourceLink)
      ? ""
      : buildGoogleMapsEmbedUrlSync(sourceLink);

    if (immediatePreviewUrl) {
      form.setValue("maps_embed_url", immediatePreviewUrl);
    }

    const abortController = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsResolvingMapsEmbed(true);

      try {
        const response = await fetch(`/api/maps/embed-url?url=${encodeURIComponent(sourceLink)}`, {
          method: "GET",
          cache: "no-store",
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error("Gagal membuat URL embed Google Maps.");
        }

        const payload = (await response.json()) as { embedUrl?: string };
        form.setValue("maps_embed_url", payload.embedUrl?.trim() || immediatePreviewUrl);
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Maps embed preview error:", error);
          form.setValue("maps_embed_url", immediatePreviewUrl);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsResolvingMapsEmbed(false);
        }
      }
    }, 350);

    return () => {
      setIsResolvingMapsEmbed(false);
      abortController.abort();
      window.clearTimeout(timeoutId);
    };
  }, [editingMapsLinkUrl, form, mapsLinkDirty]);

  const openContactDialog = () => {
    form.reset(createContactFormValues(initialContact));
    setIsContactDialogOpen(true);
  };

  const handleCancelEdit = () => {
    form.reset(createContactFormValues(initialContact));
    setIsContactDialogOpen(false);
  };

  const handleSaveContact = async (values: z.infer<typeof contactSchema>) => {
    setIsSavingContact(true);

    const { error } = await upsertContactSettings(values);

    if (error) {
      toast.error(error);
    } else {
      setIsContactDialogOpen(false);
      toast.success("Kontak berhasil disimpan");
      router.refresh();
    }

    setIsSavingContact(false);
  };

  const handleAddSocial = () => {
    if (!canManageSocialLinks) {
      return;
    }

    const nextOrder =
      initialSocialLinks.length > 0
        ? Math.max(...initialSocialLinks.map((item) => item.nomor_urut || 0)) + 1
        : 1;

    setSocialFormData(createEmptySocialForm(nextOrder, platformOptions));
    setIsSocialDialogOpen(true);
  };

  const handleEditSocial = (item: ContactSocialLink) => {
    if (!canManageSocialLinks) {
      return;
    }

    const resolvedPlatformId = item.platform_id || getPlatformByCode(item.platform_code)?.id || "";

    setSocialFormData({
      id: item.id,
      platform_id: resolvedPlatformId,
      url: item.url,
      nomor_urut: item.nomor_urut,
      aktif: item.aktif,
    });
    setIsSocialDialogOpen(true);
  };

  const handleSubmitSocial = async () => {
    setIsSavingSocial(true);

    const { error } = await upsertContactSocialLink({
      id: socialFormData.id ?? undefined,
      platform_id: socialFormData.platform_id,
      url: socialFormData.url,
      nomor_urut: Number(socialFormData.nomor_urut) || 1,
      aktif: socialFormData.aktif,
    });

    if (error) {
      toast.error(error);
    } else {
      toast.success(socialFormData.id ? "Link media sosial diperbarui" : "Link media sosial ditambahkan");
      setIsSocialDialogOpen(false);
      router.refresh();
    }

    setIsSavingSocial(false);
  };

  const handleDeleteSocial = async () => {
    if (!deleteId) {
      return;
    }

    setIsSavingSocial(true);
    const { error } = await deleteContactSocialLink(deleteId);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Link media sosial dihapus");
      setIsDeleteDialogOpen(false);
      router.refresh();
    }

    setIsSavingSocial(false);
  };

  const handleToggleSocial = async (id: string, currentValue: boolean) => {
    if (!canManageSocialLinks) {
      return;
    }

    const { error } = await toggleContactSocialLinkStatus(id, !currentValue);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Status link media sosial diubah");
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Kontak"
        action={
          <Button onClick={openContactDialog} className="font-bold">
            <PencilLine className="mr-2 h-4 w-4" />
            Edit Kontak
          </Button>
        }
      />

      {!initialContact.tablesReady ? (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <Globe2 className="h-4 w-4" />
          <AlertTitle>Migrasi kontak belum dijalankan</AlertTitle>
          <AlertDescription>
            Data utama masih memakai site settings. Form kontak tetap bisa disimpan, tetapi link media sosial multi-item
            butuh tabel kontak baru.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold text-foreground">Data Utama</h2>
          </div>

          <div className="space-y-6">
            <ContactField label="WhatsApp Utama" value={initialContact.whatsapp_number} />
            <ContactField
              label="Pesan WhatsApp Default"
              value={initialContact.whatsapp_message_default}
              multiline
            />
            <div className="grid gap-6 md:grid-cols-2">
              <ContactField label="Email" value={initialContact.email} />
              <ContactField label="Jam Kerja" value={initialContact.jam_operasional} />
            </div>
            <ContactField label="Alamat" value={initialContact.alamat} multiline />
            <div className="grid gap-6">
              <ContactField label="Link Google Maps" value={initialContact.maps_link_url} multiline />
              <ContactField label="URL Embed Maps" value={initialContact.maps_embed_url} multiline />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <MapPinned className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-2xl font-semibold text-foreground">Preview Peta</h2>
            </div>

            {initialContact.maps_embed_url ? (
              <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-xl border border-border bg-background">
                <div className="relative aspect-square w-full">
                  <iframe
                    src={initialContact.maps_embed_url}
                    title="Lokasi kantor"
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-[420px]">
                <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 text-center text-sm text-muted-foreground">
                  URL embed maps belum diisi
                </div>
              </div>
            )}

            {initialContact.maps_link_url ? (
              <a
                href={initialContact.maps_link_url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Buka di Google Maps
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-serif text-2xl font-semibold text-foreground">Link Media Sosial</h2>
          <Button onClick={handleAddSocial} className="font-bold" disabled={!canManageSocialLinks}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Link
          </Button>
        </div>

        <div className="hidden overflow-hidden rounded-xl border border-border md:block">
          <Table>
            <TableHeader className="bg-background">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-[72px]">Urut</TableHead>
                <TableHead className="w-[16%]">Platform</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="w-[18%]">Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialSocialLinks.length === 0 ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Belum ada link media sosial
                  </TableCell>
                </TableRow>
              ) : (
                initialSocialLinks.map((item) => (
                  <TableRow key={item.id} className="border-border transition-colors hover:bg-muted">
                    <TableCell className="font-medium text-muted-foreground">{item.nomor_urut}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background">
                          <SocialPlatformIcon platform={item.icon_key || item.platform_code} className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-foreground">{item.platform_nama}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="line-clamp-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {item.url}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.aktif}
                          onCheckedChange={() => handleToggleSocial(item.id, item.aktif)}
                          className="data-[state=checked]:bg-primary"
                          disabled={!canManageSocialLinks}
                        />
                        <span className="text-sm text-muted-foreground">
                          {item.aktif ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSocial(item)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          disabled={!canManageSocialLinks}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeleteId(item.id);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                          disabled={!canManageSocialLinks}
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
          {initialSocialLinks.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-10 text-center text-muted-foreground">
              Belum ada link media sosial
            </div>
          ) : (
            initialSocialLinks.map((item) => (
              <MobileCard
                key={item.id}
                avatar={
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background">
                    <SocialPlatformIcon platform={item.icon_key || item.platform_code} className="h-4 w-4" />
                  </div>
                }
                title={item.platform_nama}
                subtitle={<span>Urutan {item.nomor_urut}</span>}
                badges={
                  <Badge variant="outline" className={item.aktif ? "text-primary" : "text-muted-foreground"}>
                    {item.aktif ? "Aktif" : "Nonaktif"}
                  </Badge>
                }
                viewTitle="Detail Link Sosial"
                viewContent={
                  <div className="space-y-4">
                    <div className="rounded-xl border border-border bg-background p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Platform</div>
                      <div className="mt-2 flex items-center gap-3 text-foreground">
                        <SocialPlatformIcon platform={item.icon_key || item.platform_code} />
                        <span className="font-medium">{item.platform_nama}</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">URL</div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block break-all text-sm text-primary"
                      >
                        {item.url}
                      </a>
                    </div>
                  </div>
                }
                actions={
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSocial(item)}
                      className="border-border bg-background text-muted-foreground hover:text-primary"
                      disabled={!canManageSocialLinks}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeleteId(item.id);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="border-border bg-background text-muted-foreground hover:border-red-500 hover:bg-red-500/10 hover:text-red-500"
                      disabled={!canManageSocialLinks}
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
      </section>

      <Dialog open={isContactDialogOpen} onOpenChange={(open) => (open ? setIsContactDialogOpen(true) : handleCancelEdit())}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-foreground">Edit Kontak</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveContact)} className="space-y-6">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="whatsapp_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Utama</FormLabel>
                      <FormControl>
                        <Input placeholder="6281234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="whatsapp_message_default"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pesan WhatsApp Default</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[96px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="info@hutabaratlawoffice.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jam_operasional"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jam Kerja</FormLabel>
                      <FormControl>
                        <Input placeholder="Senin - Jumat: 08.00 - 17.00 WIB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="maps_link_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link Google Maps</FormLabel>
                        <FormControl>
                          <Input placeholder="https://maps.app.goo.gl/..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Tempel link Google Maps biasa atau short link `maps.app.goo.gl`. URL embed akan dibuat otomatis.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maps_embed_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Embed Maps</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-[120px] font-mono text-xs" readOnly {...field} />
                        </FormControl>
                        <FormDescription>
                          {isResolvingMapsEmbed
                            ? "Sedang membuat URL embed dari link Google Maps..."
                            : "Field ini dibuat otomatis dari link Google Maps di atas."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <MapPinned className="h-5 w-5 text-primary" />
                    <h3 className="font-serif text-xl font-semibold text-foreground">Preview Peta</h3>
                  </div>

                  {editingMapsEmbedUrl ? (
                    <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl border border-border bg-card">
                      <div className="relative aspect-square w-full">
                        <iframe
                          src={editingMapsEmbedUrl}
                          title="Preview lokasi kantor"
                          className="absolute inset-0 h-full w-full"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mx-auto w-full max-w-[360px]">
                      <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border bg-card px-4 text-center text-sm text-muted-foreground">
                        URL embed maps belum tersedia
                      </div>
                    </div>
                  )}

                  {editingMapsLinkUrl ? (
                    <a
                      href={editingMapsLinkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      Buka di Google Maps
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isSavingContact || isSavingSocial}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Batal
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSavingContact || isSavingSocial} className="font-bold">
                  {isSavingContact ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSocialDialogOpen} onOpenChange={setIsSocialDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-foreground">
              {socialFormData.id ? "Edit Link Media Sosial" : "Tambah Link Media Sosial"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-2">
            <div className="grid gap-2">
              <Label>Platform</Label>
              <Select
                value={socialFormData.platform_id}
                onValueChange={(value) =>
                  setSocialFormData((current) => ({ ...current, platform_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih platform" />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="social-url">URL</Label>
              <Input
                id="social-url"
                value={socialFormData.url}
                onChange={(event) =>
                  setSocialFormData((current) => ({ ...current, url: event.target.value }))
                }
                placeholder={platformMap.get(socialFormData.platform_id)?.placeholder_url || "https://"}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="social-order">Nomor Urut</Label>
                <Input
                  id="social-order"
                  type="number"
                  min={1}
                  value={socialFormData.nomor_urut}
                  onChange={(event) =>
                    setSocialFormData((current) => ({
                      ...current,
                      nomor_urut: Number(event.target.value) || 1,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                <div className="text-sm font-medium text-foreground">Status Aktif</div>
                <Switch
                  checked={socialFormData.aktif}
                  onCheckedChange={(checked) =>
                    setSocialFormData((current) => ({ ...current, aktif: checked }))
                  }
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Batal
              </Button>
            </DialogClose>
            <Button onClick={handleSubmitSocial} disabled={isSavingSocial} className="font-bold">
              {isSavingSocial ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-red-500">Hapus Link</DialogTitle>
          </DialogHeader>

          <div className="py-2 text-sm leading-relaxed text-muted-foreground">
            Link media sosial yang dipilih akan dihapus permanen.
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Batal
              </Button>
            </DialogClose>
            <Button
              onClick={handleDeleteSocial}
              disabled={isSavingSocial}
              className="bg-red-500 font-bold text-white hover:bg-red-600"
            >
              {isSavingSocial ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
