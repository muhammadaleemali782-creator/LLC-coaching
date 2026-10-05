import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, X, Send, CheckCircle2, Check, Sparkles, User, GraduationCap } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'counselor' | 'student';
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome-1',
    sender: 'counselor',
    text: 'Namaste! 🙏 Welcome to L.C.C. Live Student Helpdesk & Counseling. Aap yahan admission, fees, batch timings, notes ya kisi bhi doubt ke bare me pooch sakte hain. How can we help you today?',
    time: 'Just now'
  }
];

const QUICK_CHIPS = [
  '🎯 Admission 2026 & Fee Structure',
  '🕒 Batch Timings (Morning & Evening)',
  '💻 Computer DCA & Tally Prime',
  '❓ Doubt Clearing with Aman Sir'
];

export const LiveSupportChatModal: React.FC = () => {
  const {
    isLiveSupportChatOpen,
    setIsLiveSupportChatOpen,
    currentStudent,
    websiteSettings
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isResolved, setIsResolved] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isLiveSupportChatOpen) {
      scrollToBottom();
    }
  }, [messages, isLiveSupportChatOpen]);

  if (!isLiveSupportChatOpen) return null;

  const getSmartReply = (userMsg: string): string => {
    const q = userMsg.toLowerCase();
    if (q.includes('fee') || q.includes('admission') || q.includes('admission 2026') || q.includes('enroll') || q.includes('paisa')) {
      return 'Admissions for Session 2026-27 are currently open at L.C.C.! Classes 1–12 monthly tuition starts from ₹499/mo, and DCA Computer Diploma is ₹4,999. Sunday scholarship test me appear hokar aap up to 50% fee concession bhi le sakte hain. Aap direct campus visit kar sakte hain (Palahipatti, Sindhora Road).';
    }
    if (q.includes('time') || q.includes('timing') || q.includes('schedule') || q.includes('kab')) {
      return 'L.C.C. campus batches run 6 days a week (Mon–Sat): Morning batches: 7:00 AM – 11:30 AM | Evening batches: 3:00 PM – 8:00 PM. Sundays ko Director Aman Arora sir ke special 1:1 Doubt Clinics conduct hote hain.';
    }
    if (q.includes('computer') || q.includes('dca') || q.includes('adca') || q.includes('tally')) {
      return 'Humara Computer Department 1:1 dedicated PC provide karta hai with ISO Certified DCA, ADCA & Tally Prime with GST. Daily practical hands-on labs conduct hote hain.';
    }
    if (q.includes('doubt') || q.includes('aman') || q.includes('sir') || q.includes('question') || q.includes('math') || q.includes('science')) {
      return 'Aapka doubt Academic Counseling Desk pe record ho gaya hai. Director Aman Arora and senior faculty members daily live doubt sessions conduct karte hain. Aap campus me bhi direct Aman Sir se mil sakte hain.';
    }
    return 'Thank you for reaching out to L.C.C. Support! Aapki query Counseling Team ne note kar li hai. Agar aapka question solve ho gaya ho to upar "Mark as Resolved" pe tap karein.';
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isResolved) return;

    const studentMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, studentMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = getSmartReply(text);
      const counselorMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'counselor',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, counselorMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleResolve = () => {
    if (isResolved) return;
    setIsResolved(true);

    // Add clean polite resolution message
    const resolutionMsg: ChatMessage = {
      id: `msg-res-${Date.now()}`,
      sender: 'counselor',
      text: '✓ Query marked as Resolved. L.C.C. Helpdesk se judne ke liye dhanyawad! Wish you all the best in your studies.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, resolutionMsg]);

    // Close and cleanly destroy/reset state after short delay
    setTimeout(() => {
      setIsLiveSupportChatOpen(false);
      setIsResolved(false);
      setMessages(INITIAL_MESSAGES);
      setInputText('');
    }, 1500);
  };

  const handleClose = () => {
    setIsLiveSupportChatOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isResolved) handleClose();
      }}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[85vh] sm:h-[600px] border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4"
        style={{ color: '#1e293b' }}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <img
                src="/logo.jpg"
                alt="L.C.C."
                className="w-9 h-9 rounded-xl object-contain bg-white border border-slate-200 p-0.5 shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate">
                L.C.C. Student Helpdesk
              </h3>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Director & Counseling Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Resolve Button */}
            <button
              type="button"
              id="btn-resolve-chat"
              onClick={handleResolve}
              disabled={isResolved}
              className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                isResolved
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isResolved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Resolved</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolve</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.map((m) => {
            const isStudent = m.sender === 'student';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                    isStudent
                      ? 'bg-[#0066FF] text-white rounded-br-xs font-medium'
                      : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200 font-normal'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">
                  {m.time}
                </span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 px-2 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[10px]">Counseling desk typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {!isResolved && messages.length <= 3 && (
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {QUICK_CHIPS.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 whitespace-nowrap shrink-0 cursor-pointer transition-colors border border-slate-200"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              id="live-chat-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isResolved}
              placeholder={isResolved ? "Query resolved" : "Type your question or doubt..."}
              className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              id="btn-send-chat"
              disabled={!inputText.trim() || isResolved}
              className="w-10 h-10 rounded-2xl bg-[#0066FF] hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LiveSupportChatModal;
