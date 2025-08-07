import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function addEpisodesForSeries() {
  try {
    console.log('🎬 Adding episodes to existing series...');
    
    // Get Breaking Bad series
    const breakingBad = await prisma.series.findFirst({
      where: { title: { contains: 'Breaking Bad' } },
      include: { seasons: true }
    });
    
    if (breakingBad) {
      console.log('📺 Found Breaking Bad series');
      
      // Create Season 1 if it doesn't exist
      let season1 = await prisma.season.findFirst({
        where: { seriesId: breakingBad.id, seasonNumber: 1 }
      });
      
      if (!season1) {
        season1 = await prisma.season.create({
          data: {
            seriesId: breakingBad.id,
            seasonNumber: 1,
            title: 'Season 1',
            description: 'Walter White begins his transformation',
            releaseDate: new Date('2008-01-20')
          }
        });
        console.log('✅ Created Season 1');
      }
      
      // Add episodes for Season 1
      const season1Episodes = [
        {
          episodeNumber: 1,
          title: 'Pilot',
          description: 'Walter White, a struggling high school chemistry teacher, is diagnosed with lung cancer. To secure his family\'s financial future, he partners with former student Jesse Pinkman to cook and sell methamphetamine.',
          duration: 58,
          videoUrl: 'https://www.youtube.com/watch?v=HhesaQXLuRY',
          thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
          airDate: new Date('2008-01-20')
        },
        {
          episodeNumber: 2,
          title: 'Cat\'s in the Bag...',
          description: 'Walt and Jesse attempt to tie up loose ends. The new partnership is not without its tensions.',
          duration: 48,
          videoUrl: 'https://www.youtube.com/watch?v=WzhW20hLp6M',
          thumbnail: 'https://images.unsplash.com/photo-1489599735188-3ab8b3afc6c8?w=800',
          airDate: new Date('2008-01-27')
        },
        {
          episodeNumber: 3,
          title: '...and the Bag\'s in the River',
          description: 'Walter fights with Jesse over his drug use. Meanwhile, Jesse and Walt dispose of their liquified remains.',
          duration: 48,
          videoUrl: 'https://www.youtube.com/watch?v=mnd7sFt5c3A',
          thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
          airDate: new Date('2008-02-10')
        },
        {
          episodeNumber: 4,
          title: 'Cancer Man',
          description: 'Walter finally tells his family about his cancer diagnosis. Jesse tries to make amends.',
          duration: 48,
          videoUrl: 'https://www.youtube.com/watch?v=ClwIj3x24Q4',
          thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          airDate: new Date('2008-02-17')
        },
        {
          episodeNumber: 5,
          title: 'Gray Matter',
          description: 'Walter and his family attend Elliott and Gretchen\'s party, where Walt feels humiliated.',
          duration: 48,
          videoUrl: 'https://www.youtube.com/watch?v=yQbNGOeiGPE',
          thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
          airDate: new Date('2008-02-24')
        }
      ];
      
      for (const episodeData of season1Episodes) {
        const existingEpisode = await prisma.episode.findFirst({
          where: { 
            seasonId: season1.id, 
            episodeNumber: episodeData.episodeNumber 
          }
        });
        
        if (!existingEpisode) {
          await prisma.episode.create({
            data: {
              ...episodeData,
              seasonId: season1.id
            }
          });
          console.log(`✅ Added Episode ${episodeData.episodeNumber}: ${episodeData.title}`);
        }
      }
    }
    
    // Get Stranger Things series
    const strangerThings = await prisma.series.findFirst({
      where: { title: { contains: 'Stranger Things' } }
    });
    
    if (!strangerThings) {
      // Create Stranger Things series
      const newSeries = await prisma.series.create({
        data: {
          title: 'Stranger Things',
          description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.',
          releaseYear: 2016,
          director: 'The Duffer Brothers',
          cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'David Harbour', 'Winona Ryder'],
          poster: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=800',
          backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920',
          trailerUrl: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
          rating: 8.7,
          genres: ['Drama', 'Fantasy', 'Horror'],
          status: 'PUBLISHED',
          totalSeasons: 4
        }
      });
      
      // Create Season 1
      const stSeason1 = await prisma.season.create({
        data: {
          seriesId: newSeries.id,
          seasonNumber: 1,
          title: 'Season 1',
          description: 'The Vanishing of Will Byers',
          releaseDate: new Date('2016-07-15')
        }
      });
      
      // Add Stranger Things episodes
      const stEpisodes = [
        {
          episodeNumber: 1,
          title: 'Chapter One: The Vanishing of Will Byers',
          description: 'On his way home from a friend\'s house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.',
          duration: 49,
          videoUrl: 'https://www.youtube.com/watch?v=StVrJBm91yY',
          thumbnail: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=800',
          airDate: new Date('2016-07-15')
        },
        {
          episodeNumber: 2,
          title: 'Chapter Two: The Weirdo on Maple Street',
          description: 'Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about an unsettling phone call.',
          duration: 56,
          videoUrl: 'https://www.youtube.com/watch?v=3MXDGAUIjfI',
          thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
          airDate: new Date('2016-07-15')
        },
        {
          episodeNumber: 3,
          title: 'Chapter Three: Holly, Jolly',
          description: 'An increasingly concerned Nancy looks for Barb and finds out what Jonathan\'s been up to. Joyce is convinced Will is trying to talk to her.',
          duration: 52,
          videoUrl: 'https://www.youtube.com/watch?v=mnd7sFt5c3A',
          thumbnail: 'https://images.unsplash.com/photo-1489599735188-3ab8b3afc6c8?w=800',
          airDate: new Date('2016-07-15')
        }
      ];
      
      for (const episodeData of stEpisodes) {
        await prisma.episode.create({
          data: {
            ...episodeData,
            seasonId: stSeason1.id
          }
        });
        console.log(`✅ Added ST Episode ${episodeData.episodeNumber}: ${episodeData.title}`);
      }
    }
    
    console.log('🎉 Episodes added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding episodes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addEpisodesForSeries();
