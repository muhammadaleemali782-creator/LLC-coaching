import express from 'express';
import { getDB, saveDB, SyllabusModel } from '../config/db.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const syllabus = await SyllabusModel.find();
      return res.json({ success: true, data: syllabus });
    }
    const db = getDB();
    res.json({ success: true, data: db.syllabus || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const syl = {
      id: `syl-${Date.now()}`,
      ...req.body
    };
    if (mongoose.connection.readyState === 1) {
      const created = await SyllabusModel.create(syl);
      return res.status(201).json({ success: true, message: 'Syllabus added', data: created });
    }
    const db = getDB();
    if (!db.syllabus) db.syllabus = [];
    db.syllabus.push(syl);
    saveDB(db);
    res.status(201).json({ success: true, message: 'Syllabus added', data: syl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await SyllabusModel.deleteOne({ id });
      return res.json({ success: true, message: 'Syllabus deleted' });
    }
    const db = getDB();
    db.syllabus = (db.syllabus || []).filter(s => s.id !== id);
    saveDB(db);
    res.json({ success: true, message: 'Syllabus deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
