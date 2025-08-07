import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const movies = [
  // Action Movies
  {
    title: "Avengers: Endgame",
    description: "After the devastating events of Infinity War, the Avengers assemble once more to undo Thanos' destruction and restore the universe.",
    duration: 181,
    releaseYear: 2019,
    genres: ["Action", "Adventure", "Drama"],
    rating: 8.4,
    director: "Anthony Russo, Joe Russo",
    cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth"],
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    videoUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    status: "PUBLISHED"
  },
  {
    title: "Spider-Man: No Way Home",
    description: "Peter Parker seeks Doctor Strange's help to make people forget his identity as Spider-Man, but the spell goes wrong.",
    duration: 148,
    releaseYear: 2021,
    genres: ["Action", "Adventure", "Fantasy"],
    rating: 8.2,
    director: "Jon Watts",
    cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch", "Jacob Batalon"],
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
    videoUrl: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
    status: "PUBLISHED"
  },
  {
    title: "Black Panther",
    description: "T'Challa returns home to Wakanda to become king, but he finds his sovereignty challenged by a new adversary.",
    duration: 134,
    releaseYear: 2018,
    genres: ["Action", "Adventure", "Sci-Fi"],
    rating: 7.3,
    director: "Ryan Coogler",
    cast: ["Chadwick Boseman", "Michael B. Jordan", "Lupita Nyong'o", "Danai Gurira"],
    poster: "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/6ELCZlTA5lGUops70YLiW4EJ4EI.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=xjDjIWPwcPU",
    videoUrl: "https://www.youtube.com/watch?v=xjDjIWPwcPU",
    status: "PUBLISHED"
  },

  // Comedy Movies
  {
    title: "Deadpool",
    description: "A former Special Forces operative turned mercenary is subjected to a rogue experiment that leaves him with accelerated healing powers.",
    duration: 108,
    releaseYear: 2016,
    genres: ["Action", "Comedy", "Adventure"],
    rating: 8.0,
    director: "Tim Miller",
    cast: ["Ryan Reynolds", "Morena Baccarin", "T.J. Miller", "Ed Skrein"],
    poster: "https://image.tmdb.org/t/p/w500/3E53WEZJqP6aM84D8CckXx4pIHw.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/5LlIJ2NjfyFhz1Et8pGgLd5HO2K.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=9X8l72e8Mco",
    videoUrl: "https://www.youtube.com/watch?v=9X8l72e8Mco",
    status: "PUBLISHED"
  },
  {
    title: "Guardians of the Galaxy",
    description: "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.",
    duration: 121,
    releaseYear: 2014,
    genres: ["Action", "Adventure", "Comedy"],
    rating: 8.0,
    director: "James Gunn",
    cast: ["Chris Pratt", "Zoe Saldana", "Dave Bautista", "Vin Diesel"],
    poster: "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/aHaOjU7STKrCxLanWNWhqfbWXH8.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=d96cjJhvlMA",
    videoUrl: "https://www.youtube.com/watch?v=d96cjJhvlMA",
    status: "PUBLISHED"
  },

  // Drama Movies
  {
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    duration: 142,
    releaseYear: 1994,
    genres: ["Drama"],
    rating: 9.3,
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton", "William Sadler"],
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1qiiFVif0xF7cnAfYsTBR.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/17zArExB7ztm6fjUXZwQWgGMC9f.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=6hB3S9bIaco",
    videoUrl: "https://www.youtube.com/watch?v=6hB3S9bIaco",
    status: "PUBLISHED"
  },
  {
    title: "Forrest Gump",
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal through the eyes of an Alabama man.",
    duration: 142,
    releaseYear: 1994,
    genres: ["Drama", "Romance"],
    rating: 8.8,
    director: "Robert Zemeckis",
    cast: ["Tom Hanks", "Robin Wright", "Gary Sinise", "Sally Field"],
    poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/qdIMHd4sEfJSckfVJfKQvisL02a.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=bLvqoHBptjg",
    videoUrl: "https://www.youtube.com/watch?v=bLvqoHBptjg",
    status: "PUBLISHED"
  },

  // Horror Movies
  {
    title: "A Quiet Place",
    description: "A family lives in silence while hiding from creatures that hunt by sound.",
    duration: 90,
    releaseYear: 2018,
    genres: ["Horror", "Drama", "Sci-Fi"],
    rating: 7.5,
    director: "John Krasinski",
    cast: ["Emily Blunt", "John Krasinski", "Millicent Simmonds", "Noah Jupe"],
    poster: "https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/qAhedRxRYWZAgZ8O8pHIl6QHdD7.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=WR7cc5t7tv8",
    videoUrl: "https://www.youtube.com/watch?v=WR7cc5t7tv8",
    status: "PUBLISHED"
  },

  // Sci-Fi Movies
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into a CEO's mind.",
    duration: 148,
    releaseYear: 2010,
    genres: ["Action", "Sci-Fi", "Thriller"],
    rating: 8.8,
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy", "Cillian Murphy"],
    poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    videoUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    status: "PUBLISHED"
  },
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    duration: 169,
    releaseYear: 2014,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    rating: 8.6,
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    videoUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    status: "PUBLISHED"
  }
];

