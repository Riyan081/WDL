import { z } from 'zod';

// Auth Validations
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Movie Validations
export const movieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.number().min(1, 'Duration must be positive'),
  releaseYear: z.number().min(1900).max(new Date().getFullYear() + 5),
  genres: z.array(z.string()).min(1, 'At least one genre is required'),
  director: z.string().min(1, 'Director is required'),
  cast: z.array(z.string()).min(1, 'At least one cast member is required'),
  poster: z.string().url().optional(),
  backdrop: z.string().url().optional(),
  trailerUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
});

// Series Validations
export const seriesSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  releaseYear: z.number().min(1900).max(new Date().getFullYear() + 5),
  genres: z.array(z.string()).min(1, 'At least one genre is required'),
  director: z.string().min(1, 'Director is required'),
  cast: z.array(z.string()).min(1, 'At least one cast member is required'),
  poster: z.string().url().optional(),
  backdrop: z.string().url().optional(),
  trailerUrl: z.string().url().optional(),
  totalSeasons: z.number().min(1).default(1),
});

// Episode Validations
export const episodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.number().min(1, 'Duration must be positive'),
  videoUrl: z.string().url().optional(),
  thumbnail: z.string().url().optional(),
  airDate: z.string().datetime().optional(),
});

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
  };
};
