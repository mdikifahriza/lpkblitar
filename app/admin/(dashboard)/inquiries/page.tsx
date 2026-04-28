import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { InquiriesClient } from "./InquiriesClient";

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

  const { data: inquiries, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  // Handle if inquiries table does not exist
  let data = inquiries || [];
  if (error && error.code === 'PGRST205') {
    data = [
      { id: "1", nama: "Dummy Client 1", no_hp: "0812345678", email: "dummy1@test.com", pesan: "Test message 1", status: "baru", created_at: new Date().toISOString() },
      { id: "2", nama: "Dummy Client 2", no_hp: "0812345679", email: "dummy2@test.com", pesan: "Test message 2", status: "diproses", created_at: new Date().toISOString() }
    ];
  }

  return <InquiriesClient initialInquiries={data} />;
}
