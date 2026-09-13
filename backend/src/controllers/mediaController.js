import { getDB, saveDB, StudyMaterialModel, VideoModel } from '../config/db.js';
import mongoose from 'mongoose';

// Helper: Extract YouTube Video ID from any standard URL
const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

// ==================== PDFS CONTROLLERS ====================
export const getPDFs = async (req, res) => {
  const { category, targetClass } = req.query;

  try {
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (category && category !== 'all') query.category = category;
      if (targetClass && targetClass !== 'all') query.targetClass = new RegExp(targetClass, 'i');
      const results = await StudyMaterialModel.find(query).sort({ _id: -1 });
      if (results && results.length > 0) {
        return res.json({ success: true, count: results.length, data: results });
      }
    }
  } catch (err) {}

  const db = getDB();
  let results = db.studyMaterials || [];

  if (category && category !== 'all') {
    results = results.filter(m => m.category === category);
  }
  if (targetClass && targetClass !== 'all') {
    results = results.filter(m => m.targetClass.toLowerCase().includes(targetClass.toLowerCase()));
  }

  res.json({ success: true, count: results.length, data: results });
};

export const createPDF = async (req, res) => {
  const { title, category, targetClass, subject, chapter, pages, downloadUrl, isPremium, previewContent } = req.body;

  if (!title || !targetClass || !subject) {
    return res.status(400).json({ success: false, message: 'PDF title, target class, and subject are required.' });
  }

  const newPdf = {
    id: `m-${Date.now()}`,
    title: title.trim(),
    category: category || 'pdf_notes',
    targetClass: targetClass.trim(),
    subject: subject.trim(),
    chapter: chapter ? chapter.trim() : 'General',
    pages: Number(pages) || 10,
    downloadUrl: downloadUrl || '/assets/sample_notes.pdf',
    isPremium: Boolean(isPremium),
    fileType: 'pdf',
    dateAdded: new Date().toISOString().split('T')[0],
    downloadsCount: 0,
    previewContent: previewContent || 'Verified academic study module.'
  };

  try {
    if (mongoose.connection.readyState === 1) {
      const created = await StudyMaterialModel.create(newPdf);
      return res.status(201).json({ success: true, message: 'Study PDF added successfully!', data: created });
    }
  } catch (err) {}

  const db = getDB();
  if (!db.studyMaterials) db.studyMaterials = [];
  db.studyMaterials.unshift(newPdf);
  saveDB(db);

  res.status(201).json({ success: true, message: 'Study PDF added successfully!', data: newPdf });
};

export const deletePDF = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      await StudyMaterialModel.deleteOne({ id });
      return res.json({ success: true, message: 'Study PDF deleted successfully.' });
    }
  } catch (err) {}

  const db = getDB();
  db.studyMaterials = (db.studyMaterials || []).filter(m => m.id !== id);
  saveDB(db);

  res.json({ success: true, message: 'Study PDF deleted successfully.' });
};

export const trackPDFDownload = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      await StudyMaterialModel.updateOne({ id }, { $inc: { downloadsCount: 1 } });
      return res.json({ success: true });
    }
  } catch (err) {}

  const db = getDB();
  const pdf = (db.studyMaterials || []).find(m => m.id === id);

  if (pdf) {
    pdf.downloadsCount = (pdf.downloadsCount || 0) + 1;
    saveDB(db);
  }

  res.json({ success: true });
};

// ==================== YOUTUBE VIDEOS CONTROLLERS ====================
export const getVideos = async (req, res) => {
  const { all, subject, targetClass } = req.query;

  try {
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (!all) query.isPublished = true;
      if (subject && subject !== 'all') query.subject = subject;
      if (targetClass && targetClass !== 'all') query.targetClass = new RegExp(targetClass, 'i');
      const results = await VideoModel.find(query).sort({ _id: -1 });
      if (results && results.length > 0) {
        return res.json({ success: true, count: results.length, data: results });
      }
    }
  } catch (err) {}

  const db = getDB();
  let results = db.videos || [];

  if (!all) {
    results = results.filter(v => v.isPublished !== false);
  }
  if (subject && subject !== 'all') {
    results = results.filter(v => v.subject === subject);
  }
  if (targetClass && targetClass !== 'all') {
    results = results.filter(v => v.targetClass.toLowerCase().includes(targetClass.toLowerCase()));
  }

  res.json({ success: true, count: results.length, data: results });
};

export const createVideo = async (req, res) => {
  const { title, youtubeUrl, duration, subject, targetClass, instructor } = req.body;

  if (!title || !youtubeUrl) {
    return res.status(400).json({ success: false, message: 'Video title and valid YouTube URL are required.' });
  }

  const videoId = extractYouTubeId(youtubeUrl);
  if (!videoId) {
    return res.status(400).json({ success: false, message: 'Please enter a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=...)' });
  }

  const newVideo = {
    id: `v-${Date.now()}`,
    title: title.trim(),
    youtubeUrl: youtubeUrl.trim(),
    videoId,
    duration: duration || '35:00',
    views: '1.2K',
    subject: subject || 'General Knowledge',
    targetClass: targetClass || 'All Students',
    instructor: instructor || 'Aman Arora',
    isPublished: true,
    dateAdded: new Date().toISOString().split('T')[0]
  };

  try {
    if (mongoose.connection.readyState === 1) {
      const created = await VideoModel.create(newVideo);
      return res.status(201).json({ success: true, message: 'YouTube lecture added successfully!', data: created });
    }
  } catch (err) {}

  const db = getDB();
  if (!db.videos) db.videos = [];
  db.videos.unshift(newVideo);
  saveDB(db);

  res.status(201).json({ success: true, message: 'YouTube lecture added successfully!', data: newVideo });
};

export const toggleVideoStatus = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      const vid = await VideoModel.findOne({ id });
      if (vid) {
        vid.isPublished = !vid.isPublished;
        await vid.save();
        return res.json({ success: true, message: `Video ${vid.isPublished ? 'published' : 'hidden'} successfully!`, data: vid });
      }
    }
  } catch (err) {}

  const db = getDB();
  const video = (db.videos || []).find(v => v.id === id);

  if (!video) {
    return res.status(404).json({ success: false, message: 'Video not found.' });
  }

  video.isPublished = !video.isPublished;
  saveDB(db);

  res.json({ success: true, message: `Video ${video.isPublished ? 'published' : 'hidden'} successfully!`, data: video });
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      await VideoModel.deleteOne({ id });
      return res.json({ success: true, message: 'YouTube video deleted successfully.' });
    }
  } catch (err) {}

  const db = getDB();
  db.videos = (db.videos || []).filter(v => v.id !== id);
  saveDB(db);

  res.json({ success: true, message: 'YouTube video deleted successfully.' });
};
