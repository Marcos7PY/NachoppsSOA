// scripts/seed-admin.js
// Ejecutar desde apps/servicio-identidad con DATABASE_URL en env
const path = require('path');
const { PrismaClient } = require(path.join(process.cwd(), 'src/generated/prisma'));
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcrypt');

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  try {
    const hash = await bcrypt.hash('nachopps123', 10);
    const existing = await prisma.usuario.findUnique({
      where: { email: 'admin@nachopps.pe' }
    });
    if (!existing) {
      await prisma.usuario.create({
        data: {
          nombre: 'Admin',
          email: 'admin@nachopps.pe',
          password: hash,
          rol: 'ADMIN'
        }
      });
      console.log('   Usuario admin creado');
    } else {
      console.log('   Usuario admin ya existe');
    }
  } catch (e) {
    console.error('   ERROR seed:', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
