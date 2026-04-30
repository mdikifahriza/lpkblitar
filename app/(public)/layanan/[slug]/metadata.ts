import { getServiceBySlug } from "@/lib/api/services";
import { getSiteSettings } from "@/lib/api/settings";
import { buildSeoExcerpt } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  const settings = await getSiteSettings();

  if (!service) {
    return {
      title: {
        absolute: `Layanan Tidak Ditemukan | ${settings.site_name}`,
      },
    };
  }

  const title = `${service.nama} | ${settings.site_name}`;
  const description = buildSeoExcerpt(
    service.deskripsi_singkat || service.deskripsi_lengkap || `Layanan hukum ${service.nama} dari ${settings.site_name}.`
  );
  const ogImageUrl = settings.og_image_default_url || "/images/hero-portrait.png";

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `/layanan/${service.slug}`,
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: service.nama,
        },
      ],
      type: "website",
    },
  };
}
