import express from 'express';
import {
  getAllSeries,
  getSeriesById,
  getSeriesEpisodes,
  getEpisodeById,
  createSeries,
  updateSeries,
  deleteSeries,
  addSeason,
  addEpisode
} from '../controllers/seriesController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { validateRequest, seriesSchema, episodeSchema } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllSeries);
router.get('/:id', getSeriesById);
router.get('/:id/episodes', getSeriesEpisodes);
router.get('/episodes/:episodeId', getEpisodeById);

// Admin only routes
router.post('/', authenticate, adminOnly, validateRequest(seriesSchema), createSeries);
router.put('/:id', authenticate, adminOnly, updateSeries);
router.delete('/:id', authenticate, adminOnly, deleteSeries);
router.post('/:seriesId/seasons', authenticate, adminOnly, addSeason);
router.post('/seasons/:seasonId/episodes', authenticate, adminOnly, validateRequest(episodeSchema), addEpisode);

export default router;
