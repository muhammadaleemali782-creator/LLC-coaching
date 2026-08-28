import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Star, CheckCircle2, XCircle, Trash2, ShieldCheck, Clock } from 'lucide-react';

export const ReviewsManager: React.FC = () => {
  const { reviews, moderateReview, deleteReview } = useApp();

  const pending = reviews.filter(r => r.status === 'pending');
  const approved = reviews.filter(r => r.status === 'approved');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Student Reviews & Testimonial Moderation</h2>
        <p className="text-xs text-slate-400">Review student-submitted feedback before publishing it on the live website.</p>
      </div>

      {/* Pending Reviews Banner */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Pending Verification ({pending.length})</span>
        </h3>

        {pending.length === 0 ? (
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-500">
            No pending reviews waiting for moderation.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pending.map(rev => (
              <div key={rev.id} className="p-5 bg-slate-950 border border-amber-500/30 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-white">{rev.studentName}</h4>
                    <span className="text-[10px] text-blue-400 font-bold">{rev.studentClass}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic font-medium">"{rev.comment}"</p>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => moderateReview(rev.id, 'rejected')}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-1 hover:bg-red-500/20 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => moderateReview(rev.id, 'approved')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1 hover:bg-emerald-500/30 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Publish</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Reviews */}
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Live Approved Reviews ({approved.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {approved.map(rev => (
            <div key={rev.id} className="p-4 bg-slate-950 border border-slate-800 rounded-3xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{rev.studentName}</span>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-blue-400 block mb-2">{rev.studentClass}</span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">"{rev.comment}"</p>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-800">
                <button
                  onClick={() => deleteReview(rev.id)}
                  className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                  title="Remove Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
