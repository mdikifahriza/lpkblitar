export type ServiceCategory =
  | "Litigasi"
  | "Non-Litigasi"
  | "Perlindungan Konsumen"
  | "Konsultasi Usaha";

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceDetail {
  longDescription: string[];
  conditions: string[];
  process: { title: string; description: string }[];
  documents: string[];
  faqs: ServiceFAQ[];
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ServiceCategory;
  detail: ServiceDetail;
}

export const SERVICE_CATEGORIES: Array<"Semua" | ServiceCategory> = [
  "Semua",
  "Litigasi",
  "Non-Litigasi",
  "Perlindungan Konsumen",
  "Konsultasi Usaha"
];

export const SERVICES: Service[] = [
  {
    id: "01",
    slug: "gugatan-perbuatan-melawan-hukum",
    title: "Gugatan Perbuatan Melawan Hukum",
    description: "Pendampingan hukum untuk kerugian yang timbul akibat tindakan melawan hukum oleh pihak lain.",
    category: "Litigasi",
    detail: {
      longDescription: [
        "Gugatan Perbuatan Melawan Hukum (PMH) diatur dalam Pasal 1365 KUH Perdata. Gugatan ini diajukan ketika seseorang atau badan hukum melakukan perbuatan yang melanggar hukum, kesusilaan, atau kepatutan, sehingga menimbulkan kerugian bagi pihak lain.",
        "Berbeda dengan wanprestasi yang berakar dari hubungan kontraktual, PMH dapat diajukan tanpa adanya perjanjian sebelumnya antara penggugat dan tergugat. Pembuktian PMH menuntut analisa menyeluruh atas unsur perbuatan, kesalahan, kerugian, serta hubungan kausal antara perbuatan dan kerugian.",
        "Tim kami mendampingi klien sejak tahap pengumpulan bukti, perumusan posita, penyusunan petitum, hingga pelaksanaan persidangan dan eksekusi putusan."
      ],
      conditions: [
        "Anda mengalami kerugian akibat tindakan pihak lain di luar perjanjian.",
        "Hak Anda dilanggar oleh perbuatan yang bertentangan dengan hukum.",
        "Kerugian yang dialami bersifat materiil maupun imateriil.",
        "Pihak lawan menolak bertanggung jawab atas perbuatannya.",
        "Anda membutuhkan ganti rugi yang setimpal melalui jalur pengadilan."
      ],
      process: [
        { title: "Konsultasi & Analisa Kasus", description: "Kami menelaah kronologi, mengidentifikasi unsur PMH, dan menilai kekuatan posisi hukum Anda." },
        { title: "Pengumpulan Bukti", description: "Pengumpulan dokumen, keterangan saksi, dan bukti elektronik yang relevan dengan perbuatan tergugat." },
        { title: "Penyusunan Gugatan", description: "Merumuskan posita dan petitum yang tajam, termasuk perhitungan kerugian materiil dan imateriil." },
        { title: "Persidangan & Putusan", description: "Mendampingi seluruh tahap persidangan hingga putusan berkekuatan hukum tetap dan eksekusi." }
      ],
      documents: [
        "Identitas diri (KTP, KK).",
        "Kronologi peristiwa secara tertulis dan rinci.",
        "Bukti kerugian materiil (kuitansi, transfer, faktur).",
        "Surat, pesan, atau dokumen komunikasi dengan pihak lawan.",
        "Identitas dan alamat lengkap pihak tergugat.",
        "Bukti pendukung lain seperti foto, rekaman, atau keterangan saksi."
      ],
      faqs: [
        { question: "Apa bedanya PMH dengan wanprestasi?", answer: "PMH tidak memerlukan adanya perjanjian, sedangkan wanprestasi berasal dari pelanggaran kewajiban dalam suatu perjanjian." },
        { question: "Berapa lama proses gugatan PMH di pengadilan?", answer: "Pada umumnya 4–6 bulan di tingkat pertama, namun dapat lebih lama bila ada upaya hukum banding atau kasasi." },
        { question: "Apakah saya bisa menuntut ganti rugi imateriil?", answer: "Ya. Kerugian imateriil seperti rusaknya nama baik dapat dituntut sepanjang dapat dibuktikan dan didukung argumentasi hukum yang kuat." },
        { question: "Bagaimana jika tergugat tidak memiliki aset?", answer: "Kami akan menelusuri kondisi keuangan dan aset tergugat sejak awal agar putusan dapat dieksekusi secara nyata." }
      ]
    }
  },
  {
    id: "02",
    slug: "gugatan-wanprestasi",
    title: "Gugatan Wanprestasi",
    description: "Penyelesaian sengketa akibat kegagalan pemenuhan kewajiban dalam suatu perjanjian atau kontrak.",
    category: "Litigasi",
    detail: {
      longDescription: [
        "Wanprestasi terjadi ketika salah satu pihak dalam suatu perjanjian tidak memenuhi prestasinya sebagaimana yang telah disepakati. Bentuknya bisa berupa tidak melaksanakan sama sekali, terlambat, melaksanakan tetapi tidak sebagaimana mestinya, atau melakukan sesuatu yang dilarang dalam perjanjian.",
        "Dasar hukum gugatan wanprestasi merujuk pada Pasal 1238 dan 1243 KUH Perdata. Sebelum mengajukan gugatan, umumnya diperlukan pengiriman somasi sebagai bukti bahwa pihak lawan telah lalai memenuhi kewajibannya.",
        "Tim kami membantu Anda merumuskan strategi terbaik — apakah menempuh penyelesaian damai, mediasi, atau gugatan ke pengadilan — agar hak Anda terpenuhi dengan cara yang paling efisien."
      ],
      conditions: [
        "Pihak lawan tidak menyelesaikan kewajibannya dalam perjanjian.",
        "Pembayaran terhadap Anda terlambat atau tidak dilakukan.",
        "Hasil pekerjaan tidak sesuai dengan kesepakatan.",
        "Anda telah memberikan somasi tanpa direspons dengan baik.",
        "Anda mengalami kerugian akibat keterlambatan atau ketidakpenuhan janji."
      ],
      process: [
        { title: "Telaah Perjanjian", description: "Kami memeriksa klausul perjanjian dan menentukan bentuk wanprestasi yang terjadi." },
        { title: "Somasi", description: "Menyampaikan somasi resmi sebagai langkah formal sebelum gugatan diajukan." },
        { title: "Penyusunan Gugatan", description: "Merumuskan tuntutan pemenuhan prestasi, ganti rugi, atau pembatalan perjanjian." },
        { title: "Penyelesaian", description: "Mendampingi proses persidangan atau negosiasi hingga sengketa selesai." }
      ],
      documents: [
        "Perjanjian asli antara para pihak.",
        "Bukti pelaksanaan kewajiban dari pihak Anda.",
        "Bukti pembayaran, transfer, atau invoice yang tidak dipenuhi.",
        "Komunikasi tertulis (email, WhatsApp, surat) dengan pihak lawan.",
        "Surat somasi yang pernah dikirim, jika ada.",
        "Dokumen pendukung lain seperti berita acara serah terima."
      ],
      faqs: [
        { question: "Apakah saya wajib mengirim somasi sebelum menggugat?", answer: "Sangat dianjurkan. Somasi membuktikan bahwa pihak lawan telah dinyatakan lalai sebelum gugatan diajukan." },
        { question: "Apa yang bisa saya tuntut dalam gugatan wanprestasi?", answer: "Pemenuhan prestasi, ganti rugi, pembatalan perjanjian dengan ganti rugi, atau kombinasi sesuai kerugian Anda." },
        { question: "Bagaimana jika perjanjian hanya secara lisan?", answer: "Tetap bisa, namun pembuktian akan lebih sulit dan memerlukan bukti pendukung seperti saksi atau bukti transfer." },
        { question: "Apakah bisa diselesaikan tanpa pengadilan?", answer: "Bisa, melalui negosiasi atau mediasi. Kami selalu mengutamakan jalur non-litigasi bila memungkinkan." }
      ]
    }
  },
  {
    id: "03",
    slug: "gugatan-ganti-kerugian",
    title: "Gugatan Ganti Kerugian",
    description: "Tuntutan kompensasi atas kerugian materiil maupun imateriil yang dialami klien.",
    category: "Litigasi",
    detail: {
      longDescription: [
        "Gugatan ganti kerugian bertujuan memperoleh kompensasi atas kerugian yang dialami akibat perbuatan, kelalaian, atau kegagalan pihak lain memenuhi kewajibannya. Tuntutan ini dapat berdiri sendiri atau menyertai gugatan PMH dan wanprestasi.",
        "Perhitungan kerugian harus dilakukan secara cermat dan dapat dibuktikan. Kerugian materiil meliputi kerugian nyata yang sudah terjadi (damnum emergens) dan keuntungan yang seharusnya diperoleh (lucrum cessans). Kerugian imateriil mencakup kerusakan nama baik, tekanan psikologis, dan kerugian moril lainnya.",
        "Kami membantu menyusun perhitungan kerugian yang realistis, didukung bukti yang kuat, sehingga peluang petitum dikabulkan menjadi optimal."
      ],
      conditions: [
        "Anda mengalami kerugian finansial nyata akibat tindakan pihak lain.",
        "Anda kehilangan keuntungan yang seharusnya diperoleh.",
        "Nama baik atau reputasi Anda dirugikan.",
        "Pihak lawan menolak menyelesaikan ganti rugi secara damai.",
        "Anda memiliki bukti pendukung kerugian yang dialami."
      ],
      process: [
        { title: "Identifikasi Kerugian", description: "Memetakan jenis dan nilai kerugian secara detail dan sistematis." },
        { title: "Perhitungan Nilai", description: "Menyusun perhitungan kerugian materiil dan imateriil yang dapat dipertanggungjawabkan." },
        { title: "Penyusunan Petitum", description: "Merumuskan tuntutan ganti rugi yang spesifik dan sesuai dengan dasar hukum." },
        { title: "Pendampingan Sidang", description: "Mempresentasikan bukti dan argumentasi hingga putusan dijatuhkan." }
      ],
      documents: [
        "Bukti kerugian materiil (kuitansi, invoice, laporan keuangan).",
        "Perhitungan keuntungan yang hilang (jika ada).",
        "Bukti komunikasi atau pemberitaan terkait kerugian imateriil.",
        "Dokumen perjanjian atau kronologi peristiwa.",
        "Surat keterangan dari pihak yang relevan.",
        "Identitas para pihak yang akan digugat."
      ],
      faqs: [
        { question: "Apa beda kerugian materiil dan imateriil?", answer: "Materiil adalah kerugian yang dapat dihitung dengan uang secara langsung, sedangkan imateriil bersifat moril seperti nama baik atau penderitaan psikis." },
        { question: "Apakah kerugian imateriil pasti dikabulkan?", answer: "Tidak otomatis. Hakim akan menilai kepatutan, kewajaran, dan bukti pendukung yang Anda ajukan." },
        { question: "Bisakah dituntut bersamaan dengan gugatan lain?", answer: "Ya. Ganti rugi sering dikombinasikan dengan gugatan PMH atau wanprestasi sebagai konsekuensi pelanggaran." },
        { question: "Bagaimana cara menghitung keuntungan yang hilang?", answer: "Dihitung berdasarkan proyeksi wajar yang didukung data historis usaha atau kontrak yang batal." }
      ]
    }
  },
  {
    id: "04",
    slug: "bantahan-perlawanan",
    title: "Bantahan & Perlawanan",
    description: "Upaya hukum menolak atau melawan penetapan eksekusi yang merugikan hak klien.",
    category: "Litigasi",
    detail: {
      longDescription: [
        "Bantahan (verzet) dan perlawanan adalah upaya hukum yang ditujukan terhadap putusan verstek, sita eksekusi, atau penetapan pengadilan yang dianggap merugikan pihak ketiga maupun pihak yang berkepentingan.",
        "Perlawanan pihak ketiga (derden verzet) khususnya digunakan ketika harta milik Anda turut disita meskipun Anda bukan pihak dalam perkara utama. Ketepatan tenggang waktu pengajuan sangat krusial agar upaya ini dapat diterima.",
        "Kami memberikan analisa cepat dan tindakan strategis untuk melindungi hak Anda sebelum eksekusi dilaksanakan."
      ],
      conditions: [
        "Anda menerima putusan verstek dan tidak hadir di sidang sebelumnya.",
        "Harta Anda turut disita padahal Anda bukan pihak dalam perkara.",
        "Penetapan eksekusi mengandung cacat prosedural.",
        "Ada kekeliruan obyek yang dieksekusi.",
        "Anda perlu menunda atau membatalkan eksekusi yang merugikan."
      ],
      process: [
        { title: "Pemeriksaan Penetapan", description: "Memeriksa salinan penetapan, berita acara sita, dan dokumen pendukung." },
        { title: "Penyusunan Bantahan", description: "Merumuskan dalil bantahan atau perlawanan sesuai jenis upaya hukum." },
        { title: "Pengajuan ke Pengadilan", description: "Mengajukan bantahan dalam tenggang waktu yang ditentukan undang-undang." },
        { title: "Sidang & Putusan", description: "Mendampingi pemeriksaan dan memperjuangkan pencabutan sita atau pembatalan putusan." }
      ],
      documents: [
        "Salinan putusan atau penetapan eksekusi.",
        "Berita acara sita atau pemanggilan eksekusi.",
        "Bukti kepemilikan atas obyek yang disita (sertifikat, BPKB, kuitansi).",
        "Identitas dan alamat lengkap para pihak.",
        "Bukti yang menunjukkan ketidakhadiran karena alasan yang sah.",
        "Dokumen pendukung lain yang relevan dengan perkara pokok."
      ],
      faqs: [
        { question: "Berapa lama batas waktu mengajukan verzet?", answer: "Umumnya 14 hari sejak putusan verstek diberitahukan kepada Anda." },
        { question: "Apakah perlawanan dapat menunda eksekusi?", answer: "Bisa, jika hakim menilai ada cukup alasan untuk menunda demi melindungi hak pihak yang berkepentingan." },
        { question: "Apa yang dimaksud derden verzet?", answer: "Perlawanan pihak ketiga atas sita yang menyangkut barang miliknya, padahal ia bukan pihak dalam perkara utama." },
        { question: "Apakah saya bisa banding atas putusan bantahan?", answer: "Ya, putusan atas bantahan dapat diajukan banding atau kasasi sesuai ketentuan hukum acara." }
      ]
    }
  },
  {
    id: "05",
    slug: "perlindungan-konsumen",
    title: "Perlindungan Konsumen",
    description: "Pembelaan hak-hak konsumen terhadap praktik bisnis yang merugikan atau produk cacat.",
    category: "Perlindungan Konsumen",
    detail: {
      longDescription: [
        "Berdasarkan UU No. 8 Tahun 1999 tentang Perlindungan Konsumen, setiap konsumen berhak atas keamanan, kenyamanan, informasi yang benar, serta kompensasi atas kerugian akibat barang dan/atau jasa yang tidak sesuai janji.",
        "Praktik usaha yang merugikan dapat mencakup produk cacat, iklan menyesatkan, klausula baku yang merugikan, hingga layanan yang tidak sesuai standar. Penyelesaiannya dapat ditempuh melalui Badan Penyelesaian Sengketa Konsumen (BPSK), gugatan ke pengadilan, atau jalur damai.",
        "Tim kami memiliki pengalaman menangani sengketa konsumen di berbagai sektor — pembiayaan, e-commerce, properti, dan jasa keuangan."
      ],
      conditions: [
        "Anda menerima produk yang cacat atau tidak sesuai pesanan.",
        "Iklan produk menyesatkan atau klaim tidak terbukti.",
        "Garansi atau layanan purna jual tidak dipenuhi pelaku usaha.",
        "Anda dirugikan oleh klausul baku yang berat sebelah.",
        "Pelaku usaha menolak bertanggung jawab atas kerugian Anda."
      ],
      process: [
        { title: "Konsultasi & Pemetaan Hak", description: "Memetakan hak konsumen yang dilanggar dan jalur penyelesaian yang paling efektif." },
        { title: "Surat Keberatan / Somasi", description: "Mengirim teguran resmi kepada pelaku usaha sebagai langkah pertama." },
        { title: "Pengajuan Sengketa", description: "Membawa perkara ke BPSK, OJK, atau pengadilan sesuai kewenangan." },
        { title: "Penyelesaian & Eksekusi", description: "Mengawal proses hingga ganti rugi atau pemenuhan hak diperoleh." }
      ],
      documents: [
        "Bukti pembelian (struk, invoice, bukti transfer).",
        "Foto atau video produk yang cacat.",
        "Iklan, brosur, atau penawaran yang Anda terima.",
        "Surat garansi atau perjanjian layanan.",
        "Komunikasi dengan pelaku usaha (chat, email, surat).",
        "Identitas pelaku usaha (nama PT, alamat, NPWP jika ada)."
      ],
      faqs: [
        { question: "Apa itu BPSK dan kapan digunakan?", answer: "BPSK adalah Badan Penyelesaian Sengketa Konsumen untuk menyelesaikan sengketa konsumen secara cepat dan murah di luar pengadilan." },
        { question: "Apakah biaya berperkara di BPSK mahal?", answer: "Tidak. Proses di BPSK relatif murah dan dirancang agar mudah diakses konsumen." },
        { question: "Apa hak utama konsumen menurut undang-undang?", answer: "Hak atas keamanan, informasi yang benar, didengar, mendapatkan ganti rugi, hingga advokasi dan pendidikan konsumen." },
        { question: "Apa yang bisa dituntut dari pelaku usaha?", answer: "Pengembalian uang, penggantian produk, perawatan kesehatan, atau ganti rugi sesuai kerugian Anda." }
      ]
    }
  },
  {
    id: "06",
    slug: "sengketa-leasing-pembiayaan",
    title: "Sengketa Leasing & Pembiayaan",
    description: "Penyelesaian masalah penarikan paksa kendaraan dan sengketa dengan perusahaan pembiayaan.",
    category: "Perlindungan Konsumen",
    detail: {
      longDescription: [
        "Penarikan kendaraan oleh perusahaan pembiayaan tanpa prosedur yang sah merupakan pelanggaran hukum. Putusan Mahkamah Konstitusi No. 18/PUU-XVII/2019 menegaskan bahwa eksekusi jaminan fidusia harus melalui pengadilan apabila debitur tidak mengakui adanya wanprestasi.",
        "Kami mendampingi konsumen yang mengalami penarikan paksa, intimidasi debt collector, atau perhitungan tunggakan yang tidak transparan. Selain itu, kami juga menangani permasalahan klausul baku yang merugikan dalam perjanjian pembiayaan.",
        "Pendekatan kami menggabungkan negosiasi dengan pihak leasing dan jalur hukum bila diperlukan agar hak konsumen tetap terlindungi."
      ],
      conditions: [
        "Kendaraan ditarik paksa di jalan tanpa surat kuasa eksekusi.",
        "Anda menerima intimidasi atau ancaman dari debt collector.",
        "Perhitungan tunggakan tidak transparan atau tidak sesuai perjanjian.",
        "Perusahaan pembiayaan menolak restrukturisasi yang wajar.",
        "Anda dipaksa menandatangani dokumen di bawah tekanan."
      ],
      process: [
        { title: "Telaah Perjanjian Pembiayaan", description: "Memeriksa klausul, jaminan fidusia, dan riwayat pembayaran Anda." },
        { title: "Negosiasi Restrukturisasi", description: "Mengupayakan jalur damai melalui restrukturisasi atau penjadwalan ulang." },
        { title: "Upaya Hukum", description: "Mengajukan gugatan PMH atau perlindungan konsumen bila negosiasi gagal." },
        { title: "Pemulihan Hak", description: "Mengupayakan pengembalian kendaraan dan/atau ganti rugi." }
      ],
      documents: [
        "Perjanjian pembiayaan dan akta jaminan fidusia.",
        "Bukti angsuran dan riwayat pembayaran.",
        "Bukti penarikan kendaraan (foto, video, saksi).",
        "Surat peringatan dari pihak leasing.",
        "BPKB / fotokopi BPKB jika tersedia.",
        "Identitas pihak penarik (nama, kartu identitas, perusahaan)."
      ],
      faqs: [
        { question: "Apakah leasing boleh menarik kendaraan di jalan?", answer: "Tidak. Berdasarkan Putusan MK, eksekusi harus melalui pengadilan apabila debitur tidak mengakui wanprestasi." },
        { question: "Apa yang harus saya lakukan saat kendaraan ditarik?", answer: "Minta surat kuasa eksekusi dan identitas penarik. Catat kronologi, foto/video, dan segera hubungi kuasa hukum Anda." },
        { question: "Bisakah saya menuntut ganti rugi?", answer: "Bisa. Penarikan tanpa prosedur sah dapat digugat sebagai PMH dengan tuntutan pengembalian kendaraan dan ganti rugi." },
        { question: "Apakah restrukturisasi pasti diberikan?", answer: "Tidak otomatis. Namun perusahaan pembiayaan didorong oleh OJK untuk mempertimbangkan restrukturisasi yang wajar." }
      ]
    }
  },
  {
    id: "07",
    slug: "cessie-pengalihan-piutang",
    title: "Cessie & Pengalihan Piutang",
    description: "Penanganan sengketa yang berkaitan dengan proses pengalihan hak tagih (cessie).",
    category: "Konsultasi Usaha",
    detail: {
      longDescription: [
        "Cessie adalah pengalihan hak atas piutang dari kreditur lama (cedent) kepada kreditur baru (cessionaris). Diatur dalam Pasal 613 KUH Perdata, cessie sah apabila dilakukan dengan akta otentik atau di bawah tangan dan diberitahukan kepada debitur.",
        "Sengketa cessie sering muncul ketika debitur tidak diberitahu, akta pengalihan tidak sah, jumlah pengalihan dipersengketakan, atau penagih baru bertindak melampaui haknya. Proses ini juga umum digunakan dalam transaksi jual-beli kredit macet (NPL).",
        "Kami memberikan pendampingan baik kepada cessionaris yang ingin menagih, maupun debitur yang merasa proses cessie terhadap dirinya tidak sah."
      ],
      conditions: [
        "Anda didatangi penagih baru tanpa pemberitahuan resmi.",
        "Anda meragukan keabsahan akta cessie.",
        "Jumlah piutang yang dialihkan tidak sesuai dengan kewajiban Anda.",
        "Anda hendak melakukan jual-beli piutang secara aman.",
        "Terjadi perbedaan klaim antara kreditur lama dan baru."
      ],
      process: [
        { title: "Verifikasi Keabsahan Cessie", description: "Memeriksa akta, pemberitahuan, dan dasar hukum pengalihan piutang." },
        { title: "Analisa Posisi Hukum", description: "Menentukan apakah Anda berperan sebagai cedent, cessionaris, atau debitur tertagih." },
        { title: "Negosiasi atau Gugatan", description: "Menyusun strategi penyelesaian, termasuk mediasi atau gugatan pembatalan." },
        { title: "Pengamanan Hak", description: "Mengamankan eksekusi atau pemulihan hak sesuai kepentingan klien." }
      ],
      documents: [
        "Akta cessie dan dokumen pengalihan.",
        "Surat pemberitahuan kepada debitur.",
        "Perjanjian utang piutang awal.",
        "Bukti pembayaran yang pernah dilakukan.",
        "Korespondensi dengan kreditur lama dan baru.",
        "Identitas seluruh pihak yang terlibat."
      ],
      faqs: [
        { question: "Apakah cessie sah tanpa pemberitahuan ke debitur?", answer: "Cessie sah antara cedent dan cessionaris, namun belum mengikat debitur sebelum diberitahukan secara resmi." },
        { question: "Apakah debitur bisa membatalkan cessie?", answer: "Bisa, jika dapat dibuktikan adanya cacat hukum atau pelanggaran prosedur dalam pengalihan." },
        { question: "Apa risiko membeli piutang macet?", answer: "Risiko utamanya adalah kesulitan eksekusi dan ketidakjelasan jumlah tagihan. Diperlukan due diligence yang ketat." },
        { question: "Bagaimana posisi jaminan setelah cessie?", answer: "Jaminan ikut beralih kepada cessionaris sepanjang dicantumkan dalam akta dan didaftarkan sesuai ketentuan." }
      ]
    }
  },
  {
    id: "08",
    slug: "mediasi-penyelesaian-sengketa",
    title: "Mediasi & Penyelesaian Sengketa",
    description: "Upaya penyelesaian masalah hukum di luar pengadilan secara damai dan menguntungkan.",
    category: "Non-Litigasi",
    detail: {
      longDescription: [
        "Mediasi adalah proses penyelesaian sengketa di luar pengadilan dengan bantuan mediator yang netral. Diatur dalam UU No. 30 Tahun 1999 dan Perma No. 1 Tahun 2016, mediasi memungkinkan para pihak mencapai kesepakatan yang lebih cepat, lebih murah, dan tetap menjaga hubungan baik.",
        "Penyelesaian non-litigasi cocok untuk sengketa kontraktual, perselisihan bisnis, konflik internal perusahaan, hingga sengketa keluarga. Hasil mediasi yang dituangkan dalam akta perdamaian dapat memiliki kekuatan eksekutorial setara putusan pengadilan.",
        "Kami menyediakan jasa mediator, perumusan kesepakatan damai, dan pendampingan negosiasi yang efektif."
      ],
      conditions: [
        "Anda ingin menyelesaikan sengketa secara cepat dan rahasia.",
        "Hubungan bisnis dengan pihak lawan ingin tetap dijaga.",
        "Biaya dan waktu litigasi dirasa terlalu memberatkan.",
        "Para pihak masih membuka peluang dialog.",
        "Anda membutuhkan kesepakatan tertulis yang mengikat."
      ],
      process: [
        { title: "Pemetaan Sengketa", description: "Memahami posisi para pihak dan kepentingan mendasar masing-masing." },
        { title: "Penjajakan Mediasi", description: "Mengajak pihak lawan untuk duduk bersama dan menyetujui proses mediasi." },
        { title: "Sesi Mediasi", description: "Memandu dialog yang konstruktif untuk mencapai titik temu." },
        { title: "Akta Perdamaian", description: "Menuangkan kesepakatan dalam dokumen yang mengikat secara hukum." }
      ],
      documents: [
        "Identitas para pihak.",
        "Dokumen perjanjian atau kronologi sengketa.",
        "Bukti pendukung posisi masing-masing pihak.",
        "Surat menyurat sebelumnya antara para pihak.",
        "Daftar tuntutan atau kepentingan yang ingin dicapai.",
        "Kuasa khusus jika diwakili oleh kuasa hukum."
      ],
      faqs: [
        { question: "Apakah hasil mediasi mengikat secara hukum?", answer: "Ya, jika dituangkan dalam akta perdamaian dan didaftarkan ke pengadilan, kesepakatan menjadi mengikat dan dapat dieksekusi." },
        { question: "Berapa lama proses mediasi?", answer: "Umumnya 2–4 minggu, jauh lebih singkat dibanding proses litigasi penuh." },
        { question: "Apa yang terjadi bila mediasi gagal?", answer: "Para pihak masih dapat menempuh jalur litigasi. Catatan mediasi tetap rahasia dan tidak dapat dijadikan bukti di pengadilan." },
        { question: "Siapa yang menanggung biaya mediasi?", answer: "Biasanya dibagi rata antara para pihak, namun bisa disesuaikan berdasarkan kesepakatan." }
      ]
    }
  }
];

