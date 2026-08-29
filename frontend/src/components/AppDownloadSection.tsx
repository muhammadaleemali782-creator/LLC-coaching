import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  Download,
  QrCode,
  CheckCircle2,
  Star,
  Sparkles,
  Bell,
  WifiOff,
  Camera,
  Award,
  Clock,
  Send,
  User,
  Search,
  BookOpen,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Zap,
  Layers,
  Heart
} from 'lucide-react';

export const AppDownloadSection: React.FC = () => {
  const { showToast, courses } = useApp();
  const [notifyPhone, setNotifyPhone] = useState('');
  const [isPreRegistered, setIsPreRegistered] = useState(false);
  const [activeScreen, setActiveScreen] = useState<'home' | 'courses' | 'chat' | 'receipt' | 'profile'>('home');

  const handlePreRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyPhone) {
      showToast('Please enter your mobile number for launch alert.', 'warning');
      return;
    }
    setIsPreRegistered(true);
    showToast(`Pre-registration confirmed for ${notifyPhone}! You will get 1-Month Free Pro access on Play Store launch.`, 'success');
  };

  return (
    <section id="app-download-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Learner by L.C.C. — Mobile App</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Learn Anywhere with <span className="text-blue-600">L.C.C. Mobile App</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Experience our next-generation mobile interface designed for instant video playback, chapter tests, photo doubt solving, and offline downloads.
          </p>
        </div>

        {/* Main Grid: Interactive Phone Mockup + Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Phone Mockup Replicating Reference Design */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Screen Tabs Selector */}
            <div className="flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 shadow-sm mb-6 max-w-md w-full overflow-x-auto scrollbar-none justify-start sm:justify-center">
              {[
                { id: 'home', label: 'Feed' },
                { id: 'courses', label: 'Lessons' },
                { id: 'chat', label: 'Doubt Chat' },
                { id: 'receipt', label: 'E-Receipt' },
                { id: 'profile', label: 'Profile' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveScreen(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    activeScreen === tab.id
                      ? 'bg-[#0066FF] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Realistic Smartphone Shell */}
            <div className="relative w-full max-w-[320px] aspect-[9/18.5] bg-slate-950 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-900/50 overflow-hidden select-none">
              
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
              </div>

              {/* Phone Screen Canvas (Clean White Minimalist UI matching image) */}
              <div className="w-full h-full bg-white rounded-[38px] overflow-y-auto overflow-x-hidden pt-8 pb-16 flex flex-col justify-between relative text-slate-800 text-xs scrollbar-none font-sans">
                
                {/* 1. SCREEN: HOME FEED */}
                {activeScreen === 'home' && (
                  <div className="p-4 space-y-4 animate-in fade-in duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          AA
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Welcome Back 👋</span>
                          <span className="font-bold text-slate-900 text-xs">Aarav Patel</span>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 relative">
                        <Bell className="w-3.5 h-3.5" />
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute top-1 right-1" />
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2 text-slate-400 text-[11px]">
                      <Search className="w-3.5 h-3.5" />
                      <span>Search for physics, maths, notes...</span>
                    </div>

                    {/* Today's Special Promo Banner Matching Reference Image */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-4 text-white space-y-2 relative overflow-hidden shadow-md shadow-blue-500/20">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                          TODAY'S SPECIAL
                        </span>
                        <span className="text-xl font-black text-amber-300">75% OFF</span>
                      </div>
                      <h4 className="font-extrabold text-sm leading-tight">
                        Class 10 Board Topper Batch 2026-27
                      </h4>
                      <p className="text-[10px] text-blue-100">Daily live classes, DPPs & 1-on-1 doubt clearing.</p>
                      <button className="px-3 py-1 bg-white text-blue-600 rounded-lg font-bold text-[10px] shadow-sm">
                        Join Now
                      </button>
                    </div>

                    {/* Categories Pill Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-900 text-xs">Categories</span>
                        <span className="text-[10px] text-blue-600 font-bold">See All</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                        {[
                          { name: 'Primary', icon: '🎒' },
                          { name: 'Class 9-10', icon: '📐' },
                          { name: 'Class 11-12', icon: '🔬' },
                          { name: 'Computer', icon: '💻' }
                        ].map((c, i) => (
                          <div key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="text-base block">{c.icon}</span>
                            <span className="font-bold text-slate-700 block truncate">{c.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Popular Courses Feed */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-900 text-xs">Popular Courses</span>
                        <span className="text-[10px] text-blue-600 font-bold">View All</span>
                      </div>
                      <div className="space-y-2">
                        {courses.slice(0, 2).map(c => (
                          <div key={c.id} className="p-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3">
                            <img src={c.image} alt={c.title} className="w-14 h-14 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-slate-900 text-[11px] truncate">{c.title}</h5>
                              <span className="text-[10px] text-slate-400 block">{c.targetClass} • By Aman Arora</span>
                              <div className="flex items-center justify-between mt-1">
                                <span className="font-black text-blue-600 text-xs">₹{c.discountFee}</span>
                                <span className="text-[9px] font-bold text-amber-500 flex items-center gap-0.5">
                                  ★ {c.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Mentors */}
                    <div>
                      <span className="font-bold text-slate-900 text-xs block mb-2">Top Mentors</span>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <img src="/assets/founder.png" alt="Aman Arora" className="w-9 h-9 rounded-full object-cover border border-blue-500" />
                        <div className="flex-1">
                          <span className="font-bold text-slate-900 text-[11px] block">Aman Arora</span>
                          <span className="text-[9px] text-slate-400">Founder & Academic Director</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[9px] font-bold">
                          Lead Mentor
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SCREEN: COURSE DETAILS & LESSONS */}
                {activeScreen === 'courses' && (
                  <div className="p-4 space-y-4 animate-in fade-in duration-200">
                    <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-900">
                      <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80" alt="Course Cover" className="w-full h-full object-cover filter brightness-90" />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[9px]">
                        ₹5,999
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-blue-600 font-bold uppercase">Class 10 Board Master</span>
                      <h4 className="font-extrabold text-slate-900 text-sm">Complete Science & Maths Mastery</h4>
                      <p className="text-[10px] text-slate-500 mt-1">120+ Video Lectures, 45 Solved DPPs, Chapter PYQ Vault.</p>
                    </div>

                    <div className="space-y-2">
                      <span className="font-bold text-slate-900 text-xs block">Course Modules</span>
                      {[
                        { title: '1. Chemical Reactions & Equations', dur: '45 mins', status: 'Completed' },
                        { title: '2. Electricity & Circuits Logic', dur: '60 mins', status: 'Locked' },
                        { title: '3. Quadratic Equations Master', dur: '50 mins', status: 'Locked' }
                      ].map((mod, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800 truncate max-w-[180px]">{mod.title}</span>
                          <span className="text-[9px] text-blue-600 font-bold">{mod.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. SCREEN: DOUBT CHAT */}
                {activeScreen === 'chat' && (
                  <div className="p-4 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <img src="/assets/founder.png" alt="Aman Arora" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs">Aman Arora (Mentor)</h5>
                        <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online for Doubts
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-[10px]">
                      <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 max-w-[200px] leading-relaxed">
                        Sir, I have a doubt in Physics Ohm's law numerical from yesterday's DPP.
                      </div>
                      <div className="p-2.5 rounded-xl bg-blue-600 text-white ml-auto max-w-[200px] leading-relaxed">
                        Sure Aarav! Remember: V = I × R. When resistors are in series, add resistances directly.
                      </div>
                    </div>

                    <div className="pt-4 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type your question..."
                        className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px]"
                      />
                      <button className="p-2 rounded-xl bg-blue-600 text-white">
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. SCREEN: E-RECEIPT */}
                {activeScreen === 'receipt' && (
                  <div className="p-4 space-y-3 text-center animate-in fade-in duration-200">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 font-mono tracking-widest text-xs font-black">
                      ||| | |||| | ||| || ||||
                    </div>
                    <span className="text-[9px] text-slate-400 block font-mono">TXN-98421</span>

                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">Payment Completed</h5>
                    <div className="text-xl font-black text-slate-900">₹5,999</div>

                    <div className="bg-slate-50 p-2.5 rounded-xl text-[10px] space-y-1.5 text-left border border-slate-100">
                      <div className="flex justify-between text-slate-500">
                        <span>Course:</span>
                        <span className="font-bold text-slate-900">Class 10 Board Batch</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Student:</span>
                        <span className="font-bold text-slate-900">Aarav Patel</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Method:</span>
                        <span className="font-bold text-blue-600">UPI / GPay</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. SCREEN: PROFILE */}
                {activeScreen === 'profile' && (
                  <div className="p-4 space-y-4 animate-in fade-in duration-200">
                    <div className="text-center space-y-1">
                      <div className="w-14 h-14 rounded-full bg-blue-600 text-white text-lg font-black flex items-center justify-center mx-auto shadow-md">
                        AP
                      </div>
                      <h4 className="font-bold text-xs text-slate-900">Aarav Patel</h4>
                      <span className="text-[10px] text-slate-400 block">aarav.patel@lcc.edu</span>
                    </div>

                    <div className="space-y-1.5 text-[11px] font-bold text-slate-700">
                      <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                        <span>📚 My Enrolled Courses</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                        <span>📜 Verified Certificates</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                        <span>💳 Payment Receipts</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation Bar inside Phone Mockup */}
                <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-100 flex items-center justify-around px-2 text-[9px] font-bold text-slate-400">
                  <button
                    onClick={() => setActiveScreen('home')}
                    className={`flex flex-col items-center ${activeScreen === 'home' ? 'text-blue-600' : ''}`}
                  >
                    <span>🏠</span>
                    <span>Home</span>
                  </button>
                  <button
                    onClick={() => setActiveScreen('courses')}
                    className={`flex flex-col items-center ${activeScreen === 'courses' ? 'text-blue-600' : ''}`}
                  >
                    <span>📚</span>
                    <span>Courses</span>
                  </button>
                  <button
                    onClick={() => setActiveScreen('chat')}
                    className={`flex flex-col items-center ${activeScreen === 'chat' ? 'text-blue-600' : ''}`}
                  >
                    <span>💬</span>
                    <span>Chat</span>
                  </button>
                  <button
                    onClick={() => setActiveScreen('receipt')}
                    className={`flex flex-col items-center ${activeScreen === 'receipt' ? 'text-blue-600' : ''}`}
                  >
                    <span>🧾</span>
                    <span>Receipt</span>
                  </button>
                  <button
                    onClick={() => setActiveScreen('profile')}
                    className={`flex flex-col items-center ${activeScreen === 'profile' ? 'text-blue-600' : ''}`}
                  >
                    <span>👤</span>
                    <span>Profile</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Mobile App Feature Highlights & Pre-Registration */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Mobile App — Beta Testing (Android & iOS)</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Every Classroom Feature, <br />
              <span className="text-blue-600">Right in Your Pocket</span>
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              The upcoming <strong>Learner by L.C.C.</strong> mobile app brings high-speed video lectures, daily practice sheets, photo question recognition, and direct mentor chats with Aman Arora and faculty.
            </p>

            {/* Pre-Register Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Pre-Register for Early VIP Access</span>
              </h4>

              {isPreRegistered ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-3 text-xs">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>You're on the launch priority list! We'll send your download link on {notifyPhone}.</span>
                </div>
              ) : (
                <form onSubmit={handlePreRegister} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="tel"
                    required
                    placeholder="Enter WhatsApp / Mobile number..."
                    value={notifyPhone}
                    onChange={e => setNotifyPhone(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all shrink-0"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Get Launch Alert</span>
                  </button>
                </form>
              )}
            </div>

            {/* App Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
                <WifiOff className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">Offline Video Downloads</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
                <Camera className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">Photo Doubt Solver</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
                <Award className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">Live Quizzes & Leaderboards</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">Instant E-Receipts & Notes</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
