import express from 'express';
import { getSocialLinks, updateSocialLink } from '../controllers/socialController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSocialLinks);
router.put('/:id', requireAdmin, updateSocialLink);

export default router;