export const WORKFLOW = [
  {
    id: "01",
    title: "Konsultasi Awal",
    description: "Kami mendengarkan permasalahan Anda secara saksama dan menjaga kerahasiaan informasi."
  },
  {
    id: "02",
    title: "Analisa Dokumen & Fakta",
    description: "Tim kami mengkaji bukti dan memetakan posisi hukum Anda secara mendalam."
  },
  {
    id: "03",
    title: "Strategi Hukum",
    description: "Merumuskan langkah litigasi atau non-litigasi yang paling efektif dan efisien."
  },
  {
    id: "04",
    title: "Penyelesaian",
    description: "Eksekusi strategi untuk mencapai hasil terbaik dan tuntas bagi klien."
  }
];

export type TeamDivision =
  | "Litigasi"
  | "Non-Litigasi"
  | "Analisa Dokumen"
  | "Negosiasi";

export const TEAM_DIVISIONS: Array<"Semua" | TeamDivision> = [
  "Semua",
  "Litigasi",
  "Non-Litigasi",
  "Analisa Dokumen",
  "Negosiasi"
];

export interface TeamMember {
  name: string;
  position: string;
  specialization: string;
  image: string;
  division: TeamDivision;
  bio: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "Budi Santoso, S.H., M.H.",
    position: "Senior Associate",
    specialization: "Litigasi Perdata & Komersial",
    image: "/images/team-1.png",
    division: "Litigasi",
    bio: "Berpengalaman lebih dari 12 tahun menangani sengketa perdata, gugatan PMH, dan wanprestasi di berbagai tingkat pengadilan."
  },
  {
    name: "Siti Rahmawati, S.H.",
    position: "Associate",
    specialization: "Hukum Perlindungan Konsumen",
    image: "/images/team-2.png",
    division: "Negosiasi",
    bio: "Fokus pada advokasi konsumen, sengketa BPSK, serta negosiasi penyelesaian sengketa pembiayaan dan e-commerce."
  },
  {
    name: "Agus Pratama, S.H.",
    position: "Associate",
    specialization: "Sengketa Pembiayaan",
    image: "/images/team-3.png",
    division: "Non-Litigasi",
    bio: "Spesialis penanganan sengketa leasing, restrukturisasi utang, dan penyelesaian sengketa di luar pengadilan."
  },
  {
    name: "Dewi Lestari, S.H.",
    position: "Junior Associate",
    specialization: "Riset Hukum & Mediasi",
    image: "/images/team-4.png",
    division: "Analisa Dokumen",
    bio: "Bertanggung jawab atas riset yurisprudensi, telaah perjanjian, serta penyusunan memorandum hukum yang presisi."
  }
];

