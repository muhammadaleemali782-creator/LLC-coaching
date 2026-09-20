import { getDB, saveDB, SocialLinkModel } from '../config/db.js';
import mongoose from 'mongoose';

export const getSocialLinks = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const links = await SocialLinkModel.find();
      return res.json({ success: true, data: links });
    }
  } catch (err) {}

  const db = getDB();
  res.json({ success: true, data: db.socialLinks || [] });
};

export const updateSocialLink = async (req, res) => {
  const { id } = req.params;
  const { url, label, isEnabled, platform } = req.body;

  try {
    if (mongoose.connection.readyState === 1) {
      const updateDoc = {};
      if (url !== undefined) updateDoc.url = url.trim();
      if (label !== undefined) updateDoc.label = label.trim();
      if (isEnabled !== undefined) updateDoc.isEnabled = Boolean(isEnabled);
      if (platform !== undefined) updateDoc.platform = platform.trim();

      const updated = await SocialLinkModel.findOneAndUpdate(
        { id },
        { $set: updateDoc },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      if (updated) {
        return res.json({ success: true, message: 'Social link updated successfully in Cloud MongoDB!', data: updated });
      }
    }
  } catch (err) {
    console.error('MongoDB updateSocialLink error:', err.message);
  }

  const db = getDB();
  const link = (db.socialLinks || []).find(s => s.id === id);

  if (!link) {
    return res.status(404).json({ success: false, message: 'Social link not found.' });
  }

  if (url !== undefined) link.url = url.trim();
  if (label !== undefined) link.label = label.trim();
  if (isEnabled !== undefined) link.isEnabled = Boolean(isEnabled);

  saveDB(db);
  res.json({ success: true, message: 'Social link updated successfully!', data: link });
};
