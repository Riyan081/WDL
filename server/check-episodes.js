import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkEpisodes() {
  try {
    const series = await prisma.series.findMany({
      include: {
        seasons: {
          include: {
            episodes: true
          }
        }
      }
    });
    
    console.log('📺 Episode distribution by series:');
    series.forEach(s => {
      console.log(`\n🎬 ${s.title}: ${s.seasons.length} seasons`);
      s.seasons.forEach(season => {
        console.log(`  Season ${season.seasonNumber}: ${season.episodes.length} episodes`);
        season.episodes.forEach(ep => {
          console.log(`    E${ep.episodeNumber}: ${ep.title}`);
        });
      });
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

checkEpisodes();
