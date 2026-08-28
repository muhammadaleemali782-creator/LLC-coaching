import express from 'express';
import { getDB, saveDB } from '../config/db.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.courses || [] });
});

router.post('/', requireAdmin, (req, res) => {
  const db = getDB();
  const newCourse = { id: `c-${Date.now()}`, ...req.body };
  db.courses.unshift(newCourse);
  saveDB(db);
  res.status(201).json({ success: true, message: 'Course created successfully', data: newCourse });
});

router.delete('/:id', requireAdmin, (req, res) => {
  const db = getDB();
  db.courses = db.courses.filter(c => c.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, message: 'Course deleted successfully' });
});

export default router;
