import { getServiceBySlug, getServices } from "@/lib/api/services";
import { LayananDetailClient } from "./LayananDetailClient";
import NotFound from "@/app/not-found";

import { generateMetadata as layMetadata } from './metadata';
export const generateMetadata = layMetadata;

export default async function LayananDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  
  if (!service) {
    return <NotFound />;
  }

  const allServices = await getServices();
  const relatedServices = allServices.filter((s: any) => s.id !== service.id).slice(0, 3);

  return <LayananDetailClient service={service} relatedServices={relatedServices} />;
}

