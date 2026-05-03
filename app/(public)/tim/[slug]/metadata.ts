import { getSiteSettings } from "@/lib/api/settings";
import { getTeamMemberBySlug } from "@/lib/api/team";
import { buildSeoExcerpt } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = await params;
  const [member, settings] = await Promise.all([getTeamMemberBySlug(slug), getSiteSettings()]);

  if (!member) {
    return {
      title: {
        absolute: `Profil Tim Tidak Ditemukan | ${settings.site_name}`,
      },
    };
  }

  const title = `${member.nama} | Tim ${settings.site_name}`;
  const description = buildSeoExcerpt(
    member.bio || `${member.nama} - ${member.jabatan}. Spesialisasi: ${member.spesialisasi}.`
  );
  const ogImageUrl = member.foto_url || settings.og_image_default_url || "/images/hero-portrait.png";

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `/tim/${member.slug}`,
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: member.nama,
        },
      ],
      type: "profile",
    },
  };
}
