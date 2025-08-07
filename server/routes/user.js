import express from 'express';
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  updateWatchHistory,
  getWatchHistory,
  addReview
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Favorites
router.post('/favorites', addToFavorites);
router.delete('/favorites/:id', removeFromFavorites);
router.get('/favorites', getFavorites);

// Watch History
router.post('/watch-history', updateWatchHistory);
router.get('/watch-history', getWatchHistory);

// Reviews
router.post('/reviews', addReview);

export default router;
