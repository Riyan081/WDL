import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getContentStats
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

export default router;
