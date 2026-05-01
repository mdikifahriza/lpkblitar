# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-pages.spec.ts >> Skenario Area Publik LPK Blitar >> Membuka halaman beranda dan memverifikasi elemen utama
- Location: e2e\public-pages.spec.ts:5:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Tahun Pengalaman')
Expected: visible
Error: strict mode violation: locator('text=Tahun Pengalaman') resolved to 2 elements:
    1) <p class="text-foreground font-bold text-sm uppercase tracking-wider">Tahun Pengalaman</p> aka getByText('Tahun Pengalaman').first()
    2) <p class="text-foreground text-sm uppercase tracking-wider font-medium mb-1">Tahun Pengalaman</p> aka getByText('Tahun Pengalaman').nth(1)

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Tahun Pengalaman')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "Logo" [ref=e5] [cursor=pointer]:
        - /url: /admin/login
        - img "Logo" [ref=e6]
      - generic [ref=e7]:
        - list [ref=e8]:
          - listitem [ref=e9]:
            - link "Beranda" [ref=e10] [cursor=pointer]:
              - /url: /
          - listitem [ref=e11]:
            - link "Layanan" [ref=e12] [cursor=pointer]:
              - /url: /layanan
          - listitem [ref=e13]:
            - link "Galeri" [ref=e14] [cursor=pointer]:
              - /url: /galeri
          - listitem [ref=e15]:
            - link "Tim" [ref=e16] [cursor=pointer]:
              - /url: /tim
          - listitem [ref=e17]:
            - link "Insight" [ref=e18] [cursor=pointer]:
              - /url: /artikel
          - listitem [ref=e19]:
            - link "Kontak" [ref=e20] [cursor=pointer]:
              - /url: /kontak
          - listitem [ref=e21]:
            - link "Daftar Konsultasi" [ref=e22] [cursor=pointer]:
              - /url: /daftar-konsultasi
        - link "Konsultasi Sekarang" [ref=e23] [cursor=pointer]:
          - /url: /konsultasi
          - button "Konsultasi Sekarang" [ref=e24]
        - button "Tunggu sebentar..." [ref=e25]:
          - generic [ref=e26]: Tunggu sebentar...
  - main [ref=e27]:
    - generic [ref=e30]:
      - generic [ref=e31]:
        - generic [ref=e32]: Konsultan Hukum & Perlindungan Konsumen
        - heading "Analisa Tajam. Tim Kuat. Sengketa Tuntas." [level=1] [ref=e33]
        - paragraph [ref=e34]: Kantor konsultan hukum dan perlindungan konsumen di Blitar yang berfokus pada penyelesaian sengketa finance, perbankan, dan pengembangan usaha secara efektif.
        - generic [ref=e35]:
          - link "Konsultasi via WhatsApp" [ref=e36] [cursor=pointer]:
            - /url: https://wa.me/6281234567890?text=Halo%20Pak%20Hari%2C%20saya%20ingin%20konsultasi%20mengenai%20masalah%20hukum%20saya.
            - button "Konsultasi via WhatsApp" [ref=e37]:
              - img
              - text: Konsultasi via WhatsApp
          - link "Lihat Layanan" [ref=e38] [cursor=pointer]:
            - /url: "#layanan"
            - button "Lihat Layanan" [ref=e39]:
              - text: Lihat Layanan
              - img
      - generic [ref=e40]:
        - img "Hari Mulana Hutabarat" [ref=e44]
        - generic [ref=e46]:
          - generic [ref=e48]: 10+
          - generic [ref=e49]:
            - paragraph [ref=e50]: Tahun Pengalaman
            - paragraph [ref=e51]: Penyelesaian Sengketa
    - generic [ref=e54]:
      - generic [ref=e55]:
        - img [ref=e56]
        - heading "10+" [level=3] [ref=e59]
        - paragraph [ref=e60]: Tahun Pengalaman
        - paragraph [ref=e61]: Penyelesaian Sengketa
      - generic [ref=e62]:
        - img [ref=e63]
        - heading "8" [level=3] [ref=e67]
        - paragraph [ref=e68]: Bidang Layanan
        - paragraph [ref=e69]: Fokus Hukum Bisnis
      - generic [ref=e70]:
        - img [ref=e71]
        - heading "4" [level=3] [ref=e76]
        - paragraph [ref=e77]: Divisi Tim
        - paragraph [ref=e78]: Profesional Terlatih
      - generic [ref=e79]:
        - img [ref=e80]
        - heading "Blitar" [level=3] [ref=e83]
        - paragraph [ref=e84]: Wilayah Utama
        - paragraph [ref=e85]: "& Sekitarnya"
    - generic [ref=e88]:
      - generic [ref=e89]:
        - generic [ref=e90]: Tentang Kami
        - heading "Pusat Penyelesaian Sengketa Bisnis & Konsumen" [level=2] [ref=e91]
        - generic [ref=e92]:
          - paragraph [ref=e93]: Berada di Blitar, Jawa Timur, Kantor Konsultan Hukum Hari Mulana Hutabarat, S.H., CPLAhadir sebagai solusi terpadu untuk penyelesaian sengketa finance, gugatan perdata, mediasi bisnis, hingga analisa aset jaminan.
          - paragraph [ref=e94]:
            - text: "Filosofi kami sangat jelas:"
            - strong [ref=e95]: tidak semua perkara harus berujung sidang panjang, biaya besar, dan energi habis.
            - text: Melalui pengalaman, jaringan, legal pressure, serta negosiasi yang kuat, banyak perkara justru dapat selesai secara efektif dan menguntungkan.
          - paragraph [ref=e96]: "Prinsip kerja kami: Cepat dianalisa, tepat ditekan, singkat diselesaikan."
        - link "Kenali Tim Kami" [ref=e97] [cursor=pointer]:
          - /url: /tim
          - button "Kenali Tim Kami" [ref=e98]:
            - text: Kenali Tim Kami
            - img
      - generic [ref=e99]:
        - heading "Keunggulan Penanganan Kami" [level=3] [ref=e100]
        - list [ref=e101]:
          - listitem [ref=e102]:
            - img [ref=e104]
            - generic [ref=e106]: Analisa Dokumen Mendalam (Deep Legal Analysis)
          - listitem [ref=e107]:
            - img [ref=e109]
            - generic [ref=e111]: Penyelesaian Sengketa Efektif Tanpa Sidang Panjang
          - listitem [ref=e112]:
            - img [ref=e114]
            - generic [ref=e116]: Tim Multi-Divisi (Litigasi, Negosiasi, Investigasi)
          - listitem [ref=e117]:
            - img [ref=e119]
            - generic [ref=e121]: Pengalaman di Bidang Finance & Perlindungan Konsumen
          - listitem [ref=e122]:
            - img [ref=e124]
            - generic [ref=e126]: Jaringan Strategis & Legal Pressure Kuat
    - generic [ref=e128]:
      - generic [ref=e130]:
        - generic [ref=e131]: Area Keahlian
        - heading "Bidang Layanan Kami" [level=2] [ref=e132]
      - generic [ref=e133]:
        - link "01 Gugatan Perbuatan Melawan Hukum Penanganan gugatan atas tindakan sepihak, intimidasi, penarikan jaminan tanpa prosedur, dan kerugian akibat pelaku usaha." [ref=e135] [cursor=pointer]:
          - /url: /layanan/gugatan-pmh
          - generic [ref=e136]: "01"
          - heading "Gugatan Perbuatan Melawan Hukum" [level=3] [ref=e137]
          - paragraph [ref=e138]: Penanganan gugatan atas tindakan sepihak, intimidasi, penarikan jaminan tanpa prosedur, dan kerugian akibat pelaku usaha.
          - img [ref=e140]
        - link "02 Gugatan Wanprestasi Penanganan gugatan ingkar janji kontrak, ketidaksesuaian perjanjian, dan pelanggaran kewajiban oleh pelaku usaha." [ref=e143] [cursor=pointer]:
          - /url: /layanan/gugatan-wanprestasi
          - generic [ref=e144]: "02"
          - heading "Gugatan Wanprestasi" [level=3] [ref=e145]
          - paragraph [ref=e146]: Penanganan gugatan ingkar janji kontrak, ketidaksesuaian perjanjian, dan pelanggaran kewajiban oleh pelaku usaha.
          - img [ref=e148]
        - link "03 Gugatan Ganti Kerugian Mewakili klien dalam gugatan atas kerugian materil, imateril, kehilangan aset, dan kehilangan peluang usaha." [ref=e151] [cursor=pointer]:
          - /url: /layanan/gugatan-ganti-kerugian
          - generic [ref=e152]: "03"
          - heading "Gugatan Ganti Kerugian" [level=3] [ref=e153]
          - paragraph [ref=e154]: Mewakili klien dalam gugatan atas kerugian materil, imateril, kehilangan aset, dan kehilangan peluang usaha.
          - img [ref=e156]
        - link "04 Bantahan & Perlawanan Eksekusi Penanganan bantahan lelang, bantahan penyitaan, dan perlindungan atas objek jaminan dari eksekusi yang tidak sah." [ref=e159] [cursor=pointer]:
          - /url: /layanan/bantahan-perlawanan-eksekusi
          - generic [ref=e160]: "04"
          - heading "Bantahan & Perlawanan Eksekusi" [level=3] [ref=e161]
          - paragraph [ref=e162]: Penanganan bantahan lelang, bantahan penyitaan, dan perlindungan atas objek jaminan dari eksekusi yang tidak sah.
          - img [ref=e164]
        - link "05 Analisa Lelang, Cessie & Hak Tanggungan Analisa mendalam atas prosedur lelang KPKNL, keabsahan cessie, APHT, SKMHT, dan sertifikat hak tanggungan." [ref=e167] [cursor=pointer]:
          - /url: /layanan/analisa-lelang-cessie-hak-tanggungan
          - generic [ref=e168]: "05"
          - heading "Analisa Lelang, Cessie & Hak Tanggungan" [level=3] [ref=e169]
          - paragraph [ref=e170]: Analisa mendalam atas prosedur lelang KPKNL, keabsahan cessie, APHT, SKMHT, dan sertifikat hak tanggungan.
          - img [ref=e172]
        - link "06 Mediasi & Negosiasi Bisnis Penyelesaian sengketa melalui somasi terukur, mediasi tertutup, restrukturisasi, dan settlement agreement." [ref=e175] [cursor=pointer]:
          - /url: /layanan/mediasi-negosiasi-bisnis
          - generic [ref=e176]: "06"
          - heading "Mediasi & Negosiasi Bisnis" [level=3] [ref=e177]
          - paragraph [ref=e178]: Penyelesaian sengketa melalui somasi terukur, mediasi tertutup, restrukturisasi, dan settlement agreement.
          - img [ref=e180]
        - link "07 Perlindungan Konsumen Penanganan komplain konsumen, gugatan perlindungan konsumen, dan pendampingan ke OJK, BPSK, dan instansi terkait." [ref=e183] [cursor=pointer]:
          - /url: /layanan/perlindungan-konsumen
          - generic [ref=e184]: "07"
          - heading "Perlindungan Konsumen" [level=3] [ref=e185]
          - paragraph [ref=e186]: Penanganan komplain konsumen, gugatan perlindungan konsumen, dan pendampingan ke OJK, BPSK, dan instansi terkait.
          - img [ref=e188]
        - link "08 Konsultasi Pengembangan Usaha Membantu pelaku usaha restoran, kafe, wisata, dan retail membangun sistem usaha yang aman secara hukum dan minim konflik." [ref=e191] [cursor=pointer]:
          - /url: /layanan/konsultasi-pengembangan-usaha
          - generic [ref=e192]: "08"
          - heading "Konsultasi Pengembangan Usaha" [level=3] [ref=e193]
          - paragraph [ref=e194]: Membantu pelaku usaha restoran, kafe, wisata, dan retail membangun sistem usaha yang aman secara hukum dan minim konflik.
          - img [ref=e196]
    - generic [ref=e199]:
      - generic [ref=e200]:
        - generic [ref=e201]: Bagaimana Kami Bekerja
        - heading "Alur Penanganan Perkara" [level=2] [ref=e202]
      - generic [ref=e205]:
        - generic [ref=e206]:
          - generic [ref=e208]: "01"
          - generic [ref=e209]:
            - heading "Konsultasi Awal" [level=3] [ref=e210]
            - paragraph [ref=e211]: Mendengarkan kronologi secara menyeluruh dan mengumpulkan bukti-bukti permulaan.
        - generic [ref=e212]:
          - generic [ref=e214]: "02"
          - generic [ref=e215]:
            - heading "Analisa Dokumen" [level=3] [ref=e216]
            - paragraph [ref=e217]: Membedah setiap pasal dan klausula secara detail untuk menemukan celah hukum.
        - generic [ref=e218]:
          - generic [ref=e220]: "03"
          - generic [ref=e221]:
            - heading "Strategi Hukum" [level=3] [ref=e222]
            - paragraph [ref=e223]: Menentukan langkah paling efektif, baik melalui litigasi, mediasi, maupun laporan.
        - generic [ref=e224]:
          - generic [ref=e226]: "04"
          - generic [ref=e227]:
            - heading "Penyelesaian" [level=3] [ref=e228]
            - paragraph [ref=e229]: Mengeksekusi strategi yang telah disusun untuk mengembalikan hak klien.
    - generic [ref=e231]:
      - generic [ref=e232]:
        - generic [ref=e233]: Tim Hukum
        - heading "Pakar Hukum Bisnis & Perlindungan Konsumen" [level=2] [ref=e234]:
          - text: Pakar Hukum Bisnis &
          - text: Perlindungan Konsumen
        - paragraph [ref=e235]: Didukung oleh tim lawyer, legal analyst, dan negosiator yang bekerja secara sistematis untuk memenangkan perkara Anda.
      - generic [ref=e237]:
        - img "Hari Mulana Hutabarat, S.H., CPLA" [ref=e240]
        - generic [ref=e241]:
          - generic [ref=e242]: Pimpinan Kantor
          - heading "Hari Mulana Hutabarat, S.H., CPLA" [level=3] [ref=e243]
          - paragraph [ref=e244]: Finance & Perbankan, Perlindungan Konsumen, Sengketa Bisnis, Negosiasi
          - paragraph [ref=e245]: Hari Mulana Hutabarat, S.H., CPLA adalah seorang praktisi hukum, konsultan finance dan perbankan, negosiator penyelesaian sengketa bisnis, serta konsultan perlindungan konsumen. Beliau memimpin kantor konsultan hukum yang berfokus pada penyelesaian sengketa finance, gugatan perdata, perlindungan konsumen, mediasi dan negosiasi bisnis, serta pengembangan sistem usaha yang aman secara hukum. Di bawah kepemimpinannya, kantor ini dibangun dengan prinsip ketajaman analisa hukum, kekuatan tim, penyelesaian efektif, dan orientasi hasil nyata bagi klien.
      - generic [ref=e246]:
        - generic [ref=e247] [cursor=pointer]:
          - img "Team Lawyer Litigasi" [ref=e249]
          - generic [ref=e250]:
            - generic [ref=e251]: Divisi Persidangan
            - heading "Team Lawyer Litigasi" [level=3] [ref=e252]
            - paragraph [ref=e253]: PMH, Wanprestasi, Bantahan Lelang
        - generic [ref=e254] [cursor=pointer]:
          - img "Team Non Litigasi dan Negosiasi" [ref=e256]
          - generic [ref=e257]:
            - generic [ref=e258]: Penyelesaian Luar Pengadilan
            - heading "Team Non Litigasi dan Negosiasi" [level=3] [ref=e259]
            - paragraph [ref=e260]: Somasi, Mediasi, Restrukturisasi
        - generic [ref=e261] [cursor=pointer]:
          - img "Team Analisa Dokumen & Pembuktian" [ref=e263]
          - generic [ref=e264]:
            - generic [ref=e265]: Kajian Dokumen Hukum
            - heading "Team Analisa Dokumen & Pembuktian" [level=3] [ref=e266]
            - paragraph [ref=e267]: Perjanjian Kredit, APHT, Fidusia
        - generic [ref=e268] [cursor=pointer]:
          - img "Team Pengaduan Instansi" [ref=e270]
          - generic [ref=e271]:
            - generic [ref=e272]: Pidana & Administratif
            - heading "Team Pengaduan Instansi" [level=3] [ref=e273]
            - paragraph [ref=e274]: Kepolisian, OJK, BPSK
    - generic [ref=e276]:
      - generic [ref=e277]:
        - generic [ref=e278]: Kepercayaan Klien
        - heading "Apa Kata Klien Kami" [level=2] [ref=e279]
      - generic [ref=e280]:
        - generic [ref=e281]:
          - generic [ref=e282]:
            - img [ref=e283]
            - paragraph [ref=e286]: "\"Sangat profesional dan responsif. Analisa hukumnya tajam dan penjelasannya mudah dipahami meskipun saya bukan orang hukum. Rekomendasi untuk siapapun yang punya masalah sengketa bisnis.\""
          - heading "D.K. — Pengusaha Retail, Malang" [level=4] [ref=e289]
        - generic [ref=e290]:
          - generic [ref=e291]:
            - img [ref=e292]
            - paragraph [ref=e295]: "\"Awalnya saya sudah pasrah karena kendaraan sudah ditarik tanpa pemberitahuan yang jelas. Setelah konsultasi dengan Pak Hari, ternyata ada pelanggaran prosedur yang bisa dipermasalahkan. Alhamdulillah masalah selesai tanpa harus ke sidang panjang.\""
          - heading "B.S. — Nasabah Leasing, Blitar" [level=4] [ref=e298]
        - generic [ref=e299]:
          - generic [ref=e300]:
            - img [ref=e301]
            - paragraph [ref=e304]: "\"Saya punya masalah dengan mitra bisnis yang ingkar janji kontrak. Kantor ini membantu dari analisa dokumen sampai negosiasi. Hasilnya memuaskan dan prosesnya tidak berlarut-larut seperti yang saya bayangkan.\""
          - heading "P.W. — Pelaku Usaha, Tulungagung" [level=4] [ref=e307]
        - generic [ref=e308]:
          - generic [ref=e309]:
            - img [ref=e310]
            - paragraph [ref=e313]: "\"Sebagai pemilik usaha kafe, saya sering dapat komplain pelanggan yang tidak tahu mau saya hadapi seperti apa. Pak Hari membantu saya menyusun SOP komplain dan aturan yang aman secara hukum. Sekarang usaha saya lebih terlindungi.\""
          - heading "R.H. — Pemilik Kafe, Kediri" [level=4] [ref=e316]
        - generic [ref=e317]:
          - generic [ref=e318]:
            - img [ref=e319]
            - paragraph [ref=e322]: "\"Saya mendapat surat penagihan yang isinya mengancam dan tidak sesuai dengan perjanjian awal. Tim kantor ini menganalisa dokumen saya dan membantu menyusun somasi balik yang tepat. Penagihan yang tidak wajar akhirnya berhenti.\""
          - heading "A.N. — Debitur Finance, Blitar" [level=4] [ref=e325]
        - generic [ref=e326]:
          - generic [ref=e327]:
            - img [ref=e328]
            - paragraph [ref=e331]: "\"Awalnya saya sudah pasrah karena kendaraan sudah ditarik tanpa pemberitahuan yang jelas. Setelah konsultasi dengan Pak Hari, ternyata ada pelanggaran prosedur yang bisa dipermasalahkan. Alhamdulillah masalah selesai tanpa harus ke sidang panjang.\""
          - heading "B.S. — Nasabah Leasing, Blitar" [level=4] [ref=e334]
        - generic [ref=e335]:
          - generic [ref=e336]:
            - img [ref=e337]
            - paragraph [ref=e340]: "\"Saya punya masalah dengan mitra bisnis yang ingkar janji kontrak. Kantor ini membantu dari analisa dokumen sampai negosiasi. Hasilnya memuaskan dan prosesnya tidak berlarut-larut seperti yang saya bayangkan.\""
          - heading "P.W. — Pelaku Usaha, Tulungagung" [level=4] [ref=e343]
        - generic [ref=e344]:
          - generic [ref=e345]:
            - img [ref=e346]
            - paragraph [ref=e349]: "\"Sebagai pemilik usaha kafe, saya sering dapat komplain pelanggan yang tidak tahu mau saya hadapi seperti apa. Pak Hari membantu saya menyusun SOP komplain dan aturan yang aman secara hukum. Sekarang usaha saya lebih terlindungi.\""
          - heading "R.H. — Pemilik Kafe, Kediri" [level=4] [ref=e352]
        - generic [ref=e353]:
          - generic [ref=e354]:
            - img [ref=e355]
            - paragraph [ref=e358]: "\"Saya mendapat surat penagihan yang isinya mengancam dan tidak sesuai dengan perjanjian awal. Tim kantor ini menganalisa dokumen saya dan membantu menyusun somasi balik yang tepat. Penagihan yang tidak wajar akhirnya berhenti.\""
          - heading "A.N. — Debitur Finance, Blitar" [level=4] [ref=e361]
        - generic [ref=e362]:
          - generic [ref=e363]:
            - img [ref=e364]
            - paragraph [ref=e367]: "\"Sangat profesional dan responsif. Analisa hukumnya tajam dan penjelasannya mudah dipahami meskipun saya bukan orang hukum. Rekomendasi untuk siapapun yang punya masalah sengketa bisnis.\""
          - heading "D.K. — Pengusaha Retail, Malang" [level=4] [ref=e370]
    - generic [ref=e372]:
      - generic [ref=e373]:
        - generic [ref=e374]:
          - generic [ref=e375]: Insight & Publikasi
          - heading "Edukasi Hukum untuk Bisnis & Konsumen" [level=2] [ref=e376]
        - link "Lihat Semua Artikel" [ref=e378] [cursor=pointer]:
          - /url: /artikel
          - button "Lihat Semua Artikel" [ref=e379]
      - generic [ref=e380]:
        - link "konsultasi usaha Profil Pimpinan dan Kantor Konsultan Hukum 30 April 2026 • 4 min read Profil Pimpinan dan Kantor Konsultan Hukum Baca Selengkapnya" [ref=e382] [cursor=pointer]:
          - /url: /artikel/profil-pimpinan-konsultan-hukum-finance
          - generic [ref=e383]:
            - generic [ref=e384]: konsultasi usaha
            - img "Profil Pimpinan dan Kantor Konsultan Hukum" [ref=e385]
          - generic [ref=e387]:
            - generic [ref=e388]:
              - generic [ref=e389]:
                - img [ref=e390]
                - text: 30 April 2026
              - generic [ref=e392]: •
              - generic [ref=e393]: 4 min read
            - heading "Profil Pimpinan dan Kantor Konsultan Hukum" [level=3] [ref=e394]
            - generic [ref=e395]:
              - generic [ref=e396]: Baca Selengkapnya
              - img [ref=e397]
        - link "panduan hukum Gugatan Perbuatan Melawan Hukum (PMH) 30 April 2026 • 5 min read Gugatan Perbuatan Melawan Hukum (PMH) Baca Selengkapnya" [ref=e400] [cursor=pointer]:
          - /url: /artikel/gugatan-perbuatan-melawan-hukum-pmh
          - generic [ref=e401]:
            - generic [ref=e402]: panduan hukum
            - img "Gugatan Perbuatan Melawan Hukum (PMH)" [ref=e403]
          - generic [ref=e405]:
            - generic [ref=e406]:
              - generic [ref=e407]:
                - img [ref=e408]
                - text: 30 April 2026
              - generic [ref=e410]: •
              - generic [ref=e411]: 5 min read
            - heading "Gugatan Perbuatan Melawan Hukum (PMH)" [level=3] [ref=e412]
            - generic [ref=e413]:
              - generic [ref=e414]: Baca Selengkapnya
              - img [ref=e415]
        - link "sengketa bisnis Pentingnya Legal Criminal Assessment Sebelum Melapor ke Polisi 30 April 2026 • 6 min read Pentingnya Legal Criminal Assessment Sebelum Melapor ke Polisi Baca Selengkapnya" [ref=e418] [cursor=pointer]:
          - /url: /artikel/legal-criminal-assessment-laporan-kepolisian
          - generic [ref=e419]:
            - generic [ref=e420]: sengketa bisnis
            - img "Pentingnya Legal Criminal Assessment Sebelum Melapor ke Polisi" [ref=e421]
          - generic [ref=e423]:
            - generic [ref=e424]:
              - generic [ref=e425]:
                - img [ref=e426]
                - text: 30 April 2026
              - generic [ref=e428]: •
              - generic [ref=e429]: 6 min read
            - heading "Pentingnya Legal Criminal Assessment Sebelum Melapor ke Polisi" [level=3] [ref=e430]
            - generic [ref=e431]:
              - generic [ref=e432]: Baca Selengkapnya
              - img [ref=e433]
    - generic [ref=e437]:
      - generic [ref=e438]:
        - generic [ref=e439]: Pertanyaan Umum
        - heading "Bantuan Cepat" [level=2] [ref=e440]
        - paragraph [ref=e441]: Temukan jawaban dari pertanyaan yang sering diajukan. Jika Anda tidak menemukan jawaban yang Anda cari, silakan hubungi tim kami.
      - generic [ref=e443]:
        - heading "01 Berapa biaya konsultasi awal?" [level=3] [ref=e445]:
          - button "01 Berapa biaya konsultasi awal?" [ref=e446]:
            - generic [ref=e447]:
              - generic [ref=e448]: "01"
              - text: Berapa biaya konsultasi awal?
            - img [ref=e449]
        - heading "02 Apakah masalah saya harus langsung dibawa ke pengadilan?" [level=3] [ref=e452]:
          - button "02 Apakah masalah saya harus langsung dibawa ke pengadilan?" [ref=e453]:
            - generic [ref=e454]:
              - generic [ref=e455]: "02"
              - text: Apakah masalah saya harus langsung dibawa ke pengadilan?
            - img [ref=e456]
        - heading "03 Wilayah mana saja yang dilayani?" [level=3] [ref=e459]:
          - button "03 Wilayah mana saja yang dilayani?" [ref=e460]:
            - generic [ref=e461]:
              - generic [ref=e462]: "03"
              - text: Wilayah mana saja yang dilayani?
            - img [ref=e463]
        - heading "04 Dokumen apa yang perlu saya siapkan untuk konsultasi?" [level=3] [ref=e466]:
          - button "04 Dokumen apa yang perlu saya siapkan untuk konsultasi?" [ref=e467]:
            - generic [ref=e468]:
              - generic [ref=e469]: "04"
              - text: Dokumen apa yang perlu saya siapkan untuk konsultasi?
            - img [ref=e470]
        - heading "05 Berapa lama proses penyelesaian perkara?" [level=3] [ref=e473]:
          - button "05 Berapa lama proses penyelesaian perkara?" [ref=e474]:
            - generic [ref=e475]:
              - generic [ref=e476]: "05"
              - text: Berapa lama proses penyelesaian perkara?
            - img [ref=e477]
        - heading "06 Apakah kerahasiaan masalah saya terjamin?" [level=3] [ref=e480]:
          - button "06 Apakah kerahasiaan masalah saya terjamin?" [ref=e481]:
            - generic [ref=e482]:
              - generic [ref=e483]: "06"
              - text: Apakah kerahasiaan masalah saya terjamin?
            - img [ref=e484]
  - generic [ref=e488]:
    - generic [ref=e489]:
      - text: Siap Menyelesaikan
      - text: Masalah Hukum Anda?
    - paragraph [ref=e490]: Jangan tunda hingga masalah semakin rumit. Dapatkan analisa tajam dan strategi penyelesaian efektif dari tim profesional kami.
    - generic [ref=e491]:
      - link "Konsultasi via WhatsApp" [ref=e492] [cursor=pointer]:
        - /url: https://wa.me/6281234567890?text=Halo%20Pak%20Hari%2C%20saya%20ingin%20konsultasi%20mengenai%20masalah%20hukum%20saya.
        - button "Konsultasi via WhatsApp" [ref=e493]:
          - img
          - text: Konsultasi via WhatsApp
      - link "Isi Form Konsultasi" [ref=e494] [cursor=pointer]:
        - /url: /konsultasi
        - button "Isi Form Konsultasi" [ref=e495]:
          - img
          - text: Isi Form Konsultasi
  - contentinfo [ref=e496]:
    - generic [ref=e497]:
      - generic [ref=e498]:
        - generic [ref=e499]:
          - link "Kantor LAW" [ref=e500] [cursor=pointer]:
            - /url: /
          - paragraph [ref=e501]: Kantor konsultan hukum di Blitar yang berfokus pada sengketa finance, perlindungan konsumen, mediasi bisnis, dan pengembangan usaha.
        - generic [ref=e502]:
          - heading "Menu Navigasi" [level=4] [ref=e503]
          - list [ref=e504]:
            - listitem [ref=e505]:
              - link "Beranda" [ref=e506] [cursor=pointer]:
                - /url: /
            - listitem [ref=e507]:
              - link "Layanan Kami" [ref=e508] [cursor=pointer]:
                - /url: /layanan
            - listitem [ref=e509]:
              - link "Galeri" [ref=e510] [cursor=pointer]:
                - /url: /galeri
            - listitem [ref=e511]:
              - link "Tim Profesional" [ref=e512] [cursor=pointer]:
                - /url: /tim
            - listitem [ref=e513]:
              - link "Insight Hukum" [ref=e514] [cursor=pointer]:
                - /url: /artikel
            - listitem [ref=e515]:
              - link "Kontak" [ref=e516] [cursor=pointer]:
                - /url: /kontak
            - listitem [ref=e517]:
              - link "Daftar Konsultasi" [ref=e518] [cursor=pointer]:
                - /url: /daftar-konsultasi
            - listitem [ref=e519]:
              - link "Konsultasi" [ref=e520] [cursor=pointer]:
                - /url: /konsultasi
        - generic [ref=e521]:
          - heading "Fokus Layanan" [level=4] [ref=e522]
          - list [ref=e523]:
            - listitem [ref=e524]: Sengketa Finance & Perbankan
            - listitem [ref=e525]: Perlindungan Konsumen
            - listitem [ref=e526]: Gugatan Perdata
            - listitem [ref=e527]: Analisa Lelang & Cessie
            - listitem [ref=e528]: Mediasi & Negosiasi Bisnis
        - generic [ref=e529]:
          - heading "Hubungi Kami" [level=4] [ref=e530]
          - list [ref=e531]:
            - listitem [ref=e532]:
              - img [ref=e533]
              - generic [ref=e536]: Jalan Menur RT 003 / RW 007, Desa Kaweron, Kecamatan Talun, Kabupaten Blitar, Jawa Timur
            - listitem [ref=e537]:
              - img [ref=e538]
              - generic [ref=e540]: "6281234567890"
            - listitem [ref=e541]:
              - img [ref=e542]
              - generic [ref=e545]: info@hutabaratlawoffice.com
            - listitem [ref=e546]:
              - img [ref=e547]
              - generic [ref=e550]: "Senin - Jumat: 08.00 - 17.00 WIB"
      - generic [ref=e551]:
        - paragraph [ref=e552]: © 2026 Kantor Konsultan Hukum Hari Mulana Hutabarat, S.H., CPLA. Hak Cipta Dilindungi.
        - generic [ref=e553]:
          - link "Kebijakan Privasi" [ref=e554] [cursor=pointer]:
            - /url: /privacy
          - link "Syarat & Ketentuan" [ref=e555] [cursor=pointer]:
            - /url: /terms
  - link "Chat WhatsApp":
    - /url: https://wa.me/6281234567890?text=Halo%20Pak%20Hari%2C%20saya%20ingin%20konsultasi%20mengenai%20masalah%20hukum%20saya.
    - img
  - button "Open Next.js Dev Tools" [ref=e561] [cursor=pointer]:
    - img [ref=e562]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Skenario Area Publik LPK Blitar', () => {
  4  | 
  5  |   test('Membuka halaman beranda dan memverifikasi elemen utama', async ({ page }) => {
  6  |     await page.goto('/');
  7  | 
  8  |     await expect(page).toHaveTitle(/Hutabarat Law/i);
  9  | 
  10 |     const badgeExperience = page.locator('text=Tahun Pengalaman');
> 11 |     await expect(badgeExperience).toBeVisible();
     |                                   ^ Error: expect(locator).toBeVisible() failed
  12 | 
  13 |     const waButton = page.locator('text=Konsultasi via WhatsApp');
  14 |     await expect(waButton).toBeVisible();
  15 |   });
  16 | 
  17 |   test('Navigasi dan interaksi Galeri', async ({ page }) => {
  18 |     await page.goto('/galeri');
  19 | 
  20 |     const title = page.locator('h1', { hasText: 'Galeri Kegiatan' });
  21 |     await expect(title).toBeVisible();
  22 | 
  23 |     const filterSemua = page.locator('button', { hasText: 'Semua' });
  24 |     await expect(filterSemua).toBeVisible();
  25 | 
  26 |     const galleryCards = page.locator('article');
  27 |     const count = await galleryCards.count();
  28 |     
  29 |     if (count > 0) {
  30 |       const firstCardLink = galleryCards.first().locator('a');
  31 |       await firstCardLink.click();
  32 | 
  33 |       // Tunggu page baru di load
  34 |       await page.waitForURL(/\/galeri\/.+/);
  35 |       await expect(page).toHaveURL(/\/galeri\/.+/);
  36 |     }
  37 |   });
  38 | 
  39 |   test('Membuka halaman Daftar Konsultasi', async ({ page }) => {
  40 |     await page.goto('/daftar-konsultasi');
  41 | 
  42 |     await expect(page.locator('h1', { hasText: 'Daftar Antrean Konsultasi' })).toBeVisible();
  43 | 
  44 |     // Pastikan ada filter atau teks terkait data
  45 |     const filterText = page.locator('text=Filter daftar konsultasi').or(page.locator('text=Belum ada data masuk'));
  46 |     await expect(filterText).toBeVisible();
  47 |   });
  48 | 
  49 | });
  50 | 
```