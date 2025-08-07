import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkContent() {
  try {
    console.log('🎬 Checking Netflix Database Content...\n');

    // Check Movies
    const movies = await prisma.movie.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        releaseYear: true,
        genres: true,
        rating: true,
        duration: true,
        status: true
      }
    });

    console.log(`📽️ MOVIES (${movies.length} total):`);
    console.log('================================');
    movies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.releaseYear})`);
      console.log(`   📊 Rating: ${movie.rating}/10 | ⏱️ ${movie.duration} min`);
      console.log(`   🎭 Genres: ${Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}`);
      console.log(`   📈 Status: ${movie.status}`);
      console.log('');
    });

    // Check Series
    const series = await prisma.series.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        releaseYear: true,
        totalSeasons: true,
        status: true,
        genres: true,
        rating: true,
        _count: {
          select: {
            seasons: true
          }
        }
      }
    });

    console.log(`📺 TV SERIES (${series.length} total):`);
    console.log('================================');
    series.forEach((show, index) => {
      console.log(`${index + 1}. ${show.title} (${show.releaseYear})`);
      console.log(`   📊 Rating: ${show.rating}/10 | 📚 ${show.totalSeasons} seasons`);
      console.log(`   🎭 Genres: ${Array.isArray(show.genres) ? show.genres.join(', ') : show.genres}`);
      console.log(`   📈 Status: ${show.status} | 🎬 Seasons: ${show._count.seasons}`);
      console.log('');
    });

    // Check Episodes
    const episodes = await prisma.episode.findMany({
      include: {
        season: {
          select: {
            series: {
              select: {
                title: true
              }
            }
          }
        }
      },
      orderBy: [
        { seasonId: 'asc' },
        { episodeNumber: 'asc' }
      ]
    });

    console.log(`🎭 EPISODES (${episodes.length} total):`);
    console.log('================================');
    
    let currentSeries = '';
    episodes.forEach((episode) => {
      const seriesTitle = episode.season?.series?.title || 'Unknown Series';
      if (seriesTitle !== currentSeries) {
        currentSeries = seriesTitle;
        console.log(`\n📺 ${currentSeries}:`);
        console.log('─'.repeat(30));
      }
      console.log(`   S${episode.season?.seasonNumber || '?'}E${episode.episodeNumber}: ${episode.title}`);
      console.log(`   ⏱️ ${episode.duration} min | 📅 ${episode.releaseDate?.toDateString() || 'No date'}`);
      console.log(`   📝 ${episode.description?.substring(0, 80)}...`);
      console.log('');
    });

    // Summary Statistics
    console.log('\n📊 CONTENT SUMMARY:');
    console.log('==================');
    console.log(`🎬 Total Movies: ${movies.length}`);
    console.log(`📺 Total Series: ${series.length}`);
    console.log(`🎭 Total Episodes: ${episodes.length}`);
    console.log(`🎯 Total Content Pieces: ${movies.length + series.length + episodes.length}`);

    // Genre breakdown for movies
    const movieGenres = {};
    movies.forEach(movie => {
      if (Array.isArray(movie.genres)) {
        movie.genres.forEach(genre => {
          movieGenres[genre] = (movieGenres[genre] || 0) + 1;
        });
      }
    });

    console.log('\n🎭 MOVIE GENRES:');
    Object.entries(movieGenres).forEach(([genre, count]) => {
      console.log(`   ${genre}: ${count} movies`);
    });

    // Series status breakdown
    const seriesStatusBreakdown = {};
    series.forEach(show => {
      seriesStatusBreakdown[show.status] = (seriesStatusBreakdown[show.status] || 0) + 1;
    });

    console.log('\n📺 SERIES STATUS:');
    Object.entries(seriesStatusBreakdown).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} series`);
    });

  } catch (error) {
    console.error('❌ Error checking content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkContent();
