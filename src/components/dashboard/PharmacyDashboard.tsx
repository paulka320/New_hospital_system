import React, { useState } from 'react';
import {
  Pill,
  Package,
  Check,
  X,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Prescription, PharmacyDrug } from '../../types';

export const PharmacyDashboard: React.FC = () => {
  const {
    prescriptions,
    acceptPrescription,
    declinePrescription,
    dispensePrescription,
    drugs,
    updateDrugStock,
    addDrug,
    patients,
    doctors,
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'prescriptions' | 'inventory'>('prescriptions');
  const [decliningRx, setDecliningRx] = useState<Prescription | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  // Drug inventory search & add modal
  const [searchDrug, setSearchDrug] = useState('');
  const [isAddDrugOpen, setIsAddDrugOpen] = useState(false);
  const [newDrugData, setNewDrugData] = useState({
    name: '',
    genericName: '',
    category: 'Antibiotics',
    dosageForm: 'Tablet',
    strength: '500mg',
    stockQuantity: 100,
    reorderLevel: 25,
    unitPrice: 15.0,
    expiryDate: '2028-01-01',
    manufacturer: 'Pfizer Labs',
  });

  const pendingRx = prescriptions.filter(p => p.status === 'active' && p.responseStatus !== 'declined');
  const dispensedRx = prescriptions.filter(p => p.status === 'filled');

  const handleDeclineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decliningRx || !declineReason) return;
    declinePrescription(decliningRx.id, declineReason);
    setDecliningRx(null);
    setDeclineReason('');
  };

  const handleDispense = (rx: Prescription) => {
    // Find matching drug to decrement stock
    const matchingDrug = drugs.find(d => d.id === rx.drugId || d.name.toLowerCase().includes(rx.medicineName.toLowerCase()));
    dispensePrescription(rx.id, matchingDrug?.id);
    alert(`Medication dispensed to patient! Patient routed to Reception for mandatory payment checkout upon exit.`);
  };

  const handleAddDrugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDrug(newDrugData);
    setIsAddDrugOpen(false);
  };

  const filteredDrugs = drugs.filter(
    d =>
      d.name.toLowerCase().includes(searchDrug.toLowerCase()) ||
      d.genericName.toLowerCase().includes(searchDrug.toLowerCase()) ||
      d.category.toLowerCase().includes(searchDrug.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl font-bold shadow-inner">
              <Pill className="w-7 h-7 text-teal-200" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-teal-200 tracking-wider">
                Hospital Pharmacy & Dispensary
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Pharmacist Dispensation Console
              </h2>
              <p className="text-xs text-teal-100 mt-0.5">
                Review physician prescriptions, accept or decline orders, manage drug stock, and dispense medications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm border border-white/20">
              {pendingRx.length} Prescriptions Pending Dispensation
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-4 shadow-xs overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`py-3.5 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'prescriptions' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Prescriptions Queue ({pendingRx.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-3.5 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'inventory' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500'
          }`}
        >
          <Package className="w-4 h-4 text-teal-600" />
          <span>Formulary & Drug Stocks ({drugs.length})</span>
        </button>
      </div>

      {/* TAB 1: PRESCRIPTIONS QUEUE */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-teal-600" />
                  Prescriptions Received From Physicians
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify dosage instructions, check inventory, accept/decline, and dispense medication.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700">
                {pendingRx.length} To Dispense
              </span>
            </div>

            {pendingRx.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
                No pending prescriptions in pharmacy queue.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRx.map(rx => {
                  const pat = patients.find(p => p.id === rx.patientId);
                  const doc = doctors.find(d => d.id === rx.doctorId);
                  const matchingDrug = drugs.find(d => d.id === rx.drugId || d.name.toLowerCase().includes(rx.medicineName.toLowerCase()));
                  const inStock = matchingDrug ? matchingDrug.stockQuantity > 0 : true;

                  return (
                    <div
                      key={rx.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-base">{rx.medicineName}</span>
                          <span className="font-mono font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                            {rx.dosage} {rx.dosageUnit}
                          </span>
                          <span className="font-semibold text-slate-500">for {pat?.name}</span>
                        </div>
                        <p className="text-slate-600 mt-1">
                          Frequency: <strong>{rx.frequency}</strong> • Duration: <strong>{rx.durationDays} days</strong>
                        </p>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Prescribed by Dr. {doc?.name || 'Staff'} • Cost: <strong className="text-teal-700">${(rx.cost ?? 0).toFixed(2)}</strong>
                        </p>
                        {rx.instructions && (
                          <p className="text-slate-600 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                            Instructions: "{rx.instructions}"
                          </p>
                        )}
                        {matchingDrug && (
                          <p className={`text-[11px] font-bold mt-1.5 ${matchingDrug.stockQuantity < 20 ? 'text-red-600' : 'text-emerald-700'}`}>
                            Inventory Stock: {matchingDrug.stockQuantity} units available in pharmacy
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {inStock ? (
                          <button
                            onClick={() => handleDispense(rx)}
                            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>Dispense & Route to Reception Checkout</span>
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 bg-red-100 text-red-800 font-bold rounded-xl text-xs">
                            Out of Stock!
                          </span>
                        )}

                        <button
                          onClick={() => {
                            setDecliningRx(rx);
                            setDeclineReason('');
                          }}
                          className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dispensed History */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Recent Dispensations
            </h3>
            <div className="space-y-2 text-xs">
              {dispensedRx.map(rx => {
                const pat = patients.find(p => p.id === rx.patientId);
                return (
                  <div key={rx.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">{rx.medicineName} ({rx.dosage}{rx.dosageUnit})</p>
                      <p className="text-slate-500 text-[11px]">Patient: {pat?.name} • Dispensed by {rx.dispensedBy || 'Pharmacist'}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px] rounded-full">
                      Dispensed
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DRUG INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-600" />
                Hospital Pharmacy Formulary & Stock Levels
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage medications, track reorder thresholds, and replenish drug inventories.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchDrug}
                  onChange={e => setSearchDrug(e.target.value)}
                  placeholder="Search drug..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <button
                onClick={() => setIsAddDrugOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Drug</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <tr>
                  <th className="px-5 py-3.5">Medication</th>
                  <th className="px-5 py-3.5">Class</th>
                  <th className="px-5 py-3.5">Strength</th>
                  <th className="px-5 py-3.5 text-center">Stock</th>
                  <th className="px-5 py-3.5 text-right">Unit Price</th>
                  <th className="px-5 py-3.5 text-right">Quick Replenish</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredDrugs.map(d => {
                  const isLow = d.stockQuantity <= d.reorderLevel;
                  return (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">{d.name}</p>
                        <p className="text-[11px] text-slate-400">{d.genericName} • {d.manufacturer}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium">{d.category}</td>
                      <td className="px-5 py-4 text-slate-700">{d.dosageForm} ({d.strength})</td>
                      <td className="px-5 py-4 text-center font-mono font-bold text-slate-900">
                        <span className={`px-2 py-0.5 rounded ${isLow ? 'bg-red-100 text-red-800' : 'bg-slate-100'}`}>
                          {d.stockQuantity}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-slate-900">
                        ${(d.unitPrice ?? 0).toFixed(2)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => updateDrugStock(d.id, 20)}
                            className="px-2 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px]"
                            title="Add 20 units"
                          >
                            +20
                          </button>
                          <button
                            onClick={() => updateDrugStock(d.id, 50)}
                            className="px-2 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px]"
                            title="Add 50 units"
                          >
                            +50
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Decline Dialog */}
      {decliningRx && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in duration-150 text-xs">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Decline Prescription Dispensation</h3>
            </div>
            <p className="text-slate-500">
              Specify reason for declining (e.g. out of stock, drug-allergy contraindication). The prescribing doctor will be notified.
            </p>
            <form onSubmit={handleDeclineSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Decline Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)}
                  placeholder="e.g. Severe cross-reactivity with recorded allergy, or medication stock exhausted..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDecliningRx(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-xs"
                >
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Drug Modal */}
      {isAddDrugOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="bg-gradient-to-r from-teal-800 to-indigo-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-200" />
                <h3 className="font-bold text-base">Add Medication to Formulary</h3>
              </div>
              <button
                onClick={() => setIsAddDrugOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDrugSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={newDrugData.name}
                    onChange={e => setNewDrugData({ ...newDrugData, name: e.target.value })}
                    placeholder="e.g. Ciprofloxacin"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Generic Name</label>
                  <input
                    type="text"
                    value={newDrugData.genericName}
                    onChange={e => setNewDrugData({ ...newDrugData, genericName: e.target.value })}
                    placeholder="e.g. Ciprofloxacin HCl"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={newDrugData.category}
                    onChange={e => setNewDrugData({ ...newDrugData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Form</label>
                  <input
                    type="text"
                    value={newDrugData.dosageForm}
                    onChange={e => setNewDrugData({ ...newDrugData, dosageForm: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Strength</label>
                  <input
                    type="text"
                    value={newDrugData.strength}
                    onChange={e => setNewDrugData({ ...newDrugData, strength: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    value={newDrugData.stockQuantity}
                    onChange={e => setNewDrugData({ ...newDrugData, stockQuantity: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newDrugData.unitPrice}
                    onChange={e => setNewDrugData({ ...newDrugData, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDrugOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs"
                >
                  Save Drug
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
