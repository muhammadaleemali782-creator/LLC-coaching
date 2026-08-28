import { getDB, saveDB } from '../config/db.js';

// Get all active ads (Public) or all ads with filter (Admin)
export const getAds = (req, res) => {
  const { placement, all } = req.query;
  const db = getDB();

  let results = db.ads || [];

  // Filter by placement if specified
  if (placement) {
    results = results.filter(ad => ad.placement === placement);
  }

  // Filter out inactive ads for normal visitors
  if (!all) {
    results = results.filter(ad => ad.isActive);
  }

  // Sort by priority ascending (1 highest)
  results.sort((a, b) => (a.priority || 99) - (b.priority || 99));

  res.json({ success: true, count: results.length, data: results });
};

// Create Ad (Admin)
export const createAd = (req, res) => {
  const { title, description, imageUrl, destinationUrl, placement, badge, priority, startDate, endDate } = req.body;

  if (!title || !destinationUrl) {
    return res.status(400).json({ success: false, message: 'Ad title and destination URL are required.' });
  }

  const db = getDB();
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

  db.ads.unshift(newAd);
  saveDB(db);

  res.status(201).json({ success: true, message: 'Advertisement banner created successfully!', data: newAd });
};

// Update Ad (Admin)
export const updateAd = (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const index = db.ads.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Advertisement not found.' });
  }

  db.ads[index] = { ...db.ads[index], ...req.body, id };
  saveDB(db);

  res.json({ success: true, message: 'Advertisement updated successfully!', data: db.ads[index] });
};

// Toggle Ad Active Status (Admin)
export const toggleAdStatus = (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const ad = db.ads.find(a => a.id === id);

  if (!ad) {
    return res.status(404).json({ success: false, message: 'Advertisement not found.' });
  }

  ad.isActive = !ad.isActive;
  saveDB(db);

  res.json({ success: true, message: `Ad ${ad.isActive ? 'activated' : 'deactivated'} successfully!`, data: ad });
};

// Delete Ad (Admin)
export const deleteAd = (req, res) => {
  const { id } = req.params;
  const db = getDB();

  db.ads = db.ads.filter(a => a.id !== id);
  saveDB(db);

  res.json({ success: true, message: 'Advertisement deleted successfully.' });
};

// Track Ad Click (Public)
export const trackAdClick = (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const ad = db.ads.find(a => a.id === id);

  if (ad) {
    ad.clicks = (ad.clicks || 0) + 1;
    saveDB(db);
  }

  res.json({ success: true });
};
