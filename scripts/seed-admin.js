const { Pool } = require('pg');
const bcrypt = require('bcrypt');

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const hash = await bcrypt.hash('nachopps123', 10);
    await pool.query(
      `
        INSERT INTO "Usuario" (id, nombre, email, password, rol, activo, "createdAt", "updatedAt")
        VALUES (gen_random_uuid()::text, $1, $2, $3, $4, true, now(), now())
        ON CONFLICT (email) DO UPDATE
        SET password = EXCLUDED.password,
            rol = EXCLUDED.rol,
            activo = true,
            "updatedAt" = now()
      `,
      ['Admin', 'admin@nachopps.pe', hash, 'ADMIN']
    );
    console.log('   Usuario admin listo');
  } catch (e) {
    console.error('   ERROR seed:', e.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
