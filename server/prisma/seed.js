import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@netflix.com' },
    update: {},
    create: {
      email: 'admin@netflix.com',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=dc2626&color=ffffff'
    }
  });

  console.log('👤 Admin user created:', admin.email);

  // Create sample movies
  const movies = [
    {
      title: 'Stranger Things: The Movie',
      description: 'When supernatural forces return to Hawkins, the gang must face their biggest challenge yet.',
      duration: 150,
      releaseYear: 2024,
      genres: ['Horror', 'Sci-Fi', 'Drama'],
      director: 'The Duffer Brothers',
      cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder'],
      poster: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
      status: 'PUBLISHED',
      rating: 4.8
    },
    {
      title: 'The Crown: Final Chapter',
      description: 'The final chapter of the British Royal Family saga.',
      duration: 180,
      releaseYear: 2024,
      genres: ['Drama', 'Biography', 'History'],
      director: 'Peter Morgan',
      cast: ['Claire Foy', 'Olivia Colman', 'Imelda Staunton'],
      poster: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/7Mdt3jwUDZGzxftLhfBTlLN9Y0K.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=JWtnJjn6ng0',
      status: 'PUBLISHED',
      rating: 4.6
    },
    {
      title: 'Wednesday: The Dark Academy',
      description: 'Wednesday Addams faces her greatest mystery at Nevermore Academy.',
      duration: 120,
      releaseYear: 2024,
      genres: ['Horror', 'Comedy', 'Mystery'],
      director: 'Tim Burton',
      cast: ['Jenna Ortega', 'Emma Myers', 'Hunter Doohan'],
      poster: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=Di310WS8zLk',
      status: 'PUBLISHED',
      rating: 4.5
    }
  ];

  for (const movieData of movies) {
    const existingMovie = await prisma.movie.findFirst({
      where: { title: movieData.title }
    });

    if (!existingMovie) {
      await prisma.movie.create({
        data: movieData
      });
    }
  }

  console.log('🎬 Sample movies created');

  // Create sample series
  const seriesData = [
    {
      title: 'Breaking Bad',
      description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.',
      releaseYear: 2008,
      genres: ['Crime', 'Drama', 'Thriller'],
      director: 'Vince Gilligan',
      cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
      poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=HhesaQXLuRY',
      totalSeasons: 5,
      status: 'PUBLISHED',
      rating: 4.9
    },
    {
      title: 'The Witcher',
      description: 'Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world.',
      releaseYear: 2019,
      genres: ['Fantasy', 'Adventure', 'Drama'],
      director: 'Lauren Schmidt Hissrich',
      cast: ['Henry Cavill', 'Anya Chalotra', 'Freya Allan'],
      poster: 'https://image.tmdb.org/t/p/w500/cZ0d3rtvXPVvuiX22sP79K3Hmjz.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/7HtvmsLJdMPNjjgWyFkEP5MPKNh.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=ndl1W4ltcmg',
      totalSeasons: 3,
      status: 'PUBLISHED',
      rating: 4.4
    }
  ];

  for (const series of seriesData) {
    const existingSeries = await prisma.series.findFirst({
      where: { title: series.title }
    });

    let createdSeries;
    if (!existingSeries) {
      createdSeries = await prisma.series.create({
        data: series
      });
    } else {
      createdSeries = existingSeries;
    }

    // Add seasons and episodes for Breaking Bad
    if (series.title === 'Breaking Bad' && !existingSeries) {
      const season1 = await prisma.season.create({
        data: {
          seriesId: createdSeries.id,
          seasonNumber: 1,
          title: 'Season 1',
          description: 'Walter White begins his transformation from teacher to drug kingpin.'
        }
      });

      // Add sample episodes
      const episodes = [
        {
          episodeNumber: 1,
          title: 'Pilot',
          description: 'Walter White, a struggling high school chemistry teacher, is diagnosed with lung cancer.',
          duration: 58,
          airDate: new Date('2008-01-20')
        },
        {
          episodeNumber: 2,
          title: 'Cat\'s in the Bag...',
          description: 'Walt and Jesse attempt to tie up loose ends.',
          duration: 48,
          airDate: new Date('2008-01-27')
        }
      ];

      for (const episode of episodes) {
        await prisma.episode.create({
          data: {
            ...episode,
            seasonId: season1.id
          }
        });
      }
    }
  }

  console.log('📺 Sample series created with seasons and episodes');

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 12);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@netflix.com' },
    update: {},
    create: {
      email: 'demo@netflix.com',
      password: demoPassword,
      name: 'Demo User',
      role: 'USER',
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=random'
    }
  });

  console.log('👤 Demo user created:', demoUser.email);

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
