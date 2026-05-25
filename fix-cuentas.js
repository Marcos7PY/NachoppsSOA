const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://nachopps:secret@localhost:5435/cuentas_db?schema=public"
    }
  }
});

async function main() {
  const result = await prisma.$executeRaw`UPDATE "Cuenta" SET estado = 'CERRADA' WHERE estado = 'ABIERTA';`;
  console.log(`Cuentas cerradas.`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
