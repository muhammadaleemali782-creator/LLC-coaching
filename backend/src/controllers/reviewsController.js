import { getDB, saveDB } from '../config/db.js';

// Get reviews (Approved only for public; All for Admin)
export const getReviews = (req, res) => {
  const { all } = req.query;
  const db = getDB();
  let results = db.reviews || [];

  if (!all) {
    results = results.filter(r => r.status === 'approved');
  }

  res.json({ success: true, count: results.length, data: results });
};

// Submit Review (Public / Students)
export const submitReview = (req, res) => {
  const { studentName, studentClass, rating, comment } = req.body;

  if (!studentName || !comment) {
    return res.status(400).json({ success: false, message: 'Your name and review comments are required.' });
  }

  const db = getDB();
  const newReview = {
    id: `rev-${Date.now()}`,
    studentName: studentName.trim(),
    studentClass: studentClass ? studentClass.trim() : 'Student',
    rating: Number(rating) || 5,
    comment: comment.trim(),
    status: 'pending', // Requires admin moderation before going live
    date: new Date().toISOString().split('T')[0]
  };

  db.reviews.unshift(newReview);
  saveDB(db);

  res.status(201).json({
    success: true,
    message: 'Thank you for your feedback! Your review has been submitted for moderation and will appear publicly once approved.',
    data: newReview
  });
};

// Moderate Review (Admin: approve / reject)
export const moderateReview = (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' | 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status must be either approved or rejected.' });
  }

  const db = getDB();
  const review = db.reviews.find(r => r.id === id);

  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found.' });
  }

  review.status = status;
  saveDB(db);

  res.json({ success: true, message: `Review marked as ${status}.`, data: review });
};

// Delete Review (Admin)
export const deleteReview = (req, res) => {
  const { id } = req.params;
  const db = getDB();

  db.reviews = db.reviews.filter(r => r.id !== id);
  saveDB(db);

  res.json({ success: true, message: 'Review deleted successfully.' });
};
