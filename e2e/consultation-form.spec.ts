import { test, expect } from '@playwright/test';

test.describe('Alur Formulir Konsultasi', () => {

  test('Input formulir multi-step sukses disimulasikan', async ({ page }) => {
    await page.goto('/konsultasi');

    // Step 1: Jenis Masalah
    await page.locator('button:has-text("Lanjut")').click();

    // Step 2: Data Diri
    await page.fill('input[name="namaLengkap"]', 'Tester E2E');
    await page.fill('input[name="noHp"]', '081234567890');
    await page.fill('input[name="email"]', 'tester@example.com');
    await page.fill('input[name="kota"]', 'Blitar');
    await page.locator('button:has-text("Lanjut")').click();

    // Step 3: Detail Permasalahan
    await page.fill('textarea[name="kronologi"]', 'Ini adalah pesan otomatis dari Playwright untuk menguji sistem multi-step form.');
    await page.locator('button:has-text("Lanjut")').click();
    
    // Step 4: Konfirmasi Pengiriman (centang persetujuan)
    await page.locator('text=Saya menyatakan bahwa informasi yang saya berikan').click();

    // Submit form
    await page.click('button[type="submit"]');

    // Tunggu munculnya success page "Terima Kasih!"
    const successMessage = page.locator('h2', { hasText: 'Terima Kasih!' });
    await expect(successMessage).toBeVisible({ timeout: 10000 });
  });
});