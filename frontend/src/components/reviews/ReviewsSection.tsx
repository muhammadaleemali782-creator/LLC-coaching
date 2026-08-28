import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, MessageSquarePlus, Quote, CheckCircle2, Award } from 'lucide-react';
import { ReviewSubmitModal } from '../modals/ReviewSubmitModal';

export const ReviewsSection: React.FC = () => {
  const { reviews } = useApp();
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  // Show only approved reviews
  const approvedReviews = reviews.filter(r => r.status === 'approved');

  return (
    <section id="reviews-section" className="py-16 sm:py-20 px-3 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-black uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Real Student Stories</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              What Our <span className="text-[#0066FF]">Students & Parents</span> Say
            </h2>
            <p className="text-xs sm:text-base text-slate-600 font-medium">
              Verified testimonials from board toppers, computer diploma scholars, and spoken English achievers.
            </p>
          </div>

          <button
            onClick={() => setIsSubmitOpen(true)}
            className="px-5 py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#0066FF] border border-blue-200 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-xs"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-card-clean transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-blue-200/80" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900">{rev.studentName}</h4>
                  <span className="text-[10px] text-[#0066FF] font-bold block">{rev.studentClass}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      <ReviewSubmitModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
      />
    </section>
  );
};