const series = [
  // Action Series
  {
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.",
    releaseYear: 2016,
    status: "ONGOING",
    totalSeasons: 4,
    genres: ["Drama", "Fantasy", "Horror"],
    rating: 8.7,
    creator: "The Duffer Brothers",
    cast: ["Millie Bobby Brown", "Finn Wolfhard", "David Harbour", "Gaten Matarazzo"],
    poster: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=b9EkMc79ZSU",
    seriesStatus: "PUBLISHED"
  },
  {
    title: "Breaking Bad",
    description: "A high school chemistry teacher turned methamphetamine producer partners with a former student.",
    releaseYear: 2008,
    status: "COMPLETED",
    totalSeasons: 5,
    genres: ["Crime", "Drama", "Thriller"],
    rating: 9.5,
    creator: "Vince Gilligan",
    cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn", "Dean Norris"],
    poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/eSzpy96DwBujGFj0xMbXBcGcfxX.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=HhesaQXLuRY",
    seriesStatus: "PUBLISHED"
  },
  {
    title: "Game of Thrones",
    description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns.",
    releaseYear: 2011,
    status: "COMPLETED",
    totalSeasons: 8,
    genres: ["Action", "Adventure", "Drama"],
    rating: 9.3,
    creator: "David Benioff, D.B. Weiss",
    cast: ["Peter Dinklage", "Lena Headey", "Emilia Clarke", "Kit Harington"],
    poster: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/suopoADq0k8YHr9VB2dFQCPjcen.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=rlR4PJn8b8I",
    seriesStatus: "PUBLISHED"
  },
  {
    title: "The Office",
    description: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes and inappropriate behavior.",
    releaseYear: 2005,
    status: "COMPLETED",
    totalSeasons: 9,
    genres: ["Comedy"],
    rating: 9.0,
    creator: "Greg Daniels",
    cast: ["Steve Carell", "John Krasinski", "Jenna Fischer", "Rainn Wilson"],
    poster: "https://image.tmdb.org/t/p/w500/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/lWlsZIsrGVWHtBeoOeLxIKDd9uy.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=LHOtME2DL4g",
    seriesStatus: "PUBLISHED"
  },
  {
    title: "The Mandalorian",
    description: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
    releaseYear: 2019,
    status: "ONGOING",
    totalSeasons: 3,
    genres: ["Action", "Adventure", "Sci-Fi"],
    rating: 8.7,
    creator: "Jon Favreau",
    cast: ["Pedro Pascal", "Gina Carano", "Carl Weathers", "Giancarlo Esposito"],
    poster: "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQPMxZWba8TiIJp8.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/aaBDEVj3yCIqd9QOYb6b6t5t9MI.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=aOC8E8z_ifw",
    seriesStatus: "PUBLISHED"
  }
];

