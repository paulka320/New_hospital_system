import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  Search,
  Plus,
  Filter,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  XCircle,
  RotateCw,
  AlertTriangle,
  Calendar,
  X,
} from 'lucide-react';
import { Appointment, AppointmentStatus, AppointmentType } from '../../types';
import { useHospital } from '../../context/HospitalContext';

export const AppointmentsView: React.FC = () => {
  const {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    confirmAppointment,
    cancelAppointment,
    rescheduleAppointment,
    patients,
    doctors,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<'today' | 'upcoming' | 'all'>('today');

  // Modals
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newReschedDate, setNewReschedDate] = useState('2026-10-18');
  const [newReschedTime, setNewReschedTime] = useState('10:00');

  // New appointment form state
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    targetRole: 'doctor' as const,
    date: '2026-10-17',
    time: '09:00',
    appointmentType: 'consultation' as AppointmentType,
    status: 'scheduled' as AppointmentStatus,
    reason: '',
    notes: '',
  });

  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const todayStr = '2026-10-17';

  const handleOpenSchedule = () => {
    setFormData({
      patientId: patients[0]?.id || '',
      doctorId: doctors[0]?.id || '',
      targetRole: 'doctor',
      date: '2026-10-17',
      time: '09:00',
      appointmentType: 'consultation',
      status: 'scheduled',
      reason: '',
      notes: '',
    });
    setConflictWarning(null);
    setIsScheduleOpen(true);
  };

  const handleCheckAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check for scheduling conflict: same doctor at same date and time
    const conflict = appointments.find(
      a =>
        a.doctorId === formData.doctorId &&
        a.date === formData.date &&
        a.time === formData.time &&
        a.status !== 'cancelled'
    );

    if (conflict) {
      const conflictDoc = doctors.find(d => d.id === formData.doctorId);
      setConflictWarning(
        `Dr. ${conflictDoc?.name} already has an active appointment at ${formData.time} on ${formData.date}. Please pick an alternate time slot.`
      );
      return;
    }

    addAppointment(formData);
    setIsScheduleOpen(false);
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const pat = patients.find(p => p.id === apt.patientId);
      const doc = doctors.find(d => d.id === apt.doctorId);

      const matchesSearch =
        (pat?.name && pat.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc?.name && doc.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (apt.reason && apt.reason.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDoctor = selectedDoctorId === 'all' || apt.doctorId === selectedDoctorId;
      const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus;

      let matchesTab = true;
      if (selectedTab === 'today') {
        matchesTab = apt.date === todayStr;
      } else if (selectedTab === 'upcoming') {
        matchesTab = apt.date >= todayStr && apt.status !== 'cancelled' && apt.status !== 'completed';
      }

      return matchesSearch && matchesDoctor && matchesStatus && matchesTab;
    });
  }, [appointments, patients, doctors, searchQuery, selectedDoctorId, selectedStatus, selectedTab]);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Appointments</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage patient bookings, consultation schedules, and attendance states
          </p>
        </div>

        <button
          onClick={handleOpenSchedule}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Tabs & Filters bar */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setSelectedTab('today')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTab === 'today'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today's Schedule ({appointments.filter(a => a.date === todayStr).length})
            </button>
            <button
              onClick={() => setSelectedTab('upcoming')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTab === 'upcoming'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming Queue
            </button>
            <button
              onClick={() => setSelectedTab('all')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTab === 'all'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records ({appointments.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search patient, doctor, reason..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor:</span>
            <select
              value={selectedDoctorId}
              onChange={e => setSelectedDoctorId(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">All Doctors</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>Dr. {d.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rescheduled">Rescheduled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointment Cards / Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
              <tr>
                <th className="px-5 py-3.5">Schedule</th>
                <th className="px-5 py-3.5">Patient</th>
                <th className="px-5 py-3.5">Doctor & Specialty</th>
                <th className="px-5 py-3.5">Type & Reason</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-xs">
                    No appointments found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map(apt => {
                  const pat = patients.find(p => p.id === apt.patientId);
                  const doc = doctors.find(d => d.id === apt.doctorId);
                  const isToday = apt.date === todayStr;

                  return (
                    <tr key={apt.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                            {apt.time}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{apt.date}</p>
                            {isToday && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                TODAY
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 text-xs">{pat?.name || 'Unknown Patient'}</p>
                        <p className="text-[11px] text-slate-400">{pat?.phone}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 text-xs">Dr. {doc?.name || 'Unassigned'}</p>
                        <p className="text-[11px] text-indigo-600 font-medium">{doc?.specialization}</p>
                      </td>
                      <td className="px-5 py-4 text-xs">
                        <span className="capitalize font-semibold text-slate-700 px-2 py-0.5 rounded bg-slate-100 text-[11px]">
                          {apt.appointmentType.replace('_', ' ')}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1 max-w-xs truncate">
                          {apt.reason || 'General checkup'}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            apt.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : apt.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-800'
                              : apt.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : apt.status === 'rescheduled'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {apt.status.replace('_', ' ')}
                        </span>
                        {apt.cancelledReason && (
                          <p className="text-[10px] text-red-500 italic mt-0.5 truncate max-w-36">
                            {apt.cancelledReason}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status === 'scheduled' && (
                            <button
                              onClick={() => confirmAppointment(apt.id)}
                              className="px-2.5 py-1 text-xs rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition-colors"
                              title="Confirm appointment"
                            >
                              Confirm
                            </button>
                          )}
                          {apt.status === 'confirmed' && (
                            <button
                              onClick={() => updateAppointment(apt.id, { status: 'in_progress' })}
                              className="px-2.5 py-1 text-xs rounded bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold transition-colors"
                              title="Mark in progress"
                            >
                              Check-In
                            </button>
                          )}
                          {apt.status === 'in_progress' && (
                            <button
                              onClick={() => updateAppointment(apt.id, { status: 'completed' })}
                              className="px-2.5 py-1 text-xs rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold transition-colors"
                              title="Mark completed"
                            >
                              Complete
                            </button>
                          )}
                          {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                            <>
                              <button
                                onClick={() => {
                                  setRescheduleApt(apt);
                                  setNewReschedDate(apt.date);
                                  setNewReschedTime(apt.time);
                                }}
                                className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                                title="Reschedule appointment"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setCancelModalApt(apt);
                                  setCancelReason('');
                                }}
                                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100"
                                title="Cancel appointment"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
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

      {/* Book Appointment Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-indigo-700 to-purple-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-indigo-300" />
                <h3 className="font-bold text-base">Schedule Patient Appointment</h3>
              </div>
              <button
                onClick={() => setIsScheduleOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckAndSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {conflictWarning && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="font-medium">{conflictWarning}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                  <select
                    required
                    value={formData.patientId}
                    onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Doctor *</label>
                  <select
                    required
                    value={formData.doctorId}
                    onChange={e => {
                      setConflictWarning(null);
                      setFormData({ ...formData, doctorId: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>
                        Dr. {d.name} ({d.specialization}) {d.isAvailable ? '' : '[On Leave]'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => {
                      setConflictWarning(null);
                      setFormData({ ...formData, date: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot *</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={e => {
                      setConflictWarning(null);
                      setFormData({ ...formData, time: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Appointment Type</label>
                  <select
                    value={formData.appointmentType}
                    onChange={e => setFormData({ ...formData, appointmentType: e.target.value as AppointmentType })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow_up">Follow-up</option>
                    <option value="routine_check">Routine Check</option>
                    <option value="surgery">Surgery</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chief Reason for Consultation</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g. Chronic chest tightness, medication review"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any pre-consultation instructions or nurse remarks"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900">Reschedule Appointment</h3>
            <p className="text-xs text-slate-500">Pick a new date and time for this consultation.</p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">New Date</label>
                <input
                  type="date"
                  value={newReschedDate}
                  onChange={e => setNewReschedDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">New Time</label>
                <input
                  type="time"
                  value={newReschedTime}
                  onChange={e => setNewReschedTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setRescheduleApt(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  rescheduleAppointment(rescheduleApt.id, newReschedDate, newReschedTime);
                  setRescheduleApt(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
              >
                Save New Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Reason Modal */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900 text-red-600">Cancel Appointment</h3>
            <p className="text-xs text-slate-500">Please provide a cancellation reason for audit records.</p>
            <div>
              <textarea
                rows={3}
                required
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="e.g. Patient emergency, doctor unavailable, schedule conflict..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setCancelModalApt(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={() => {
                  cancelAppointment(cancelModalApt.id, cancelReason);
                  setCancelModalApt(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
