import React, { useState } from 'react';
import {
  HeartPulse,
  Lock,
  User,
  Shield,
  Stethoscope,
  UserCheck,
  FlaskConical,
  Pill,
  ReceiptText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { UserRole } from '../../types';

export const LoginView: React.FC = () => {
  const { users, login } = useHospital();
  const [selectedUserId, setSelectedUserId] = useState<string>('user-reception');
  const [password, setPassword] = useState('password123');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedUserId);
  };

  const handleQuickLogin = (userId: string) => {
    login(userId);
  };

  const roleCardConfig: Record<
    UserRole,
    { label: string; roleDesc: string; icon: any; color: string; bg: string; border: string }
  > = {
    receptionist: {
      label: 'Reception Desk',
      roleDesc: 'Patient intake, booking, lobby queue & mandatory exit checkout',
      icon: UserCheck,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 hover:bg-emerald-100/80',
      border: 'border-emerald-200',
    },
    doctor: {
      label: 'Doctor Clinical',
      roleDesc: 'Consultations, accept/decline bookings, lab orders & prescriptions',
      icon: Stethoscope,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50 hover:bg-indigo-100/80',
      border: 'border-indigo-200',
    },
    lab_technician: {
      label: 'Laboratory',
      roleDesc: 'Accept/decline lab orders, pathology assays & diagnostic findings',
      icon: FlaskConical,
      color: 'text-purple-700',
      bg: 'bg-purple-50 hover:bg-purple-100/80',
      border: 'border-purple-200',
    },
    pharmacist: {
      label: 'Pharmacy',
      roleDesc: 'Prescription reviews, drug dispensation, inventory & medication costs',
      icon: Pill,
      color: 'text-teal-700',
      bg: 'bg-teal-50 hover:bg-teal-100/80',
      border: 'border-teal-200',
    },
    accountant: {
      label: 'Finance Personnel',
      roleDesc: 'Financial invoices, payment audits, revenue & accounts ledger',
      icon: ReceiptText,
      color: 'text-amber-700',
      bg: 'bg-amber-50 hover:bg-amber-100/80',
      border: 'border-amber-200',
    },
    admin: {
      label: 'Executive Admin',
      roleDesc: 'Summaries of all appointments, cancellation reasons, drug stocks & stats',
      icon: Shield,
      color: 'text-slate-800',
      bg: 'bg-slate-100 hover:bg-slate-200/80',
      border: 'border-slate-300',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 grid grid-cols-1 lg:grid-cols-12 relative z-10">
        {/* Left Side: Brand & Quick Role Access */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 bg-slate-50/70 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col justify-between">
          <div>
            {/* Header Brand */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <HeartPulse className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">HMS MedCare</h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                    Hospital Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Healthcare Information & Clinical Workflow System</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900">Select Department Portal to Enter</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Each personnel role has strict dashboard segregation and tailored clinical permissions.
              </p>
            </div>

            {/* Quick Login Role Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {users.map(u => {
                const conf = roleCardConfig[u.role] || roleCardConfig.admin;
                const Icon = conf.icon;
                const isSelected = selectedUserId === u.id;

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setSelectedUserId(u.id);
                      handleQuickLogin(u.id);
                    }}
                    className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-md'
                        : `${conf.bg} ${conf.border}`
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-xl bg-white shadow-xs ${conf.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border ${conf.border} ${conf.color}`}>
                          {conf.label}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                        {conf.roleDesc}
                      </p>
                    </div>

                    <div className="pt-2.5 mt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-semibold text-indigo-600">
                      <span>Launch Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Role-Based Access Control Active
            </span>
            <span>Hospital OS v2.4</span>
          </div>
        </div>

        {/* Right Side: Direct Credential Sign-in Form */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="mb-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Staff Account Sign-in</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials or use the one-click department buttons on the left.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Select Active User Account</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={selectedUserId}
                    onChange={e => setSelectedUserId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-800"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.firstName} {u.lastName} ({u.role.replace('_', ' ').toUpperCase()} • {u.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter security password"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Default demo access password is pre-filled.</p>
              </div>

              <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  Active Clinical Rules Enforced:
                </p>
                <ul className="list-disc list-inside text-indigo-700 space-y-0.5 text-[10px]">
                  <li>Receptionist manages bookings, triage, and mandatory checkout bill</li>
                  <li>Doctors, Lab & Pharmacy can Accept or Decline with audit reasons</li>
                  <li>Patients cannot leave without mandatory checkout settlement</li>
                  <li>Admin oversees all cancellations, inventory, labs & finances</li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Authorize & Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-[11px] text-slate-400">
            HMS MedCare Clinical Information Network • Authorized Hospital Personnel Only
          </div>
        </div>
      </div>
    </div>
  );
};