export const PRINCIPAL = {
  name: "Hari Mulana Hutabarat, S.H., CPLA",
  position: "Principal & Founder",
  image: "/images/principal.png",
  bio: [
    "Hari Mulana Hutabarat, S.H., CPLA adalah pendiri sekaligus pimpinan Kantor Konsultan Hukum & Perlindungan Konsumen yang berfokus pada penanganan sengketa keperdataan, perlindungan konsumen, serta sengketa pembiayaan. Lebih dari satu setengah dekade berkecimpung di dunia advokasi, beliau dikenal dengan pendekatan yang strategis, analitis, dan selalu mengutamakan kepentingan jangka panjang klien.",
    "Sebagai pemegang sertifikasi Certified Professional in Legal Audit (CPLA), beliau memiliki kapasitas yang teruji dalam melakukan audit hukum, telaah perjanjian, serta perumusan strategi mitigasi risiko bagi pelaku usaha. Pengalaman menangani ratusan perkara — dari sengketa perdata kompleks hingga sengketa konsumen di berbagai sektor — menjadikan beliau rujukan bagi klien yang menghadapi situasi hukum yang menuntut ketelitian dan kecepatan.",
    "Filosofi praktik beliau bertumpu pada tiga pilar: integritas tanpa kompromi, analisa hukum yang tajam, dan komunikasi yang jujur kepada klien. Setiap perkara yang masuk diperlakukan secara personal — tanpa janji yang berlebihan, tanpa biaya tersembunyi, dan dengan strategi yang dirancang khusus berdasarkan fakta serta posisi hukum klien.",
    "Selain praktik di pengadilan, beliau aktif memberikan edukasi hukum kepada masyarakat melalui forum, tulisan, dan kanal media sosial — dengan keyakinan bahwa pemahaman hukum yang baik adalah bentuk perlindungan paling fundamental bagi setiap individu maupun pelaku usaha."
  ],
  skills: [
    "Sengketa Perdata Kompleks",
    "Hukum Perlindungan Konsumen",
    "Sengketa Leasing & Pembiayaan",
    "Mediasi & Negosiasi Bisnis",
    "Audit Hukum & Telaah Perjanjian",
    "Litigasi Perbuatan Melawan Hukum"
  ],
  certifications: [
    "Sarjana Hukum (S.H.) — Fakultas Hukum",
    "Certified Professional in Legal Audit (CPLA)",
    "Anggota Perhimpunan Advokat Indonesia (PERADI)",
    "Bersertifikat Mediator Non-Hakim"
  ]
};

