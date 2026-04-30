import { getTeamMembers } from "@/lib/api/team";
import { buildStaticPageMetadata } from "@/lib/page-seo";
import { TimClient } from "./TimClient";

export async function generateMetadata() {
  return buildStaticPageMetadata({
    path: "/tim",
    fallbackTitle: "Tim",
    fallbackDescription:
      "Kenali tim profesional Hutabarat Law yang menangani litigasi, negosiasi, analisa dokumen, dan pendampingan hukum.",
  });
}

export default async function TimPage() {
  const team = await getTeamMembers();
  return <TimClient initialTeam={team} />;
}
