import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { InquiriesClient } from "./InquiriesClient";
import { getServices } from "@/lib/api/services";

export default async function AdminInquiriesPage() {
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

  const [{ data: inquiries, error }, services, { data: profile }] = await Promise.all([
    supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false }),
    getServices(),
    user ? supabase.from('profiles').select('role').eq('id', user.id).single() : Promise.resolve({ data: null })
  ]);

  if (error) {
    console.error("Error fetching inquiries:", error.message);
  }

  const data = (inquiries as any[]) || [];
  
  if (data.length === 0) {
    const { error: countError } = await supabase.from("inquiries").select('*', { count: 'exact', head: true });
    
    if (countError && countError.code === '42P01') {
      return (
        <div className="p-8 text-center text-muted-foreground">
          <p>Tabel inquiries belum dibuat. Jalankan migration database terlebih dahulu.</p>
        </div>
      );
    }
  }

  const userRole = profile?.role || 'admin';

  return <InquiriesClient initialInquiries={data} services={services} userRole={userRole} />;
}