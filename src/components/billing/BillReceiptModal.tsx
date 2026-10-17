import React from 'react';
import { Printer, X, HeartPulse, Receipt, CheckCircle2 } from 'lucide-react';
import { Bill } from '../../types';
import { useHospital } from '../../context/HospitalContext';

interface BillReceiptModalProps {
  bill: Bill;
  onClose: () => void;
}

export const BillReceiptModal: React.FC<BillReceiptModalProps> = ({ bill, onClose }) => {
  const { patients } = useHospital();
  const patient = patients.find(p => p.id === bill.patientId);

  const handlePrint = () => {
    window.print();
  };

  const balanceDue = Math.max(0, bill.totalAmount - bill.paidAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in duration-150">
        {/* Toolbar */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">Hospital Billing Invoice & Payment Receipt</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice / Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Paper Document Body */}
        <div className="p-8 sm:p-12 space-y-8 bg-white print:p-0 text-slate-800 font-sans text-xs">
          {/* Header */}
          <div className="border-b-2 border-indigo-700 pb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-2xl tracking-tight">
                <HeartPulse className="w-8 h-8 text-red-500 inline" />
                <span>HMS MedCare Hospital</span>
              </div>
              <p className="text-slate-500 font-medium mt-1">Patient Financial Accounting Department</p>
              <p className="text-slate-500">
                100 Medical Plaza, Suite 400 • Tel: +1 (555) 019-2000 • Email: billing@hospitalsystem.com
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 font-bold text-xs uppercase tracking-wider rounded border ${
                bill.status === 'paid'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}>
                {bill.status === 'paid' ? 'PAID RECEIPT' : 'OFFICIAL INVOICE'}
              </span>
              <p className="text-slate-900 font-mono font-bold text-sm mt-2">{bill.billNumber}</p>
              <p className="text-slate-400 mt-0.5">
                Issued: {bill.createdAt.split('T')[0]}
              </p>
              {bill.dueDate && (
                <p className="text-slate-400">Due: {bill.dueDate}</p>
              )}
            </div>
          </div>

          {/* Billed To */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Billed To (Patient)</span>
              <p className="text-sm font-bold text-slate-900 mt-1">{patient?.name || 'Walk-in Patient'}</p>
              <p className="text-slate-600 mt-0.5">ID: <span className="font-mono">{patient?.id}</span></p>
              <p className="text-slate-600">{patient?.phone}</p>
              <p className="text-slate-600">{patient?.address || 'Springfield'}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Payment Information</span>
              <p className="text-slate-700 mt-1 font-medium capitalize">
                Method: <strong>{bill.paymentMethod || 'Pending'}</strong>
              </p>
              {bill.paidAt && (
                <p className="text-emerald-700 font-semibold mt-0.5">
                  Paid Date: {bill.paidAt.split('T')[0]}
                </p>
              )}
              {patient?.insuranceProvider && (
                <p className="text-slate-500 mt-0.5">
                  Insurance: {patient.insuranceProvider} ({patient.insuranceId})
                </p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 font-semibold text-slate-700 text-xs">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Service / Charge Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bill.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-semibold text-slate-900">{item.description}</td>
                    <td className="p-3 capitalize text-slate-600">{item.itemType.replace('_', ' ')}</td>
                    <td className="p-3 text-center font-mono">{item.quantity}</td>
                    <td className="p-3 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2 border-t border-slate-200 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold">${bill.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax / Regulatory Fee:</span>
                <span className="font-mono">+${bill.tax.toFixed(2)}</span>
              </div>
              {bill.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Insurance / Discount:</span>
                  <span className="font-mono">-${bill.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-300">
                <span>Total Amount:</span>
                <span className="font-mono text-indigo-700">${bill.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700 font-semibold">
                <span>Amount Paid:</span>
                <span className="font-mono text-emerald-600">${bill.paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-slate-200">
                <span>Balance Due:</span>
                <span className={`font-mono ${balanceDue > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                  ${balanceDue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {bill.notes && (
            <div className="p-3 bg-slate-50 rounded-lg text-slate-500 text-[11px]">
              <strong>Notes:</strong> {bill.notes}
            </div>
          )}

          {/* Footer */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-slate-400 text-[11px]">
            <div>
              <p className="text-slate-600 font-medium">Payment Terms: Due within 30 days of issuance.</p>
              <p>Accepted payments: Credit Card, Insurance direct claim, Bank transfer, Cash.</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-700">HMS MedCare Hospital Billing</p>
              <p className="font-mono text-[10px]">AUTH-TRANSACTION-ID: #{bill.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