const episodes = [
  // Stranger Things Episodes (Season 1)
  {
    title: "Chapter One: The Vanishing of Will Byers",
    description: "On his way home from a friend's house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.",
    episodeNumber: 1,
    seasonNumber: 1,
    duration: 47,
    releaseDate: new Date('2016-07-15'),
    videoUrl: "https://www.youtube.com/watch?v=mnd7sFt5c3A",
    status: "PUBLISHED"
  },
  {
    title: "Chapter Two: The Weirdo on Maple Street",
    description: "Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about an unsettling phone call.",
    episodeNumber: 2,
    seasonNumber: 1,
    duration: 55,
    releaseDate: new Date('2016-07-15'),
    videoUrl: "https://www.youtube.com/watch?v=ClwIj3x24Q4",
    status: "PUBLISHED"
  },
  {
    title: "Chapter Three: Holly, Jolly",
    description: "An increasingly concerned Nancy looks for Barb and finds out what Jonathan's been up to. Joyce is convinced Will is trying to talk to her.",
    episodeNumber: 3,
    seasonNumber: 1,
    duration: 51,
    releaseDate: new Date('2016-07-15'),
    videoUrl: "https://www.youtube.com/watch?v=yQbNGOeiGPE",
    status: "PUBLISHED"
  },

  // Breaking Bad Episodes (Season 1)
  {
    title: "Pilot",
    description: "Walter White, a struggling high school chemistry teacher, is diagnosed with lung cancer. He turns to a life of crime to secure his family's financial future.",
    episodeNumber: 1,
    seasonNumber: 1,
    duration: 58,
    releaseDate: new Date('2008-01-20'),
    videoUrl: "https://www.youtube.com/watch?v=XZ8daibM3AE",
    status: "PUBLISHED"
  },
  {
    title: "Cat's in the Bag...",
    description: "Walt and Jesse attempt to tie up loose ends. The desperate situation gets more complicated with the flip of a coin.",
    episodeNumber: 2,
    seasonNumber: 1,
    duration: 48,
    releaseDate: new Date('2008-01-27'),
    videoUrl: "https://www.youtube.com/watch?v=1yeA2aAQwoA",
    status: "PUBLISHED"
  },

  // Game of Thrones Episodes (Season 1)
  {
    title: "Winter Is Coming",
    description: "Eddard Stark is torn between his family and an old friend when asked to serve at the side of King Robert Baratheon.",
    episodeNumber: 1,
    seasonNumber: 1,
    duration: 62,
    releaseDate: new Date('2011-04-17'),
    videoUrl: "https://www.youtube.com/watch?v=BpJYNVhGf1s",
    status: "PUBLISHED"
  },
  {
    title: "The Kingsroad",
    description: "While Bran recovers from his fall, Ned takes only his daughters to King's Landing. Jon Snow goes with his uncle Benjen to the Wall.",
    episodeNumber: 2,
    seasonNumber: 1,
    duration: 56,
    releaseDate: new Date('2011-04-24'),
    videoUrl: "https://www.youtube.com/watch?v=TLIcfJlGIII",
    status: "PUBLISHED"
  },

  // The Office Episodes (Season 1)
  {
    title: "Pilot",
    description: "A documentary crew arrives at the Scranton branch of Dunder Mifflin to observe the employees and their daily interactions.",
    episodeNumber: 1,
    seasonNumber: 1,
    duration: 22,
    releaseDate: new Date('2005-03-24'),
    videoUrl: "https://www.youtube.com/watch?v=Q6M3lGm5G_A",
    status: "PUBLISHED"
  },
  {
    title: "Diversity Day",
    description: "Michael's off-color remark puts a sensitivity trainer in the office for a presentation, which prompts Michael to create his own.",
    episodeNumber: 2,
    seasonNumber: 1,
    duration: 22,
    releaseDate: new Date('2005-03-29'),
    videoUrl: "https://www.youtube.com/watch?v=WJZhOKfOJuE",
    status: "PUBLISHED"
  },

  // The Mandalorian Episodes (Season 1)
  {
    title: "Chapter 1: The Mandalorian",
    description: "A Mandalorian bounty hunter tracks a fugitive in the outer rim, but when he arrives at the hideout, he is offered a mysterious reward.",
    episodeNumber: 1,
    seasonNumber: 1,
    duration: 39,
    releaseDate: new Date('2019-11-12'),
    videoUrl: "https://www.youtube.com/watch?v=aOC8E8z_ifw",
    status: "PUBLISHED"
  },
  {
    title: "Chapter 2: The Child",
    description: "The Mandalorian and his cargo go through the dangerous planet Arvala-7. There, they encounter a gang of scavengers.",
    episodeNumber: 2,
    seasonNumber: 1,
    duration: 32,
    releaseDate: new Date('2019-11-15'),
    videoUrl: "https://www.youtube.com/watch?v=eW7Twd85m2g",
    status: "PUBLISHED"
  }
];

