import React, { useState } from 'react';
import {
  Stethoscope,
  CalendarCheck,
  Check,
  X,
  AlertCircle,
  FlaskConical,
  Pill,
  Clock,
  User,
  HeartPulse,
  PlusCircle,
  CheckCircle2,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Appointment, LabTestType, DosageUnit } from '../../types';

export const DoctorDashboard: React.FC = () => {
  const {
    currentUser,
    doctors,
    patients,
    appointments,
    acceptAppointment,
    declineAppointment,
    labTests,
    addLabTest,
    prescriptions,
    addPrescription,
    drugs,
    addMedicalRecord,
  } = useHospital();

  const currentDoctor = doctors.find(d => d.id === currentUser.doctorId) || doctors[0];

  // Appointments for this doctor
  const myAppointments = appointments.filter(
    a => a.doctorId === currentDoctor.id || a.targetPersonnelName?.includes(currentDoctor.name)
  );

  const pendingRequests = myAppointments.filter(a => a.responseStatus === 'pending');
  const acceptedAppointments = myAppointments.filter(
    a => a.responseStatus === 'accepted' && a.status !== 'cancelled'
  );

  // Decline Dialog State
  const [decliningApt, setDecliningApt] = useState<Appointment | null>(null);
  const [declineReasonText, setDeclineReasonText] = useState('');

  // Active Patient for Consultation
  const [activePatientId, setActivePatientId] = useState<string>(patients[0]?.id || '');
  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  // Clinical Consultation forms
  const [diagnosisDisease, setDiagnosisDisease] = useState('');
  const [diagnosisFindings, setDiagnosisFindings] = useState('');
  const [orderLabType, setOrderLabType] = useState<LabTestType>('blood');
  const [orderLabCost, setOrderLabCost] = useState<number>(65.0);
  const [orderLabNotes, setOrderLabNotes] = useState('');
  const [selectedDrugId, setSelectedDrugId] = useState<string>(drugs[0]?.id || '');
  const [rxFrequency, setRxFrequency] = useState('Twice daily with meals');
  const [rxDuration, setRxDuration] = useState('7');
  const [rxInstructions, setRxInstructions] = useState('');

  // Notifications of lab results completed for this doctor's patients
  const completedLabFindings = labTests.filter(
    l => (l.doctorId === currentDoctor.id || l.patientId === activePatientId) && l.completed
  );

  const handleDeclineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decliningApt || !declineReasonText) return;
    declineAppointment(decliningApt.id, declineReasonText);
    setDecliningApt(null);
    setDeclineReasonText('');
  };

  const handleOrderLabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLabTest({
      patientId: activePatient.id,
      doctorId: currentDoctor.id,
      testType: orderLabType,
      cost: Number(orderLabCost),
      requestedDate: new Date().toISOString(),
      technicianNotes: orderLabNotes || `Ordered by Dr. ${currentDoctor.name}`,
    });
    setOrderLabNotes('');
    alert(`Laboratory test ordered! Notification dispatched to Laboratory Attendant.`);
  };

  const handlePrescribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const drug = drugs.find(d => d.id === selectedDrugId) || drugs[0];
    addPrescription({
      patientId: activePatient.id,
      doctorId: currentDoctor.id,
      drugId: drug.id,
      medicineName: drug.name,
      dosage: parseInt(drug.strength.replace(/\D/g, '') || '500', 10),
      dosageUnit: (drug.dosageForm.toLowerCase().includes('tablet') ? 'tablet' : 'mg') as DosageUnit,
      frequency: rxFrequency,
      durationDays: parseInt(rxDuration, 10) || 7,
      instructions: rxInstructions,
      cost: drug.unitPrice,
      status: 'active',
    });

    if (diagnosisDisease && diagnosisFindings) {
      addMedicalRecord({
        patientId: activePatient.id,
        doctorId: currentDoctor.id,
        disease: diagnosisDisease,
        diagnosis: diagnosisFindings,
        prescription: `${drug.name} (${drug.strength}) - ${rxFrequency} for ${rxDuration} days`,
        visitDate: new Date().toISOString().split('T')[0],
      });
    }

    setRxInstructions('');
    alert(`Prescription issued! Notification dispatched to Pharmacist for dispensation.`);
  };

  return (
    <div className="space-y-6">
      {/* Doctor Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl font-bold">
              Dr.
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-indigo-200 tracking-wider">
                Physician Clinical Workbench
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Dr. {currentDoctor.name} ({currentDoctor.specialization})
              </h2>
              <p className="text-xs text-indigo-100 mt-0.5">
                License: {currentDoctor.licenseNumber} • Consultation Fee: ${currentDoctor.consultationFee.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm border border-white/20">
              {pendingRequests.length} Pending Appointment Requests
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: INCOMING APPOINTMENTS TO ACCEPT OR DECLINE */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-indigo-600" />
              Incoming Patient Appointments From Reception
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review bookings scheduled by the receptionist. Accept or Decline with an audit reason.
            </p>
          </div>
          {pendingRequests.length > 0 && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full animate-pulse">
              Action Required ({pendingRequests.length})
            </span>
          )}
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-400 text-xs">
            No pending appointment requests awaiting your confirmation.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map(apt => {
              const pat = patients.find(p => p.id === apt.patientId);
              return (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{pat?.name}</span>
                      <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                        {apt.date} at {apt.time}
                      </span>
                      <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        {apt.appointmentType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Reason: <strong className="text-slate-800">{apt.reason || 'General checkup'}</strong>
                    </p>
                    {apt.notes && <p className="text-[11px] text-slate-500 italic mt-0.5">Notes: {apt.notes}</p>}
                  </div>

                  {/* Accept / Decline Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => acceptAppointment(apt.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => {
                        setDecliningApt(apt);
                        setDeclineReasonText('');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Decline with Reason</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: CLINICAL CONSULTATION WORKBENCH */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-indigo-600" />
              Patient Clinical Examination & Order Dispatcher
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select arriving patient to document diagnosis, order diagnostic lab tests, and prescribe pharmacy medications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Active Patient:</span>
            <select
              value={activePatientId}
              onChange={e => setActivePatientId(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 text-slate-800"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.age} yrs • Blood {p.bloodType})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Patient Demographics & History Banner */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Patient Name</span>
            <p className="font-bold text-slate-900">{activePatient.name}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Blood Group</span>
            <p className="font-bold text-red-600">{activePatient.bloodType || 'N/A'}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Known Allergies</span>
            <p className="font-semibold text-amber-700">{activePatient.allergies || 'None reported'}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Chronic Conditions</span>
            <p className="font-semibold text-slate-800">{activePatient.chronicDiseases || 'None reported'}</p>
          </div>
        </div>

        {/* Laboratory Findings Returned for this patient */}
        {completedLabFindings.length > 0 && (
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2 text-xs">
            <h4 className="font-bold text-purple-950 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-purple-700" />
              Diagnostic Lab Findings Returned From Lab Attendant:
            </h4>
            <div className="space-y-2">
              {completedLabFindings.map(lf => (
                <div key={lf.id} className="p-3 bg-white rounded-xl border border-purple-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold uppercase text-purple-900 text-[11px]">{lf.testType} Test</span>
                    <span className="text-[10px] font-mono text-slate-400">Completed by {lf.performedBy || 'Lab'}</span>
                  </div>
                  <p className="font-mono text-slate-800 font-medium">{lf.result}</p>
                  {lf.technicianNotes && <p className="text-[10px] text-slate-500 mt-1 italic">Notes: {lf.technicianNotes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dual Actions: Order Lab Testing OR Issue Prescription */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Action 1: Order Lab Test */}
          <form onSubmit={handleOrderLabSubmit} className="p-5 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-purple-950 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-600" />
                Step 1: Order Diagnostic Testing
              </h4>
              <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                Dispatched to Laboratory Attendant
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Diagnostic Test Type</label>
              <select
                value={orderLabType}
                onChange={e => setOrderLabType(e.target.value as LabTestType)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
              >
                <option value="blood">Blood Test (Full Blood Count & Glycemia)</option>
                <option value="malaria">Malaria Test (Blood Smear)</option>
                <option value="covid">COVID-19 Diagnostic Test</option>
                <option value="urine">Urinalysis & Chemistry</option>
                <option value="xray">Digital X-Ray Radiography</option>
                <option value="ultrasound">Diagnostic Ultrasound</option>
                <option value="ecg">12-Lead Electrocardiogram (ECG)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Diagnostic Fee ($)</label>
                <input
                  type="number"
                  value={orderLabCost}
                  onChange={e => setOrderLabCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Indications</label>
                <input
                  type="text"
                  value={orderLabNotes}
                  onChange={e => setOrderLabNotes(e.target.value)}
                  placeholder="Suspected anemia, arrhythmia..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Send Order to Laboratory Attendant</span>
            </button>
          </form>

          {/* Action 2: Prescribe Medication */}
          <form onSubmit={handlePrescribeSubmit} className="p-5 bg-teal-50/50 rounded-2xl border border-teal-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-teal-950 flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-600" />
                Step 2: Prescribe Medication
              </h4>
              <span className="text-[10px] font-semibold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                Dispatched to Pharmacist
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Select Medication From Formulary</label>
              <select
                value={selectedDrugId}
                onChange={e => setSelectedDrugId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
              >
                {drugs.map(drug => (
                  <option key={drug.id} value={drug.id}>
                    {drug.name} ({drug.strength}) • Stock: {drug.stockQuantity} • ${(drug.unitPrice ?? 0).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Frequency</label>
                <input
                  type="text"
                  value={rxFrequency}
                  onChange={e => setRxFrequency(e.target.value)}
                  placeholder="Twice daily"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Duration (days)</label>
                <input
                  type="number"
                  value={rxDuration}
                  onChange={e => setRxDuration(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Clinical Disease / Diagnosis Note</label>
              <input
                type="text"
                value={diagnosisDisease}
                onChange={e => setDiagnosisDisease(e.target.value)}
                placeholder="e.g. Essential Hypertension, Bronchitis"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Route Prescription to Pharmacist</span>
            </button>
          </form>
        </div>
      </div>

      {/* Decline Appointment Reason Dialog */}
      {decliningApt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in duration-150 text-xs">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Decline Appointment</h3>
            </div>
            <p className="text-slate-500">
              State the reason for declining. This reason is forwarded to the Receptionist and logged in the Administrator audit report.
            </p>
            <form onSubmit={handleDeclineSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Decline *</label>
                <textarea
                  required
                  rows={3}
                  value={declineReasonText}
                  onChange={e => setDeclineReasonText(e.target.value)}
                  placeholder="e.g. Called to emergency room, in surgery, off duty, or specialist conflict..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDecliningApt(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-xs"
                >
                  Submit & Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
