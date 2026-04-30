import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ServicesClient } from "./ServicesClient";

export default async function AdminServicesPage() {
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

  const [{ data: services, error }, { data: profile }] = await Promise.all([
    supabase
      .from('services')
      .select('*')
      .order('nomor_urut', { ascending: true }),
    user ? supabase.from('profiles').select('role').eq('id', user.id).single() : Promise.resolve({ data: null })
  ]);

  if (error) {
    if (error.code === '42P01') {
      return (
        <div className="p-8 text-center text-muted-foreground">
          <p>Tabel services belum dibuat. Jalankan migration database terlebih dahulu.</p>
        </div>
      );
    }
    console.error("Error fetching services:", error.message);
  }

  const userRole = profile?.role || 'admin';

  return <ServicesClient initialServices={services || []} userRole={userRole} />;
}