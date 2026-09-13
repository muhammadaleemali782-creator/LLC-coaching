import { getDB, saveDB, AdModel } from '../config/db.js';
import mongoose from 'mongoose';

// Get all active ads (Public) or all ads with filter (Admin)
export const getAds = async (req, res) => {
  const { placement, all } = req.query;

  try {
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (placement) query.placement = placement;
      if (!all) query.isActive = true;
      const results = await AdModel.find(query).sort({ priority: 1 });
      if (results && results.length > 0) {
        return res.json({ success: true, count: results.length, data: results });
      }
    }
  } catch (err) {}

  const db = getDB();
  let results = db.ads || [];

  if (placement) {
    results = results.filter(ad => ad.placement === placement);
  }
  if (!all) {
    results = results.filter(ad => ad.isActive);
  }
  results.sort((a, b) => (a.priority || 99) - (b.priority || 99));

  res.json({ success: true, count: results.length, data: results });
};

// Create Ad (Admin)
export const createAd = async (req, res) => {
  const { title, description, imageUrl, destinationUrl, placement, badge, priority, startDate, endDate } = req.body;

  if (!title || !destinationUrl) {
    return res.status(400).json({ success: false, message: 'Ad title and destination URL are required.' });
  }

  const newAd = {
    id: `ad-${Date.now()}`,
    title: title.trim(),
    description: description ? description.trim() : '',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
    destinationUrl: destinationUrl.trim(),
    placement: placement || 'hero_top',
    badge: badge || 'PROMOTED',
    priority: Number(priority) || 1,
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || '2027-12-31',
    isActive: true,
    clicks: 0,
    createdAt: new Date().toISOString()
  };

  try {
    if (mongoose.connection.readyState === 1) {
      const created = await AdModel.create(newAd);
      return res.status(201).json({ success: true, message: 'Advertisement banner created successfully!', data: created });
    }
  } catch (err) {}

  const db = getDB();
  if (!db.ads) db.ads = [];
  db.ads.unshift(newAd);
  saveDB(db);

  res.status(201).json({ success: true, message: 'Advertisement banner created successfully!', data: newAd });
};

// Update Ad (Admin)
export const updateAd = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      const updated = await AdModel.findOneAndUpdate({ id }, req.body, { new: true });
      if (updated) {
        return res.json({ success: true, message: 'Advertisement updated successfully!', data: updated });
      }
    }
  } catch (err) {}

  const db = getDB();
  const index = (db.ads || []).findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Advertisement not found.' });
  }

  db.ads[index] = { ...db.ads[index], ...req.body, id };
  saveDB(db);

  res.json({ success: true, message: 'Advertisement updated successfully!', data: db.ads[index] });
};

// Toggle Ad Active Status (Admin)
export const toggleAdStatus = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      const ad = await AdModel.findOne({ id });
      if (ad) {
        ad.isActive = !ad.isActive;
        await ad.save();
        return res.json({ success: true, message: `Ad ${ad.isActive ? 'activated' : 'deactivated'} successfully!`, data: ad });
      }
    }
  } catch (err) {}

  const db = getDB();
  const ad = (db.ads || []).find(a => a.id === id);

  if (!ad) {
    return res.status(404).json({ success: false, message: 'Advertisement not found.' });
  }

  ad.isActive = !ad.isActive;
  saveDB(db);

  res.json({ success: true, message: `Ad ${ad.isActive ? 'activated' : 'deactivated'} successfully!`, data: ad });
};

// Delete Ad (Admin)
export const deleteAd = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      await AdModel.deleteOne({ id });
      return res.json({ success: true, message: 'Advertisement deleted successfully.' });
    }
  } catch (err) {}

  const db = getDB();
  db.ads = (db.ads || []).filter(a => a.id !== id);
  saveDB(db);

  res.json({ success: true, message: 'Advertisement deleted successfully.' });
};

// Track Ad Click (Public)
export const trackAdClick = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      await AdModel.updateOne({ id }, { $inc: { clicks: 1 } });
      return res.json({ success: true });
    }
  } catch (err) {}

  const db = getDB();
  const ad = (db.ads || []).find(a => a.id === id);

  if (ad) {
    ad.clicks = (ad.clicks || 0) + 1;
    saveDB(db);
  }

  res.json({ success: true });
};
