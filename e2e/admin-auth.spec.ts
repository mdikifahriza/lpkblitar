import { test, expect } from '@playwright/test';

test.describe('Autentikasi & Keamanan Admin', () => {

  test('Guest harus diarahkan ke halaman login jika membuka rute admin', async ({ page }) => {
    await page.goto('/admin');
    
    await page.waitForURL(/\/admin\/login/);
    
    // Pastikan halaman login memuat Panel Admin
    await expect(page.locator('h1', { hasText: 'Panel Admin' })).toBeVisible();
    await expect(page.locator('input[name="identifier"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('Muncul pesan error jika kredensial salah', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('input[name="identifier"]', 'salah@example.com');
    await page.fill('input[name="password"]', 'password_salah123');

    await page.locator('button[type="submit"]').click();

    // Tunggu pesan error dari toast/sonner
    const errorMessage = page.locator('text=Gagal masuk. Identitas atau kata sandi salah.');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

});