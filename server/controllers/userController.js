import prisma from '../config/database.js';

// Favorites Management
export const addToFavorites = async (req, res) => {
  try {
    const { contentType, movieId, seriesId } = req.body;
    const userId = req.user.id;

    // Validate content type
    if (!['MOVIE', 'SERIES'].includes(contentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type'
      });
    }

    // Check if content exists
    if (contentType === 'MOVIE' && movieId) {
      const movie = await prisma.movie.findUnique({ where: { id: movieId } });
      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }
    } else if (contentType === 'SERIES' && seriesId) {
      const series = await prisma.series.findUnique({ where: { id: seriesId } });
      if (!series) {
        return res.status(404).json({
          success: false,
          message: 'Series not found'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Content ID is required'
      });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        contentType,
        ...(movieId && { movieId }),
        ...(seriesId && { seriesId })
      }
    });

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: favorite
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Already in favorites'
      });
    }
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const removeFromFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const favorite = await prisma.favorite.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    await prisma.favorite.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            poster: true,
            backdrop: true,
            rating: true,
            duration: true,
            releaseYear: true,
            genres: true
          }
        },
        series: {
          select: {
            id: true,
            title: true,
            poster: true,
            backdrop: true,
            rating: true,
            totalSeasons: true,
            releaseYear: true,
            genres: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.favorite.count({ where: { userId } });

    res.json({
      success: true,
      data: {
        favorites,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Watch History Management
export const updateWatchHistory = async (req, res) => {
  try {
    const { contentType, movieId, seriesId, episodeId, progress, completed = false } = req.body;
    const userId = req.user.id;

    const existingHistory = await prisma.watchHistory.findFirst({
      where: {
        userId,
        ...(movieId && { movieId }),
        ...(seriesId && { seriesId }),
        ...(episodeId && { episodeId })
      }
    });

    let watchHistory;

    if (existingHistory) {
      watchHistory = await prisma.watchHistory.update({
        where: { id: existingHistory.id },
        data: {
          progress: parseInt(progress),
          completed,
          watchedAt: new Date()
        }
      });
    } else {
      watchHistory = await prisma.watchHistory.create({
        data: {
          userId,
          contentType,
          ...(movieId && { movieId }),
          ...(seriesId && { seriesId }),
          ...(episodeId && { episodeId }),
          progress: parseInt(progress),
          completed
        }
      });
    }

    res.json({
      success: true,
      message: 'Watch history updated',
      data: watchHistory
    });
  } catch (error) {
    console.error('Update watch history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getWatchHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const watchHistory = await prisma.watchHistory.findMany({
      where: { userId },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            poster: true,
            backdrop: true,
            duration: true
          }
        },
        series: {
          select: {
            id: true,
            title: true,
            poster: true,
            backdrop: true
          }
        },
        episode: {
          select: {
            id: true,
            title: true,
            episodeNumber: true,
            duration: true,
            season: {
              select: {
                seasonNumber: true,
                series: {
                  select: {
                    title: true,
                    poster: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { watchedAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.watchHistory.count({ where: { userId } });

    res.json({
      success: true,
      data: {
        watchHistory,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get watch history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Reviews Management
export const addReview = async (req, res) => {
  try {
    const { contentType, movieId, seriesId, rating, comment } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        contentType,
        ...(movieId && { movieId }),
        ...(seriesId && { seriesId }),
        rating: parseInt(rating),
        comment
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    // Update average rating
    if (movieId) {
      const avgRating = await prisma.review.aggregate({
        where: { movieId },
        _avg: { rating: true }
      });
      await prisma.movie.update({
        where: { id: movieId },
        data: { rating: avgRating._avg.rating }
      });
    } else if (seriesId) {
      const avgRating = await prisma.review.aggregate({
        where: { seriesId },
        _avg: { rating: true }
      });
      await prisma.series.update({
        where: { id: seriesId },
        data: { rating: avgRating._avg.rating }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this content'
      });
    }
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