export interface Division {
  name: string;
  icon: "scale" | "handshake" | "fileSearch" | "megaphone";
  description: string;
  responsibilities: string[];
}

export const DIVISIONS: Division[] = [
  {
    name: "Lawyer Litigasi",
    icon: "scale",
    description: "Divisi yang berfokus pada penanganan perkara di pengadilan, mulai dari penyusunan gugatan hingga eksekusi putusan.",
    responsibilities: [
      "Menyusun gugatan dan jawaban di pengadilan negeri.",
      "Mendampingi klien pada seluruh tahap persidangan.",
      "Menangani upaya hukum banding, kasasi, dan peninjauan kembali."
    ]
  },
  {
    name: "Non-Litigasi & Negosiasi",
    icon: "handshake",
    description: "Divisi yang menangani penyelesaian sengketa di luar pengadilan melalui negosiasi, mediasi, dan restrukturisasi.",
    responsibilities: [
      "Menyusun strategi penyelesaian damai dan mediasi.",
      "Memimpin negosiasi dengan pihak lawan atau kreditur.",
      "Merumuskan akta perdamaian yang mengikat secara hukum."
    ]
  },
  {
    name: "Analisa Dokumen",
    icon: "fileSearch",
    description: "Divisi yang melakukan telaah, audit, dan riset hukum atas seluruh dokumen yang menjadi pijakan strategi perkara.",
    responsibilities: [
      "Melakukan telaah perjanjian dan dokumen kontraktual.",
      "Menyusun legal opinion dan memorandum hukum.",
      "Riset yurisprudensi dan dasar hukum yang relevan."
    ]
  },
  {
    name: "Pengaduan Instansi",
    icon: "megaphone",
    description: "Divisi yang menangani pengaduan dan koordinasi dengan lembaga seperti BPSK, OJK, kepolisian, hingga lembaga perlindungan konsumen.",
    responsibilities: [
      "Menyusun dan mengajukan pengaduan ke instansi terkait.",
      "Melakukan koordinasi dengan BPSK, OJK, dan LBH.",
      "Mengawal proses pengaduan hingga rekomendasi terbit."
    ]
  }
];

export const TESTIMONIALS = [
  {
    quote: "Kantor Hukum Hari Mulana sangat profesional. Masalah penarikan kendaraan saya oleh leasing berhasil diselesaikan dengan baik tanpa perlu sidang panjang.",
    client: "R.A.",
    service: "Sengketa Leasing"
  },
  {
    quote: "Analisa hukumnya sangat tajam. Mereka membeberkan strategi yang jelas sejak awal konsultasi. Saya merasa sangat terbantu dalam gugatan wanprestasi.",
    client: "H.S.",
    service: "Gugatan Wanprestasi"
  },
  {
    quote: "Pelayanan responsif dan transparan. Tim selalu memberikan update perkembangan kasus. Sangat direkomendasikan untuk urusan perdata di Blitar.",
    client: "M.W.",
    service: "Gugatan Perbuatan Melawan Hukum"
  }
];

export type ArticleCategory =
  | "Finance & Perbankan"
  | "Perlindungan Konsumen"
  | "Sengketa Bisnis"
  | "Panduan Hukum"
  | "Konsultasi Usaha";

export const ARTICLE_CATEGORIES: Array<"Semua" | ArticleCategory> = [
  "Semua",
  "Finance & Perbankan",
  "Perlindungan Konsumen",
  "Sengketa Bisnis",
  "Panduan Hukum",
  "Konsultasi Usaha"
];

