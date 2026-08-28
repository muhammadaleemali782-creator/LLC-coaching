import { getDB, saveDB } from '../config/db.js';

export const getSocialLinks = (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.socialLinks || [] });
};

export const updateSocialLink = (req, res) => {
  const { id } = req.params;
  const { url, label, isEnabled } = req.body;

  const db = getDB();
  const link = db.socialLinks.find(s => s.id === id);

  if (!link) {
    return res.status(404).json({ success: false, message: 'Social link not found.' });
  }

  if (url !== undefined) link.url = url.trim();
  if (label !== undefined) link.label = label.trim();
  if (isEnabled !== undefined) link.isEnabled = Boolean(isEnabled);

  saveDB(db);
  res.json({ success: true, message: 'Social link updated successfully!', data: link });
};
