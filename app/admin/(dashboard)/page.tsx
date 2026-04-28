import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
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

  // Fetch some summary stats
  // Using Anon Key here means we'll only see public info unless we use Service Role Key for inquiries.
  // Wait, inquiries is inserted by public but read only by authenticated users (Admin).
  // Is RLS set up properly? `create policy "Admin all inquiries" on inquiries for all using (auth.role() = 'authenticated');`
  // Yes! Since we are authenticated, Anon Key with session token WILL work and bypass RLS to read inquiries!

  const [
    { count: inqCount },
    { count: artCount },
    { count: srvCount },
    { count: tmCount },
  ] = await Promise.all([
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("team_members").select("*", { count: "exact", head: true }),
  ]);

  return (
    <DashboardClient
      stats={{
        inquiries: inqCount || 0,
        articles: artCount || 0,
        services: srvCount || 0,
        team: tmCount || 0,
      }}
    />
  );
}
