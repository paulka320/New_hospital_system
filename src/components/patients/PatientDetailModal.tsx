import React, { useState } from 'react';
import {
  X,
  FileText,
  Activity,
  FlaskConical,
  Pill,
  Receipt,
  Printer,
  Plus,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Shield,
  HeartPulse,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Patient, MedicalRecord, Visit, LaboratoryTest, Prescription, Bill, LabTestType, DosageUnit, VisitStatus } from '../../types';
import { useHospital } from '../../context/HospitalContext';
import { PatientReportModal } from './PatientReportModal';

interface PatientDetailModalProps {
  patient: Patient;
  onClose: () => void;
  onEditPatient: (patient: Patient) => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  onClose,
  onEditPatient,
}) => {
  const {
    doctors,
    medicalRecords,
    addMedicalRecord,
    visits,
    addVisit,
    labTests,
    addLabTest,
    prescriptions,
    addPrescription,
    markPrescriptionFilled,
    bills,
    addBill,
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'records' | 'visits' | 'labs' | 'prescriptions' | 'bills'>('records');
  const [showReport, setShowReport] = useState(false);

  // Forms states
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [showAddLab, setShowAddLab] = useState(false);
  const [showAddRx, setShowAddRx] = useState(false);
  const [showAddBill, setShowAddBill] = useState(false);

  // Medical Record form
  const [recordDisease, setRecordDisease] = useState('');
  const [recordDiagnosis, setRecordDiagnosis] = useState('');
  const [recordPrescription, setRecordPrescription] = useState('');
  const [recordDoctorId, setRecordDoctorId] = useState(doctors[0]?.id || '');
  const [recordReviewDate, setRecordReviewDate] = useState('');
  const [recordNotes, setRecordNotes] = useState('');

  // Visit form
  const [visitDoctorId, setVisitDoctorId] = useState(doctors[0]?.id || '');
  const [visitStatus, setVisitStatus] = useState<VisitStatus>('waiting');
  const [visitBP, setVisitBP] = useState('120/80 mmHg');
  const [visitHR, setVisitHR] = useState('72 bpm');
  const [visitTemp, setVisitTemp] = useState('36.8 °C');
  const [visitSpO2, setVisitSpO2] = useState('98 %');
  const [visitNotes, setVisitNotes] = useState('');

  // Lab form
  const [labType, setLabType] = useState<LabTestType>('blood');
  const [labDoctorId, setLabDoctorId] = useState(doctors[0]?.id || '');
  const [labNotes, setLabNotes] = useState('');

  // Prescription form
  const [rxMedicine, setRxMedicine] = useState('');
  const [rxDosage, setRxDosage] = useState('500');
  const [rxUnit, setRxUnit] = useState<DosageUnit>('mg');
  const [rxFrequency, setRxFrequency] = useState('Twice daily');
  const [rxDuration, setRxDuration] = useState('7');
  const [rxInstructions, setRxInstructions] = useState('');

  // Filtered data for this patient
  const patientRecords = medicalRecords.filter(r => r.patientId === patient.id);
  const patientVisits = visits.filter(v => v.patientId === patient.id);
  const patientLabs = labTests.filter(l => l.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id);
  const patientBills = bills.filter(b => b.patientId === patient.id);

  // Submit handlers
  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordDisease || !recordDiagnosis) return;
    addMedicalRecord({
      patientId: patient.id,
      doctorId: recordDoctorId,
      disease: recordDisease,
      diagnosis: recordDiagnosis,
      prescription: recordPrescription,
      visitDate: new Date().toISOString().split('T')[0],
      reviewDate: recordReviewDate || undefined,
      notes: recordNotes || undefined,
    });
    setRecordDisease('');
    setRecordDiagnosis('');
    setRecordPrescription('');
    setRecordNotes('');
    setShowAddRecord(false);
  };

  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault();
    addVisit({
      patientId: patient.id,
      doctorId: visitDoctorId,
      visitDate: new Date().toISOString().split('T')[0],
      status: visitStatus,
      vitals: {
        bloodPressure: visitBP,
        heartRate: visitHR,
        temperature: visitTemp,
        oxygenSaturation: visitSpO2,
      },
      notes: visitNotes,
    });
    setVisitNotes('');
    setShowAddVisit(false);
  };

  const handleCreateLab = (e: React.FormEvent) => {
    e.preventDefault();
    addLabTest({
      patientId: patient.id,
      doctorId: labDoctorId,
      testType: labType,
      requestedDate: new Date().toISOString(),
      technicianNotes: labNotes,
    });
    setLabNotes('');
    setShowAddLab(false);
  };

  const handleCreateRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxMedicine) return;
    addPrescription({
      patientId: patient.id,
      doctorId: doctors[0]?.id,
      medicineName: rxMedicine,
      dosage: parseInt(rxDosage, 10) || 1,
      dosageUnit: rxUnit,
      frequency: rxFrequency,
      durationDays: parseInt(rxDuration, 10) || 7,
      instructions: rxInstructions,
      status: 'active',
    });
    setRxMedicine('');
    setRxInstructions('');
    setShowAddRx(false);
  };

  return (
    <>
      {showReport && (
        <PatientReportModal patient={patient} onClose={() => setShowReport(false)} />
      )}

      <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl font-bold shadow-inner">
                {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold">{patient.name}</h2>
                  <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-white/20 border border-white/30 text-white">
                    {patient.bloodType || 'Blood N/A'}
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-0.5">
                  ID: <span className="font-mono">{patient.id}</span> • {patient.age} yrs • {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'} • DOB: {patient.dateOfBirth}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReport(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-sm border border-white/20 transition-all"
                title="View formatted printable medical report"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Medical Report</span>
              </button>
              <button
                onClick={() => onEditPatient(patient)}
                className="px-3 py-1.5 rounded-lg bg-white text-indigo-900 text-xs font-semibold shadow-xs hover:bg-indigo-50 transition-colors"
              >
                Edit Info
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{patient.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{patient.email || 'No email registered'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{patient.insuranceProvider || 'Self-pay'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <HeartPulse className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Emergency: {patient.emergencyContact || 'None'}</span>
            </div>
          </div>

          {/* Tabs bar */}
          <div className="flex border-b border-slate-200 px-6 overflow-x-auto bg-white">
            {[
              { id: 'records', label: `Medical Records (${patientRecords.length})`, icon: FileText },
              { id: 'visits', label: `Triage & Visits (${patientVisits.length})`, icon: Activity },
              { id: 'labs', label: `Diagnostic Labs (${patientLabs.length})`, icon: FlaskConical },
              { id: 'prescriptions', label: `Prescriptions (${patientPrescriptions.length})`, icon: Pill },
              { id: 'bills', label: `Billing & Invoices (${patientBills.length})`, icon: Receipt },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* TAB 1: MEDICAL RECORDS */}
            {activeTab === 'records' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">Clinical History & Diagnoses</h4>
                  <button
                    onClick={() => setShowAddRecord(!showAddRecord)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddRecord ? 'Cancel' : 'Add Medical Record'}</span>
                  </button>
                </div>

                {/* Add Record Form Inline */}
                {showAddRecord && (
                  <form onSubmit={handleCreateRecord} className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-3">
                    <h5 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">New Diagnosis Entry</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Disease / Condition *</label>
                        <input
                          type="text"
                          required
                          value={recordDisease}
                          onChange={e => setRecordDisease(e.target.value)}
                          placeholder="e.g. Acute Bronchitis"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Attending Doctor</label>
                        <select
                          value={recordDoctorId}
                          onChange={e => setRecordDoctorId(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialization})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Clinical Diagnosis Findings *</label>
                      <textarea
                        required
                        rows={2}
                        value={recordDiagnosis}
                        onChange={e => setRecordDiagnosis(e.target.value)}
                        placeholder="Detailed clinical evaluation, symptoms, examination..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Prescription & Recommended Therapy</label>
                      <input
                        type="text"
                        value={recordPrescription}
                        onChange={e => setRecordPrescription(e.target.value)}
                        placeholder="e.g. Amoxicillin 500mg TID for 7 days, rest & hydration"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Next Follow-up Review Date</label>
                        <input
                          type="date"
                          value={recordReviewDate}
                          onChange={e => setRecordReviewDate(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Physician Notes</label>
                        <input
                          type="text"
                          value={recordNotes}
                          onChange={e => setRecordNotes(e.target.value)}
                          placeholder="Optional internal clinical notes"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                    >
                      Save Medical Record
                    </button>
                  </form>
                )}

                {patientRecords.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No medical records recorded for this patient yet. Click "Add Medical Record" above.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {patientRecords.map(rec => {
                      const doc = doctors.find(d => d.id === rec.doctorId);
                      return (
                        <div key={rec.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 transition-colors space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm">{rec.disease}</span>
                            <span className="text-xs text-slate-500">
                              {rec.visitDate} • Dr. {doc?.name || 'Staff'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{rec.diagnosis}</p>
                          {rec.prescription && (
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                              <span className="font-semibold text-slate-700">Prescription: </span>
                              <span className="text-slate-600">{rec.prescription}</span>
                            </div>
                          )}
                          {rec.reviewDate && (
                            <p className="text-[11px] text-indigo-600 font-medium">
                              Review scheduled for: {rec.reviewDate}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: VISITS & VITALS */}
            {activeTab === 'visits' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">Triage & Clinical Visits</h4>
                  <button
                    onClick={() => setShowAddVisit(!showAddVisit)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddVisit ? 'Cancel' : 'Record Visit / Vitals'}</span>
                  </button>
                </div>

                {showAddVisit && (
                  <form onSubmit={handleCreateVisit} className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
                    <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Log Visit & Triage Vitals</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">Blood Pressure</label>
                        <input
                          type="text"
                          value={visitBP}
                          onChange={e => setVisitBP(e.target.value)}
                          placeholder="120/80 mmHg"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">Heart Rate</label>
                        <input
                          type="text"
                          value={visitHR}
                          onChange={e => setVisitHR(e.target.value)}
                          placeholder="72 bpm"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">Temperature</label>
                        <input
                          type="text"
                          value={visitTemp}
                          onChange={e => setVisitTemp(e.target.value)}
                          placeholder="36.8 °C"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">O2 Saturation</label>
                        <input
                          type="text"
                          value={visitSpO2}
                          onChange={e => setVisitSpO2(e.target.value)}
                          placeholder="98 %"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">Assigned Doctor</label>
                        <select
                          value={visitDoctorId}
                          onChange={e => setVisitDoctorId(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>Dr. {d.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">Status</label>
                        <select
                          value={visitStatus}
                          onChange={e => setVisitStatus(e.target.value as VisitStatus)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="waiting">Waiting in lobby</option>
                          <option value="in_progress">In Consultation</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Triage Notes</label>
                      <input
                        type="text"
                        value={visitNotes}
                        onChange={e => setVisitNotes(e.target.value)}
                        placeholder="Nurse notes or presenting chief complaint"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                    >
                      Save Visit
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  {patientVisits.map(visit => {
                    const doc = doctors.find(d => d.id === visit.doctorId);
                    return (
                      <div key={visit.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">
                            Visit on {visit.visitDate} • Dr. {doc?.name || 'On duty'}
                          </span>
                          <span className="text-[11px] font-semibold capitalize px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                            {visit.status.replace('_', ' ')}
                          </span>
                        </div>
                        {visit.vitals && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                            <div className="p-2 rounded bg-slate-50 border border-slate-100">
                              <span className="text-[10px] text-slate-400 block font-semibold">BP</span>
                              <span className="font-mono font-bold text-slate-800">{visit.vitals.bloodPressure || '-'}</span>
                            </div>
                            <div className="p-2 rounded bg-slate-50 border border-slate-100">
                              <span className="text-[10px] text-slate-400 block font-semibold">Pulse / HR</span>
                              <span className="font-mono font-bold text-slate-800">{visit.vitals.heartRate || '-'}</span>
                            </div>
                            <div className="p-2 rounded bg-slate-50 border border-slate-100">
                              <span className="text-[10px] text-slate-400 block font-semibold">Temperature</span>
                              <span className="font-mono font-bold text-slate-800">{visit.vitals.temperature || '-'}</span>
                            </div>
                            <div className="p-2 rounded bg-slate-50 border border-slate-100">
                              <span className="text-[10px] text-slate-400 block font-semibold">SpO2</span>
                              <span className="font-mono font-bold text-slate-800">{visit.vitals.oxygenSaturation || '-'}</span>
                            </div>
                          </div>
                        )}
                        {visit.notes && <p className="text-xs text-slate-500 italic">{visit.notes}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: LAB TESTS */}
            {activeTab === 'labs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">Laboratory & Diagnostic Tests</h4>
                  <button
                    onClick={() => setShowAddLab(!showAddLab)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddLab ? 'Cancel' : 'Order Lab Test'}</span>
                  </button>
                </div>

                {showAddLab && (
                  <form onSubmit={handleCreateLab} className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-3">
                    <h5 className="text-xs font-bold text-purple-950 uppercase tracking-wider">New Diagnostic Request</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Test Type</label>
                        <select
                          value={labType}
                          onChange={e => setLabType(e.target.value as LabTestType)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="blood">Blood Test</option>
                          <option value="malaria">Malaria Test</option>
                          <option value="covid">COVID-19 Test</option>
                          <option value="urine">Urine Test</option>
                          <option value="xray">X-Ray Imaging</option>
                          <option value="ultrasound">Ultrasound</option>
                          <option value="ct_scan">CT Scan</option>
                          <option value="ecg">Electrocardiogram (ECG)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Ordering Physician</label>
                        <select
                          value={labDoctorId}
                          onChange={e => setLabDoctorId(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>Dr. {d.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Clinical Indications / Notes</label>
                      <input
                        type="text"
                        value={labNotes}
                        onChange={e => setLabNotes(e.target.value)}
                        placeholder="Reason for test or special handling instructions"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700"
                    >
                      Submit Lab Order
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  {patientLabs.map(lab => (
                    <div key={lab.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs uppercase">
                          {lab.testType} Test
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            lab.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {lab.completed ? 'Completed' : 'Pending in Lab'}
                        </span>
                      </div>
                      {lab.result ? (
                        <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 border border-slate-200">
                          {lab.result}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Results pending analysis.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: PRESCRIPTIONS */}
            {activeTab === 'prescriptions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">Prescribed Pharmaceuticals</h4>
                  <button
                    onClick={() => setShowAddRx(!showAddRx)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddRx ? 'Cancel' : 'New Prescription'}</span>
                  </button>
                </div>

                {showAddRx && (
                  <form onSubmit={handleCreateRx} className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-3">
                    <h5 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">New Digital Prescription</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Medication Name *</label>
                        <input
                          type="text"
                          required
                          value={rxMedicine}
                          onChange={e => setRxMedicine(e.target.value)}
                          placeholder="e.g. Amoxicillin"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Dosage Amount</label>
                        <input
                          type="number"
                          value={rxDosage}
                          onChange={e => setRxDosage(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Dosage Unit</label>
                        <select
                          value={rxUnit}
                          onChange={e => setRxUnit(e.target.value as DosageUnit)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="mg">Milligram (mg)</option>
                          <option value="ml">Milliliter (ml)</option>
                          <option value="tablet">Tablet</option>
                          <option value="capsule">Capsule</option>
                          <option value="injection">Injection</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Frequency</label>
                        <input
                          type="text"
                          value={rxFrequency}
                          onChange={e => setRxFrequency(e.target.value)}
                          placeholder="e.g. 3 times daily with meals"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Duration (days)</label>
                        <input
                          type="number"
                          value={rxDuration}
                          onChange={e => setRxDuration(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                    >
                      Issue Prescription
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  {patientPrescriptions.map(rx => (
                    <div key={rx.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{rx.medicineName}</p>
                        <p className="text-xs text-slate-500">
                          {rx.dosage} {rx.dosageUnit} • {rx.frequency} • {rx.durationDays} days
                        </p>
                        {rx.instructions && <p className="text-[11px] text-slate-400 mt-1">{rx.instructions}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                          rx.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {rx.status}
                        </span>
                        {rx.status === 'active' && (
                          <button
                            onClick={() => markPrescriptionFilled(rx.id)}
                            className="px-2.5 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                          >
                            Mark Filled
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: BILLS */}
            {activeTab === 'bills' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800">Invoices & Billing History</h4>
                {patientBills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No bills issued yet for this patient.</p>
                ) : (
                  <div className="space-y-3">
                    {patientBills.map(b => (
                      <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                        <div>
                          <p className="text-xs font-mono font-bold text-slate-900">{b.billNumber}</p>
                          <p className="text-xs text-slate-500">
                            Issued: {b.createdAt.split('T')[0]} • Method: {b.paymentMethod || 'Pending'}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs font-medium">
                            <span>Total: <strong className="text-slate-900">${b.totalAmount.toFixed(2)}</strong></span>
                            <span>Paid: <strong className="text-emerald-600">${b.paidAmount.toFixed(2)}</strong></span>
                          </div>
                        </div>
                        <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                          b.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
