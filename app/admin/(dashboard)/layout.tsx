import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, nama_lengkap, foto_url')
    .eq('id', user.id)
    .single();

  const userRole = profile?.role || 'admin';

  return (
    <AdminLayoutClient user={user} userRole={userRole} userProfile={profile}>
      {children}
    </AdminLayoutClient>
  );
}
