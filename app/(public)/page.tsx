import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { ProfilKantor } from "@/components/sections/ProfilKantor";
import { Layanan } from "@/components/sections/Layanan";
import { AlurKerja } from "@/components/sections/AlurKerja";
import { ProfilTim } from "@/components/sections/ProfilTim";
import { Testimoni } from "@/components/sections/Testimoni";
import { Artikel } from "@/components/sections/Artikel";
import { FAQ } from "@/components/sections/FAQ";

import { getServices } from "@/lib/api/services";
import { getTeamMembers } from "@/lib/api/team";
import { getTestimonials } from "@/lib/api/testimonials";
import { getArticles } from "@/lib/api/articles";
import { getFaqs } from "@/lib/api/faqs";
import { buildStaticPageMetadata } from "@/lib/page-seo";

export async function generateMetadata() {
  return buildStaticPageMetadata({
    path: "/",
    fallbackDescription:
      "Kantor konsultan hukum di Blitar spesialis sengketa finance, perlindungan konsumen, mediasi bisnis, dan gugatan perdata.",
  });
}

export default async function Home() {
  const [services, team, testimonials, articles, faqs] = await Promise.all([
    getServices(),
    getTeamMembers(),
    getTestimonials(),
    getArticles(),
    getFaqs()
  ]);

  return (
    <>
      <Hero />
      <TrustBar />
      <ProfilKantor />
      <Layanan services={services} />
      <AlurKerja />
      <ProfilTim team={team} />
      <Testimoni testimonials={testimonials} />
      <Artikel articles={articles} />
      <FAQ faqs={faqs} />
    </>
  );
}