export interface ArticleAuthor {
  name: string;
  position: string;
  image: string;
}

export const ARTICLE_AUTHORS: Record<string, ArticleAuthor> = {
  principal: {
    name: "Hari Mulana Hutabarat, S.H., CPLA",
    position: "Principal & Founder",
    image: "/images/principal.png"
  },
  budi: {
    name: "Budi Santoso, S.H., M.H.",
    position: "Senior Associate — Litigasi",
    image: "/images/team-1.png"
  },
  siti: {
    name: "Siti Rahmawati, S.H.",
    position: "Associate — Perlindungan Konsumen",
    image: "/images/team-2.png"
  },
  agus: {
    name: "Agus Pratama, S.H.",
    position: "Associate — Sengketa Pembiayaan",
    image: "/images/team-3.png"
  }
};

export type ArticleBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] };

export interface Article {
  slug: string;
  title: string;
  category: ArticleCategory;
  date: string;
  readTime: string;
  summary: string;
  image: string;
  featured?: boolean;
  authorKey: keyof typeof ARTICLE_AUTHORS;
  content: ArticleBlock[];
}

export const ARTICLES: Article[] = [
  {
    slug: "hak-konsumen-saat-kendaraan-ditarik-leasing",
    title: "Hak Konsumen Saat Kendaraan Ditarik Leasing: Panduan Lengkap 2025",
    category: "Perlindungan Konsumen",
    date: "18 Mar 2025",
    readTime: "8 menit",
    summary:
      "Penarikan kendaraan secara paksa di jalan tanpa prosedur yang sah merupakan pelanggaran hukum. Pelajari hak Anda berdasarkan Putusan MK No. 18/PUU-XVII/2019 dan langkah-langkah praktis yang dapat Anda tempuh.",
    image: "/images/article-2.png",
    featured: true,
    authorKey: "principal",
    content: [
      { type: "p", text: "Praktik penarikan kendaraan secara paksa oleh pihak leasing — sering dilakukan oleh debt collector di jalan — masih banyak terjadi meski secara hukum praktik tersebut tidak dapat dibenarkan. Putusan Mahkamah Konstitusi No. 18/PUU-XVII/2019 telah meletakkan batas yang tegas: eksekusi jaminan fidusia hanya dapat dilakukan secara sepihak apabila debitur mengakui adanya wanprestasi dan secara sukarela menyerahkan obyek jaminan." },
      { type: "h2", text: "Apa Kata Putusan MK?" },
      { type: "p", text: "Inti dari Putusan MK adalah bahwa frasa “kekuatan eksekutorial” dalam UU Jaminan Fidusia tidak boleh ditafsirkan sebagai kewenangan untuk mengeksekusi sendiri tanpa fiat eksekusi pengadilan. Apabila debitur tidak mengakui adanya wanprestasi atau tidak secara sukarela menyerahkan obyek, kreditur wajib menempuh permohonan eksekusi melalui pengadilan." },
      { type: "quote", text: "Eksekusi jaminan fidusia tanpa kesepakatan atau penetapan pengadilan adalah perbuatan melawan hukum yang dapat digugat secara perdata.", cite: "Praktik di Pengadilan Negeri pasca Putusan MK 18/PUU-XVII/2019" },
      { type: "h2", text: "Hak-Hak Anda sebagai Konsumen" },
      { type: "list", items: [
        "Hak untuk mendapatkan informasi yang benar dan jujur mengenai jumlah tunggakan.",
        "Hak menolak penarikan paksa di jalan tanpa adanya penetapan pengadilan.",
        "Hak meminta identitas, surat tugas, dan surat kuasa eksekusi dari pihak penarik.",
        "Hak melaporkan tindakan intimidasi, kekerasan, atau perampasan ke pihak kepolisian.",
        "Hak mengajukan restrukturisasi sebagai jalan tengah penyelesaian."
      ]},
      { type: "h2", text: "Langkah Praktis Saat Kendaraan Hendak Ditarik" },
      { type: "p", text: "Bersikap tenang dan tidak menyerahkan kendaraan begitu saja. Mintalah penarik menunjukkan: identitas pribadi (KTP dan kartu sertifikasi profesi), surat tugas dari perusahaan pembiayaan, akta jaminan fidusia, dan penetapan eksekusi dari pengadilan. Apabila salah satu dokumen tersebut tidak dapat ditunjukkan, Anda berhak menolak penarikan." },
      { type: "p", text: "Dokumentasikan kejadian sedetail mungkin: foto, video, catat nama dan plat kendaraan penarik, serta kumpulkan keterangan saksi. Bukti-bukti ini akan menjadi modal penting bagi gugatan Perbuatan Melawan Hukum yang dapat Anda ajukan kemudian." },
      { type: "h3", text: "Pemulihan Hak Pasca Penarikan Tidak Sah" },
      { type: "p", text: "Jika kendaraan Anda terlanjur ditarik tanpa prosedur, Anda dapat mengajukan gugatan PMH dengan tuntutan pengembalian kendaraan dan ganti rugi materiil maupun imateriil. Selain itu, pengaduan ke OJK dan BPSK dapat memperkuat posisi Anda dalam negosiasi maupun pengadilan." }
    ]
  },
  {
    slug: "memahami-gugatan-perbuatan-melawan-hukum",
    title: "Memahami Gugatan Perbuatan Melawan Hukum (PMH)",
    category: "Panduan Hukum",
    date: "12 Mar 2025",
    readTime: "6 menit",
    summary:
      "Pasal 1365 KUH Perdata menjadi dasar utama gugatan PMH. Apa unsur yang harus dipenuhi dan bagaimana cara membuktikannya di pengadilan?",
    image: "/images/article-1.png",
    authorKey: "budi",
    content: [
      { type: "p", text: "Gugatan Perbuatan Melawan Hukum (PMH) adalah salah satu instrumen hukum paling fundamental dalam sistem keperdataan Indonesia. Diatur dalam Pasal 1365 KUH Perdata, PMH dapat diajukan ketika suatu perbuatan menimbulkan kerugian bagi pihak lain — tanpa harus didasarkan pada hubungan kontraktual sebelumnya." },
      { type: "h2", text: "Empat Unsur PMH yang Wajib Dibuktikan" },
      { type: "list", items: [
        "Adanya perbuatan, baik berupa tindakan aktif maupun kelalaian.",
        "Perbuatan tersebut bersifat melawan hukum — bukan hanya melanggar undang-undang, tetapi juga melanggar kepatutan, kesusilaan, atau hak subyektif orang lain.",
        "Adanya kesalahan pada pihak yang melakukan perbuatan, baik dalam bentuk kesengajaan maupun kelalaian.",
        "Adanya kerugian dan hubungan kausal antara perbuatan dengan kerugian yang timbul."
      ]},
      { type: "h2", text: "Perluasan Makna “Melawan Hukum”" },
      { type: "p", text: "Sejak putusan Hoge Raad tahun 1919 dalam perkara Lindenbaum vs Cohen, makna “melawan hukum” telah diperluas tidak hanya pada pelanggaran undang-undang, tetapi juga mencakup pelanggaran terhadap kepatutan, ketelitian, dan kehati-hatian dalam pergaulan masyarakat. Doktrin ini dianut pula oleh Mahkamah Agung Indonesia dalam berbagai putusannya." },
      { type: "quote", text: "Perbuatan Melawan Hukum tidak terbatas pada pelanggaran terhadap kaidah hukum tertulis, melainkan juga mencakup pelanggaran terhadap norma kepatutan dan kesusilaan." },
      { type: "h2", text: "Strategi Pembuktian" },
      { type: "p", text: "Yang membedakan keberhasilan dan kegagalan gugatan PMH umumnya terletak pada kekuatan pembuktian, terutama unsur kesalahan dan hubungan kausal. Pengumpulan bukti tertulis, keterangan saksi, dan bukti elektronik harus dilakukan secara sistematis sejak tahap awal." },
      { type: "p", text: "Petitum gugatan juga harus dirumuskan dengan presisi: tuntutan ganti rugi materiil disertai perhitungan rinci, tuntutan ganti rugi imateriil disertai justifikasi dampak yang dialami, serta — bila relevan — tuntutan pemulihan nama baik atau penghentian perbuatan." }
    ]
  },
  {
    slug: "proses-cessie-dan-risikonya",
    title: "Mengenal Proses Cessie dan Risikonya bagi Debitur",
    category: "Finance & Perbankan",
    date: "05 Mar 2025",
    readTime: "7 menit",
    summary:
      "Pengalihan piutang (cessie) sering dilakukan tanpa pemberitahuan kepada debitur. Bagaimana posisi hukum Anda jika menerima tagihan dari kreditur baru?",
    image: "/images/article-3.png",
    authorKey: "principal",
    content: [
      { type: "p", text: "Cessie adalah pengalihan hak atas piutang dari kreditur lama (cedent) kepada kreditur baru (cessionaris). Diatur dalam Pasal 613 KUH Perdata, cessie merupakan praktik yang umum digunakan dalam dunia perbankan dan pembiayaan, terutama dalam transaksi jual-beli kredit macet (Non Performing Loan)." },
      { type: "h2", text: "Syarat Sahnya Cessie" },
      { type: "list", items: [
        "Dilakukan dengan akta otentik atau akta di bawah tangan.",
        "Memuat secara jelas identitas piutang, kreditur lama, dan kreditur baru.",
        "Diberitahukan secara resmi kepada debitur agar mengikat baginya.",
        "Apabila piutang dijamin dengan hak kebendaan, peralihan jaminan harus didaftarkan."
      ]},
      { type: "h2", text: "Risiko Bagi Debitur" },
      { type: "p", text: "Banyak debitur tiba-tiba menerima tagihan dari pihak yang tidak dikenal — perusahaan penagihan, bahkan individu — yang mengaku telah membeli piutangnya. Tanpa pemberitahuan resmi, peralihan tersebut belum mengikat debitur. Bahkan, pembayaran kepada kreditur lama tetap sah dan membebaskan debitur dari kewajibannya." },
      { type: "quote", text: "Cessie sah antara cedent dan cessionaris sejak akta dibuat, namun tidak mengikat debitur sebelum diberitahukan secara resmi.", cite: "Pasal 613 KUH Perdata jo. yurisprudensi MA" },
      { type: "h3", text: "Hal yang Harus Diperiksa Saat Menerima Tagihan dari Kreditur Baru" },
      { type: "list", items: [
        "Salinan akta cessie yang menjelaskan dasar peralihan piutang.",
        "Surat pemberitahuan resmi dari kreditur lama atau kreditur baru.",
        "Kesesuaian jumlah piutang dengan catatan pembayaran Anda.",
        "Kewenangan dan identitas hukum dari pihak yang menagih."
      ]},
      { type: "h2", text: "Langkah Penyelesaian" },
      { type: "p", text: "Apabila Anda menemukan kejanggalan, sebaiknya segera berkonsultasi dengan kuasa hukum. Cessie yang cacat hukum dapat dibatalkan, dan dalam beberapa kasus, debitur memiliki hak untuk meminta pertanggungjawaban atas tagihan yang tidak sah." }
    ]
  },
  {
    slug: "wanprestasi-vs-perbuatan-melawan-hukum",
    title: "Wanprestasi vs Perbuatan Melawan Hukum: Apa Bedanya?",
    category: "Panduan Hukum",
    date: "26 Feb 2025",
    readTime: "5 menit",
    summary:
      "Dua dasar gugatan ini sering dikaburkan. Memilih dasar hukum yang tepat sejak awal akan menentukan keberhasilan strategi perkara Anda.",
    image: "/images/article-1.png",
    authorKey: "budi",
    content: [
      { type: "p", text: "Salah satu kesalahan paling umum dalam praktik adalah memilih dasar gugatan yang keliru. Wanprestasi dan PMH memiliki landasan, syarat, dan akibat hukum yang berbeda. Memilih dasar yang salah dapat berujung pada gugatan yang tidak diterima atau ditolak." },
      { type: "h2", text: "Sumber Hubungan Hukum" },
      { type: "p", text: "Wanprestasi berasal dari pelanggaran kewajiban dalam suatu perjanjian (Pasal 1238 dan 1243 KUH Perdata). Tanpa adanya perjanjian, gugatan wanprestasi tidak dapat dipertahankan. Sebaliknya, PMH (Pasal 1365 KUH Perdata) tidak memerlukan adanya perjanjian — cukup adanya perbuatan yang melanggar hukum dan menimbulkan kerugian." },
      { type: "h2", text: "Bentuk Wanprestasi" },
      { type: "list", items: [
        "Tidak melakukan apa yang disanggupi.",
        "Melakukan apa yang dijanjikan, tetapi tidak sebagaimana mestinya.",
        "Melakukan apa yang dijanjikan tetapi terlambat.",
        "Melakukan sesuatu yang menurut perjanjian tidak boleh dilakukan."
      ]},
      { type: "h2", text: "Konsekuensi Pemilihan Dasar Hukum" },
      { type: "p", text: "Dalam wanprestasi, somasi umumnya wajib sebelum gugatan diajukan. Tuntutannya pun terbatas pada pemenuhan prestasi, ganti rugi, atau pembatalan perjanjian. PMH menawarkan ruang yang lebih luas — termasuk ganti rugi imateriil — namun pembuktiannya cenderung lebih sulit." },
      { type: "quote", text: "Tidak boleh menggabungkan dalil wanprestasi dan PMH dalam satu gugatan tanpa pemilahan yang tegas, karena keduanya memiliki dasar dan akibat hukum yang berbeda." }
    ]
  },
  {
    slug: "klausul-baku-pembiayaan-yang-merugikan",
    title: "Klausul Baku Perjanjian Pembiayaan yang Sering Merugikan Konsumen",
    category: "Finance & Perbankan",
    date: "20 Feb 2025",
    readTime: "9 menit",
    summary:
      "Beberapa klausul standar dalam perjanjian leasing dan kartu kredit ternyata bertentangan dengan UU Perlindungan Konsumen. Kenali klausul yang patut Anda waspadai.",
    image: "/images/article-3.png",
    authorKey: "siti",
    content: [
      { type: "p", text: "Pasal 18 UU No. 8 Tahun 1999 tentang Perlindungan Konsumen secara tegas melarang pencantuman klausul baku tertentu dalam perjanjian standar. Namun, dalam praktik, banyak perusahaan pembiayaan dan penerbit kartu kredit masih mencantumkan klausul-klausul yang berat sebelah." },
      { type: "h2", text: "Klausul yang Dilarang Berdasarkan UU Perlindungan Konsumen" },
      { type: "list", items: [
        "Pengalihan tanggung jawab pelaku usaha kepada konsumen.",
        "Pelaku usaha berhak menolak pengembalian barang/jasa yang telah dibeli konsumen.",
        "Pelaku usaha berhak mengubah ketentuan perjanjian secara sepihak.",
        "Konsumen tunduk pada peraturan baru, tambahan, lanjutan, dan/atau perubahan yang dibuat sepihak.",
        "Konsumen memberikan kuasa kepada pelaku usaha untuk pembebanan hak tanggungan, hak gadai, atau hak jaminan terhadap barang yang dibeli secara angsuran."
      ]},
      { type: "h2", text: "Klausul yang Sering Disalahgunakan dalam Praktik" },
      { type: "h3", text: "1. Hak Tarik Sepihak Tanpa Pengadilan" },
      { type: "p", text: "Klausul ini menyatakan bahwa apabila debitur lalai membayar, perusahaan pembiayaan berhak menarik kendaraan kapan saja tanpa proses pengadilan. Pasca Putusan MK No. 18/PUU-XVII/2019, klausul demikian secara substansi tidak dapat dilaksanakan apabila debitur tidak menyerahkan kendaraan secara sukarela." },
      { type: "h3", text: "2. Pembebanan Biaya Penagihan yang Tidak Wajar" },
      { type: "p", text: "Beberapa perjanjian membebankan biaya penagihan, biaya kunjungan, atau biaya administrasi yang nilainya tidak proporsional dengan tunggakan. Konsumen berhak mempersoalkan kewajaran biaya tersebut, terutama bila tidak diatur secara jelas pada saat penandatanganan." },
      { type: "h3", text: "3. Perubahan Suku Bunga Sepihak" },
      { type: "p", text: "Pencantuman klausul yang memberikan kewenangan kepada pemberi pembiayaan untuk mengubah suku bunga secara sepihak tanpa pemberitahuan adalah salah satu klausul baku yang dilarang." },
      { type: "h2", text: "Akibat Hukum Klausul Baku yang Dilarang" },
      { type: "quote", text: "Setiap klausul baku yang telah ditetapkan oleh pelaku usaha pada dokumen atau perjanjian yang memenuhi ketentuan sebagaimana dimaksud Pasal 18 ayat (1) dan ayat (2) dinyatakan batal demi hukum.", cite: "Pasal 18 ayat (3) UU Perlindungan Konsumen" }
    ]
  },
  {
    slug: "menyusun-somasi-yang-efektif",
    title: "Cara Menyusun Somasi yang Efektif Sebelum Mengajukan Gugatan",
    category: "Panduan Hukum",
    date: "12 Feb 2025",
    readTime: "6 menit",
    summary:
      "Somasi yang baik bukan sekadar surat peringatan. Ia adalah fondasi pembuktian wanprestasi di pengadilan. Berikut struktur dan elemen pentingnya.",
    image: "/images/article-1.png",
    authorKey: "budi",
    content: [
      { type: "p", text: "Somasi atau ingebreke stelling adalah pernyataan resmi yang ditujukan kepada debitur untuk memenuhi kewajibannya dalam jangka waktu tertentu. Selain berfungsi sebagai upaya damai, somasi juga merupakan syarat penting untuk membuktikan bahwa debitur telah dinyatakan lalai." },
      { type: "h2", text: "Struktur Somasi yang Baik" },
      { type: "list", items: [
        "Kepala surat: identitas pengirim dan tujuan surat (Somasi I/II/III).",
        "Identitas para pihak: nama, alamat, dan kedudukan dalam perjanjian.",
        "Uraian fakta: kronologi singkat hubungan hukum dan pelanggaran yang terjadi.",
        "Dasar hukum: pasal perjanjian dan ketentuan undang-undang yang dilanggar.",
        "Tuntutan: pemenuhan kewajiban yang spesifik dan terukur.",
        "Tenggang waktu: batas waktu pemenuhan, umumnya 7–14 hari kerja.",
        "Konsekuensi: tindakan hukum yang akan ditempuh apabila somasi tidak diindahkan."
      ]},
      { type: "h2", text: "Tiga Tahap Somasi" },
      { type: "p", text: "Umumnya somasi dilakukan dalam tiga tahap dengan tenggang waktu yang berbeda. Setiap tahap harus dikirim secara resmi — melalui kurir tercatat atau jasa pengantaran dengan bukti penerimaan — agar memiliki kekuatan pembuktian di pengadilan." },
      { type: "quote", text: "Somasi yang dirumuskan secara serampangan dapat menjadi celah bagi pihak lawan untuk membantah dalil wanprestasi di persidangan." },
      { type: "h2", text: "Hal yang Sering Dilupakan" },
      { type: "p", text: "Bukti pengiriman somasi sama pentingnya dengan isi somasi itu sendiri. Simpan dengan baik resi pengiriman, tanda terima, atau bukti komunikasi elektronik. Tanpa bukti penerimaan, somasi sulit dipakai sebagai dasar pembuktian." }
    ]
  },
  {
    slug: "mediasi-sebagai-jalur-penyelesaian-sengketa",
    title: "Mediasi sebagai Jalur Penyelesaian Sengketa Bisnis yang Efisien",
    category: "Sengketa Bisnis",
    date: "04 Feb 2025",
    readTime: "7 menit",
    summary:
      "Litigasi tidak selalu menjadi jalan terbaik. Mediasi yang dirumuskan dalam akta perdamaian memiliki kekuatan eksekutorial setara putusan pengadilan.",
    image: "/images/article-2.png",
    authorKey: "principal",
    content: [
      { type: "p", text: "Sengketa bisnis yang berlarut di pengadilan tidak hanya mahal — ia juga merusak hubungan komersial, menggerogoti reputasi, dan menyita waktu produktif. Mediasi hadir sebagai alternatif yang lebih cepat, lebih murah, dan lebih menjaga kelangsungan hubungan antarpihak." },
      { type: "h2", text: "Dasar Hukum Mediasi" },
      { type: "p", text: "Mediasi diatur dalam UU No. 30 Tahun 1999 tentang Arbitrase dan Alternatif Penyelesaian Sengketa, serta Perma No. 1 Tahun 2016 tentang Prosedur Mediasi di Pengadilan. Hasil mediasi yang dituangkan dalam akta perdamaian dan didaftarkan ke pengadilan memiliki kekuatan eksekutorial layaknya putusan pengadilan." },
      { type: "h2", text: "Keunggulan Mediasi" },
      { type: "list", items: [
        "Waktu penyelesaian relatif singkat — umumnya 2 sampai 4 minggu.",
        "Biaya yang jauh lebih rendah dibanding litigasi penuh.",
        "Sifatnya rahasia, sehingga reputasi para pihak terjaga.",
        "Kesepakatan disusun bersama, sehingga lebih mungkin dilaksanakan.",
        "Hubungan bisnis para pihak berpotensi tetap terjalin."
      ]},
      { type: "h2", text: "Kapan Mediasi Tidak Cocok?" },
      { type: "p", text: "Mediasi tidak ideal ketika salah satu pihak tidak beriktikad baik, ketika sengketa menyangkut pelanggaran pidana yang serius, atau ketika diperlukan putusan yang menjadi yurisprudensi. Dalam kondisi seperti itu, jalur litigasi tetap menjadi pilihan terbaik." },
      { type: "quote", text: "Mediasi yang berhasil tidak diukur dari siapa yang menang, melainkan dari sejauh mana kedua pihak dapat melanjutkan hubungannya pasca sengketa." }
    ]
  },
  {
    slug: "audit-hukum-untuk-pelaku-usaha",
    title: "Audit Hukum: Investasi Murah untuk Mencegah Sengketa Mahal",
    category: "Konsultasi Usaha",
    date: "27 Jan 2025",
    readTime: "8 menit",
    summary:
      "Banyak sengketa bisnis dapat dicegah dengan audit hukum berkala. Apa saja yang dicakup dan kapan idealnya dilakukan?",
    image: "/images/article-3.png",
    authorKey: "principal",
    content: [
      { type: "p", text: "Audit hukum (legal audit) adalah pemeriksaan menyeluruh atas seluruh aspek hukum yang berkaitan dengan operasional perusahaan. Tujuannya bukan mencari kesalahan, melainkan memetakan risiko hukum yang ada dan menyusun strategi mitigasi sebelum risiko tersebut menjadi sengketa." },
      { type: "h2", text: "Cakupan Audit Hukum" },
      { type: "list", items: [
        "Status badan hukum dan perizinan usaha.",
        "Aspek ketenagakerjaan dan kepatuhan terhadap UU Cipta Kerja.",
        "Perjanjian-perjanjian penting: vendor, distributor, sewa, kerjasama.",
        "Kepatuhan pajak dan kewajiban pelaporan.",
        "Aset perusahaan dan status hukumnya.",
        "Sengketa berjalan dan potensi sengketa."
      ]},
      { type: "h2", text: "Kapan Audit Hukum Dibutuhkan?" },
      { type: "p", text: "Selain dilakukan secara berkala (idealnya satu hingga dua kali setahun), audit hukum juga sangat penting dilakukan menjelang transaksi-transaksi besar: akuisisi, kerjasama strategis, ekspansi ke wilayah baru, atau saat akan menerima investor." },
      { type: "h3", text: "Manfaat Konkret bagi Perusahaan" },
      { type: "list", items: [
        "Identifikasi risiko hukum yang tersembunyi.",
        "Penyusunan SOP dan kebijakan internal yang lebih kuat.",
        "Pengaturan ulang dokumen perjanjian agar lebih protektif.",
        "Memperbaiki posisi tawar dalam negosiasi bisnis.",
        "Menghemat biaya jangka panjang akibat sengketa yang dapat dicegah."
      ]},
      { type: "quote", text: "Biaya audit hukum tahunan umumnya jauh lebih kecil dibanding biaya menyelesaikan satu sengketa di pengadilan." }
    ]
  },
  {
    slug: "perlindungan-konsumen-di-era-e-commerce",
    title: "Perlindungan Konsumen di Era E-Commerce: Hak yang Sering Diabaikan",
    category: "Perlindungan Konsumen",
    date: "20 Jan 2025",
    readTime: "6 menit",
    summary:
      "Belanja online membawa risiko tersendiri — dari produk tidak sesuai pesanan hingga klaim garansi yang ditolak. Berikut peta hak konsumen digital Anda.",
    image: "/images/article-2.png",
    authorKey: "siti",
    content: [
      { type: "p", text: "Pertumbuhan e-commerce di Indonesia tumbuh pesat, namun perlindungan konsumen seringkali tertinggal. Banyak konsumen merasa tidak berdaya ketika produk tidak sesuai, paket hilang, atau klaim garansi ditolak — padahal hak mereka tetap dijamin oleh undang-undang." },
      { type: "h2", text: "Dasar Hukum Perlindungan Konsumen Digital" },
      { type: "p", text: "Selain UU No. 8 Tahun 1999 tentang Perlindungan Konsumen, transaksi digital juga diatur dalam UU No. 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik (ITE) sebagaimana diubah, serta PP No. 80 Tahun 2019 tentang Perdagangan Melalui Sistem Elektronik (PMSE)." },
      { type: "h2", text: "Hak yang Sering Diabaikan" },
      { type: "list", items: [
        "Hak mendapatkan informasi yang benar dan jujur tentang produk.",
        "Hak mengembalikan barang yang tidak sesuai pesanan dalam tenggang waktu yang wajar.",
        "Hak atas perlindungan data pribadi sesuai UU PDP.",
        "Hak mendapatkan kepastian status pengiriman dan pengembalian dana.",
        "Hak atas pelayanan purna jual sesuai janji penjual."
      ]},
      { type: "h2", text: "Langkah Saat Hak Konsumen Dilanggar" },
      { type: "p", text: "Tahap pertama selalu dimulai dengan komunikasi formal kepada penjual atau platform — sertakan bukti transaksi, foto/video, dan screenshot komunikasi. Apabila tidak direspons, Anda dapat mengadukan ke layanan resolusi platform, OJK (jika menyangkut pembiayaan), atau langsung ke BPSK." },
      { type: "quote", text: "Penyelenggara perdagangan melalui sistem elektronik wajib memberikan perlindungan kepada konsumen termasuk mekanisme penyelesaian sengketa.", cite: "PP No. 80 Tahun 2019 tentang PMSE" }
    ]
  },
  {
    slug: "verzet-perlawanan-pihak-ketiga",
    title: "Verzet & Perlawanan Pihak Ketiga: Upaya Hukum yang Sering Terlupakan",
    category: "Panduan Hukum",
    date: "13 Jan 2025",
    readTime: "7 menit",
    summary:
      "Putusan verstek dan sita yang keliru dapat dilawan. Namun tenggang waktunya pendek — kenali kapan dan bagaimana upaya hukum ini ditempuh.",
    image: "/images/article-1.png",
    authorKey: "budi",
    content: [
      { type: "p", text: "Tidak semua orang tahu bahwa putusan pengadilan yang dijatuhkan tanpa kehadiran tergugat (verstek) maupun sita yang menyangkut barang milik pihak ketiga dapat dilawan. Verzet (perlawanan terhadap putusan verstek) dan derden verzet (perlawanan pihak ketiga) adalah dua upaya hukum yang penting untuk dipahami." },
      { type: "h2", text: "Verzet: Perlawanan terhadap Putusan Verstek" },
      { type: "p", text: "Apabila Anda tidak hadir dalam persidangan dan dijatuhi putusan verstek, Anda berhak mengajukan verzet dalam tenggang waktu 14 hari setelah pemberitahuan putusan diterima. Dengan verzet, perkara akan diperiksa kembali sejak awal pada peradilan yang sama." },
      { type: "h2", text: "Derden Verzet: Perlawanan Pihak Ketiga" },
      { type: "p", text: "Dalam praktik sita eksekusi, kerap terjadi barang milik pihak ketiga turut disita meskipun ia bukan pihak dalam perkara utama. Pihak ketiga tersebut berhak mengajukan derden verzet untuk meminta pencabutan sita atas barangnya." },
      { type: "list", items: [
        "Diajukan ke pengadilan negeri yang menangani perkara pokok.",
        "Diajukan sebelum sita eksekusi dilaksanakan tuntas.",
        "Wajib disertai bukti kepemilikan yang sah atas barang yang disita.",
        "Bersifat menunda eksekusi sepanjang dianggap beralasan oleh hakim."
      ]},
      { type: "quote", text: "Tenggang waktu adalah jiwa dari upaya hukum ini. Terlambat satu hari saja dapat membuat verzet maupun derden verzet kehilangan ruangnya." },
      { type: "h2", text: "Risiko Mengabaikan Upaya Hukum Ini" },
      { type: "p", text: "Ketika tenggang waktu telah lewat, putusan verstek maupun sita eksekusi memperoleh kekuatan hukum tetap. Akibatnya, hak Anda atas obyek sengketa atau barang sita menjadi sangat sulit untuk dipulihkan." }
    ]
  },
  {
    slug: "perjanjian-kerjasama-yang-aman",
    title: "Lima Klausul Wajib dalam Perjanjian Kerjasama yang Aman",
    category: "Konsultasi Usaha",
    date: "06 Jan 2025",
    readTime: "5 menit",
    summary:
      "Perjanjian yang baik melindungi kedua pihak dan meminimalkan ruang sengketa. Berikut lima klausul yang sering terlewatkan oleh pelaku usaha.",
    image: "/images/article-3.png",
    authorKey: "principal",
    content: [
      { type: "p", text: "Perjanjian yang dibuat secara terburu-buru tanpa perumusan yang matang adalah cikal bakal sengketa di kemudian hari. Berikut lima klausul yang wajib ada dalam setiap perjanjian kerjasama bisnis." },
      { type: "h2", text: "1. Definisi yang Jelas" },
      { type: "p", text: "Banyak sengketa muncul karena tafsir berbeda atas istilah yang sama. Cantumkan bagian definisi yang menjelaskan istilah-istilah kunci secara presisi: cakupan layanan, kriteria penyelesaian, dan obyek perjanjian." },
      { type: "h2", text: "2. Hak dan Kewajiban yang Seimbang" },
      { type: "p", text: "Distribusikan hak dan kewajiban secara proporsional. Klausul yang berat sebelah cenderung diuji oleh hakim — terutama jika salah satu pihak adalah konsumen atau UMKM yang posisinya tidak setara." },
      { type: "h2", text: "3. Mekanisme Pembayaran dan Sanksi Keterlambatan" },
      { type: "list", items: [
        "Tata cara, tenggang waktu, dan rekening tujuan pembayaran.",
        "Bukti pembayaran yang diterima sebagai sah.",
        "Sanksi keterlambatan dengan persentase yang wajar.",
        "Mekanisme penyesuaian harga apabila relevan."
      ]},
      { type: "h2", text: "4. Klausul Penyelesaian Sengketa" },
      { type: "p", text: "Atur dengan tegas apakah sengketa akan diselesaikan melalui musyawarah, mediasi, arbitrase, atau pengadilan. Tentukan pula domisili hukum yang dipilih untuk menghindari sengketa kompetensi antar pengadilan." },
      { type: "h2", text: "5. Klausul Force Majeure dan Pengakhiran" },
      { type: "p", text: "Definisikan kondisi force majeure secara spesifik, bukan sekadar mengikuti rumusan generik. Atur pula syarat dan tata cara pengakhiran perjanjian — termasuk kewajiban yang tetap berlaku setelah perjanjian berakhir." },
      { type: "quote", text: "Perjanjian yang baik bukan yang menguntungkan satu pihak, melainkan yang membuat kedua pihak sama-sama nyaman menjalankannya." }
    ]
  },
  {
    slug: "strategi-menghadapi-gugatan-balik",
    title: "Strategi Menghadapi Gugatan Balik (Rekonvensi) di Pengadilan",
    category: "Sengketa Bisnis",
    date: "30 Des 2024",
    readTime: "6 menit",
    summary:
      "Gugatan balik dari pihak lawan dapat mengubah dinamika perkara secara signifikan. Bagaimana mengantisipasi dan meresponsnya secara strategis?",
    image: "/images/article-2.png",
    authorKey: "principal",
    content: [
      { type: "p", text: "Rekonvensi atau gugatan balik adalah hak yang dimiliki tergugat untuk balik menggugat penggugat dalam perkara yang sama. Apabila tidak dipersiapkan, rekonvensi dapat membalikkan posisi tawar dan bahkan mengubah arah keseluruhan perkara." },
      { type: "h2", text: "Dasar Hukum Rekonvensi" },
      { type: "p", text: "Rekonvensi diatur dalam Pasal 132a HIR / 157 RBg. Tergugat dapat mengajukan rekonvensi paling lambat pada saat menyampaikan jawaban atas gugatan utama (konvensi). Rekonvensi diperiksa bersamaan dengan gugatan utama dalam satu putusan." },
      { type: "h2", text: "Kapan Rekonvensi Tidak Dapat Diajukan?" },
      { type: "list", items: [
        "Apabila penggugat dalam konvensi bertindak dalam kapasitas yang berbeda dari kepentingan rekonvensi.",
        "Apabila pengadilan yang memeriksa konvensi tidak berwenang memeriksa rekonvensi.",
        "Dalam perkara mengenai pelaksanaan putusan."
      ]},
      { type: "h2", text: "Strategi Antisipasi dan Respons" },
      { type: "p", text: "Sebelum mengajukan gugatan, lakukan analisa risiko menyeluruh: adakah celah yang dapat digunakan pihak lawan untuk balik menggugat? Persiapkan jawaban dan bukti tandingan sejak awal agar tidak kewalahan ketika rekonvensi benar-benar diajukan." },
      { type: "p", text: "Apabila Anda yang menjadi sasaran rekonvensi, jawablah dengan jawaban replik yang fokus dan terstruktur. Hindari terjebak dalam perdebatan emosional — fokus pada bukti, dasar hukum, dan logika argumen." },
      { type: "quote", text: "Rekonvensi yang dipersiapkan dengan matang dapat menjadi alat negosiasi yang efektif untuk mendorong perdamaian." }
    ]
  }
];

