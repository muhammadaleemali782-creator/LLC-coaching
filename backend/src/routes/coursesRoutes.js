import express from 'express';
import mongoose from 'mongoose';
import { getDB, saveDB, CourseModel } from '../config/db.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const courses = await CourseModel.find();
      if (courses && courses.length > 0) {
        return res.json({ success: true, data: courses });
      }
    }
    const db = getDB();
    res.json({ success: true, data: db.courses || [] });
  } catch (err) {
    const db = getDB();
    res.json({ success: true, data: db.courses || [] });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const newCourse = { id: `c-${Date.now()}`, ...req.body };
    if (mongoose.connection.readyState === 1) {
      const created = await CourseModel.create(newCourse);
      return res.status(201).json({ success: true, message: 'Course created successfully', data: created });
    }
    const db = getDB();
    if (!db.courses) db.courses = [];
    db.courses.unshift(newCourse);
    saveDB(db);
    res.status(201).json({ success: true, message: 'Course created successfully', data: newCourse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const updated = await CourseModel.findOneAndUpdate({ id }, req.body, { new: true });
      if (updated) {
        return res.json({ success: true, message: 'Course updated successfully', data: updated });
      }
    }
    const db = getDB();
    const idx = (db.courses || []).findIndex(c => c.id === id);
    if (idx !== -1) {
      db.courses[idx] = { ...db.courses[idx], ...req.body };
      saveDB(db);
      return res.json({ success: true, message: 'Course updated successfully', data: db.courses[idx] });
    }
    res.status(404).json({ success: false, message: 'Course not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await CourseModel.deleteOne({ id });
      return res.json({ success: true, message: 'Course deleted successfully' });
    }
    const db = getDB();
    db.courses = (db.courses || []).filter(c => c.id !== id);
    saveDB(db);
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
