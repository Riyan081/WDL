import prisma from '../config/database.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalMovies,
      totalSeries,
      totalEpisodes,
      totalViews,
      recentUsers,
      popularContent
    ] = await Promise.all([
      prisma.user.count(),
      prisma.movie.count(),
      prisma.series.count(),
      prisma.episode.count(),
      prisma.watchHistory.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
          role: true
        }
      }),
      Promise.all([
        prisma.movie.findMany({
          take: 5,
          orderBy: { viewCount: 'desc' },
          select: {
            id: true,
            title: true,
            poster: true,
            viewCount: true,
            rating: true
          }
        }),
        prisma.series.findMany({
          take: 5,
          orderBy: { viewCount: 'desc' },
          select: {
            id: true,
            title: true,
            poster: true,
            viewCount: true,
            rating: true
          }
        })
      ])
    ]);

    // Get weekly stats
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyStats = await Promise.all([
      prisma.user.count({
        where: { createdAt: { gte: weekAgo } }
      }),
      prisma.movie.count({
        where: { createdAt: { gte: weekAgo } }
      }),
      prisma.series.count({
        where: { createdAt: { gte: weekAgo } }
      }),
      prisma.watchHistory.count({
        where: { watchedAt: { gte: weekAgo } }
      })
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalMovies,
          totalSeries,
          totalEpisodes,
          totalViews,
          weeklyNew: {
            users: weeklyStats[0],
            movies: weeklyStats[1],
            series: weeklyStats[2],
            views: weeklyStats[3]
          }
        },
        recentUsers,
        popularContent: {
          movies: popularContent[0],
          series: popularContent[1]
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(role && { role }),
      ...(isActive !== undefined && { isActive: isActive === 'true' })
    };

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            watchHistory: true,
            favorites: true,
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.user.count({ where });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getContentStats = async (req, res) => {
  try {
    const { type = 'movies' } = req.query;

    let stats;
    if (type === 'movies') {
      stats = await prisma.movie.groupBy({
        by: ['status'],
        _count: { status: true }
      });
    } else {
      stats = await prisma.series.groupBy({
        by: ['status'],
        _count: { status: true }
      });
    }

    const genreStats = type === 'movies' 
      ? await prisma.$queryRaw`
          SELECT unnest(genres) as genre, COUNT(*) as count
          FROM movies 
          WHERE status = 'PUBLISHED'
          GROUP BY genre 
          ORDER BY count DESC 
          LIMIT 10
        `
      : await prisma.$queryRaw`
          SELECT unnest(genres) as genre, COUNT(*) as count
          FROM series 
          WHERE status = 'PUBLISHED'
          GROUP BY genre 
          ORDER BY count DESC 
          LIMIT 10
        `;

    res.json({
      success: true,
      data: {
        statusStats: stats,
        genreStats
      }
    });
  } catch (error) {
    console.error('Get content stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
