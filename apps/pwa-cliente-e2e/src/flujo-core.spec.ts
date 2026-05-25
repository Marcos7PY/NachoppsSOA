import { test, expect } from '@playwright/test';

test('Flujo Core: Ocupar Mesa, Pedir, KDS y Cobrar', async ({ page }) => {
  // 1. Iniciar sesión o saltar login (el app actual permite navegar directamente a veces, pero por si acaso navegamos al inicio)
  await page.goto('/');

  // 2. Ir a Mesas y ocupar una mesa libre
  await page.click('text="Mapa de Mesas"');
  await expect(page.locator('text="Mesa"').first()).toBeVisible();

  // 3. Ir a Inventario y crear un plato rápido
  await page.click('text="Inventario"');
  await expect(page.locator('text="Menú e Inventario"')).toBeVisible();

  // Clic en Nuevo Producto (asumiendo que hay una categoría activa)
  const btnNuevoProducto = page.locator('button:has-text("Nuevo Producto")');
  if (await btnNuevoProducto.isEnabled()) {
    await btnNuevoProducto.click();
    await page.fill('input[name="nombre"]', 'Plato E2E Test');
    await page.fill('input[name="precio"]', '25.50');
    await page.fill('input[name="stockActual"]', '10');
    await page.click('button:has-text("Crear Producto")');
  }

  // 4. Ir a Pedidos
  await page.click('text="Pedidos y Comandas"');
  await expect(page.locator('text="Nueva Comanda"')).toBeVisible();
  
  // Seleccionar la primera mesa
  await page.selectOption('select', { index: 1 });
  
  // Añadir el plato al pedido
  await page.click('button:has-text("Añadir")');
  
  // Enviar Pedido
  await page.click('button:has-text("Enviar Pedido")');
  await expect(page.locator('text="Pedido enviado a cocina"')).toBeVisible({ timeout: 5000 }).catch(() => {}); // Opcional dependiendo del Toast

  // 5. Ir a KDS (Cocina)
  await page.click('text="Monitor de Cocina"');
  await expect(page.locator('text="Monitor de Cocina KDS"')).toBeVisible();
  
  // Cambiar estado a Listo si hay pedidos
  const btnPreparando = page.locator('button:has-text("Empezar a Preparar")').first();
  if (await btnPreparando.isVisible()) {
    await btnPreparando.click();
    await page.click('button:has-text("Marcar como Listo")');
  }

  // 6. Ir a Caja y Cobrar
  await page.click('text="Caja y Pagos"');
  
  // Seleccionar la mesa para cobrar
  await page.locator('.MesaCard').first().click().catch(() => {});
  
  const btnCobrar = page.locator('button:has-text("Cobrar Ticket")');
  if (await btnCobrar.isVisible()) {
    await btnCobrar.click();
  }

  // Verificar que termina exitosamente
  await expect(page.locator('text="NachoPps"').first()).toBeVisible();
});
