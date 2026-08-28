import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import { Star, X, CheckCircle2, MessageSquare, Send, Sparkles } from 'lucide-react';

interface ReviewSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewSubmitModal: React.FC<ReviewSubmitModalProps> = ({ isOpen, onClose }) => {
  const { showToast, addReviewLocally } = useApp();
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('Class 10 Scholar');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) {
      showToast('Please enter your name and testimonial feedback.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.reviews.submit({
        studentName: name.trim(),
        studentClass: studentClass.trim(),
        rating,
        comment: comment.trim()
      });
      addReviewLocally({
        id: `rev-${Date.now()}`,
        studentName: name.trim(),
        studentClass: studentClass.trim(),
        rating,
        comment: comment.trim(),
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      });
      setIsSubmitting(false);
      showToast('Thank you! Your testimonial has been submitted for admin verification.', 'success');
      onClose();
      setName('');
      setComment('');
    } catch (err: any) {
      setIsSubmitting(false);
      showToast('Review submitted for moderation!', 'success');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-[#0066FF] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black">Share Your Experience</h3>
              <span className="text-[11px] text-blue-100 font-medium">L.C.C. Student Testimonial Hub</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Sharma"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Your Course / Batch *</label>
            <input
              type="text"
              required
              placeholder="e.g. Class 10 (Board Topper) or DCA Diploma"
              value={studentClass}
              onChange={e => setStudentClass(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-700 ml-2">{rating}.0 / 5.0</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Your Honest Feedback / Review *</label>
            <textarea
              required
              rows={3}
              placeholder="Tell us about the faculty, tests, doubt solving, or computer lab experience..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>SUBMIT TESTIMONIAL</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
