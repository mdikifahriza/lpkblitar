import { getAdminGalleries } from "@/lib/api/galleries";
import { GalleriesClient } from "./GalleriesClient";

// Force dynamic revalidation for development
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GalleriesPage() {
  const { galleries, tableReady } = await getAdminGalleries();

  return <GalleriesClient initialGalleries={galleries} tableReady={tableReady} />;
}
