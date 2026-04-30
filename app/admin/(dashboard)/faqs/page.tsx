import { createClient } from "@/lib/supabase/server";
import { FaqsClient, type FaqItem, type ServiceOption } from "./FaqsClient";

const fallbackFaqs: FaqItem[] = [
  {
    id: "4722f770-6fb1-4205-9cc2-be98518bc67b",
    pertanyaan: "Berapa biaya konsultasi awal?",
    jawaban:
      "Konsultasi awal dapat dilakukan via WhatsApp untuk menjelaskan gambaran umum masalah Anda. Biaya penanganan perkara akan diinformasikan setelah kami memahami detail masalah dan dokumen yang ada. Kami percaya setiap klien berhak mendapat gambaran biaya yang jelas sebelum memutuskan.",
    layanan_id: null,
    nomor_urut: 1,
    aktif: true,
  },
  {
    id: "02feff9a-55dd-4c46-8ac8-d1902e650156",
    pertanyaan: "Apakah masalah saya harus langsung dibawa ke pengadilan?",
    jawaban:
      "Tidak selalu. Filosofi kami adalah mengutamakan penyelesaian yang efektif dan efisien. Banyak perkara yang dapat selesai melalui somasi terukur, mediasi tertutup, atau negosiasi tanpa harus melalui sidang panjang yang menguras waktu dan biaya. Kami akan merekomendasikan jalur terbaik setelah menganalisa situasi Anda.",
    layanan_id: null,
    nomor_urut: 2,
    aktif: true,
  },
  {
    id: "7260a78a-2881-40a0-89b5-a973b7ff9e21",
    pertanyaan: "Wilayah mana saja yang dilayani?",
    jawaban:
      "Kantor kami berkedudukan di Kabupaten Blitar dan melayani klien dari wilayah Blitar Kota, Blitar Kabupaten, Tulungagung, Kediri, Malang, dan sekitarnya. Untuk konsultasi awal, kami dapat melayani via WhatsApp atau pertemuan online terlebih dahulu.",
    layanan_id: null,
    nomor_urut: 3,
    aktif: true,
  },
  {
    id: "2cfa2bbb-6c58-49bf-9247-c706563669a7",
    pertanyaan: "Dokumen apa yang perlu saya siapkan untuk konsultasi?",
    jawaban:
      "Siapkan dokumen yang berkaitan langsung dengan masalah Anda, misalnya: perjanjian kredit atau kontrak, surat penagihan, berita acara, akta pembiayaan, atau bukti korespondensi. Tidak perlu khawatir jika dokumen belum lengkap — kami akan membantu mengidentifikasi dokumen apa yang dibutuhkan.",
    layanan_id: null,
    nomor_urut: 4,
    aktif: true,
  },
  {
    id: "e414427f-f3f9-4735-8b1a-499974fe8dd5",
    pertanyaan: "Berapa lama proses penyelesaian perkara?",
    jawaban:
      "Durasi sangat bergantung pada jenis dan kompleksitas perkara. Penyelesaian melalui mediasi dan negosiasi umumnya lebih cepat dibanding litigasi. Setelah analisa dokumen, kami akan memberikan estimasi waktu yang realistis agar Anda dapat mempersiapkan diri dengan baik.",
    layanan_id: null,
    nomor_urut: 5,
    aktif: true,
  },
  {
    id: "34cc41fe-a679-46e2-a933-f84e4efa2157",
    pertanyaan: "Apakah kerahasiaan masalah saya terjamin?",
    jawaban:
      "Absolut. Seluruh informasi yang Anda sampaikan kepada kami tunduk pada prinsip kerahasiaan profesional yang wajib kami jaga. Tidak ada informasi klien yang akan dibagikan kepada pihak manapun tanpa izin Anda.",
    layanan_id: null,
    nomor_urut: 6,
    aktif: true,
  },
];

export default async function AdminFaqsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: faqs, error: faqsError }, { data: services }, { data: profile }] = await Promise.all([
    supabase.from("faqs").select("*").order("nomor_urut", { ascending: true }),
    supabase.from("services").select("id, nama, slug").order("nomor_urut", { ascending: true }),
    supabase.from('profiles').select('role').eq('id', user?.id).single()
  ]);

  const faqData =
    faqsError && faqsError.code === "PGRST205"
      ? fallbackFaqs
      : ((faqs ?? []) as FaqItem[]);

  const serviceOptions = ((services ?? []) as ServiceOption[]).map((service) => ({
    id: service.id,
    nama: service.nama,
    slug: service.slug ?? null,
  }));

  const userRole = profile?.role || 'admin';

  return <FaqsClient initialFaqs={faqData} services={serviceOptions} userRole={userRole} />;
}
