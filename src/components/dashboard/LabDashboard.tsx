import React, { useState } from 'react';
import {
  FlaskConical,
  Microscope,
  Check,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { LaboratoryTest } from '../../types';

export const LabDashboard: React.FC = () => {
  const {
    labTests,
    acceptLabTest,
    declineLabTest,
    completeLabTest,
    patients,
    doctors,
  } = useHospital();

  const [decliningTest, setDecliningTest] = useState<LaboratoryTest | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  const [activeWorkbenchTest, setActiveWorkbenchTest] = useState<LaboratoryTest | null>(null);
  const [resultInput, setResultInput] = useState('');
  const [techNotes, setTechNotes] = useState('');

  const pendingTests = labTests.filter(t => !t.completed);
  const completedTests = labTests.filter(t => t.completed);

  const handleDeclineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decliningTest || !declineReason) return;
    declineLabTest(decliningTest.id, declineReason);
    setDecliningTest(null);
    setDeclineReason('');
  };

  const handlePublishResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkbenchTest || !resultInput) return;
    completeLabTest(activeWorkbenchTest.id, resultInput, techNotes);
    setActiveWorkbenchTest(null);
    setResultInput('');
    setTechNotes('');
    alert('Results published! Notification sent back to the ordering doctor.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl font-bold shadow-inner">
              <Microscope className="w-7 h-7 text-purple-200" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-purple-200 tracking-wider">
                Clinical Diagnostics Laboratory
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Laboratory Attendant Workbench
              </h2>
              <p className="text-xs text-purple-100 mt-0.5">
                Process pathology assays, accept or decline test orders, and report findings directly to doctors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm border border-white/20">
              {pendingTests.length} Tests in Queue
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: INCOMING ORDERS AWAITING ACCEPTANCE OR RESULTS */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-purple-600" />
              Incoming Diagnostic Orders from Physicians
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review requests from doctors. Accept to begin assay or Decline with a scientific reason.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
            {pendingTests.length} Pending
          </span>
        </div>

        {pendingTests.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
            No pending diagnostic tests in laboratory queue.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTests.map(test => {
              const pat = patients.find(p => p.id === test.patientId);
              const doc = doctors.find(d => d.id === test.doctorId);
              const isAccepted = test.responseStatus === 'accepted';
              const isDeclined = test.responseStatus === 'declined';

              return (
                <div
                  key={test.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200 text-[11px]">
                        {test.testType} Test
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{pat?.name}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-medium">Dr. {doc?.name || 'Ordering Doctor'}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1">
                      Ordered: {test.requestedDate ? test.requestedDate.split('T')[0] : 'Recent'} • Fee: <strong>${(test.cost ?? 0).toFixed(2)}</strong>
                    </p>
                    {test.technicianNotes && (
                      <p className="text-slate-600 italic mt-0.5">Physician Note: {test.technicianNotes}</p>
                    )}
                    {test.declineReason && (
                      <p className="text-red-700 font-semibold mt-1">Declined: {test.declineReason}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isAccepted && !isDeclined ? (
                      <>
                        <button
                          onClick={() => acceptLabTest(test.id)}
                          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
                        >
                          Accept Order
                        </button>
                        <button
                          onClick={() => {
                            setDecliningTest(test);
                            setDeclineReason('');
                          }}
                          className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs"
                        >
                          Decline
                        </button>
                      </>
                    ) : isAccepted ? (
                      <button
                        onClick={() => {
                          setActiveWorkbenchTest(test);
                          setResultInput('');
                          setTechNotes(test.technicianNotes || '');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                      >
                        <Microscope className="w-4 h-4" />
                        <span>Run Test & Enter Results</span>
                      </button>
                    ) : (
                      <span className="text-red-600 font-bold uppercase text-[10px]">Declined</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: COMPLETED TESTS ARCHIVE */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Verified Findings Sent Back to Physicians
          </h3>
          <span className="text-xs font-semibold text-slate-400">Total completed: {completedTests.length}</span>
        </div>

        <div className="space-y-3 text-xs">
          {completedTests.map(test => {
            const pat = patients.find(p => p.id === test.patientId);
            const doc = doctors.find(d => d.id === test.doctorId);
            return (
              <div key={test.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase text-purple-900 text-xs">{test.testType} Test</span>
                    <span className="font-semibold text-slate-800">{pat?.name}</span>
                    <span className="text-slate-400">• Attending: Dr. {doc?.name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                    Delivered to Doctor
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-slate-700">
                  {test.result}
                </div>
                <p className="text-[11px] text-slate-400">
                  Completed on {test.completedDate?.split('T')[0]} by {test.performedBy || 'Laboratory Scientist'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enter Test Results Modal */}
      {activeWorkbenchTest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Microscope className="w-5 h-5 text-purple-200" />
                <h3 className="font-bold text-base">Enter Diagnostic Test Findings</h3>
              </div>
              <button
                onClick={() => setActiveWorkbenchTest(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishResults} className="p-6 space-y-4">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <p className="font-bold uppercase text-purple-950 text-xs">{activeWorkbenchTest.testType} Test</p>
                <p className="text-purple-700 text-[11px] mt-0.5">
                  Ordered for patient ID: {activeWorkbenchTest.patientId}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quantitative Lab Findings & Clinical Analysis *
                </label>
                <textarea
                  required
                  rows={4}
                  value={resultInput}
                  onChange={e => setResultInput(e.target.value)}
                  placeholder="e.g. Fasting Blood Glucose: 112 mg/dL. Negative for parasites. Hemoglobin 14.2 g/dL."
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Instrument / Technical Remarks
                </label>
                <input
                  type="text"
                  value={techNotes}
                  onChange={e => setTechNotes(e.target.value)}
                  placeholder="e.g. Roche Cobas assay, calibration check passed"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveWorkbenchTest(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-xs"
                >
                  Publish & Send Back to Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Decline Lab Test Dialog */}
      {decliningTest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in duration-150 text-xs">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Decline Lab Order</h3>
            </div>
            <p className="text-slate-500">
              Provide reason for declining. The doctor will be notified immediately to re-order or adjust protocol.
            </p>
            <form onSubmit={handleDeclineSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Decline Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)}
                  placeholder="e.g. Non-fasting specimen, analyzer in maintenance, hemolyzed tube..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDecliningTest(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-xs"
                >
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
