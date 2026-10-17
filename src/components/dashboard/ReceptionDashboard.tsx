import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Clock,
  HeartPulse,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  CalendarCheck,
  Stethoscope,
  FlaskConical,
  Pill,
  CreditCard,
  Printer,
  Eye,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import {
  AppointmentTargetRole,
  AppointmentType,
  PaymentMethod,
  Bill,
} from '../../types';
import { BillReceiptModal } from '../billing/BillReceiptModal';

export const ReceptionDashboard: React.FC = () => {
  const {
    currentUser,
    patients,
    doctors,
    appointments,
    addAppointment,
    visits,
    addVisit,
    patientJourneys,
    checkoutAndDischargePatient,
    bills,
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'queue' | 'book' | 'checkout' | 'declined'>('queue');
  const [selectedReceipt, setSelectedReceipt] = useState<Bill | null>(null);

  // New Booking form
  const [bookPatientId, setBookPatientId] = useState(patients[0]?.id || '');
  const [bookTargetRole, setBookTargetRole] = useState<AppointmentTargetRole>('doctor');
  const [bookDoctorId, setBookDoctorId] = useState(doctors[0]?.id || '');
  const [bookDate, setBookDate] = useState('2026-10-17');
  const [bookTime, setBookTime] = useState('11:30');
  const [bookType, setBookType] = useState<AppointmentType>('consultation');
  const [bookReason, setBookReason] = useState('');

  // Triage Intake form
  const [showTriageIntake, setShowTriageIntake] = useState(false);
  const [intakePatientId, setIntakePatientId] = useState(patients[0]?.id || '');
  const [intakeBP, setIntakeBP] = useState('120/80 mmHg');
  const [intakeHR, setIntakeHR] = useState('72 bpm');
  const [intakeTemp, setIntakeTemp] = useState('36.8 °C');
  const [intakeSpO2, setIntakeSpO2] = useState('98 %');
  const [intakeNotes, setIntakeNotes] = useState('Patient arrived at reception triage desk.');

  // Mandatory Checkout dialog
  const [checkoutPatientId, setCheckoutPatientId] = useState<string | null>(null);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<PaymentMethod>('card');
  const [checkoutNotes, setCheckoutNotes] = useState('');

  // Filter journeys needing mandatory checkout
  const pendingCheckoutJourneys = Object.values(patientJourneys).filter(
    j => j.currentStage === 'reception_checkout' && !j.isPaid
  );

  // Declined appointments needing receptionist rescheduling
  const declinedAppointments = appointments.filter(a => a.responseStatus === 'declined');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === bookPatientId);
    let targetStaffName = '';

    if (bookTargetRole === 'doctor') {
      const doc = doctors.find(d => d.id === bookDoctorId);
      targetStaffName = doc ? `Dr. ${doc.name}` : 'Doctor';
    } else if (bookTargetRole === 'lab_technician') {
      targetStaffName = 'Laboratory Attendant';
    } else {
      targetStaffName = 'Chief Pharmacist';
    }

    addAppointment({
      patientId: bookPatientId,
      doctorId: bookDoctorId || 'staff-1',
      targetRole: bookTargetRole,
      targetPersonnelName: targetStaffName,
      date: bookDate,
      time: bookTime,
      appointmentType: bookType,
      status: 'scheduled',
      reason: bookReason || `${bookType} scheduled at reception`,
    });

    setBookReason('');
    alert(`Appointment scheduled with ${targetStaffName}! The personnel has received notification to Accept or Decline.`);
    setActiveTab('queue');
  };

  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVisit({
      patientId: intakePatientId,
      doctorId: doctors[0]?.id,
      visitDate: new Date().toISOString().split('T')[0],
      status: 'waiting',
      vitals: {
        bloodPressure: intakeBP,
        heartRate: intakeHR,
        temperature: intakeTemp,
        oxygenSaturation: intakeSpO2,
      },
      notes: intakeNotes,
    });
    setShowTriageIntake(false);
    alert('Patient check-in & triage vitals recorded in queue!');
  };

  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPatientId) return;

    const generatedBill = checkoutAndDischargePatient(
      checkoutPatientId,
      checkoutPaymentMethod,
      checkoutNotes
    );

    setCheckoutPatientId(null);
    setSelectedReceipt(generatedBill);
  };

  return (
    <div className="space-y-6">
      {selectedReceipt && (
        <BillReceiptModal bill={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}

      {/* Reception Desk Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl font-bold shadow-inner">
              <UserCheck className="w-7 h-7 text-emerald-200" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-emerald-200 tracking-wider">
                Front Desk Operations
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Receptionist Management Desk
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Manage patient check-ins, triage bookings, staff dispatching, and mandatory exit payment collection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTriageIntake(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-md hover:bg-emerald-50 transition-all cursor-pointer"
            >
              <HeartPulse className="w-4 h-4 text-emerald-700" />
              <span>Patient Check-in / Vitals</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Checkout Alert Banner (Crucial Requirement!) */}
      {pendingCheckoutJourneys.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Mandatory Exit Settlement Required ({pendingCheckoutJourneys.length} Patients Ready)
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Patients have completed doctor consultation and received medications. Hospital policy requires mandatory payment collection at the reception desk before leaving.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('checkout')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Go to Checkout Counter →
          </button>
        </div>
      )}

      {/* Reception Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-4 shadow-xs overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('queue')}
          className={`py-3.5 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'queue' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Lobby Triage Queue</span>
        </button>

        <button
          onClick={() => setActiveTab('book')}
          className={`py-3.5 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'book' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
          }`}
        >
          <CalendarCheck className="w-4 h-4 text-indigo-600" />
          <span>Book Appointment (Doctor, Lab, Pharmacy)</span>
        </button>

        <button
          onClick={() => setActiveTab('checkout')}
          className={`py-3.5 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'checkout' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>Mandatory Checkout & Discharge ({pendingCheckoutJourneys.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('declined')}
          className={`py-3.5 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'declined' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span>Declined Bookings ({declinedAppointments.length})</span>
        </button>
      </div>

      {/* TAB 1: LOBBY TRIAGE QUEUE */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Active Patient Visits in Lobby</h3>
            <span className="text-xs font-semibold text-slate-400">Total visits logged: {visits.length}</span>
          </div>

          <div className="space-y-3">
            {visits.map(v => {
              const pat = patients.find(p => p.id === v.patientId);
              return (
                <div key={v.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{pat?.name || 'Walk-in Patient'}</span>
                      <span className="text-[10px] uppercase font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                        {v.status}
                      </span>
                    </div>
                    {v.vitals && (
                      <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] font-mono text-slate-700">
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">BP: {v.vitals.bloodPressure || '-'}</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">HR: {v.vitals.heartRate || '-'}</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Temp: {v.vitals.temperature || '-'}</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">SpO2: {v.vitals.oxygenSaturation || '-'}</span>
                      </div>
                    )}
                    {v.notes && <p className="text-slate-500 mt-1 italic">{v.notes}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setBookPatientId(v.patientId);
                        setActiveTab('book');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold"
                    >
                      Book for Doctor →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: APPOINTMENT CREATOR (Doctor, Lab, Pharmacist) */}
      {activeTab === 'book' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Create Appointment & Dispatch Notification
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select patient and dispatch appointment to Doctor, Laboratory Attendant, or Pharmacist. The personnel will receive a notification to Accept or Decline with a reason.
            </p>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient *</label>
                <select
                  value={bookPatientId}
                  onChange={e => setBookPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Department Personnel *</label>
                <select
                  value={bookTargetRole}
                  onChange={e => setBookTargetRole(e.target.value as AppointmentTargetRole)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                >
                  <option value="doctor">Medical Doctor (Consultation & Exam)</option>
                  <option value="lab_technician">Laboratory Attendant (Diagnostic Assays)</option>
                  <option value="pharmacist">Pharmacist (Medication Consultation / Refill)</option>
                </select>
              </div>
            </div>

            {bookTargetRole === 'doctor' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Specific Doctor</label>
                <select
                  value={bookDoctorId}
                  onChange={e => setBookDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.name} ({d.specialization}) • Fee: ${d.consultationFee}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={bookDate}
                  onChange={e => setBookDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Time</label>
                <input
                  type="time"
                  value={bookTime}
                  onChange={e => setBookTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Appointment Type</label>
                <select
                  value={bookType}
                  onChange={e => setBookType(e.target.value as AppointmentType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="routine_check">Routine Check</option>
                  <option value="laboratory">Laboratory Specimen</option>
                  <option value="pharmacy">Pharmacy Dispensation</option>
                  <option value="emergency">Emergency Triage</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Chief Reason for Appointment</label>
              <input
                type="text"
                value={bookReason}
                onChange={e => setBookReason(e.target.value)}
                placeholder="e.g. Chest discomfort, routine diabetes review, lab blood test order"
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Dispatch Appointment & Notify Personnel
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MANDATORY CHECKOUT & DISCHARGE COUNTER */}
      {activeTab === 'checkout' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Mandatory Patient Checkout & Cumulative Bill Collection
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Patients cannot leave without mandatory checkout settlement. The bill tallies all charges from the first place (Reception Intake) to the last place (Pharmacy Dispensation).
            </p>
          </div>

          {pendingCheckoutJourneys.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-60" />
              All patients currently discharged have settled mandatory exit bills.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCheckoutJourneys.map(j => {
                const pat = patients.find(p => p.id === j.patientId);
                const regFee = j.registrationFee ?? 20;
                const consultFee = j.consultationFee ?? 0;
                const labFee = j.labFee ?? 0;
                const medFee = j.medicationFee ?? 0;
                const subtotal = regFee + consultFee + labFee + medFee;
                const tax = subtotal * 0.05;
                const grandTotal = subtotal + tax;

                return (
                  <div
                    key={j.patientId}
                    className="p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">{pat?.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase text-[10px]">
                          Payment Mandatory Upon Leaving
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Phone: {pat?.phone} • Insurance: {pat?.insuranceProvider || 'Self-pay'}
                      </p>

                      {/* Cumulative journey price breakdown */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 font-mono">
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-sans">Reception Intake</span>
                          <span className="font-bold text-slate-800">${regFee.toFixed(2)}</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-sans">Doctor Consultation</span>
                          <span className="font-bold text-slate-800">${consultFee.toFixed(2)}</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-sans">Diagnostic Lab</span>
                          <span className="font-bold text-slate-800">${labFee.toFixed(2)}</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-sans">Pharmacy Medications</span>
                          <span className="font-bold text-slate-800">${medFee.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Total Exit Amount Due</span>
                        <p className="text-2xl font-bold font-mono text-emerald-800">${grandTotal.toFixed(2)}</p>
                      </div>

                      <button
                        onClick={() => {
                          setCheckoutPatientId(j.patientId);
                          setCheckoutNotes('');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        Collect Payment & Print Receipt
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DECLINED APPOINTMENTS ALERT */}
      {activeTab === 'declined' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-red-950 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Declined Appointments by Doctors / Personnel
            </h3>
            <span className="text-xs text-slate-400 font-medium">Follow-up required</span>
          </div>

          {declinedAppointments.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No appointments declined by staff.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {declinedAppointments.map(apt => {
                const pat = patients.find(p => p.id === apt.patientId);
                const doc = doctors.find(d => d.id === apt.doctorId);
                return (
                  <div key={apt.id} className="p-4 bg-red-50 rounded-xl border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">{pat?.name} with Dr. {doc?.name || apt.targetPersonnelName}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{apt.date} at {apt.time}</p>
                      <p className="text-red-800 font-medium mt-1">
                        Reason given: "{apt.declineReason || apt.cancelledReason || 'Staff conflict'}"
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setBookPatientId(apt.patientId);
                        setActiveTab('book');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-red-300 text-red-700 font-bold hover:bg-red-100"
                    >
                      Reschedule to Alternate Doctor →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Mandatory Checkout Modal Form */}
      {checkoutPatientId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base">Mandatory Exit Checkout</h3>
              </div>
              <button
                onClick={() => setCheckoutPatientId(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProcessCheckout} className="p-6 space-y-4">
              <p className="text-slate-600">
                Confirm payment collection from patient before allowing hospital departure.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method *</label>
                <select
                  value={checkoutPaymentMethod}
                  onChange={e => setCheckoutPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                >
                  <option value="card">Credit / Debit Card</option>
                  <option value="cash">Cash Payment</option>
                  <option value="insurance">Insurance Direct Settlement</option>
                  <option value="online">Online Transfer / Wire</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Receipt Notes / Transaction Auth Code</label>
                <input
                  type="text"
                  value={checkoutNotes}
                  onChange={e => setCheckoutNotes(e.target.value)}
                  placeholder="e.g. Card auth #49102, verified at front desk"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutPatientId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  Confirm Payment & Discharge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Triage Intake Modal */}
      {showTriageIntake && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base">Patient Arrival Check-in & Vitals</h3>
              </div>
              <button
                onClick={() => setShowTriageIntake(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIntakeSubmit} className="p-6 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                <select
                  value={intakePatientId}
                  onChange={e => setIntakePatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={intakeBP}
                    onChange={e => setIntakeBP(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Heart Rate</label>
                  <input
                    type="text"
                    value={intakeHR}
                    onChange={e => setIntakeHR(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Temperature</label>
                  <input
                    type="text"
                    value={intakeTemp}
                    onChange={e => setIntakeTemp(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Oxygen SpO2</label>
                  <input
                    type="text"
                    value={intakeSpO2}
                    onChange={e => setIntakeSpO2(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Arrival Notes</label>
                <input
                  type="text"
                  value={intakeNotes}
                  onChange={e => setIntakeNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTriageIntake(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  Check In Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
