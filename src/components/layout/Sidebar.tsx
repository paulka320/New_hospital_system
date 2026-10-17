import React from 'react';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarCheck,
  UserCheck,
  FlaskConical,
  ReceiptText,
  Bell,
  HeartPulse,
  Activity,
  LogOut,
  Pill,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpen,
  setIsOpen,
}) => {
  const { currentUser, notifications, logout } = useHospital();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Strict role isolation:
  // - Receptionist CANNOT view doctor, lab, finance, admin dashboards!
  const navItems = [
    {
      id: 'dashboard',
      label:
        currentUser.role === 'admin'
          ? 'Master Operations'
          : currentUser.role === 'receptionist'
          ? 'Reception Desk'
          : currentUser.role === 'doctor'
          ? 'Clinical Practice'
          : currentUser.role === 'lab_technician'
          ? 'Lab Diagnostics'
          : currentUser.role === 'pharmacist'
          ? 'Pharmacy Dispense'
          : currentUser.role === 'accountant'
          ? 'Finance Ledger'
          : 'Console',
      icon:
        currentUser.role === 'doctor'
          ? Stethoscope
          : currentUser.role === 'receptionist'
          ? UserCheck
          : currentUser.role === 'lab_technician'
          ? FlaskConical
          : currentUser.role === 'pharmacist'
          ? Pill
          : currentUser.role === 'accountant'
          ? ReceiptText
          : LayoutDashboard,
      roles: ['admin', 'doctor', 'receptionist', 'lab_technician', 'pharmacist', 'accountant'],
    },
    {
      id: 'patients',
      label: 'Patient Directory',
      icon: Users,
      roles: ['admin', 'receptionist', 'doctor'],
    },
    {
      id: 'doctors',
      label: 'Physicians & Staff',
      icon: Stethoscope,
      roles: ['admin'],
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: CalendarCheck,
      roles: ['admin', 'doctor'],
    },
    {
      id: 'reception',
      label: 'Reception & Triage',
      icon: UserCheck,
      roles: ['admin'],
    },
    {
      id: 'laboratory',
      label: 'Diagnostic Lab',
      icon: FlaskConical,
      roles: ['admin'],
    },
    {
      id: 'billing',
      label: 'Billing & Invoices',
      icon: ReceiptText,
      roles: ['admin', 'accountant'],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
      roles: ['admin', 'doctor', 'receptionist', 'lab_technician', 'pharmacist', 'accountant'],
    },
  ];

  const allowedNavItems = navItems.filter(item =>
    item.roles.includes(currentUser.role)
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-[#312e81] via-[#1e1b4b] to-[#0f172a] text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight">HMS MedCare</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-indigo-300 font-medium capitalize">
                {currentUser.role.replace('_', ' ')} Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/80 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Current User Card */}
        <div className="px-5 py-4 mx-4 my-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-400 to-purple-500 text-slate-950 font-black flex items-center justify-center text-sm shadow">
              {currentUser.firstName[0]}
              {currentUser.lastName[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-[11px] text-indigo-300 font-medium capitalize truncate">
                {currentUser.department} Dept
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-indigo-300/60 mb-2">
              Assigned Modules
            </p>
            <nav className="space-y-1">
              {allowedNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md border border-white/20 translate-x-1'
                        : 'text-indigo-200/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-300'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Logout button at bottom of sidebar */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
};
