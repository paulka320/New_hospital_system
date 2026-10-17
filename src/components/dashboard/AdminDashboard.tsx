import React, { useState } from 'react';
import {
  Shield,
  CalendarX2,
  Pill,
  Users,
  Stethoscope,
  FlaskConical,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  FileText,
  Clock,
  ArrowUpRight,
  Package,
  UserPlus,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { StaffManagementSection } from './StaffManagementSection';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    doctors,
    patients,
    appointments,
    labTests,
    prescriptions,
    drugs,
    bills,
    visits,
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'cancellations' | 'drugs' | 'finance'>('overview');

  // Metrics
  const totalDoctors = doctors.length;
  const totalStaff = users.length;
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const totalLabsDone = labTests.filter(l => l.completed).length;
  const totalLabsPending = labTests.filter(l => !l.completed).length;
  const totalDrugsInStock = drugs.reduce((sum, d) => sum + d.stockQuantity, 0);
  const lowStockDrugs = drugs.filter(d => d.stockQuantity <= d.reorderLevel);

  // Cancellations & declines
  const cancelledOrDeclinedAppointments = appointments.filter(
    a => a.status === 'cancelled' || a.responseStatus === 'declined'
  );

  // Financial calculations
  const totalRevenue = bills
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.paidAmount, 0);
  const outstandingRevenue = bills
    .filter(b => b.status === 'issued')
    .reduce((sum, b) => sum + (b.totalAmount - b.paidAmount), 0);

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500/10 transform skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4 text-indigo-400" />
              Executive Administrator Oversight
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hospital Master Operations Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Complete cross-departmental executive audit: appointment rosters, cancellation reasons, pharmacy drug formulary inventory, laboratory diagnostics, and financial cashflow.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs font-semibold text-white">All 6 Hospital Units Active</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Doctors On Staff</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalDoctors}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">{doctors.filter(d => d.isAvailable).length} Available</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Census</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalPatients}</p>
          <span className="text-[11px] text-indigo-600 font-semibold">Active EMR files</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalAppointments}</p>
          <span className="text-[11px] text-amber-600 font-semibold">
            {cancelledOrDeclinedAppointments.length} Cancelled/Declined
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lab Assays Done</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalLabsDone}</p>
          <span className="text-[11px] text-purple-600 font-semibold">{totalLabsPending} in queue</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drugs In Stock</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalDrugsInStock}</p>
          <span className={`text-[11px] font-semibold ${lowStockDrugs.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {lowStockDrugs.length > 0 ? `${lowStockDrugs.length} Low stock!` : 'Formulary healthy'}
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue Collected</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">${totalRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500 font-semibold">${outstandingRevenue.toLocaleString()} pending</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Admin Deep Dive */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-4 shadow-xs overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3.5 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Operational Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`py-3.5 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'staff'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-600" />
          <span>Staff & Doctors Management ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cancellations')}
          className={`py-3.5 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'cancellations'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CalendarX2 className="w-4 h-4 text-red-500" />
          <span>Declined & Cancelled Log ({cancelledOrDeclinedAppointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('drugs')}
          className={`py-3.5 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'drugs'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Pill className="w-4 h-4 text-teal-600" />
          <span>Pharmacy Drug Formulary & Stocks ({drugs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`py-3.5 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'finance'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4 text-amber-600" />
          <span>Hospital Billing & Revenue</span>
        </button>
      </div>

      {/* SECTION: STAFF & DOCTORS MANAGEMENT */}
      {activeTab === 'staff' && <StaffManagementSection />}

      {/* SECTION 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Appointments & Status */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Latest Hospital Appointments Roster
              </h3>
              <span className="text-xs font-semibold text-slate-400">Real-time status</span>
            </div>

            <div className="divide-y divide-slate-100">
              {appointments.slice(0, 6).map(apt => {
                const pat = patients.find(p => p.id === apt.patientId);
                const doc = doctors.find(d => d.id === apt.doctorId);
                return (
                  <div key={apt.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{pat?.name || 'Patient'}</p>
                      <p className="text-slate-500">
                        Dr. {doc?.name || apt.targetPersonnelName || 'Staff'} • {apt.date} at {apt.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        apt.responseStatus === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.responseStatus === 'declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {apt.responseStatus || apt.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Laboratory Diagnostic Activity Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-600" />
                Diagnostic Laboratory Test Summary
              </h3>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                {labTests.length} Total Assays
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {labTests.map(test => {
                const pat = patients.find(p => p.id === test.patientId);
                return (
                  <div key={test.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold uppercase text-purple-900 text-[11px]">
                          {test.testType} Test
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="font-semibold text-slate-700">{pat?.name}</span>
                      </div>
                      <p className="text-slate-500 mt-1 line-clamp-1">
                        {test.result || 'Specimen processing in laboratory'}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      test.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {test.completed ? 'Done' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: AUDIT OF DECLINED & CANCELLED APPOINTMENTS WITH REASONS */}
      {activeTab === 'cancellations' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-red-50/40 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-red-950 flex items-center gap-2">
                <CalendarX2 className="w-5 h-5 text-red-600" />
                Audit Log of Cancelled & Declined Appointments
              </h3>
              <p className="text-xs text-red-700 mt-0.5">
                Full transparency log showing reasons provided by doctors, lab attendants, or pharmacists when declining appointments.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-bold text-xs">
              {cancelledOrDeclinedAppointments.length} Total Declines
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <tr>
                  <th className="px-6 py-4">Scheduled Date</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Target Personnel</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Declined By</th>
                  <th className="px-6 py-4">Decline / Cancellation Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {cancelledOrDeclinedAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No cancelled or declined appointments on record.
                    </td>
                  </tr>
                ) : (
                  cancelledOrDeclinedAppointments.map(apt => {
                    const pat = patients.find(p => p.id === apt.patientId);
                    const doc = doctors.find(d => d.id === apt.doctorId);
                    const reason = apt.declineReason || apt.cancelledReason || 'Staff conflict / emergency';

                    return (
                      <tr key={apt.id} className="hover:bg-red-50/20 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-800">
                          {apt.date} • {apt.time}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {pat?.name || 'Unknown Patient'}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          Dr. {doc?.name || apt.targetPersonnelName || 'Staff'}
                        </td>
                        <td className="px-6 py-4 capitalize">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                            {apt.appointmentType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-red-700">
                          {apt.declinedBy || `Dr. ${doc?.name || 'Staff'}`}
                        </td>
                        <td className="px-6 py-4 max-w-md">
                          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900 font-medium leading-relaxed">
                            "{reason}"
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
      )}

      {/* SECTION 3: PHARMACY DRUG FORMULARY SUMMARY */}
      {activeTab === 'drugs' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                Hospital Pharmacy Formulary & Inventory Summary
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current drug stocks, unit costs, low-inventory alerts and expiration dates
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-teal-50 text-teal-800 font-bold text-xs rounded-full border border-teal-200">
                {drugs.length} Medications Monitored
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <tr>
                  <th className="px-6 py-4">Medication Name</th>
                  <th className="px-6 py-4">Therapeutic Class</th>
                  <th className="px-6 py-4">Form & Strength</th>
                  <th className="px-6 py-4 text-center">In Stock</th>
                  <th className="px-6 py-4">Reorder Level</th>
                  <th className="px-6 py-4 text-right">Unit Price</th>
                  <th className="px-6 py-4">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {drugs.map(drug => {
                  const isLow = drug.stockQuantity <= drug.reorderLevel;
                  return (
                    <tr key={drug.id} className="hover:bg-teal-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{drug.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{drug.genericName} • {drug.manufacturer}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {drug.category}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {drug.dosageForm} ({drug.strength})
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-slate-900 text-sm">
                        {drug.stockQuantity}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500">
                        Min {drug.reorderLevel}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                        ${drug.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            isLow
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isLow ? 'Low Stock Alert' : 'In Stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: BILLING & REVENUE OVERVIEW */}
      {activeTab === 'finance' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-600" />
                Hospital Financial Invoicing & Cashflow
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Full ledger of patient receipts, mandatory checkout settlements and accounts receivable
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                ${(totalRevenue ?? 0).toFixed(2)} Collected
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <tr>
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Itemized Breakdown</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {bills.map(bill => {
                  const pat = patients.find(p => p.id === bill.patientId);
                  return (
                    <tr key={bill.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">{bill.billNumber}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{pat?.name || 'Walk-in'}</td>
                      <td className="px-6 py-4 font-mono text-slate-500">{bill.createdAt.split('T')[0]}</td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                        {bill.items.map(i => i.description).join('; ')}
                      </td>
                      <td className="px-6 py-4 capitalize font-medium">{bill.paymentMethod || 'Pending'}</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                        ${(bill.totalAmount ?? 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          bill.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {bill.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
