import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Download, Printer, X, ShieldCheck, Share2 } from 'lucide-react';
import { Transaction } from '../../types';

export const EReceiptModal: React.FC<{ transaction: Transaction | null; onClose: () => void }> = ({
  transaction,
  onClose
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-black text-slate-900">E-Receipt</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-5 text-center">
          
          {/* Barcode Graphic */}
          <div className="py-2 px-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block w-full">
            <div className="font-mono text-xl tracking-[0.25em] font-black text-slate-900 select-none py-1">
              ||| | |||| | ||| || |||| | ||
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider block">
              {transaction.id}
            </span>
          </div>

          {/* Success Badge */}
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
              Payment Successful
            </span>
            <div className="text-3xl font-black text-slate-900">
              ₹{transaction.amount}
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2.5 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Course / Batch:</span>
              <span className="font-bold text-slate-900 text-right line-clamp-1 max-w-[170px]">{transaction.courseName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Student Name:</span>
              <span className="font-bold text-slate-900">{transaction.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Phone:</span>
              <span className="font-bold text-slate-900">{transaction.studentPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Method:</span>
              <span className="font-bold text-blue-600">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">UTR / Ref No:</span>
              <span className="font-mono text-[11px] text-slate-700 font-bold truncate max-w-[150px]">{transaction.utrNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date & Time:</span>
              <span className="text-slate-700">{transaction.date}</span>
            </div>
          </div>

          {/* Director Seal */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Institute: L.C.C. Coaching</span>
            <span className="font-bold text-slate-700">Director: Aman Arora</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download E-Receipt</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
