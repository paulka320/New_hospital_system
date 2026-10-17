import React from 'react';
import {
  Users,
  Stethoscope,
  CalendarCheck,
  Clock,
  PlusCircle,
  FlaskConical,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  TrendingUp,
  FileText,
  UserCheck,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenNewPatient: () => void;
  onOpenNewAppointment: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewPatient,
  onOpenNewAppointment,
}) => {
  const {
    currentUser,
    patients,
    doctors,
    appointments,
    visits,
    labTests,
    bills,
  } = useHospital();

  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;

  const todayStr = '2026-10-17'; // current simulated system date
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const pendingAppointments = appointments.filter(a => a.status === 'scheduled');
  const activeVisits = visits.filter(v => v.status === 'waiting' || v.status === 'in_progress');
  const pendingLabs = labTests.filter(t => !t.completed);

  // Financial calculation
  const totalRevenue = bills
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.paidAmount, 0);
  const unpaidBills = bills.filter(b => b.status === 'issued' || b.status === 'draft');
  const unpaidAmount = unpaidBills.reduce((sum, b) => sum + (b.totalAmount - b.paidAmount), 0);

  // Doctor specific
  const currentDoctor = doctors.find(d => d.id === currentUser.doctorId);
  const myAppointments = currentDoctor
    ? appointments.filter(a => a.doctorId === currentDoctor.id)
    : [];
  const myTodayAppointments = myAppointments.filter(a => a.date === todayStr);

  return (
    <div className="space-y-6">
      {/* Banner / Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold tracking-wider uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Hospital Management System
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.firstName} {currentUser.lastName}
            </h2>
            <p className="text-sm text-indigo-100/90 mt-1 max-w-xl">
              {currentUser.role === 'doctor' &&
                `You have ${myTodayAppointments.length} patient consultation${myTodayAppointments.length === 1 ? '' : 's'} scheduled for today.`}
              {currentUser.role === 'receptionist' &&
                `Reception is active with ${todayAppointments.length} appointment${todayAppointments.length === 1 ? '' : 's'} on schedule and ${activeVisits.length} patient${activeVisits.length === 1 ? '' : 's'} in clinic queue.`}
              {currentUser.role === 'lab_technician' &&
                `Laboratory has ${pendingLabs.length} diagnostic test request${pendingLabs.length === 1 ? '' : 's'} awaiting assay and completion.`}
              {currentUser.role === 'accountant' &&
                `Finance overview: $${totalRevenue.toLocaleString()} collected revenue with ${unpaidBills.length} pending invoice${unpaidBills.length === 1 ? '' : 's'}.`}
              {currentUser.role === 'admin' &&
                `Overview of clinic operations, patient census, doctors on duty, and clinical appointments.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenNewPatient}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-semibold text-xs shadow-md hover:bg-indigo-50 transition-all hover:scale-102"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>Register Patient</span>
            </button>
            <button
              onClick={onOpenNewAppointment}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/30 backdrop-blur-md text-white font-semibold text-xs border border-white/20 hover:bg-indigo-500/40 transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Stats - styled with base.html stat-card style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1: Patients */}
        <div
          onClick={() => onNavigate('patients')}
          className="bg-white rounded-xl p-5 shadow-xs border-l-4 border-indigo-600 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Patients</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900">{totalPatients}</h3>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              Active registry <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Stat 2: Doctors */}
        <div
          onClick={() => onNavigate('doctors')}
          className="bg-white rounded-xl p-5 shadow-xs border-l-4 border-emerald-600 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Medical Staff</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900">{totalDoctors}</h3>
            <span className="text-xs font-medium text-slate-500">
              {doctors.filter(d => d.isAvailable).length} Available now
            </span>
          </div>
        </div>

        {/* Stat 3: Appointments */}
        <div
          onClick={() => onNavigate('appointments')}
          className="bg-white rounded-xl p-5 shadow-xs border-l-4 border-amber-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Appointments</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900">{todayAppointments.length}</h3>
            <span className="text-xs font-medium text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded">
              {todayAppointments.length} Today
            </span>
          </div>
        </div>

        {/* Stat 4: Pending / Lab / Billing */}
        <div
          onClick={() => onNavigate('laboratory')}
          className="bg-white rounded-xl p-5 shadow-xs border-l-4 border-rose-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Diagnostics</span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900">{pendingLabs.length}</h3>
            <span className="text-xs font-medium text-rose-600">Tests in queue</span>
          </div>
        </div>
      </div>

      {/* Role specific panels */}
      {currentUser.role === 'doctor' && currentDoctor && (
        <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Dr. {currentDoctor.name}'s Schedule</h3>
                <p className="text-xs text-slate-500">{currentDoctor.specialization} • Fee: ${currentDoctor.consultationFee.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View Full Schedule →
            </button>
          </div>

          {myTodayAppointments.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-xl text-slate-500 text-sm">
              No appointments scheduled for you today.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {myTodayAppointments.map(apt => {
                const patient = patients.find(p => p.id === apt.patientId);
                return (
                  <div key={apt.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{patient?.name}</p>
                      <p className="text-xs text-slate-500">{apt.reason || 'General consultation'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                        {apt.time}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                        apt.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : apt.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {apt.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Today's Appointments & Reception Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Today's Schedule & Actionable Queue */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">Today's Appointment Roster</h3>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              All Appointments →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <tr>
                  <th className="px-5 py-3.5">Time</th>
                  <th className="px-5 py-3.5">Patient</th>
                  <th className="px-5 py-3.5">Doctor</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {todayAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                      No appointments scheduled for today.
                    </td>
                  </tr>
                ) : (
                  todayAppointments.map(apt => {
                    const pat = patients.find(p => p.id === apt.patientId);
                    const doc = doctors.find(d => d.id === apt.doctorId);
                    return (
                      <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-800">
                          {apt.time}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-slate-900">
                          {pat?.name || 'Unknown'}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-600">
                          Dr. {doc?.name || 'Unassigned'}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            {apt.appointmentType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              apt.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : apt.status === 'in_progress'
                                ? 'bg-amber-100 text-amber-800'
                                : apt.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {apt.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Reception & Triage Live Status */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Clinic Waiting Room</h3>
              </div>
              <button
                onClick={() => onNavigate('reception')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Queue Manager →
              </button>
            </div>

            <div className="space-y-3">
              {activeVisits.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No patients currently waiting in reception lobby.
                </div>
              ) : (
                activeVisits.map(visit => {
                  const pat = patients.find(p => p.id === visit.patientId);
                  const doc = doctors.find(d => d.id === visit.doctorId);
                  return (
                    <div
                      key={visit.id}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 hover:bg-slate-100/60 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{pat?.name}</p>
                          <p className="text-[11px] text-slate-500">
                            Dr. {doc?.name || 'On Duty'}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            visit.status === 'waiting'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {visit.status.replace('_', ' ')}
                        </span>
                      </div>
                      {visit.vitals && (
                        <div className="mt-2 text-[11px] font-mono text-slate-600 flex gap-2 flex-wrap">
                          {visit.vitals.bloodPressure && (
                            <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              BP: {visit.vitals.bloodPressure}
                            </span>
                          )}
                          {visit.vitals.heartRate && (
                            <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              HR: {visit.vitals.heartRate}
                            </span>
                          )}
                          {visit.vitals.temperature && (
                            <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              Temp: {visit.vitals.temperature}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Average waiting time</span>
            <span className="font-semibold text-slate-800">14 mins</span>
          </div>
        </div>
      </div>

      {/* Quick Action Dock */}
      <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Hospital Quick Actions
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('patients')}
            className="p-3 text-left rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors group"
          >
            <Users className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-slate-900">Find Patient</p>
            <p className="text-[11px] text-slate-500">Search health records</p>
          </button>
          <button
            onClick={() => onNavigate('reception')}
            className="p-3 text-left rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors group"
          >
            <UserCheck className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-slate-900">Patient Check-in</p>
            <p className="text-[11px] text-slate-500">Record triage vitals</p>
          </button>
          <button
            onClick={() => onNavigate('laboratory')}
            className="p-3 text-left rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-colors group"
          >
            <FlaskConical className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-slate-900">Order Lab Test</p>
            <p className="text-[11px] text-slate-500">Diagnostic requests</p>
          </button>
          <button
            onClick={() => onNavigate('billing')}
            className="p-3 text-left rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-colors group"
          >
            <Receipt className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-slate-900">Create Bill</p>
            <p className="text-[11px] text-slate-500">Itemized billing & receipts</p>
          </button>
        </div>
      </div>
    </div>
  );
};
