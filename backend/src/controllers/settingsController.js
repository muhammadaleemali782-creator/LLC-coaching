import { getDB, saveDB } from '../config/db.js';

export const getSettings = (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.settings || {} });
};

export const updateSettings = (req, res) => {
  const db = getDB();
  db.settings = { ...db.settings, ...req.body };
  saveDB(db);

  res.json({ success: true, message: 'Website settings updated successfully!', data: db.settings });
};
