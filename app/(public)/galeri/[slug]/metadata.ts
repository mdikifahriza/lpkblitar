import type { Metadata } from "next";
import { getGalleryBySlug } from "@/lib/api/galleries";
import { getSiteSettings } from "@/lib/api/settings";
import { getGalleryCoverUrl } from "@/lib/gallery";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const [{ gallery }, settings] = await Promise.all([getGalleryBySlug(slug), getSiteSettings()]);

  if (!gallery) {
    return {
      title: `Galeri Tidak Ditemukan | ${settings.site_name}`,
    };
  }

  const description =
    gallery.deskripsi ||
    `Album galeri ${gallery.judul} yang menampilkan dokumentasi kegiatan, edukasi, atau momen penting ${settings.site_name}.`;

  return {
    title: `${gallery.judul} | ${settings.site_name}`,
    description,
    openGraph: {
      title: gallery.judul,
      description,
      images: [
        {
          url: getGalleryCoverUrl(gallery),
          width: 1200,
          height: 630,
          alt: gallery.judul,
        },
      ],
      type: "article",
    },
  };
}
