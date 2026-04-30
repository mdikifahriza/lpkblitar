import { test, expect } from '@playwright/test';

test.describe('Skenario Area Publik LPK Blitar', () => {

  test('Membuka halaman beranda dan memverifikasi elemen utama', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Hutabarat Law/i);

    const badgeExperience = page.locator('text=Tahun Pengalaman');
    await expect(badgeExperience).toBeVisible();

    const waButton = page.locator('text=Konsultasi via WhatsApp');
    await expect(waButton).toBeVisible();
  });

  test('Navigasi dan interaksi Galeri', async ({ page }) => {
    await page.goto('/galeri');

    const title = page.locator('h1', { hasText: 'Galeri Kegiatan' });
    await expect(title).toBeVisible();

    const filterSemua = page.locator('button', { hasText: 'Semua' });
    await expect(filterSemua).toBeVisible();

    const galleryCards = page.locator('article');
    const count = await galleryCards.count();
    
    if (count > 0) {
      const firstCardLink = galleryCards.first().locator('a');
      await firstCardLink.click();

      // Tunggu page baru di load
      await page.waitForURL(/\/galeri\/.+/);
      await expect(page).toHaveURL(/\/galeri\/.+/);
    }
  });

  test('Membuka halaman Daftar Konsultasi', async ({ page }) => {
    await page.goto('/daftar-konsultasi');

    await expect(page.locator('h1', { hasText: 'Daftar Antrean Konsultasi' })).toBeVisible();

    // Pastikan ada filter atau teks terkait data
    const filterText = page.locator('text=Filter daftar konsultasi').or(page.locator('text=Belum ada data masuk'));
    await expect(filterText).toBeVisible();
  });

});
