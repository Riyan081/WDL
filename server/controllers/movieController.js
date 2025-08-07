import prisma from '../config/database.js';

export const getAllMovies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      genre,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      status = 'PUBLISHED'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {
      status,
      ...(genre && { genres: { has: genre } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { director: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const movies = await prisma.movie.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip,
      take: parseInt(limit),
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        releaseYear: true,
        genres: true,
        director: true,
        cast: true,
        poster: true,
        backdrop: true,
        trailerUrl: true,
        rating: true,
        viewCount: true,
        createdAt: true
      }
    });

    const total = await prisma.movie.count({ where });

    res.json({
      success: true,
      data: {
        movies,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            reviews: true,
            favorites: true
          }
        }
      }
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Increment view count
    await prisma.movie.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createMovie = async (req, res) => {
  try {
    const movieData = req.body;

    const movie = await prisma.movie.create({
      data: movieData,
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        releaseYear: true,
        genres: true,
        director: true,
        cast: true,
        poster: true,
        backdrop: true,
        trailerUrl: true,
        videoUrl: true,
        status: true,
        createdAt: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie
    });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const movie = await prisma.movie.findUnique({
      where: { id }
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        releaseYear: true,
        genres: true,
        director: true,
        cast: true,
        poster: true,
        backdrop: true,
        trailerUrl: true,
        videoUrl: true,
        status: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Movie updated successfully',
      data: updatedMovie
    });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await prisma.movie.findUnique({
      where: { id }
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    await prisma.movie.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getPopularMovies = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const movies = await prisma.movie.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [
        { viewCount: 'desc' },
        { rating: 'desc' }
      ],
      take: parseInt(limit),
      select: {
        id: true,
        title: true,
        poster: true,
        backdrop: true,
        rating: true,
        viewCount: true,
        genres: true,
        releaseYear: true
      }
    });

    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    console.error('Get popular movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const { limit = 20 } = req.query;

    const movies = await prisma.movie.findMany({
      where: {
        status: 'PUBLISHED',
        genres: { has: genre }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      select: {
        id: true,
        title: true,
        poster: true,
        backdrop: true,
        rating: true,
        viewCount: true,
        genres: true,
        releaseYear: true
      }
    });

    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    console.error('Get movies by genre error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
