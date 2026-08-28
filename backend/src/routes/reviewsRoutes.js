import express from 'express';
import { getReviews, submitReview, moderateReview, deleteReview } from '../controllers/reviewsController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', submitReview);
router.patch('/:id/moderate', requireAdmin, moderateReview);
router.delete('/:id', requireAdmin, deleteReview);

export default router;
