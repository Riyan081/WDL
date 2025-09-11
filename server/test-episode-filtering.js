import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testEpisodeFiltering() {
  try {
    console.log('📺 Testing episode filtering...\n');
    
    // Get all series
    const allSeries = await prisma.series.findMany({
      select: { id: true, title: true }
    });
    
    console.log('Available series:');
    allSeries.forEach(s => console.log(`- ${s.title}: ${s.id}`));
    console.log('');
    
    // Test each series individually
    for (const series of allSeries) {
      console.log(`🎬 Testing ${series.title} (${series.id}):`);
      
      const episodes = await prisma.episode.findMany({
        where: {
          season: {
            seriesId: series.id
          }
        },
        include: {
          season: {
            select: {
              seasonNumber: true,
              series: {
                select: {
                  title: true
                }
              }
            }
          }
        },
        orderBy: [
          { season: { seasonNumber: 'asc' } },
          { episodeNumber: 'asc' }
        ]
      });
      
      console.log(`  Found ${episodes.length} episodes:`);
      episodes.forEach(ep => {
        console.log(`    S${ep.season.seasonNumber}E${ep.episodeNumber}: ${ep.title}`);
      });
      console.log('');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

testEpisodeFiltering();