export const FAQS = [
  {
    question: "Berapa biaya konsultasi awal?",
    answer: "Biaya konsultasi bervariasi bergantung pada kompleksitas kasus. Kami menyediakan sesi konsultasi awal dengan biaya yang terjangkau untuk memetakan masalah hukum Anda terlebih dahulu."
  },
  {
    question: "Apakah wilayah layanan hanya di Blitar?",
    answer: "Basis utama kami di Blitar, namun tim kami siap menangani perkara di wilayah Jawa Timur dan kota-kota lain sesuai dengan kesepakatan dengan klien."
  },
  {
    question: "Apakah sengketa bisa diselesaikan lewat mediasi dulu?",
    answer: "Sangat bisa. Kami selalu memprioritaskan penyelesaian sengketa di luar pengadilan (non-litigasi) melalui mediasi atau negosiasi untuk menghemat waktu dan biaya klien."
  },
  {
    question: "Berapa lama proses penyelesaian perkara di pengadilan?",
    answer: "Durasi persidangan perdata di pengadilan tingkat pertama umumnya memakan waktu 4 hingga 6 bulan. Namun, bisa lebih lama jika ada upaya banding atau kasasi."
  },
  {
    question: "Dokumen apa saja yang perlu disiapkan saat konsultasi?",
    answer: "Untuk konsultasi awal, siapkan identitas diri (KTP), kronologi kejadian secara tertulis, serta dokumen terkait seperti perjanjian, bukti transfer, atau surat peringatan (somasi) yang Anda terima."
  }
];