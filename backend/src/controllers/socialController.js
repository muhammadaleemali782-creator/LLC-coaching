import { getDB, saveDB, SocialLinkModel } from '../config/db.js';
import mongoose from 'mongoose';

export const getSocialLinks = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const links = await SocialLinkModel.find();
      if (links && links.length > 0) {
        return res.json({ success: true, data: links });
      }
    }
  } catch (err) {}

  const db = getDB();
  res.json({ success: true, data: db.socialLinks || [] });
};

export const updateSocialLink = async (req, res) => {
  const { id } = req.params;
  const { url, label, isEnabled } = req.body;

  try {
    if (mongoose.connection.readyState === 1) {
      const updated = await SocialLinkModel.findOneAndUpdate(
        { id },
        { ...(url !== undefined && { url: url.trim() }), ...(label !== undefined && { label: label.trim() }), ...(isEnabled !== undefined && { isEnabled: Boolean(isEnabled) }) },
        { new: true }
      );
      if (updated) {
        return res.json({ success: true, message: 'Social link updated successfully in Cloud MongoDB!', data: updated });
      }
    }
  } catch (err) {}

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
