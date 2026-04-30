import type { Metadata } from "next";
import { getServices } from "@/lib/api/services";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PublicInquiriesClient } from "./PublicInquiriesClient";

type InquirySummary = {
  id: string;
  nama: string;
  layanan_id: string | null;
  status: "baru" | "diproses" | "selesai";
  created_at: string;
};

const FALLBACK_INQUIRIES: InquirySummary[] = [
  {
    id: "1",
    nama: "Budi Santoso",
    status: "baru",
    layanan_id: "gugatan-pmh",
    created_at: "2026-04-29T08:00:00.000Z",
  },
  {
    id: "2",
    nama: "Harianto",
    status: "diproses",
    layanan_id: "perlindungan-konsumen",
    created_at: "2026-04-28T08:00:00.000Z",
  },
  {
    id: "3",
    nama: "Wawan S",
    status: "selesai",
    layanan_id: "mediasi-negosiasi-bisnis",
    created_at: "2026-04-27T08:00:00.000Z",
  },
  {
    id: "4",
    nama: "Citra Dewi",
    status: "selesai",
    layanan_id: null,
    created_at: "2026-04-26T08:00:00.000Z",
  },
];

export const metadata: Metadata = {
  title: "Daftar Konsultasi",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DaftarKonsultasiPage() {
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

  const [{ data: inquiries, error }, services] = await Promise.all([
    supabase
      .from("inquiries")
      .select("id, nama, layanan_id, status, created_at")
      .order("created_at", { ascending: false }),
    getServices(),
  ]);

  let data = (inquiries ?? []) as InquirySummary[];
  if (error && error.code === "PGRST205") {
    data = FALLBACK_INQUIRIES;
  }

  // Masking names securely on server
  const maskedData = data.map((inq) => {
    const nameStr = inq.nama || "Unk";
    const maskedName = nameStr.length > 3 ? nameStr.substring(0, 3) + "********" : nameStr + "*****";

    return {
      ...inq,
      nama: maskedName,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-background pb-16 pt-36 md:pb-24 md:pt-44">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary opacity-[0.05] blur-[120px]" />

        <div className="container relative z-10 mx-auto px-4 text-center md:px-8">
          <span className="mb-6 block text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Transparansi Layanan
          </span>
          <h1 className="mb-8 font-serif text-4xl font-bold leading-[1.05] text-foreground md:text-5xl lg:text-6xl">
            Daftar Antrean Konsultasi
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Pantau status antrean pesan dan konsultasi hukum klien kami secara transparan. Identitas
            pelapor disamarkan untuk menjaga kerahasiaan.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-card py-16 md:py-24">
        <div className="container mx-auto max-w-5xl px-4 md:px-8">
          <PublicInquiriesClient inquiries={maskedData} services={services} />
        </div>
      </section>
    </div>
  );
}
