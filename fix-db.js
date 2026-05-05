const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixDatabase() {
  try {
    console.log("Dropping broken trigger...");
    await prisma.$executeRawUnsafe('DROP TRIGGER IF EXISTS tr_reset_daily_counts ON "User" CASCADE;');
    await prisma.$executeRawUnsafe('DROP FUNCTION IF EXISTS reset_daily_counts CASCADE;');
    console.log("Trigger dropped successfully.");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

fixDatabase();
