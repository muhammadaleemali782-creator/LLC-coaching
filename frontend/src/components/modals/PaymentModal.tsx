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
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentModal: React.FC = () => {
  const { selectedCourseForPayment, setSelectedCourseForPayment, enrollInCourse, navigateTo } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'QR'>('UPI');
  const [upiId, setUpiId] = useState('student@okaxis');
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
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }, 1000);
  };

  const handleClose = () => {
    setSelectedCourseForPayment(null);
    setIsSuccess(false);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-[#0066FF] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black">256-Bit Encrypted Checkout</h3>
              <span className="text-[11px] text-blue-100">Lakshya Career Classes Payment Portal</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* SUCCESS SCREEN WITH E-RECEIPT BARCODE MATCHING LEARNER DESIGN */
          <div className="p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
            {/* Barcode Strip */}
            <div className="py-2.5 px-6 bg-slate-50 rounded-2xl border border-slate-200 inline-block w-full">
              <div className="font-mono text-xl tracking-[0.25em] font-black text-slate-900 select-none py-1">
                ||| | |||| | ||| || |||| | ||
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider block">
                TXN-{Math.floor(10000 + Math.random() * 90000)}
              </span>
            </div>

            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                Payment Completed
              </span>
              <h4 className="text-2xl font-black text-slate-900">
                ₹{selectedCourseForPayment.discountFee}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Enrolled in <strong>{selectedCourseForPayment.title}</strong>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Student:</span>
                <span className="font-bold text-slate-900">Aarav Patel</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Class Batch:</span>
                <span className="font-bold text-[#0066FF]">{selectedCourseForPayment.targetClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-600">Active / Enrolled</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  navigateTo('student-portal');
                }}
                className="flex-1 py-3.5 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-500/25"
              >
                Go to Student Portal
              </button>
            </div>
          </div>
        ) : (
          /* PAYMENT FORM */
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Course Summary */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black text-[#0066FF] uppercase">
                  {selectedCourseForPayment.targetClass}
                </span>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {selectedCourseForPayment.title}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-[#0066FF]">
                  ₹{selectedCourseForPayment.discountFee}
                </span>
                <span className="text-[10px] text-slate-400 block line-through">
                  ₹{selectedCourseForPayment.fee}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select Payment Method</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / GPay', icon: Smartphone },
                  { id: 'QR', label: 'QR Scan', icon: QrCode },
                  { id: 'Card', label: 'Card', icon: CreditCard },
                  { id: 'NetBanking', label: 'NetBanking', icon: Building2 }
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                      paymentMethod === method.id
                        ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <method.icon className="w-5 h-5" />
                    <span className="text-[10px] font-bold">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Method Inputs */}
            {paymentMethod === 'UPI' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700">Enter UPI ID (Google Pay / PhonePe / Paytm)</span>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            )}

            {paymentMethod === 'QR' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2">
                <div className="w-32 h-32 mx-auto bg-white p-2 border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                  <QrCode className="w-24 h-24 text-slate-900" />
                </div>
                <span className="text-xs font-bold text-slate-700 block">Scan with any UPI App to Pay</span>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <label className="text-[11px] text-slate-500 font-bold block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 font-bold block mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-bold block mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'NetBanking' && (
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">Select Your Bank</label>
                <select
                  value={selectedBank}
                  onChange={e => setSelectedBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                >
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank</option>
                </select>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-4 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Secure Payment...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{selectedCourseForPayment.discountFee} & Generate E-Receipt</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
