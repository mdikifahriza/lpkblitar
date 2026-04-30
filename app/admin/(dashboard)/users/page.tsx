import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UsersClient } from "./UsersClient";
import { getUsers } from "./actions";

export default async function AdminUsersPage() {
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

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Get current user role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== 'superadmin') {
    // Redirect non-superadmins back to dashboard
    redirect("/admin");
  }

  const { data: users, error } = await getUsers();

  return <UsersClient initialUsers={users || []} currentUserId={user.id} />;
}
