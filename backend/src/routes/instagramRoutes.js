import express from 'express';
import { getDB, saveDB, InstagramModel } from '../config/db.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const posts = await InstagramModel.find().sort({ _id: -1 });
      return res.json({ success: true, data: posts });
    }
    const db = getDB();
    res.json({ success: true, data: db.instagramPosts || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const post = {
      id: `ig-${Date.now()}`,
      imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      caption: req.body.caption || 'New update from L.C.C. Official',
      likes: req.body.likes || 120,
      comments: req.body.comments || 15,
      postUrl: req.body.postUrl || 'https://instagram.com',
      timestamp: req.body.timestamp || 'Just now'
    };
    if (mongoose.connection.readyState === 1) {
      const created = await InstagramModel.create(post);
      return res.status(201).json({ success: true, message: 'Instagram post added', data: created });
    }
    const db = getDB();
    if (!db.instagramPosts) db.instagramPosts = [];
    db.instagramPosts.unshift(post);
    saveDB(db);
    res.status(201).json({ success: true, message: 'Instagram post added', data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const updated = await InstagramModel.findOneAndUpdate({ id }, req.body, { new: true });
      return res.json({ success: true, message: 'Instagram post updated', data: updated });
    }
    const db = getDB();
    const idx = (db.instagramPosts || []).findIndex(p => p.id === id);
    if (idx !== -1) {
      db.instagramPosts[idx] = { ...db.instagramPosts[idx], ...req.body };
      saveDB(db);
      return res.json({ success: true, message: 'Instagram post updated', data: db.instagramPosts[idx] });
    }
    res.status(404).json({ success: false, message: 'Post not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await InstagramModel.deleteOne({ id });
      return res.json({ success: true, message: 'Instagram post removed' });
    }
    const db = getDB();
    db.instagramPosts = (db.instagramPosts || []).filter(p => p.id !== id);
    saveDB(db);
    res.json({ success: true, message: 'Instagram post removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
