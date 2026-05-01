# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-auth.spec.ts >> Autentikasi & Keamanan Admin >> Muncul pesan error jika kredensial salah
- Location: e2e\admin-auth.spec.ts:16:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Gagal masuk. Identitas atau kata sandi salah.')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=Gagal masuk. Identitas atau kata sandi salah.')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - heading "Panel Admin" [level=1] [ref=e6]
        - paragraph [ref=e7]: Masuk untuk mengelola website Hutabarat Law
      - generic [ref=e8]:
        - generic [ref=e9]:
          - text: Email / Username
          - generic [ref=e10]:
            - generic:
              - img
            - textbox "admin@contoh.com / adminhari" [ref=e11]: salah@example.com
        - generic [ref=e12]:
          - text: Kata Sandi
          - generic [ref=e13]:
            - generic:
              - img
            - textbox "••••••••" [ref=e14]: password_salah123
            - button [ref=e15]:
              - img [ref=e16]
        - button "Masuk" [ref=e19]
    - link "← Kembali ke Beranda" [ref=e21] [cursor=pointer]:
      - /url: /
  - button "Open Next.js Dev Tools" [ref=e27] [cursor=pointer]:
    - img [ref=e28]
  - alert [ref=e31]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Autentikasi & Keamanan Admin', () => {
  4  | 
  5  |   test('Guest harus diarahkan ke halaman login jika membuka rute admin', async ({ page }) => {
  6  |     await page.goto('/admin');
  7  |     
  8  |     await page.waitForURL(/\/admin\/login/);
  9  |     
  10 |     // Pastikan halaman login memuat Panel Admin
  11 |     await expect(page.locator('h1', { hasText: 'Panel Admin' })).toBeVisible();
  12 |     await expect(page.locator('input[name="identifier"]')).toBeVisible();
  13 |     await expect(page.locator('input[name="password"]')).toBeVisible();
  14 |   });
  15 | 
  16 |   test('Muncul pesan error jika kredensial salah', async ({ page }) => {
  17 |     await page.goto('/admin/login');
  18 | 
  19 |     await page.fill('input[name="identifier"]', 'salah@example.com');
  20 |     await page.fill('input[name="password"]', 'password_salah123');
  21 | 
  22 |     await page.locator('button[type="submit"]').click();
  23 | 
  24 |     // Tunggu pesan error dari toast/sonner
  25 |     const errorMessage = page.locator('text=Gagal masuk. Identitas atau kata sandi salah.');
> 26 |     await expect(errorMessage).toBeVisible({ timeout: 10000 });
     |                                ^ Error: expect(locator).toBeVisible() failed
  27 |   });
  28 | 
  29 | });
```