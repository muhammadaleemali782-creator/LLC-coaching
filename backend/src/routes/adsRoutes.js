import express from 'express';
import { getAds, createAd, updateAd, toggleAdStatus, deleteAd, trackAdClick } from '../controllers/adsController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAds);
router.post('/', requireAdmin, createAd);
router.put('/:id', requireAdmin, updateAd);
router.patch('/:id/toggle', requireAdmin, toggleAdStatus);
router.delete('/:id', requireAdmin, deleteAd);
router.post('/click/:id', trackAdClick);

export default router;
