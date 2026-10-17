import React, { useState } from 'react';
import {
  ReceiptText,
  DollarSign,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  Filter,
  Search,
  ArrowUpRight,
  PieChart,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Bill } from '../../types';
import { BillReceiptModal } from '../billing/BillReceiptModal';

export const FinanceDashboard: React.FC = () => {
  const { bills, payBill, patients } = useHospital();

  const [selectedReceipt, setSelectedReceipt] = useState<Bill | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const totalRevenue = bills
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.paidAmount, 0);

  const pendingRevenue = bills
    .filter(b => b.status === 'issued')
    .reduce((sum, b) => sum + (b.totalAmount - b.paidAmount), 0);

  const paidCount = bills.filter(b => b.status === 'paid').length;
  const issuedCount = bills.filter(b => b.status === 'issued').length;

  const filteredBills = bills.filter(b => {
    const pat = patients.find(p => p.id === b.patientId);
    const matchesSearch =
      b.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pat?.name && pat.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {selectedReceipt && (
        <BillReceiptModal bill={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-orange-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl font-bold shadow-inner">
              <ReceiptText className="w-7 h-7 text-amber-200" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-amber-200 tracking-wider">
                Financial Accounting & Revenue Ledger
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Finance Personnel Console
              </h2>
              <p className="text-xs text-amber-100 mt-0.5">
                Hospital receivables, patient claims, mandatory exit bill audits, and payment ledger reconciliation.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-amber-200 block">Total Settle Cash</span>
            <span className="text-2xl font-black font-mono text-white">${(totalRevenue ?? 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border-l-4 border-emerald-600 shadow-xs">
          <p className="text-xs font-bold uppercase text-slate-400">Total Collected</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">${totalRevenue.toLocaleString()}</p>
          <span className="text-xs text-emerald-600 font-semibold">{paidCount} Paid Invoices</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border-l-4 border-amber-500 shadow-xs">
          <p className="text-xs font-bold uppercase text-slate-400">Receivables / Pending</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">${pendingRevenue.toLocaleString()}</p>
          <span className="text-xs text-amber-600 font-semibold">{issuedCount} Awaiting checkout</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border-l-4 border-indigo-600 shadow-xs">
          <p className="text-xs font-bold uppercase text-slate-400">Total Invoices</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{bills.length}</p>
          <span className="text-xs text-indigo-600 font-semibold">100% Audit trail</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border-l-4 border-teal-600 shadow-xs">
          <p className="text-xs font-bold uppercase text-slate-400">Collection Rate</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {bills.length > 0 ? `${Math.round((paidCount / bills.length) * 100)}%` : '100%'}
          </p>
          <span className="text-xs text-teal-600 font-semibold">Mandatory settlement</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">Official Hospital Billing Ledger</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search invoice or patient..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="issued">Issued / Unpaid</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Itemized Breakdown</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBills.map(bill => {
                const pat = patients.find(p => p.id === bill.patientId);
                const isPaid = bill.status === 'paid';
                return (
                  <tr key={bill.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{bill.billNumber}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{pat?.name || 'Walk-in'}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">{bill.createdAt.split('T')[0]}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                      {bill.items.map(i => i.description).join(', ')}
                    </td>
                    <td className="px-6 py-4 capitalize">{bill.paymentMethod || 'Pending'}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                      ${(bill.totalAmount ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedReceipt(bill)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-lg border border-slate-300 font-bold hover:bg-slate-100"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
