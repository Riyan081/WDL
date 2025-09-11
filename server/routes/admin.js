import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getContentStats,
  createOrGetSeason,
  createEpisode,
  getAllEpisodes,
  updateEpisode,
  deleteEpisode
} from '../controllers/adminController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/content-stats', getContentStats);

// Episode management routes
router.post('/series/:id/seasons', createOrGetSeason);
router.post('/episodes', createEpisode);
router.get('/episodes', getAllEpisodes);
router.put('/episodes/:id', updateEpisode);
router.delete('/episodes/:id', deleteEpisode);

export default router;
