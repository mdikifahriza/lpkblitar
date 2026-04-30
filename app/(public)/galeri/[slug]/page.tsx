import NotFound from "@/app/not-found";
import { getGalleryBySlug, getPublicGalleries } from "@/lib/api/galleries";
import { GaleriDetailClient } from "./GaleriDetailClient";
import { generateMetadata as detailMetadata } from "./metadata";

export const generateMetadata = detailMetadata;

export default async function GaleriDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const { gallery } = await getGalleryBySlug(slug);

  if (!gallery) {
    return <NotFound />;
  }

  const { galleries } = await getPublicGalleries();
  const relatedGalleries = galleries.filter((item) => item.slug !== slug).slice(0, 3);

  return <GaleriDetailClient gallery={gallery} relatedGalleries={relatedGalleries} />;
}
