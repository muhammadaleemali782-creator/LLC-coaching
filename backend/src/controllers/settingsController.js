import { getDB, saveDB, SettingModel } from '../config/db.js';
import mongoose from 'mongoose';

export const getSettings = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const settings = await SettingModel.findOne();
      if (settings) return res.json({ success: true, data: settings });
    }
    const db = getDB();
    res.json({ success: true, data: db.settings || {} });
  } catch (err) {
    const db = getDB();
    res.json({ success: true, data: db.settings || {} });
  }
};

export const updateSettings = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const settings = await SettingModel.findOneAndUpdate(
        {},
        { $set: req.body },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, message: 'Website branding & settings updated successfully in Cloud MongoDB!', data: settings });
    }
    const db = getDB();
    db.settings = { ...db.settings, ...req.body };
    saveDB(db);

    res.json({ success: true, message: 'Website branding & settings updated successfully!', data: db.settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
