import express from 'express';
import { getPDFs, createPDF, deletePDF, trackPDFDownload, getVideos, createVideo, toggleVideoStatus, deleteVideo } from '../controllers/mediaController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// PDFs
router.get('/pdfs', getPDFs);
router.post('/pdfs', requireAdmin, createPDF);
router.delete('/pdfs/:id', requireAdmin, deletePDF);
router.post('/pdfs/download/:id', trackPDFDownload);

// Videos
router.get('/videos', getVideos);
router.post('/videos', requireAdmin, createVideo);
router.patch('/videos/:id/toggle', requireAdmin, toggleVideoStatus);
router.delete('/videos/:id', requireAdmin, deleteVideo);

export default router;
