import { Client } from 'pg';

const DATABASES = [
  { name: 'servicio-mesas', url: 'postgresql://nachopps:secret@localhost:5433/mesas_db?schema=public' },
  { name: 'servicio-pedidos', url: 'postgresql://nachopps:secret@localhost:5434/pedidos_db?schema=public' },
  { name: 'servicio-cuentas', url: 'postgresql://nachopps:secret@localhost:5435/cuentas_db?schema=public' },
  { name: 'servicio-inventario', url: 'postgresql://nachopps:secret@localhost:5436/inventario_db?schema=public' },
  { name: 'servicio-caja', url: 'postgresql://nachopps:secret@localhost:5437/caja_db?schema=public' },
  { name: 'servicio-reportes', url: 'postgresql://nachopps:secret@localhost:5438/reportes_db?schema=public' },
  { name: 'servicio-notificaciones', url: 'postgresql://nachopps:secret@localhost:5440/notificaciones_db?schema=public' },
  { name: 'servicio-reservas', url: 'postgresql://nachopps:secret@localhost:5441/reservas_db?schema=public' },
];

async function limpiarBaseDeDatos(db: typeof DATABASES[0]) {
  console.log(`🧹 Conectando y limpiando base de datos de ${db.name}...`);
  const client = new Client({ connectionString: db.url });
  try {
    await client.connect();
    
    // Buscar todas las tablas en el esquema public
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT LIKE '_prisma_migrations';
    `);
    
    const tables = res.rows.map((row) => row.table_name);
    
    if (tables.length > 0) {
      const truncateQuery = `TRUNCATE TABLE ${tables.map((t) => `"${t}"`).join(', ')} CASCADE;`;
      await client.query(truncateQuery);
      console.log(`   ✅ Tablas truncadas: ${tables.join(', ')}`);
    } else {
      console.log(`   ℹ️ No hay tablas para limpiar.`);
    }
  } catch (err) {
    console.error(`   ❌ Error al limpiar ${db.name}:`, err instanceof Error ? err.message : err);
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('========================================================');
  console.log('  NachoPps — Limpiador General de Bases de Datos');
  console.log('  (Omitiendo BD de Identidad de forma segura)');
  console.log('========================================================\n');

  for (const db of DATABASES) {
    await limpiarBaseDeDatos(db);
  }

  console.log('\n✨ Proceso de limpieza finalizado con éxito.');
}

main().catch((err) => {
  console.error('❌ Error general durante la limpieza:', err);
  process.exit(1);
});
