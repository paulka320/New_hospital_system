import React, { useState } from 'react';
import {
  Menu,
  Bell,
  RotateCcw,
  LogOut,
  Shield,
  ChevronDown,
  Check,
  Stethoscope,
  UserCheck,
  FlaskConical,
  Pill,
  ReceiptText,
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
  const { currentUser, users, switchUser, notifications, logout, resetToDemoData } = useHospital();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getRoleHeader = () => {
    switch (currentUser.role) {
      case 'receptionist':
        return {
          title: 'Receptionist Front Desk Console',
          subtitle: 'Patient intake, staff appointment dispatching & mandatory exit billing',
        };
      case 'doctor':
        return {
          title: 'Physician Clinical Workbench',
          subtitle: 'Patient examinations, booking accept/decline, diagnostic orders & prescriptions',
        };
      case 'lab_technician':
        return {
          title: 'Clinical Diagnostics Laboratory',
          subtitle: 'Pathology testing queue, specimen acceptance & findings delivery',
        };
      case 'pharmacist':
        return {
          title: 'Hospital Pharmacy Dispensary',
          subtitle: 'Prescription fulfillment, formulary inventory & drug dispensation',
        };
      case 'accountant':
        return {
          title: 'Finance & Accounts Ledger',
          subtitle: 'Receivables, hospital invoice audits & payment reconciliation',
        };
      case 'admin':
        return {
          title: 'Executive Hospital Administrator',
          subtitle: 'Master operational audit, decline reasons, drug stocks & facility metrics',
        };
      default:
        return {
          title: 'Hospital Management System',
          subtitle: 'Healthcare Clinical & Administrative Portal',
        };
    }
  };

  const headerInfo = getRoleHeader();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      <div className="px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left side: Hamburger & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
              {headerInfo.title}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block truncate">
              {headerInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right side: Switch role, Notifications, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Department Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
              title="Switch department portal"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline font-medium text-slate-500">Department:</span>
              <span className="capitalize">{currentUser.role.replace('_', ' ')}</span>
              <ChevronDown className="w-3 h-3 text-indigo-500" />
            </button>

            {roleMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Switch Department Staff</p>
                    <p className="text-[11px] text-slate-400">Preview isolated dashboards for each hospital unit</p>
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
                          className={`w-full px-3.5 py-2 text-left flex items-center justify-between text-xs hover:bg-slate-50 ${
                            isCurrent ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-slate-700'
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
              if (window.confirm('Reset all hospital patient journeys, pharmacy stock, and records?')) {
                resetToDemoData();
              }
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Reset to fresh demo clinical state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Hospital notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors cursor-pointer"
            title="Sign out of hospital portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
