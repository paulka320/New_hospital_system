import React, { useState } from 'react';
import {
  ReceiptText,
  Plus,
  Search,
  Filter,
  DollarSign,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  X,
  FileText,
  PlusCircle,
} from 'lucide-react';
import { Bill, BillItem, BillItemType, BillStatus, PaymentMethod } from '../../types';
import { useHospital } from '../../context/HospitalContext';
import { BillReceiptModal } from './BillReceiptModal';

export const BillingView: React.FC = () => {
  const { bills, addBill, payBill, patients } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [selectedReceipt, setSelectedReceipt] = useState<Bill | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [payingBill, setPayingBill] = useState<Bill | null>(null);

  // Payment form
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('card');
  const [payNotes, setPayNotes] = useState('');

  // New Invoice form
  const [newPatientId, setNewPatientId] = useState(patients[0]?.id || '');
  const [newDueDate, setNewDueDate] = useState('2026-11-17');
  const [newTax, setNewTax] = useState(10.0);
  const [newDiscount, setNewDiscount] = useState(0.0);
  const [newNotes, setNewNotes] = useState('');
  const [lineItems, setLineItems] = useState<Array<{ itemType: BillItemType; description: string; quantity: number; unitPrice: number }>>([
    { itemType: 'consultation', description: 'Clinical Consultation', quantity: 1, unitPrice: 100.0 },
  ]);

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      { itemType: 'medicine', description: 'Prescribed Medication', quantity: 1, unitPrice: 25.0 },
    ]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleLineItemChange = (index: number, field: string, value: any) => {
    const updated = [...lineItems];
    (updated[index] as any)[field] = value;
    setLineItems(updated);
  };

  const subtotalCalc = lineItems.reduce((acc, it) => acc + (it.quantity * it.unitPrice || 0), 0);
  const totalCalc = Math.max(0, subtotalCalc + (newTax || 0) - (newDiscount || 0));

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lineItems.length === 0) return;

    const formattedItems: BillItem[] = lineItems.map((item, idx) => ({
      id: `bi-${Date.now()}-${idx}`,
      billId: '',
      itemType: item.itemType,
      description: item.description,
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 0,
    }));

    addBill({
      patientId: newPatientId,
      status: 'issued',
      tax: Number(newTax) || 0,
      discount: Number(newDiscount) || 0,
      paidAmount: 0,
      dueDate: newDueDate,
      notes: newNotes,
      items: formattedItems,
    });

    setIsCreateOpen(false);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingBill) return;
    payBill(payingBill.id, Number(payAmount), payMethod, payNotes);
    setPayingBill(null);
  };

  // Metrics
  const totalRevenue = bills
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.paidAmount, 0);

  const pendingAmount = bills
    .filter(b => b.status === 'issued' || b.status === 'draft')
    .reduce((sum, b) => sum + (b.totalAmount - b.paidAmount), 0);

  const paidCount = bills.filter(b => b.status === 'paid').length;
  const issuedCount = bills.filter(b => b.status === 'issued').length;

  const filteredBills = bills.filter(bill => {
    const pat = patients.find(p => p.id === bill.patientId);
    const matchesSearch =
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pat?.name && pat.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Receipt Modal */}
      {selectedReceipt && (
        <BillReceiptModal bill={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Billing & Invoicing</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Patient claims, itemized invoicing, payment receipts and revenue tracking
          </p>
        </div>

        <button
          onClick={() => {
            setLineItems([{ itemType: 'consultation', description: 'Clinical Consultation', quantity: 1, unitPrice: 100.0 }]);
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Bill</span>
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border-l-4 border-emerald-600 shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-400">Total Revenue Collected</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Reconciled in system</span>
        </div>

        <div className="p-5 bg-white rounded-xl border-l-4 border-amber-500 shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-400">Outstanding Balance</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">${pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <span className="text-[11px] text-amber-600 font-medium">{issuedCount} Invoices unpaid</span>
        </div>

        <div className="p-5 bg-white rounded-xl border-l-4 border-blue-600 shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-400">Paid Invoices</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{paidCount}</p>
          <span className="text-[11px] text-blue-600 font-medium">Fully settled</span>
        </div>

        <div className="p-5 bg-white rounded-xl border-l-4 border-purple-600 shadow-xs">
          <p className="text-xs uppercase font-semibold text-slate-400">Total Invoices Issued</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{bills.length}</p>
          <span className="text-[11px] text-purple-600 font-medium">All accounts</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search invoice number or patient..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5" />
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="all">All Invoices</option>
            <option value="draft">Draft</option>
            <option value="issued">Issued / Unpaid</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-5 py-3.5">Patient Name</th>
                <th className="px-5 py-3.5">Date Issued</th>
                <th className="px-5 py-3.5">Items / Services</th>
                <th className="px-5 py-3.5">Total Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-xs">
                    No billing invoices match current criteria.
                  </td>
                </tr>
              ) : (
                filteredBills.map(bill => {
                  const pat = patients.find(p => p.id === bill.patientId);
                  const isPaid = bill.status === 'paid';

                  return (
                    <tr key={bill.id} className="hover:bg-indigo-50/20 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-slate-900">
                        {bill.billNumber}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 text-xs">{pat?.name || 'Walk-in'}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{pat?.id}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 font-mono">
                        {bill.createdAt.split('T')[0]}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600">
                        <span className="font-medium text-slate-800">{bill.items.length} line items</span>
                        <p className="text-[11px] text-slate-400 truncate max-w-44">
                          {bill.items.map(i => i.description).join(', ')}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-xs text-slate-900">
                        ${bill.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : bill.status === 'issued'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReceipt(bill)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                            title="View / Print Receipt"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                          {!isPaid && (
                            <button
                              onClick={() => {
                                setPayingBill(bill);
                                setPayAmount(bill.totalAmount - bill.paidAmount);
                                setPayMethod(bill.paymentMethod || 'card');
                              }}
                              className="px-3 py-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                            >
                              Collect Payment
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create New Bill Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-indigo-700 to-purple-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-indigo-300" />
                <h3 className="font-bold text-base">Generate Itemized Hospital Bill</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                  <select
                    value={newPatientId}
                    onChange={e => setNewPatientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Line items table */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Itemized Services & Charges
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {lineItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-12 sm:col-span-3">
                        <select
                          value={item.itemType}
                          onChange={e => handleLineItemChange(idx, 'itemType', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs rounded border border-slate-300 bg-white"
                        >
                          <option value="consultation">Consultation</option>
                          <option value="procedure">Procedure</option>
                          <option value="medicine">Medicine</option>
                          <option value="lab_test">Lab Test</option>
                          <option value="room_charge">Room Charge</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="col-span-12 sm:col-span-5">
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={e => handleLineItemChange(idx, 'description', e.target.value)}
                          placeholder="Description"
                          className="w-full px-2 py-1.5 text-xs rounded border border-slate-300 bg-white"
                        />
                      </div>
                      <div className="col-span-5 sm:col-span-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => handleLineItemChange(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                          placeholder="Qty"
                          className="w-full px-2 py-1.5 text-xs rounded border border-slate-300 bg-white"
                        />
                      </div>
                      <div className="col-span-5 sm:col-span-1">
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={e => handleLineItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          placeholder="$"
                          className="w-full px-2 py-1.5 text-xs rounded border border-slate-300 bg-white"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1 text-right">
                        {lineItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLineItem(idx)}
                            className="p-1 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Tax / Surcharge ($)</label>
                    <input
                      type="number"
                      value={newTax}
                      onChange={e => setNewTax(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Insurance / Discount ($)</label>
                    <input
                      type="number"
                      value={newDiscount}
                      onChange={e => setNewDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Calculated Total:</span>
                  <span className="text-base font-bold text-indigo-700">${totalCalc.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Invoice Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Terms, insurance authorization code, etc."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collect Payment Modal */}
      {payingBill && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in duration-150">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base">Collect Payment</h3>
              </div>
              <button
                onClick={() => setPayingBill(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
                <div>
                  <p className="font-mono font-bold text-emerald-950">{payingBill.billNumber}</p>
                  <p className="text-emerald-700 text-[11px]">Total due: ${payingBill.totalAmount.toFixed(2)}</p>
                </div>
                <span className="font-bold text-sm text-emerald-900">
                  Remaining: ${(payingBill.totalAmount - payingBill.paidAmount).toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount to Pay ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payAmount}
                  onChange={e => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="online">Online Wire Transfer</option>
                  <option value="insurance">Insurance Claim</option>
                  <option value="check">Check</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Notes / Auth Code</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={e => setPayNotes(e.target.value)}
                  placeholder="e.g. Card ending 4821, TxID #9910"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPayingBill(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
