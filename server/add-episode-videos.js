import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// YouTube videos for different series episodes
const videoLinks = {
  'Breaking Bad': [
    'https://www.youtube.com/watch?v=HhesaQXLuRY', // Pilot
    'https://www.youtube.com/watch?v=krQHQvtIr6w', // Cat's in the Bag
    'https://www.youtube.com/watch?v=MBLm9jPCjW0', // And the Bag's in the River
    'https://www.youtube.com/watch?v=F1HNuAE9WdU', // Cancer Man
    'https://www.youtube.com/watch?v=HQqbxnE2XjM', // Gray Matter
    'https://www.youtube.com/watch?v=uonxeR6pujo', // Crazy Handful
    'https://www.youtube.com/watch?v=A3HemKGDavw'  // No Rough Stuff
  ],
  'Stranger Things': [
    'https://www.youtube.com/watch?v=b9EkMc79ZSU', // The Vanishing of Will Byers
    'https://www.youtube.com/watch?v=XcnHOQ-cHa0', // The Weirdo on Maple Street
    'https://www.youtube.com/watch?v=lWwTCsFZJQ4', // Holly, Jolly
    'https://www.youtube.com/watch?v=CKOc6hXMDhc', // The Body
    'https://www.youtube.com/watch?v=StKVS0eI85I', // Dig Dug
    'https://www.youtube.com/watch?v=yQEondeGvKo', // The Monster
    'https://www.youtube.com/watch?v=9Egf5U8xLo8', // The Bathtub
    'https://www.youtube.com/watch?v=YEG3bmU_WaI'  // The Upside Down
  ],
  'The Witcher': [
    'https://www.youtube.com/watch?v=ndl1W4ltcmg', // The End's Beginning
    'https://www.youtube.com/watch?v=HtVdAasjOgU', // Four Marks
    'https://www.youtube.com/watch?v=c_VaTNNJ4Co', // Betrayer Moon
    'https://www.youtube.com/watch?v=P0oJqfLzZzQ', // Of Banquets, Bastards and Burials
    'https://www.youtube.com/watch?v=WqI5-vLJjZw', // Bottled Appetites
    'https://www.youtube.com/watch?v=48VEN5y2H9A', // Rare Species
    'https://www.youtube.com/watch?v=vCIID7e2vgA', // Before a Fall
    'https://www.youtube.com/watch?v=v1y3X6h2TqI'  // Much More
  ]
};

async function addVideoUrls() {
  try {
    console.log('🎬 Adding video URLs to episodes...\n');
    
    const series = await prisma.series.findMany({
      include: {
        seasons: {
          include: {
            episodes: {
              orderBy: [
                { episodeNumber: 'asc' }
              ]
            }
          },
          orderBy: { seasonNumber: 'asc' }
        }
      }
    });

    for (const s of series) {
      console.log(`📺 Processing ${s.title}...`);
      
      const videos = videoLinks[s.title] || [];
      let episodeIndex = 0;
      
      for (const season of s.seasons) {
        for (const episode of season.episodes) {
          const videoUrl = videos[episodeIndex] || videos[0] || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Fallback
          
          await prisma.episode.update({
            where: { id: episode.id },
            data: { 
              videoUrl: videoUrl,
              thumbnail: `https://img.youtube.com/vi/${videoUrl.split('v=')[1]?.split('&')[0] || 'dQw4w9WgXcQ'}/maxresdefault.jpg`
            }
          });
          
          console.log(`  ✅ S${season.seasonNumber}E${episode.episodeNumber}: ${episode.title} -> ${videoUrl}`);
          episodeIndex++;
        }
      }
    }
    
    console.log('\n🎉 All episodes now have video URLs!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
  }
}

addVideoUrls();
