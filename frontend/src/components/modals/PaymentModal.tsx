import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  QrCode,
  Smartphone,
  Building2,
  CheckCircle2,
  Lock,
  X,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Loader2,
  Copy,
  Receipt,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentModal: React.FC = () => {
  const { selectedCourseForPayment, setSelectedCourseForPayment, enrollInCourse, navigateTo, showToast } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'QR' | 'Card' | 'NetBanking'>('UPI');
  const [upiId, setUpiId] = useState('student@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8842');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!selectedCourseForPayment) return null;

  const handlePay = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      await enrollInCourse(selectedCourseForPayment.id, paymentMethod);
      setIsProcessing(false);
      setIsSuccess(true);

      try {
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
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
        
        {/* Elite Gradient Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0066FF] to-[#0052CC] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xs">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black tracking-tight">256-Bit Encrypted Checkout</h3>
                <span className="bg-emerald-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                  SECURE
                </span>
              </div>
              <span className="text-[11px] text-blue-100 font-medium">Lakshya Career Classes Official Desk</span>
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
          /* SUCCESS SCREEN WITH E-RECEIPT BARCODE */
          <div className="p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md border-2 border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest block">
                PAYMENT COMPLETED SUCCESSFULLY
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
                TXN-LCC-{Math.floor(100000 + Math.random() * 900000)}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-900">Aarav Patel</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Batch Category:</span>
                <span className="font-bold text-[#0066FF]">{selectedCourseForPayment.targetClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Access:</span>
                <span className="font-bold text-emerald-600">Immediate LMS & Vault Unlocked</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  navigateTo('student-portal');
                }}
                className="w-full py-3.5 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                Go to Student Portal
              </button>
            </div>
          </div>
        ) : (
          /* PAYMENT FORM */
          <div className="p-5 sm:p-7 space-y-5">
            
            {/* Course Summary Card */}
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

            {/* Payment Method Selector Grid */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 block">Select Payment Method</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / Apps', icon: Smartphone },
                  { id: 'QR', label: 'QR Scan', icon: QrCode },
                  { id: 'Card', label: 'Card', icon: CreditCard },
                  { id: 'NetBanking', label: 'NetBanking', icon: Building2 }
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                      paymentMethod === method.id
                        ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-md shadow-blue-500/20 scale-102'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                    }`}
                  >
                    <method.icon className="w-5 h-5" />
                    <span className="text-[10px] font-black">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Method Inputs */}
            {paymentMethod === 'UPI' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Enter UPI ID</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Instant Auto-Verify
                  </span>
                </div>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0066FF] shadow-xs"
                />
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 font-bold">
                  <span>Fast Apps:</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">GPay</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">PhonePe</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">Paytm</span>
                </div>
              </div>
            )}

            {paymentMethod === 'QR' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center space-y-3">
                <div className="w-32 h-32 bg-white rounded-2xl p-2 mx-auto border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-xl p-1.5 flex items-center justify-center text-white font-mono text-[10px]">
                    [ QR SCANNER ]
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-700">UPI: amanarora@lcc</span>
                  <button
                    onClick={handleCopyUPI}
                    className="p-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[#0066FF]"
                    title="Copy UPI"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">CVV</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'NetBanking' && (
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <label className="text-xs font-bold text-slate-700 block">Select Popular Bank</label>
                <select
                  value={selectedBank}
                  onChange={e => setSelectedBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0066FF]"
                >
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank</option>
                </select>
              </div>
            )}

            {/* Primary Pay Button */}
            <div className="pt-2">
              <button
                disabled={isProcessing}
                onClick={handlePay}
                className="w-full py-4 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>PAY ₹{selectedCourseForPayment.discountFee} & GENERATE E-RECEIPT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium mt-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Money-Back Guarantee • Instant Receipt Generation</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
