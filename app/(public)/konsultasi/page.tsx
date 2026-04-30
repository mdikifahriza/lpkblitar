import { getContactData } from "@/lib/api/contact";
import { getServices } from "@/lib/api/services";
import { buildStaticPageMetadata } from "@/lib/page-seo";
import { KonsultasiClient } from "./KonsultasiClient";

export async function generateMetadata() {
  return buildStaticPageMetadata({
    path: "/konsultasi",
    fallbackTitle: "Konsultasi",
    fallbackDescription:
      "Sampaikan masalah hukum Anda melalui form konsultasi. Tim kami akan meninjau dan menghubungi Anda untuk sesi awal.",
  });
}

export default async function KonsultasiPage() {
  const [{ contact }, services] = await Promise.all([getContactData(), getServices()]);

  return <KonsultasiClient contact={contact} services={services} />;
}
