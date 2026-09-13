import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Institute & Leadership',
    question: 'What is Learning Coaching Center (L.C.C. / LLC) Varanasi?',
    answer: 'Learning Coaching Center (L.C.C., also searched as LLC Coaching) is a top-ranked coaching institute in Varanasi, Uttar Pradesh, specializing in Class 9th to 12th Board examinations, IIT-JEE/NEET foundation, computer diplomas (DCA/ADCA), and personality-focused Spoken English programs.'
  },
  {
    category: 'Institute & Leadership',
    question: 'Who is the Director and Lead Mentor at LCC Coaching?',
    answer: 'The institute is founded and mentored by Director Aman Arora, an experienced educator known for personalized doubt resolution, board topper preparation, and practical computer curriculum.'
  },
  {
    category: 'Batches & Academics',
    question: 'Which academic boards and classes are taught at LCC?',
    answer: 'We provide comprehensive batches for CBSE, ICSE, and UP Board students from Class 9th to 12th across Science (PCM / PCB), Commerce (Accounts, Economics, BST), and Arts streams.'
  },
  {
    category: 'Batches & Academics',
    question: 'Are practical computer diploma courses like DCA and ADCA available?',
    answer: 'Yes! LCC features a modern 1:1 computer lab offering government-certified Diploma in Computer Applications (DCA), Advanced DCA (ADCA), and Tally Prime with GST.'
  },
  {
    category: 'Location & Admissions',
    question: 'Where is the LCC campus located in Varanasi?',
    answer: 'Our main campus is situated at Main Market Road, Near City Central, Varanasi, Uttar Pradesh 221001, easily accessible with dedicated study zones and computer labs.'
  },
  {
    category: 'Location & Admissions',
    question: 'How do students enroll online and join the WhatsApp batch group?',
    answer: 'Students simply login with their student account, choose their desired course, and complete verified enrollment via Razorpay. Upon successful verification, the portal immediately auto-redirects them to the official WhatsApp batch community and private video playlist.'
  }
];

export const FaqSection: React.FC = () => {
  const { navigateTo } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-black uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Everything You Need to Know About <span className="text-[#0066FF]">L.C.C.</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
            Direct answers to common questions about admissions, batches, fees, and Varanasi campus facilities.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-blue-50/40 border-blue-300 shadow-sm'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-xl bg-blue-100/80 text-[#0066FF] font-black text-xs flex items-center justify-center shrink-0">
                      Q{idx + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-[#0066FF] text-white rotate-180' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed animate-in fade-in duration-150 border-t border-blue-100/60 mt-1">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 p-6 rounded-3xl bg-slate-900 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-black">Still have queries or want to visit the campus?</h4>
            <p className="text-xs text-slate-400 font-medium">Talk directly with Director Aman Arora or admission counselors.</p>
          </div>
          <button
            onClick={() => navigateTo('admission', 'admission-section')}
            className="px-6 py-3 rounded-full bg-[#0066FF] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
          >
            <span>Ask Admission Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
