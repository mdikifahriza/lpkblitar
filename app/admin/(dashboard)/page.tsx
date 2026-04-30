import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getAnalyticsOverview } from "@/lib/api/analytics";
import { DashboardClient } from "./DashboardClient";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const [
    { count: inqCount },
    { count: artCount },
    { count: srvCount },
    { count: tmCount },
    analytics,
  ] = await Promise.all([
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("team_members").select("*", { count: "exact", head: true }),
    getAnalyticsOverview(),
  ]);

  return (
    <DashboardClient
      stats={{
        inquiries: inqCount || 0,
        articles: artCount || 0,
        services: srvCount || 0,
        team: tmCount || 0,
      }}
      analytics={analytics}
    />
  );
}
