import prisma from '../config/database.js';

export const getAllSeries = async (req, res) => {
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

    const series = await prisma.series.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip,
      take: parseInt(limit),
      select: {
        id: true,
        title: true,
        description: true,
        releaseYear: true,
        genres: true,
        director: true,
        cast: true,
        poster: true,
        backdrop: true,
        trailerUrl: true,
        rating: true,
        viewCount: true,
        totalSeasons: true,
        createdAt: true,
        _count: {
          select: {
            seasons: true
          }
        }
      }
    });

    const total = await prisma.series.count({ where });

    res.json({
      success: true,
      data: {
        series,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get series error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getSeriesById = async (req, res) => {
  try {
    const { id } = req.params;

    const series = await prisma.series.findUnique({
      where: { id },
      include: {
        seasons: {
          include: {
            episodes: {
              orderBy: { episodeNumber: 'asc' },
              select: {
                id: true,
                episodeNumber: true,
                title: true,
                description: true,
                duration: true,
                thumbnail: true,
                airDate: true,
                viewCount: true
              }
            }
          },
          orderBy: { seasonNumber: 'asc' }
        },
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

    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series not found'
      });
    }

    // Increment view count
    await prisma.series.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });

    res.json({
      success: true,
      data: series
    });
  } catch (error) {
    console.error('Get series error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createSeries = async (req, res) => {
  try {
    const seriesData = req.body;

    const series = await prisma.series.create({
      data: seriesData,
      select: {
        id: true,
        title: true,
        description: true,
        releaseYear: true,
        genres: true,
        director: true,
        cast: true,
        poster: true,
        backdrop: true,
        trailerUrl: true,
        totalSeasons: true,
        status: true,
        createdAt: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Series created successfully',
      data: series
    });
  } catch (error) {
    console.error('Create series error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateSeries = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const series = await prisma.series.findUnique({
      where: { id }
    });

    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series not found'
      });
    }

    const updatedSeries = await prisma.series.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        description: true,
        releaseYear: true,
        genres: true,
        director: true,
        cast: true,
        poster: true,
        backdrop: true,
        trailerUrl: true,
        totalSeasons: true,
        status: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Series updated successfully',
      data: updatedSeries
    });
  } catch (error) {
    console.error('Update series error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteSeries = async (req, res) => {
  try {
    const { id } = req.params;

    const series = await prisma.series.findUnique({
      where: { id }
    });

    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series not found'
      });
    }

    await prisma.series.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Series deleted successfully'
    });
  } catch (error) {
    console.error('Delete series error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const addSeason = async (req, res) => {
  try {
    const { seriesId } = req.params;
    const { seasonNumber, title, description, poster, releaseDate } = req.body;

    // Check if series exists
    const series = await prisma.series.findUnique({
      where: { id: seriesId }
    });

    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series not found'
      });
    }

    // Check if season already exists
    const existingSeason = await prisma.season.findUnique({
      where: {
        seriesId_seasonNumber: {
          seriesId,
          seasonNumber: parseInt(seasonNumber)
        }
      }
    });

    if (existingSeason) {
      return res.status(400).json({
        success: false,
        message: 'Season already exists'
      });
    }

    const season = await prisma.season.create({
      data: {
        seriesId,
        seasonNumber: parseInt(seasonNumber),
        title,
        description,
        poster,
        ...(releaseDate && { releaseDate: new Date(releaseDate) })
      }
    });

    res.status(201).json({
      success: true,
      message: 'Season added successfully',
      data: season
    });
  } catch (error) {
    console.error('Add season error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const addEpisode = async (req, res) => {
  try {
    const { seasonId } = req.params;
    const episodeData = req.body;

    // Check if season exists
    const season = await prisma.season.findUnique({
      where: { id: seasonId }
    });

    if (!season) {
      return res.status(404).json({
        success: false,
        message: 'Season not found'
      });
    }

    const episode = await prisma.episode.create({
      data: {
        ...episodeData,
        seasonId,
        episodeNumber: parseInt(episodeData.episodeNumber),
        duration: parseInt(episodeData.duration),
        ...(episodeData.airDate && { airDate: new Date(episodeData.airDate) })
      }
    });

    res.status(201).json({
      success: true,
      message: 'Episode added successfully',
      data: episode
    });
  } catch (error) {
    console.error('Add episode error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
