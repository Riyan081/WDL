import express from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getPopularMovies,
  getMoviesByGenre
} from '../controllers/movieController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { validateRequest, movieSchema } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllMovies);
router.get('/popular', getPopularMovies);
router.get('/genre/:genre', getMoviesByGenre);
router.get('/:id', getMovieById);

// Admin only routes
router.post('/', authenticate, adminOnly, validateRequest(movieSchema), createMovie);
router.put('/:id', authenticate, adminOnly, updateMovie);
router.delete('/:id', authenticate, adminOnly, deleteMovie);

export default router;
