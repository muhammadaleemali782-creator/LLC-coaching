import { getDB, saveDB } from '../config/db.js';

// Helper: Extract YouTube Video ID from any standard URL
const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

// ==================== PDFS CONTROLLERS ====================
export const getPDFs = (req, res) => {
  const { category, targetClass } = req.query;
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

export const createPDF = (req, res) => {
  const { title, category, targetClass, subject, chapter, pages, downloadUrl, isPremium, previewContent } = req.body;

  if (!title || !targetClass || !subject) {
    return res.status(400).json({ success: false, message: 'PDF title, target class, and subject are required.' });
  }

  const db = getDB();
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

  db.studyMaterials.unshift(newPdf);
  saveDB(db);

  res.status(201).json({ success: true, message: 'Study PDF added successfully!', data: newPdf });
};

export const deletePDF = (req, res) => {
  const { id } = req.params;
  const db = getDB();

  db.studyMaterials = db.studyMaterials.filter(m => m.id !== id);
  saveDB(db);

  res.json({ success: true, message: 'Study PDF deleted successfully.' });
};

export const trackPDFDownload = (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const pdf = db.studyMaterials.find(m => m.id === id);

  if (pdf) {
    pdf.downloadsCount = (pdf.downloadsCount || 0) + 1;
    saveDB(db);
  }

  res.json({ success: true });
};

// ==================== YOUTUBE VIDEOS CONTROLLERS ====================
export const getVideos = (req, res) => {
  const { all, subject, targetClass } = req.query;
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

export const createVideo = (req, res) => {
  const { title, youtubeUrl, duration, subject, targetClass, instructor } = req.body;

  if (!title || !youtubeUrl) {
    return res.status(400).json({ success: false, message: 'Video title and valid YouTube URL are required.' });
  }

  const videoId = extractYouTubeId(youtubeUrl);
  if (!videoId) {
    return res.status(400).json({ success: false, message: 'Please enter a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=...)' });
  }

  const db = getDB();
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

  db.videos.unshift(newVideo);
  saveDB(db);

  res.status(201).json({ success: true, message: 'YouTube lecture added successfully!', data: newVideo });
};

export const toggleVideoStatus = (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const video = db.videos.find(v => v.id === id);

  if (!video) {
    return res.status(404).json({ success: false, message: 'Video not found.' });
  }

  video.isPublished = !video.isPublished;
  saveDB(db);

  res.json({ success: true, message: `Video ${video.isPublished ? 'published' : 'hidden'} successfully!`, data: video });
};

export const deleteVideo = (req, res) => {
  const { id } = req.params;
  const db = getDB();

  db.videos = db.videos.filter(v => v.id !== id);
  saveDB(db);

  res.json({ success: true, message: 'YouTube video deleted successfully.' });
};
