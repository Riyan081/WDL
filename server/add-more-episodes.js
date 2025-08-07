import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function addMoreEpisodes() {
  try {
    console.log('📺 Adding more episodes to existing series...');

    // Get all series with their seasons
    const series = await prisma.series.findMany({
      include: {
        seasons: {
          include: {
            episodes: true
          }
        }
      }
    });
    console.log('Found series:', series.map(s => s.title));

    // Find specific series
    const breakingBad = series.find(s => s.title === 'Breaking Bad');
    const strangerThings = series.find(s => s.title === 'Stranger Things');
    const witcher = series.find(s => s.title === 'The Witcher');

    // Helper function to ensure season exists
    async function ensureSeason(seriesId, seasonNumber, title) {
      let season = await prisma.season.findFirst({
        where: {
          seriesId,
          seasonNumber
        }
      });

      if (!season) {
        season = await prisma.season.create({
          data: {
            seriesId,
            seasonNumber,
            title,
            description: `Season ${seasonNumber}`,
            releaseDate: new Date()
          }
        });
        console.log(`✅ Created season ${seasonNumber} for series`);
      }

      return season;
    }

    // Add Breaking Bad episodes (Season 1)
    if (breakingBad) {
      const season1 = await ensureSeason(breakingBad.id, 1, 'Season 1');
      
      const breakingBadEpisodes = [
        {
          title: "Pilot",
          description: "A high school chemistry teacher turns to cooking meth to secure his family's future.",
          episodeNumber: 1,
          duration: 58,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Cat's in the Bag...",
          description: "Walt and Jesse clean up after the aftermath of their first cook.",
          episodeNumber: 2,
          duration: 48,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "...And the Bag's in the River",
          description: "Walt struggles with the moral implications of his actions.",
          episodeNumber: 3,
          duration: 48,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Cancer Man",
          description: "Walt tells his family about his cancer diagnosis.",
          episodeNumber: 4,
          duration: 48,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Gray Matter",
          description: "Walt's former business partners offer to pay for his treatment.",
          episodeNumber: 5,
          duration: 48,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Crazy Handful of Nothin'",
          description: "Walt makes a bold move to establish his territory.",
          episodeNumber: 6,
          duration: 48,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "A No-Rough-Stuff-Type Deal",
          description: "Walt and Jesse look for a new distributor.",
          episodeNumber: 7,
          duration: 48,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=200&fit=crop",
          seasonId: season1.id
        }
      ];

      for (const episode of breakingBadEpisodes) {
        const exists = await prisma.episode.findFirst({
          where: {
            seasonId: season1.id,
            episodeNumber: episode.episodeNumber
          }
        });

        if (!exists) {
          await prisma.episode.create({ data: episode });
          console.log(`✅ Added Breaking Bad S1E${episode.episodeNumber}: ${episode.title}`);
        } else {
          console.log(`⏭️  Breaking Bad S1E${episode.episodeNumber} already exists`);
        }
      }
    }

    // Add Stranger Things episodes (Season 1)
    if (strangerThings) {
      const season1 = await ensureSeason(strangerThings.id, 1, 'Season 1');
      
      const strangerThingsEpisodes = [
        {
          title: "Chapter One: The Vanishing of Will Byers",
          description: "Will Byers mysteriously vanishes, and his friends search for him.",
          episodeNumber: 1,
          duration: 47,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Chapter Two: The Weirdo on Maple Street",
          description: "Eleven escapes and the boys find her hiding in the school gym.",
          episodeNumber: 2,
          duration: 55,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Chapter Three: Holly, Jolly",
          description: "Joyce and Hopper investigate further into Will's disappearance.",
          episodeNumber: 3,
          duration: 51,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Chapter Four: The Body",
          description: "Will's body is found, but questions remain about what really happened.",
          episodeNumber: 4,
          duration: 50,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Chapter Five: Dig Dug",
          description: "Nancy and Jonathan team up to fight the monster.",
          episodeNumber: 5,
          duration: 52,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Chapter Six: The Monster",
          description: "Joyce and Hopper enter the Upside Down to find Will.",
          episodeNumber: 6,
          duration: 46,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Chapter Seven: The Bathtub",
          description: "Eleven makes the ultimate sacrifice to save her friends.",
          episodeNumber: 7,
          duration: 41,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Chapter Eight: The Upside Down",
          description: "The aftermath of the battle and Will's recovery.",
          episodeNumber: 8,
          duration: 55,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop",
          seasonId: season1.id
        }
      ];

      for (const episode of strangerThingsEpisodes) {
        const exists = await prisma.episode.findFirst({
          where: {
            seasonId: season1.id,
            episodeNumber: episode.episodeNumber
          }
        });

        if (!exists) {
          await prisma.episode.create({ data: episode });
          console.log(`✅ Added Stranger Things S1E${episode.episodeNumber}: ${episode.title}`);
        } else {
          console.log(`⏭️  Stranger Things S1E${episode.episodeNumber} already exists`);
        }
      }
    }

    // Add The Witcher episodes (Season 1)
    if (witcher) {
      const season1 = await ensureSeason(witcher.id, 1, 'Season 1');
      
      const witcherEpisodes = [
        {
          title: "The End's Beginning",
          description: "Geralt of Rivia, a mutated monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
          episodeNumber: 1,
          duration: 60,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Four Marks",
          description: "Ciri is trained by Dara while Geralt and Borch team up to help dragons.",
          episodeNumber: 2,
          duration: 60,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Betrayer Moon",
          description: "Geralt takes on a contract to remove a curse from a girl born during an eclipse.",
          episodeNumber: 3,
          duration: 59,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Of Banquets, Bastards and Burials",
          description: "Against his better judgment, Geralt accompanies Jaskier to a royal ball.",
          episodeNumber: 4,
          duration: 65,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Bottled Appetites",
          description: "Geralt and Jaskier come across a djinn and things go sideways.",
          episodeNumber: 5,
          duration: 59,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Rare Species",
          description: "A quest to find a dragon leads to a reckoning with the past.",
          episodeNumber: 6,
          duration: 59,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Before a Fall",
          description: "Geralt and Ciri finally meet as destinies align.",
          episodeNumber: 7,
          duration: 52,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
          seasonId: season1.id
        },
        {
          title: "Much More",
          description: "Geralt faces his destiny as Ciri comes into her power.",
          episodeNumber: 8,
          duration: 60,
          videoUrl: "dQw4w9WgXcQ",
          thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
          seasonId: season1.id
        }
      ];

      for (const episode of witcherEpisodes) {
        const exists = await prisma.episode.findFirst({
          where: {
            seasonId: season1.id,
            episodeNumber: episode.episodeNumber
          }
        });

        if (!exists) {
          await prisma.episode.create({ data: episode });
          console.log(`✅ Added The Witcher S1E${episode.episodeNumber}: ${episode.title}`);
        } else {
          console.log(`⏭️  The Witcher S1E${episode.episodeNumber} already exists`);
        }
      }
    }

    // Check final episode count
    console.log('\n📊 Final episode count:');
    const finalSeries = await prisma.series.findMany({
      include: {
        seasons: {
          include: {
            episodes: true
          }
        }
      }
    });

    finalSeries.forEach(s => {
      const totalEpisodes = s.seasons.reduce((total, season) => total + season.episodes.length, 0);
      console.log(`🎬 ${s.title}: ${totalEpisodes} episodes across ${s.seasons.length} seasons`);
    });

    console.log('\n✅ Successfully added more episodes!');
  } catch (error) {
    console.error('❌ Error adding episodes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreEpisodes();
