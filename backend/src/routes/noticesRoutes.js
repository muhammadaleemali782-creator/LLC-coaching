import express from 'express';
import { getDB, saveDB, NoticeModel } from '../config/db.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const notices = await NoticeModel.find().sort({ _id: -1 });
      return res.json({ success: true, data: notices });
    }
    const db = getDB();
    res.json({ success: true, data: db.notices || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const notice = {
      id: `not-${Date.now()}`,
      ...req.body,
      date: req.body.date || new Date().toISOString().split('T')[0]
    };
    if (mongoose.connection.readyState === 1) {
      const created = await NoticeModel.create(notice);
      return res.status(201).json({ success: true, message: 'Notice published', data: created });
    }
    const db = getDB();
    if (!db.notices) db.notices = [];
    db.notices.unshift(notice);
    saveDB(db);
    res.status(201).json({ success: true, message: 'Notice published', data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await NoticeModel.deleteOne({ id });
      return res.json({ success: true, message: 'Notice deleted' });
    }
    const db = getDB();
    db.notices = (db.notices || []).filter(n => n.id !== id);
    saveDB(db);
    res.json({ success: true, message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