async function addContent() {
  try {
    console.log('🎬 Adding movies to database...');
    
    // Add movies
    for (const movie of movies) {
      try {
        await prisma.movie.create({
          data: movie
        });
        console.log(`✅ Added movie: ${movie.title}`);
      } catch (error) {
        console.log(`⚠️ Movie ${movie.title} may already exist, skipping...`);
      }
    }

    console.log('\n📺 Adding series to database...');
    
    // Add series and store their IDs for episodes
    const seriesIds = {};
    for (const seriesData of series) {
      try {
        const createdSeries = await prisma.series.create({
          data: seriesData
        });
        seriesIds[seriesData.title] = createdSeries.id;
        console.log(`✅ Added series: ${seriesData.title}`);
      } catch (error) {
        console.log(`⚠️ Series ${seriesData.title} may already exist, skipping...`);
        // Try to find existing series
        const existing = await prisma.series.findFirst({
          where: { title: seriesData.title }
        });
        if (existing) {
          seriesIds[seriesData.title] = existing.id;
        }
      }
    }

    console.log('\n🎭 Adding episodes to database...');
    
    // Add episodes with series associations
    const episodeToSeries = {
      "Chapter One: The Vanishing of Will Byers": "Stranger Things",
      "Chapter Two: The Weirdo on Maple Street": "Stranger Things", 
      "Chapter Three: Holly, Jolly": "Stranger Things",
      "Pilot": "The Office", // Will map to the last Pilot which is The Office
      "Cat's in the Bag...": "Breaking Bad",
      "Winter Is Coming": "Game of Thrones",
      "The Kingsroad": "Game of Thrones",
      "Diversity Day": "The Office",
      "Chapter 1: The Mandalorian": "The Mandalorian",
      "Chapter 2: The Child": "The Mandalorian"
    };
    
    // Handle Breaking Bad pilot separately
    const breakingBadPilot = episodes.find(ep => ep.title === "Pilot" && ep.description.includes("Walter White"));
    if (breakingBadPilot && seriesIds["Breaking Bad"]) {
      try {
        await prisma.episode.create({
          data: {
            ...breakingBadPilot,
            seriesId: seriesIds["Breaking Bad"]
          }
        });
        console.log(`✅ Added episode: ${breakingBadPilot.title} (Breaking Bad)`);
      } catch (error) {
        console.log(`⚠️ Episode ${breakingBadPilot.title} (Breaking Bad) may already exist, skipping...`);
      }
    }

    for (const episode of episodes) {
      if (episode.title === "Pilot" && episode.description.includes("Walter White")) {
        continue; // Already handled above
      }
      
      const seriesTitle = episodeToSeries[episode.title];
      const seriesId = seriesIds[seriesTitle];
      
      if (seriesId) {
        try {
          await prisma.episode.create({
            data: {
              ...episode,
              seriesId: seriesId
            }
          });
          console.log(`✅ Added episode: ${episode.title} (${seriesTitle})`);
        } catch (error) {
          console.log(`⚠️ Episode ${episode.title} may already exist, skipping...`);
        }
      } else {
        console.log(`❌ Could not find series for episode: ${episode.title}`);
      }
    }

    console.log('\n🎉 Content addition completed!');
    console.log(`📊 Added ${movies.length} movies, ${series.length} series, and ${episodes.length} episodes`);

  } catch (error) {
    console.error('❌ Error adding content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addContent();
