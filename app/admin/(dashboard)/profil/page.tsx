import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ProfilClient } from "./ProfilClient";

export default async function ProfilPage() {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <ProfilClient user={user} />;
}
