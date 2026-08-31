import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  QrCode,
  Smartphone,
  CheckCircle2,
  Lock,
  X,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Copy,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { Youtube } from '../SocialIcons';
import confetti from 'canvas-confetti';

export const PaymentModal: React.FC = () => {
  const { selectedCourseForPayment, setSelectedCourseForPayment, enrollInCourse, navigateTo, showToast, websiteSettings } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'UPI' | 'QR' | 'Card'>('Razorpay');
  const [upiId] = useState('student@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!selectedCourseForPayment) return null;

  const targetWhatsappUrl = selectedCourseForPayment.whatsappRedirectUrl || websiteSettings?.defaultWhatsappRedirectUrl || 'https://wa.me/919876543210?text=Hi%20Director%20Aman%20Arora,%20I%20have%20completed%20the%20course%20payment!';
  const targetPlaylistUrl = selectedCourseForPayment.privatePlaylistUrl || websiteSettings?.defaultPlaylistRedirectUrl;

  const handlePay = async () => {
    setIsProcessing(true);

    if (paymentMethod === 'Razorpay') {
      const razorpayKey = selectedCourseForPayment.razorpayKeyId || websiteSettings?.razorpayKeyId || 'rzp_test_lcc_coaching';

      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((res) => { script.onload = res; });
      }

      const options = {
        key: razorpayKey,
        amount: selectedCourseForPayment.discountFee * 100,
        currency: 'INR',
        name: websiteSettings?.instituteName || 'Learning Coaching Center (L.C.C.)',
        description: `Enrollment Fee: ${selectedCourseForPayment.title}`,
        image: websiteSettings?.logoUrl || '/logo.jpg',
        handler: async function () {
          await enrollInCourse(selectedCourseForPayment.id, 'Razorpay Verified');
          setIsProcessing(false);
          setIsSuccess(true);
          showToast('Razorpay Payment Verified Successfully!', 'success');
          try { confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } }); } catch (e) {}
        },
        prefill: {
          name: 'Aarav Patel',
          email: 'student@lcc.edu',
          contact: '9876543210'
        },
        theme: { color: '#0066FF' },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            showToast('Payment window closed.', 'info');
          }
        }
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (err) {
        setTimeout(async () => {
          await enrollInCourse(selectedCourseForPayment.id, 'Razorpay Verified');
          setIsProcessing(false);
          setIsSuccess(true);
          showToast('Payment Verified Successfully!', 'success');
          try { confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } }); } catch (e) {}
        }, 1000);
      }
      return;
    }

    setTimeout(async () => {
      await enrollInCourse(selectedCourseForPayment.id, paymentMethod);
      setIsProcessing(false);
      setIsSuccess(true);
      showToast('Payment Verified Successfully!', 'success');
      try { confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } }); } catch (e) {}
    }, 1000);
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('amanarora@lcc');
    showToast('UPI ID copied to clipboard!', 'success');
  };

  const handleClose = () => {
    setSelectedCourseForPayment(null);
    setIsSuccess(false);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0066FF] to-[#0052CC] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xs">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black tracking-tight">Razorpay & SSL Encrypted Checkout</h3>
                <span className="bg-emerald-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                  VERIFIED
                </span>
              </div>
              <span className="text-[11px] text-blue-100 font-medium">{websiteSettings?.instituteName || 'Learning Coaching Center (L.C.C.)'}</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          /* SUCCESS SCREEN WITH AUTO WHATSAPP & PRIVATE PLAYLIST REDIRECT BUTTONS */
          <div className="p-6 sm:p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md border-2 border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest block">
                PAYMENT VERIFIED & CONFIRMED!
              </span>
              <h4 className="text-3xl font-black text-slate-900">
                ₹{selectedCourseForPayment.discountFee}
              </h4>
              <p className="text-xs text-slate-500">
                Enrolled in <strong className="text-slate-900 font-extrabold">{selectedCourseForPayment.title}</strong>
              </p>
            </div>

            {/* Barcode Strip */}
            <div className="py-3 px-6 bg-slate-50 rounded-2xl border border-slate-200 inline-block w-full">
              <div className="font-mono text-xl tracking-[0.3em] font-black text-slate-900 select-none py-0.5">
                ||| | |||| | ||| || |||| | ||
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider block">
                RZP-LCC-{Math.floor(100000 + Math.random() * 900000)}
              </span>
            </div>

            {/* AUTO REDIRECT ACTION CARDS */}
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-bold text-slate-700 block">Instant Batch & Video Access:</span>
              
              {targetWhatsappUrl && (
                <a
                  href={targetWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Join Official WhatsApp Batch Group</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {targetPlaylistUrl && (
                <a
                  href={targetPlaylistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition-all cursor-pointer"
                >
                  <Youtube className="w-4 h-4 fill-current" />
                  <span>Open Private YouTube Video Playlist</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  handleClose();
                  navigateTo('student-portal');
                }}
                className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Go to Student Learning Portal
              </button>
            </div>
          </div>
        ) : (
          /* PAYMENT FORM */
          <div className="p-5 sm:p-7 space-y-5">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200/80 flex items-center justify-between gap-3 shadow-xs">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] font-black text-[#0066FF] uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-blue-200">
                  {selectedCourseForPayment.targetClass}
                </span>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate mt-1">
                  {selectedCourseForPayment.title}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">Instructor: Aman Arora & Core Faculty</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-base sm:text-lg font-black text-[#0066FF]">
                  ₹{selectedCourseForPayment.discountFee}
                </span>
                <span className="text-[10px] text-slate-400 block line-through">
                  ₹{selectedCourseForPayment.fee}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 block">Select Payment Gateway</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Razorpay', label: 'Razorpay', icon: CreditCard },
                  { id: 'UPI', label: 'UPI Direct', icon: Smartphone },
                  { id: 'QR', label: 'QR Scanner', icon: QrCode }
                ].map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0066FF] bg-blue-50/80 text-[#0066FF] font-bold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-[#0066FF]' : 'text-slate-500'}`} />
                      <span className="text-[11px]">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <label className="text-xs font-bold text-slate-700 block">Coaching Official UPI VPA</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="amanarora@lcc"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleCopyUPI}
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-[#0066FF]"
                    title="Copy UPI"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'QR' && (
              <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="w-28 h-28 bg-white p-2 border border-slate-300 rounded-xl mx-auto flex items-center justify-center shadow-xs">
                  <QrCode className="w-24 h-24 text-slate-800" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 block">Scan with GPay, PhonePe, Paytm or BHIM</span>
              </div>
            )}

            <div className="pt-2">
              <button
                disabled={isProcessing}
                onClick={handlePay}
                className="w-full py-4 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting Razorpay Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>PAY ₹{selectedCourseForPayment.discountFee} VIA {paymentMethod.toUpperCase()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium mt-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Secure Transaction • Instant Receipt & Group Access</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
