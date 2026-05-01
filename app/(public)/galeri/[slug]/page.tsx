import NotFound from "@/app/not-found";
import { getGalleryBySlug } from "@/lib/api/galleries";
import { GaleriDetailClient } from "./GaleriDetailClient";
import { generateMetadata as detailMetadata } from "./metadata";

export const generateMetadata = detailMetadata;

export default async function GaleriDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const { gallery } = await getGalleryBySlug(slug);

  if (!gallery) {
    return <NotFound />;
  }

  return <GaleriDetailClient gallery={gallery} />;
}
