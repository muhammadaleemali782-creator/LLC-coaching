import express from 'express';
import { getDB, saveDB, GalleryModel } from '../config/db.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const gallery = await GalleryModel.find().sort({ _id: -1 });
      return res.json({ success: true, data: gallery });
    }
    const db = getDB();
    res.json({ success: true, data: db.gallery || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = {
      id: `gal-${Date.now()}`,
      ...req.body,
      date: req.body.date || 'Recent Event'
    };
    if (mongoose.connection.readyState === 1) {
      const created = await GalleryModel.create(item);
      return res.status(201).json({ success: true, message: 'Gallery item added', data: created });
    }
    const db = getDB();
    if (!db.gallery) db.gallery = [];
    db.gallery.unshift(item);
    saveDB(db);
    res.status(201).json({ success: true, message: 'Gallery item added', data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await GalleryModel.deleteOne({ id });
      return res.json({ success: true, message: 'Gallery item removed' });
    }
    const db = getDB();
    db.gallery = (db.gallery || []).filter(g => g.id !== id);
    saveDB(db);
    res.json({ success: true, message: 'Gallery item removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const updated = await GalleryModel.findOneAndUpdate({ id }, { $set: req.body }, { new: true });
      return res.json({ success: true, message: 'Gallery item updated', data: updated });
    }
    const db = getDB();
    if (!db.gallery) db.gallery = [];
    const index = db.gallery.findIndex(g => g.id === id);
    if (index >= 0) {
      db.gallery[index] = { ...db.gallery[index], ...req.body };
      saveDB(db);
      return res.json({ success: true, message: 'Gallery item updated', data: db.gallery[index] });
    }
    res.status(404).json({ success: false, message: 'Gallery item not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
