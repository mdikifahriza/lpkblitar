import NotFound from "@/app/not-found";
import { getContactData } from "@/lib/api/contact";
import { getServiceBySlug, getServices, type ServiceRow } from "@/lib/api/services";
import { LayananDetailClient } from "./LayananDetailClient";

import { generateMetadata as layMetadata } from "./metadata";

export const generateMetadata = layMetadata;

export default async function LayananDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return <NotFound />;
  }

  const [{ contact }, allServices] = await Promise.all([getContactData(), getServices()]);
  const relatedServices = allServices
    .filter((serviceItem: ServiceRow) => serviceItem.id !== service.id)
    .slice(0, 3);

  return (
    <LayananDetailClient
      service={service}
      relatedServices={relatedServices}
      whatsappNumber={contact.whatsapp_number}
    />
  );
}
