const { PrismaClient } = require('./apps/servicio-caja/src/generated/prisma/index.js');
const prisma = new PrismaClient();
console.log("Prisma keys:", Object.keys(prisma).filter(k => !k.startsWith('_')));
