import { getPublicGalleries } from "@/lib/api/galleries";
import { buildStaticPageMetadata } from "@/lib/page-seo";
import { GaleriClient } from "./GaleriClient";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildStaticPageMetadata({
    path: "/galeri",
    fallbackTitle: "Galeri",
    fallbackDescription:
      "Dokumentasi kegiatan, edukasi hukum, media, dan momen penting Kantor Hutabarat Law.",
  });
}

export default async function GaleriPage() {
  const { galleries, tableReady } = await getPublicGalleries();

  return <GaleriClient initialGalleries={galleries} tableReady={tableReady} />;
}
