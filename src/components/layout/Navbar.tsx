import React, { useState } from 'react';
import {
  Menu,
  Bell,
  RotateCcw,
  User,
  Shield,
  ChevronDown,
  Check,
  Stethoscope,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

interface NavbarProps {
  currentTab: string;
  onOpenSidebar: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenSidebar,
  onOpenNotifications,
}) => {
  const { currentUser, users, switchUser, notifications, resetToDemoData } = useHospital();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Operational Dashboard', subtitle: 'Real-time hospital metrics & clinic activity' },
    patients: { title: 'Patient Registry', subtitle: 'Electronic health records, demographics & histories' },
    doctors: { title: 'Medical Staff & Specialists', subtitle: 'Doctor schedules, credentials and reviews' },
    appointments: { title: 'Clinical Appointments', subtitle: 'Consultation scheduling and status workflow' },
    reception: { title: 'Reception & Triage Queue', subtitle: 'Patient check-in desk and vital sign monitoring' },
    laboratory: { title: 'Diagnostic Laboratory', subtitle: 'Specimen orders, pathology and test results' },
    billing: { title: 'Invoicing & Financial Billing', subtitle: 'Patient bills, itemized invoices & payment collection' },
    notifications: { title: 'System Notifications', subtitle: 'Clinical alerts, reminders & updates' },
  };

  const currentInfo = tabTitles[currentTab] || { title: 'Hospital Management', subtitle: 'Healthcare System' };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      <div className="px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left side: Hamburger & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight truncate">
              {currentInfo.title}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block truncate">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right side: Role Switcher, Reset, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher (Crucial for testing all roles in Django app) */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
              title="Switch user role to experience doctor, receptionist, accountant or lab tech views"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline text-slate-500 font-normal">Role:</span>
              <span className="capitalize font-bold">{currentUser.role.replace('_', ' ')}</span>
              <ChevronDown className="w-3 h-3 text-indigo-500" />
            </button>

            {roleMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-700">Switch System Account</p>
                    <p className="text-[11px] text-slate-400">Preview role-specific access and permissions</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {users.map(u => {
                      const isCurrent = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-slate-50 ${
                            isCurrent ? 'bg-indigo-50/70 text-indigo-900 font-medium' : 'text-slate-700'
                          }`}
                        >
                          <div>
                            <p className="font-semibold">{u.firstName} {u.lastName}</p>
                            <p className="text-[11px] text-slate-400 capitalize">
                              {u.role.replace('_', ' ')} • {u.department}
                            </p>
                          </div>
                          {isCurrent && <Check className="w-4 h-4 text-indigo-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Reset Demo Data button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all hospital records to default initial state?')) {
                resetToDemoData();
              }
            }}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset to fresh demo data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="System notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Avatar badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {currentUser.firstName[0]}
              {currentUser.lastName[0]}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-[10px] text-slate-400 font-medium capitalize">
                {currentUser.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
