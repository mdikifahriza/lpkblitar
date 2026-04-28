import { getServiceBySlug, getServices } from "@/lib/api/services";
import { getSiteSettings } from "@/lib/api/settings";
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  const settings = await getSiteSettings();

  if (!service) {
    return {
      title: `Layanan Tidak Ditemukan | ${settings.site_name}`
    };
  }

  return {
    title: `${service.nama} | ${settings.site_name}`,
    description: service.deskripsi_singkat,
    openGraph: {
      title: `${service.nama} | ${settings.site_name}`,
      description: service.deskripsi_singkat,
      type: "website",
    },
  };
}
