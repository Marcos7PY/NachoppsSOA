/**
 * NachoPps — Población de datos mínimos de prueba
 * Uso: npx tsx scripts/poblar-datos-minimos.ts
 */
import axios from 'axios';

const BASE = 'http://localhost:8000';

interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
}

interface Producto {
  id: string;
  categoriaId: string;
  nombre: string;
  precio: number;
  stockActual?: number;
}

interface Mesa {
  id: string;
  numero: number;
  capacidad: number;
  ubicacion: string;
  estado: string;
}

async function login(): Promise<string> {
  console.log('🔐 Iniciando sesión como admin@nachopps.pe...');
  const res = await axios.post(`${BASE}/identidad/auth/login`, {
    email: 'admin@nachopps.pe',
    password: 'nachopps123',
  });
  const token = res.data.access_token;
  if (!token) throw new Error('No se recibió token JWT');
  console.log('   ✅ Token obtenido');
  return token;
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

async function crearCategoria(token: string, nombre: string, descripcion?: string): Promise<Categoria> {
  const res = await axios.post(
    `${BASE}/inventario/categorias`,
    { nombre, descripcion },
    { headers: authHeaders(token) },
  );
  return res.data.categoria;
}

async function crearProducto(token: string, data: { categoriaId: string; nombre: string; precio: number; stockActual?: number; descripcion?: string }): Promise<Producto> {
  const res = await axios.post(
    `${BASE}/inventario/productos`,
    data,
    { headers: authHeaders(token) },
  );
  return res.data.producto;
}

async function crearMesa(token: string, numero: number, capacidad: number, ubicacion: string = 'Salón Principal'): Promise<Mesa> {
  const res = await axios.post(
    `${BASE}/mesas`,
    { numero, capacidad, ubicacion },
    { headers: authHeaders(token) },
  );
  return res.data.mesa;
}

async function main() {
  console.log('════════════════════════════════════════════════════════');
  console.log('  NachoPps — Población de Datos de Muestra (MÍNIMO)');
  console.log('════════════════════════════════════════════════════════\n');

  const token = await login();

  // ── Categorías Mínimas ────────────────────────────────────
  console.log('\n📦 Creando categorías mínimas...');
  const categoriasData = [
    { nombre: 'Entradas', descripcion: 'Entradas frías y calientes' },
    { nombre: 'Platos de Fondo', descripcion: 'Platos de fondo principales' },
    { nombre: 'Bebidas', descripcion: 'Bebidas y coctelería' },
  ];

  const categorias: Record<string, Categoria> = {};
  for (const c of categoriasData) {
    categorias[c.nombre] = await crearCategoria(token, c.nombre, c.descripcion);
    console.log(`   ✅ Categoría: ${c.nombre}`);
  }

  // ── Productos Mínimos ─────────────────────────────────────
  console.log('\n🍽️  Creando productos mínimos...');
  const productosData = [
    { cat: 'Entradas', nombre: 'Ceviche Clásico', precio: 35, stock: 50 },
    { cat: 'Entradas', nombre: 'Causa Limeña', precio: 22, stock: 30 },
    { cat: 'Platos de Fondo', nombre: 'Lomo Saltado', precio: 42, stock: 40 },
    { cat: 'Platos de Fondo', nombre: 'Ají de Gallina', precio: 38, stock: 35 },
    { cat: 'Bebidas', nombre: 'Chicha Morada (Jarra)', precio: 15, stock: 120 },
    { cat: 'Bebidas', nombre: 'Pisco Sour', precio: 25, stock: 80 },
  ];

  for (const p of productosData) {
    const prod = await crearProducto(token, {
      categoriaId: categorias[p.cat].id,
      nombre: p.nombre,
      precio: p.precio,
      stockActual: p.stock,
    });
    console.log(`   ✅ ${p.cat} → ${p.nombre} (S/ ${p.precio}, stock: ${p.stock})`);
  }

  // ── Mesas ─────────────────────────────────────────
  console.log('\n🪑  Creando mesas físicas...');
  for (let i = 1; i <= 10; i++) {
    const capacidad = [2, 2, 4, 4, 4, 6, 6, 2, 4, 6][i - 1];
    await crearMesa(token, i, capacidad);
    console.log(`   ✅ Mesa #${i} — cap: ${capacidad}`);
  }

  for (let i = 11; i <= 12; i++) {
    await crearMesa(token, i, 8, 'Terraza');
    console.log(`   ✅ Mesa #${i} — cap: 8 (Terraza)`);
  }

  // Mesas virtuales
  console.log('\n🪑  Creando mesas virtuales...');
  await crearMesa(token, 99, 999, 'Virtual Delivery');
  console.log('   ✅ Mesa #99 (Delivery)');
  
  await crearMesa(token, 98, 999, 'Virtual Llevar');
  console.log('   ✅ Mesa #98 (Para Llevar)');

  console.log('\n════════════════════════════════════════════════════════');
  console.log('  📊 Población Mínima Completada Exitosamente.');
  console.log('════════════════════════════════════════════════════════\n');
}

main().catch((err) => {
  console.error('\n❌ Error durante la población:', err.response?.data || err.message);
  process.exit(1);
});
