import { buildStaticPageMetadata } from "@/lib/page-seo";
import LayananClient from "./LayananClient";

export async function generateMetadata() {
  return buildStaticPageMetadata({
    path: "/layanan",
    fallbackTitle: "Layanan",
    fallbackDescription:
      "Lihat semua layanan hukum kami mulai dari gugatan perdata, perlindungan konsumen, mediasi bisnis, hingga konsultasi pengembangan usaha.",
  });
}

export default function LayananPage() {
  return <LayananClient />;
}
