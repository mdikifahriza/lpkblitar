import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ArticlesClient } from "./ArticlesClient";

export default async function AdminArticlesPage() {
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

  const [{ data: articles, error }, { data: profile }] = await Promise.all([
    supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false }),
    user ? supabase.from('profiles').select('role').eq('id', user.id).single() : Promise.resolve({ data: null })
  ]);

  if (error) {
    if (error.code === '42P01') {
      return (
        <div className="p-8 text-center text-muted-foreground">
          <p>Tabel articles belum dibuat. Jalankan migration database terlebih dahulu.</p>
        </div>
      );
    }
    console.error("Error fetching articles:", error.message);
  }

  const userRole = profile?.role || 'admin';

  return <ArticlesClient initialArticles={articles || []} userRole={userRole} />;
}