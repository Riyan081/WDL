import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkSeriesStructure() {
  try {
    const series = await prisma.series.findFirst();
    console.log('Series structure:');
    console.log(JSON.stringify(series, null, 2));
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

checkSeriesStructure();
