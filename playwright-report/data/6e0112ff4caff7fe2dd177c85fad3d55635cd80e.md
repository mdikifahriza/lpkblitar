# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: consultation-form.spec.ts >> Alur Formulir Konsultasi >> Input formulir multi-step sukses disimulasikan
- Location: e2e\consultation-form.spec.ts:5:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="namaLengkap"]')

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
        - button "Ubah Tema" [ref=e25]:
          - img
          - generic [ref=e26]: Ubah Tema
  - main [ref=e27]:
    - generic [ref=e28]:
      - generic [ref=e30]:
        - generic [ref=e31]: Langkah Awal
        - heading "Mulai Konsultasi Anda" [level=1] [ref=e32]
        - paragraph [ref=e33]: Ceritakan detail permasalahan hukum yang Anda hadapi. Segala informasi yang Anda berikan dilindungi oleh kerahasiaan profesional pengacara.
      - generic [ref=e36]:
        - generic [ref=e38]:
          - generic [ref=e40]:
            - generic [ref=e41]: Jenis Masalah
            - generic [ref=e42]: Data Diri
            - generic [ref=e43]: Detail
            - generic [ref=e44]: Kirim
          - generic [ref=e47]:
            - generic [ref=e48]:
              - heading "Apa masalah hukum yang Anda hadapi?" [level=3] [ref=e49]
              - generic [ref=e50]:
                - generic [ref=e51]:
                  - generic [ref=e55] [cursor=pointer]: Gugatan Perbuatan Melawan Hukum
                  - generic [ref=e59] [cursor=pointer]: Gugatan Wanprestasi
                  - generic [ref=e63] [cursor=pointer]: Gugatan Ganti Kerugian
                  - generic [ref=e67] [cursor=pointer]: Bantahan & Perlawanan Eksekusi
                  - generic [ref=e71] [cursor=pointer]: Analisa Lelang, Cessie & Hak Tanggungan
                  - generic [ref=e75] [cursor=pointer]: Mediasi & Negosiasi Bisnis
                  - generic [ref=e79] [cursor=pointer]: Perlindungan Konsumen
                  - generic [ref=e83] [cursor=pointer]: Konsultasi Pengembangan Usaha
                - paragraph [ref=e84]: Pilih jenis masalah Anda
            - generic [ref=e85]:
              - button "Kembali" [disabled]:
                - img
                - text: Kembali
              - button "Lanjut" [active] [ref=e86]:
                - text: Lanjut
                - img
        - generic [ref=e88]:
          - generic [ref=e89]:
            - heading "Kontak Alternatif" [level=3] [ref=e90]
            - paragraph [ref=e91]: Anda juga dapat langsung menghubungi kami melalui WhatsApp atau datang langsung ke kantor kami.
            - list [ref=e92]:
              - listitem [ref=e93]:
                - img [ref=e95]
                - generic [ref=e97]:
                  - generic [ref=e98]: WhatsApp
                  - link "6281234567890" [ref=e99] [cursor=pointer]:
                    - /url: https://wa.me/6281234567890
              - listitem [ref=e100]:
                - img [ref=e102]
                - generic [ref=e105]:
                  - generic [ref=e106]: Email
                  - link "info@hutabaratlawoffice.com" [ref=e107] [cursor=pointer]:
                    - /url: mailto:info@hutabaratlawoffice.com
              - listitem [ref=e108]:
                - img [ref=e110]
                - generic [ref=e113]:
                  - generic [ref=e114]: Alamat Kantor
                  - generic [ref=e115]: Jalan Menur RT 003 / RW 007, Desa Kaweron, Kecamatan Talun, Kabupaten Blitar, Jawa Timur
          - generic [ref=e116]:
            - heading "Yang Terjadi Selanjutnya" [level=3] [ref=e117]:
              - img [ref=e118]
              - text: Yang Terjadi Selanjutnya
            - list [ref=e121]:
              - listitem [ref=e122]:
                - heading "Tim kami menganalisa form" [level=4] [ref=e124]
                - paragraph [ref=e125]: Review awal dalam 1x24 jam kerja.
              - listitem [ref=e126]:
                - heading "Kami menghubungi Anda" [level=4] [ref=e128]
                - paragraph [ref=e129]: Untuk penjadwalan sesi konsultasi.
              - listitem [ref=e130]:
                - heading "Penawaran Solusi Hukum" [level=4] [ref=e132]
                - paragraph [ref=e133]: Pembuatan strategi dan estimasi biaya.
  - generic [ref=e136]:
    - generic [ref=e137]:
      - text: Siap Menyelesaikan
      - text: Masalah Hukum Anda?
    - paragraph [ref=e138]: Jangan tunda hingga masalah semakin rumit. Dapatkan analisa tajam dan strategi penyelesaian efektif dari tim profesional kami.
    - generic [ref=e139]:
      - link "Konsultasi via WhatsApp" [ref=e140] [cursor=pointer]:
        - /url: https://wa.me/6281234567890?text=Halo%20Pak%20Hari%2C%20saya%20ingin%20konsultasi%20mengenai%20masalah%20hukum%20saya.
        - button "Konsultasi via WhatsApp" [ref=e141]:
          - img
          - text: Konsultasi via WhatsApp
      - link "Isi Form Konsultasi" [ref=e142] [cursor=pointer]:
        - /url: /konsultasi
        - button "Isi Form Konsultasi" [ref=e143]:
          - img
          - text: Isi Form Konsultasi
  - contentinfo [ref=e144]:
    - generic [ref=e145]:
      - generic [ref=e146]:
        - generic [ref=e147]:
          - link "Kantor LAW" [ref=e148] [cursor=pointer]:
            - /url: /
          - paragraph [ref=e149]: Kantor konsultan hukum di Blitar yang berfokus pada sengketa finance, perlindungan konsumen, mediasi bisnis, dan pengembangan usaha.
        - generic [ref=e150]:
          - heading "Menu Navigasi" [level=4] [ref=e151]
          - list [ref=e152]:
            - listitem [ref=e153]:
              - link "Beranda" [ref=e154] [cursor=pointer]:
                - /url: /
            - listitem [ref=e155]:
              - link "Layanan Kami" [ref=e156] [cursor=pointer]:
                - /url: /layanan
            - listitem [ref=e157]:
              - link "Galeri" [ref=e158] [cursor=pointer]:
                - /url: /galeri
            - listitem [ref=e159]:
              - link "Tim Profesional" [ref=e160] [cursor=pointer]:
                - /url: /tim
            - listitem [ref=e161]:
              - link "Insight Hukum" [ref=e162] [cursor=pointer]:
                - /url: /artikel
            - listitem [ref=e163]:
              - link "Kontak" [ref=e164] [cursor=pointer]:
                - /url: /kontak
            - listitem [ref=e165]:
              - link "Daftar Konsultasi" [ref=e166] [cursor=pointer]:
                - /url: /daftar-konsultasi
            - listitem [ref=e167]:
              - link "Konsultasi" [ref=e168] [cursor=pointer]:
                - /url: /konsultasi
        - generic [ref=e169]:
          - heading "Fokus Layanan" [level=4] [ref=e170]
          - list [ref=e171]:
            - listitem [ref=e172]: Sengketa Finance & Perbankan
            - listitem [ref=e173]: Perlindungan Konsumen
            - listitem [ref=e174]: Gugatan Perdata
            - listitem [ref=e175]: Analisa Lelang & Cessie
            - listitem [ref=e176]: Mediasi & Negosiasi Bisnis
        - generic [ref=e177]:
          - heading "Hubungi Kami" [level=4] [ref=e178]
          - list [ref=e179]:
            - listitem [ref=e180]:
              - img [ref=e181]
              - generic [ref=e184]: Jalan Menur RT 003 / RW 007, Desa Kaweron, Kecamatan Talun, Kabupaten Blitar, Jawa Timur
            - listitem [ref=e185]:
              - img [ref=e186]
              - generic [ref=e188]: "6281234567890"
            - listitem [ref=e189]:
              - img [ref=e190]
              - generic [ref=e193]: info@hutabaratlawoffice.com
            - listitem [ref=e194]:
              - img [ref=e195]
              - generic [ref=e198]: "Senin - Jumat: 08.00 - 17.00 WIB"
      - generic [ref=e199]:
        - paragraph [ref=e200]: © 2026 Kantor Konsultan Hukum Hari Mulana Hutabarat, S.H., CPLA. Hak Cipta Dilindungi.
        - generic [ref=e201]:
          - link "Kebijakan Privasi" [ref=e202] [cursor=pointer]:
            - /url: /privacy
          - link "Syarat & Ketentuan" [ref=e203] [cursor=pointer]:
            - /url: /terms
  - link "Chat WhatsApp" [ref=e204] [cursor=pointer]:
    - /url: https://wa.me/6281234567890?text=Halo%20Pak%20Hari%2C%20saya%20ingin%20konsultasi%20mengenai%20masalah%20hukum%20saya.
    - img [ref=e205]
  - button "Open Next.js Dev Tools" [ref=e212] [cursor=pointer]:
    - img [ref=e213]
  - alert [ref=e216]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Alur Formulir Konsultasi', () => {
  4  | 
  5  |   test('Input formulir multi-step sukses disimulasikan', async ({ page }) => {
  6  |     await page.goto('/konsultasi');
  7  | 
  8  |     // Step 1: Jenis Masalah
  9  |     await page.locator('button:has-text("Lanjut")').click();
  10 | 
  11 |     // Step 2: Data Diri
> 12 |     await page.fill('input[name="namaLengkap"]', 'Tester E2E');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  13 |     await page.fill('input[name="noHp"]', '081234567890');
  14 |     await page.fill('input[name="email"]', 'tester@example.com');
  15 |     await page.fill('input[name="kota"]', 'Blitar');
  16 |     await page.locator('button:has-text("Lanjut")').click();
  17 | 
  18 |     // Step 3: Detail Permasalahan
  19 |     await page.fill('textarea[name="kronologi"]', 'Ini adalah pesan otomatis dari Playwright untuk menguji sistem multi-step form.');
  20 |     await page.locator('button:has-text("Lanjut")').click();
  21 |     
  22 |     // Step 4: Konfirmasi Pengiriman (centang persetujuan)
  23 |     await page.locator('text=Saya menyatakan bahwa informasi yang saya berikan').click();
  24 | 
  25 |     // Submit form
  26 |     await page.click('button[type="submit"]');
  27 | 
  28 |     // Tunggu munculnya success page "Terima Kasih!"
  29 |     const successMessage = page.locator('h2', { hasText: 'Terima Kasih!' });
  30 |     await expect(successMessage).toBeVisible({ timeout: 10000 });
  31 |   });
  32 | });
```