import React from 'react';
import { Printer, X, HeartPulse, FileText, Calendar, AlertCircle } from 'lucide-react';
import { Patient } from '../../types';
import { useHospital } from '../../context/HospitalContext';

interface PatientReportModalProps {
  patient: Patient;
  onClose: () => void;
}

export const PatientReportModal: React.FC<PatientReportModalProps> = ({ patient, onClose }) => {
  const { medicalRecords, visits, labTests, prescriptions, doctors } = useHospital();

  const patientRecords = medicalRecords.filter(r => r.patientId === patient.id);
  const patientVisits = visits.filter(v => v.patientId === patient.id);
  const patientLabs = labTests.filter(l => l.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in duration-150">
        {/* Modal Toolbar (hidden during print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">Comprehensive Clinical Patient Report</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 space-y-8 bg-white print:p-0 text-slate-800 font-sans">
          {/* Hospital Header Banner */}
          <div className="border-b-2 border-indigo-700 pb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-2xl tracking-tight">
                <HeartPulse className="w-8 h-8 text-red-500 inline" />
                <span>HMS MedCare Hospital</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Clinical Health Services & Diagnostic Center • Department of Health Services
              </p>
              <p className="text-xs text-slate-500">
                100 Medical Plaza, Suite 400 • Tel: +1 (555) 019-2000 • Email: records@hospitalsystem.com
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-wider rounded border border-indigo-200">
                Official Medical Record
              </span>
              <p className="text-xs text-slate-400 mt-2">
                Report Date: <span className="font-semibold text-slate-700">{new Date().toLocaleDateString()}</span>
              </p>
              <p className="text-xs text-slate-400">
                Record ID: <span className="font-mono font-semibold text-slate-700">{patient.id}</span>
              </p>
            </div>
          </div>

          {/* Patient Demographics Card */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Patient Name</span>
              <span className="font-bold text-sm text-slate-900">{patient.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Age / Gender</span>
              <span className="font-semibold text-slate-800">{patient.age} yrs • {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Date of Birth</span>
              <span className="font-semibold text-slate-800">{patient.dateOfBirth}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Blood Type</span>
              <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 inline-block">
                {patient.bloodType || 'Unknown'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Phone Number</span>
              <span className="font-semibold text-slate-800">{patient.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Email Address</span>
              <span className="font-semibold text-slate-800">{patient.email || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Emergency Contact</span>
              <span className="font-semibold text-slate-800">{patient.emergencyContactName} ({patient.emergencyContact})</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Insurance</span>
              <span className="font-semibold text-slate-800">{patient.insuranceProvider ? `${patient.insuranceProvider} (${patient.insuranceId})` : 'Private / Self-pay'}</span>
            </div>
          </div>

          {/* Critical Alerts: Allergies & Chronic Diseases */}
          {(patient.allergies || patient.chronicDiseases) && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div>
                  <span className="font-bold text-amber-900 block uppercase text-[10px]">Documented Allergies</span>
                  <p className="text-amber-800 font-medium">{patient.allergies || 'None reported'}</p>
                </div>
                <div>
                  <span className="font-bold text-amber-900 block uppercase text-[10px]">Chronic Conditions</span>
                  <p className="text-amber-800 font-medium">{patient.chronicDiseases || 'None reported'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Clinical Medical Records Section */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-4">
              1. Diagnoses & Clinical Records
            </h4>
            {patientRecords.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No medical records documented for this patient.</p>
            ) : (
              <div className="space-y-4">
                {patientRecords.map((rec, idx) => {
                  const doc = doctors.find(d => d.id === rec.doctorId);
                  return (
                    <div key={rec.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">
                          {idx + 1}. {rec.disease}
                        </span>
                        <span className="text-slate-500">
                          Date: <span className="font-semibold text-slate-700">{rec.visitDate}</span> • Attending: Dr. {doc?.name || 'Staff'}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Diagnosis Details:</span>
                        <p className="text-slate-600 mt-0.5">{rec.diagnosis}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Prescription / Therapy:</span>
                        <p className="text-slate-600 mt-0.5">{rec.prescription}</p>
                      </div>
                      {rec.notes && (
                        <p className="text-slate-500 italic text-[11px]">Clinical Notes: {rec.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Vitals History Section */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-4">
              2. Vital Signs & Triage Visits
            </h4>
            {patientVisits.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No triage visits logged.</p>
            ) : (
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">BP</th>
                    <th className="p-2.5">Heart Rate</th>
                    <th className="p-2.5">Temp</th>
                    <th className="p-2.5">Oxygen Sat</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {patientVisits.map(v => (
                    <tr key={v.id}>
                      <td className="p-2.5 font-medium">{v.visitDate}</td>
                      <td className="p-2.5 font-mono">{v.vitals?.bloodPressure || '-'}</td>
                      <td className="p-2.5 font-mono">{v.vitals?.heartRate || '-'}</td>
                      <td className="p-2.5 font-mono">{v.vitals?.temperature || '-'}</td>
                      <td className="p-2.5 font-mono">{v.vitals?.oxygenSaturation || '-'}</td>
                      <td className="p-2.5 capitalize">{v.status.replace('_', ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Diagnostic Laboratory Section */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-4">
              3. Laboratory Test Findings
            </h4>
            {patientLabs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No laboratory tests requested.</p>
            ) : (
              <div className="space-y-3">
                {patientLabs.map(lab => (
                  <div key={lab.id} className="p-3 rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900 uppercase">
                        {lab.testType} Test
                      </span>
                      <span className={lab.completed ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                        {lab.completed ? 'COMPLETED' : 'PENDING'}
                      </span>
                    </div>
                    {lab.result ? (
                      <p className="text-slate-700 font-mono bg-slate-50 p-2 rounded border border-slate-200/80">
                        {lab.result}
                      </p>
                    ) : (
                      <p className="text-slate-400 italic">Results pending laboratory analysis.</p>
                    )}
                    {lab.technicianNotes && (
                      <p className="text-[11px] text-slate-500 mt-1">Tech notes: {lab.technicianNotes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Prescriptions Section */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-4">
              4. Pharmacological Regimens
            </h4>
            {patientPrescriptions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No active prescriptions recorded.</p>
            ) : (
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2.5">Medication</th>
                    <th className="p-2.5">Dosage</th>
                    <th className="p-2.5">Frequency</th>
                    <th className="p-2.5">Duration</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {patientPrescriptions.map(rx => (
                    <tr key={rx.id}>
                      <td className="p-2.5 font-bold text-slate-800">{rx.medicineName}</td>
                      <td className="p-2.5">{rx.dosage} {rx.dosageUnit}</td>
                      <td className="p-2.5">{rx.frequency}</td>
                      <td className="p-2.5">{rx.durationDays} days</td>
                      <td className="p-2.5 capitalize">{rx.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Signature & Disclaimer Footer */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-semibold">Attending Physician Verification</p>
              <div className="mt-8 border-b border-slate-400 w-48"></div>
              <p className="text-slate-600 mt-1">Signature & Medical Stamp</p>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              <p>Certified Electronic Health Record</p>
              <p>Generated by HMS MedCare Clinical Information System</p>
              <p className="font-mono text-[10px] mt-1">SEC-KEY: #{patient.id.toUpperCase()}-VERIFIED</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
