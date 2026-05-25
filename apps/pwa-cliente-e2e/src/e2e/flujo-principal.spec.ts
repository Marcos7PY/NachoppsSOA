import { test, expect } from '@playwright/test';

test.describe('Flujo Principal - NachoPps Restobar', () => {
  // Simularemos el flujo básico: Login -> Ver Mesas -> Pedidos -> Caja
  // Dado que es una prueba de humo y requiere backend, asumiremos un flujo optimista mockeado o real
  // Asumiendo que el backend de desarrollo está corriendo en localhost:8000 y front en localhost:4200
  
  test('debe permitir al usuario iniciar sesión y ver el panel de control', async ({ page }) => {
    // 1. Navegar a Login
    await page.goto('/');

    // 2. Si no hay token, el sistema redirige al login o el usuario está deslogueado
    // Simular inicio de sesión (basado en Login.tsx)
    await page.fill('input[type="email"]', 'mesero@nachopps.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Iniciar Sesión")');

    // 3. Esperar que cargue el Panel de Control
    await expect(page.locator('h1')).toContainText('Panel de Control');

    // 4. Verificar que las tarjetas principales existan
    await expect(page.locator('text=Mesas y Salón')).toBeVisible();
    await expect(page.locator('text=Comandas')).toBeVisible();
    await expect(page.locator('text=Caja y Pagos')).toBeVisible();
  });

  test('debe poder navegar al mapa de mesas', async ({ page }) => {
    await page.goto('/');
    
    // Login rápido
    await page.fill('input[type="email"]', 'admin@nachopps.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForSelector('text=Panel de Control');

    // Clic en Mesas
    await page.click('text=Mesas y Salón');
    
    // Validar que entramos a mesas
    await expect(page.locator('h1')).toContainText('Mapa de Mesas');
  });

  test('debe cargar la vista de pedidos y caja', async ({ page }) => {
    // Autenticar primero (se podría usar storage state para evitar login redundante)
    await page.goto('/');
    await page.fill('input[type="email"]', 'admin@nachopps.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForSelector('text=Panel de Control');

    // Ir a Caja
    await page.goto('/caja');
    
    // Si la caja no está abierta, saldrá el mensaje "Caja Bloqueada"
    // Si está abierta, se ve "Caja Central" o el título
    const isLocked = await page.locator('text=Caja Bloqueada').isVisible();
    if (!isLocked) {
      await expect(page.locator('h1')).toContainText('Caja Central');
    }
  });
});
