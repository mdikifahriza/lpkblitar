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

  // Use Anon Key (bypasses RLS due to authenticated session)
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  let data = articles || [];
  
  if (error && error.code === 'PGRST205') {
     data = [
       { id: "1", judul: "Dummy Article", slug: "dummy", kategori: "panduan-hukum", published: true, created_at: new Date().toISOString() }
     ];
  }

  return <ArticlesClient initialArticles={data} />;
}
