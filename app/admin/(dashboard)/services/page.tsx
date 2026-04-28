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

  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .order("nomor_urut", { ascending: true });

  let data = services || [];
  
  if (error && error.code === 'PGRST205') {
     data = [
       { id: "1", nama: "Dummy Service 1", slug: "dummy-1", kategori: "litigasi", aktif: true, nomor_urut: 1 },
       { id: "2", nama: "Dummy Service 2", slug: "dummy-2", kategori: "non-litigasi", aktif: false, nomor_urut: 2 }
     ];
  }

  return <ServicesClient initialServices={data} />;
}
