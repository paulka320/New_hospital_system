import React, { useState } from 'react';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  FlaskConical,
  Receipt,
  Pill,
  Settings,
  Mail,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { Notification, NotificationType } from '../../types';
import { useHospital } from '../../context/HospitalContext';

interface NotificationsModalProps {
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onClose }) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
    notificationPreferences,
    updateNotificationPreferences,
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences'>('notifications');

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'appointment_reminder':
      case 'appointment_confirmed':
      case 'appointment_cancelled':
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      case 'lab_result_ready':
        return <FlaskConical className="w-4 h-4 text-purple-600" />;
      case 'prescription_filled':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'bill_issued':
      case 'payment_received':
        return <Receipt className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-300" />
            <h3 className="font-bold text-base">System Notifications & Alerts</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 text-xs">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'notifications'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'preferences'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Delivery Preferences</span>
          </button>
        </div>

        {/* Tab 1: Notifications List */}
        {activeTab === 'notifications' && (
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Live clinical event feed</span>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold text-xs"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-slate-400 hover:text-red-600 text-xs"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {notifications.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No notifications in your inbox.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-3.5 rounded-xl border transition-colors flex items-start justify-between gap-3 ${
                      notif.isRead
                        ? 'bg-white border-slate-200'
                        : 'bg-indigo-50/50 border-indigo-200/80 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                        {getIcon(notif.notificationType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-xs">{notif.title}</h4>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
                          )}
                        </div>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {notif.createdAt.split('T')[0]}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!notif.isRead && (
                        <button
                          onClick={() => markNotificationRead(notif.id)}
                          className="p-1 text-slate-400 hover:text-indigo-600"
                          title="Mark read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="p-1 text-slate-400 hover:text-red-600"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Preferences */}
        {activeTab === 'preferences' && (
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Communication Channels</h4>
              <p className="text-slate-500 mb-3">Choose how clinic alerts and updates reach you.</p>

              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>Email Notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPreferences.emailNotifications}
                    onChange={e => updateNotificationPreferences({ emailNotifications: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>SMS / Text Alerts</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPreferences.smsNotifications}
                    onChange={e => updateNotificationPreferences({ smsNotifications: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Bell className="w-4 h-4 text-purple-600" />
                    <span>Push Desktop Notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPreferences.pushNotifications}
                    onChange={e => updateNotificationPreferences({ pushNotifications: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Event Categories</h4>
              <p className="text-slate-500 mb-3">Select the types of alerts you want to receive.</p>

              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Appointment Reminders & Status Changes</span>
                  <input
                    type="checkbox"
                    checked={notificationPreferences.appointmentReminders}
                    onChange={e => updateNotificationPreferences({ appointmentReminders: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200/60">
                  <span>Laboratory Test Completion Results</span>
                  <input
                    type="checkbox"
                    checked={notificationPreferences.labResults}
                    onChange={e => updateNotificationPreferences({ labResults: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200/60">
                  <span>Billing Invoices & Payment Confirmations</span>
                  <input
                    type="checkbox"
                    checked={notificationPreferences.billingAlerts}
                    onChange={e => updateNotificationPreferences({ billingAlerts: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200/60">
                  <span>Prescription Dispensation Alerts</span>
                  <input
                    type="checkbox"
                    checked={notificationPreferences.prescriptionAlerts}
                    onChange={e => updateNotificationPreferences({ prescriptionAlerts: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
