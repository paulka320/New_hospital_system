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
  Settings,
  ShieldAlert,
  Activity,
  HeartPulse,
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
  const { currentUser, notifications } = useHospital();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      section: 'main',
      roles: ['admin', 'doctor', 'receptionist', 'lab_technician', 'accountant', 'patient'],
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: Users,
      section: 'medical',
      roles: ['admin', 'doctor', 'receptionist', 'lab_technician', 'accountant'],
    },
    {
      id: 'doctors',
      label: 'Doctors',
      icon: Stethoscope,
      section: 'medical',
      roles: ['admin', 'doctor', 'receptionist'],
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: CalendarCheck,
      section: 'medical',
      roles: ['admin', 'doctor', 'receptionist', 'patient'],
    },
    {
      id: 'reception',
      label: 'Reception & Vitals',
      icon: UserCheck,
      section: 'clinical',
      roles: ['admin', 'receptionist', 'doctor'],
    },
    {
      id: 'laboratory',
      label: 'Laboratory',
      icon: FlaskConical,
      section: 'clinical',
      roles: ['admin', 'lab_technician', 'doctor'],
    },
    {
      id: 'billing',
      label: 'Billing & Invoices',
      icon: ReceiptText,
      section: 'finance',
      roles: ['admin', 'accountant', 'receptionist'],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
      section: 'settings',
      roles: ['admin', 'doctor', 'receptionist', 'lab_technician', 'accountant', 'patient'],
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-[#4f46e5] via-[#4338ca] to-[#3730a3] text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-6 border-b border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <HeartPulse className="w-6 h-6 text-red-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight">HMS MedCare</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  Live
                </span>
              </div>
              <p className="text-xs text-indigo-200 font-medium">Healthcare Management</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/80 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* User Card Summary in Sidebar */}
        <div className="px-5 py-4 mx-4 my-3 rounded-xl bg-white/10 border border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-200 text-indigo-900 font-bold flex items-center justify-center text-sm shadow">
              {currentUser.firstName[0]}
              {currentUser.lastName[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                <p className="text-[11px] text-indigo-200 capitalize font-medium truncate">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          <div>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-indigo-200/80 mb-2">
              Menu Navigation
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
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white/20 text-white shadow-sm border border-white/25 translate-x-1'
                        : 'text-indigo-100/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-200'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/15 text-xs text-indigo-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-300" />
            <span>Clinic Operational</span>
          </div>
          <span className="font-mono text-[11px] text-indigo-300">v1.2.0</span>
        </div>
      </aside>
    </>
  );
};
