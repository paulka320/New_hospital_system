import React, { useState } from 'react';
import {
  FlaskConical,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertCircle,
  X,
  Stethoscope,
  Microscope,
} from 'lucide-react';
import { LaboratoryTest, LabTestType } from '../../types';
import { useHospital } from '../../context/HospitalContext';

export const LaboratoryView: React.FC = () => {
  const { labTests, addLabTest, completeLabTest, patients, doctors } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Modals
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [completingTest, setCompletingTest] = useState<LaboratoryTest | null>(null);
  const [resultInput, setResultInput] = useState('');
  const [techNotesInput, setTechNotesInput] = useState('');

  // Order form
  const [orderPatientId, setOrderPatientId] = useState(patients[0]?.id || '');
  const [orderDoctorId, setOrderDoctorId] = useState(doctors[0]?.id || '');
  const [orderType, setOrderType] = useState<LabTestType>('blood');
  const [orderNotes, setOrderNotes] = useState('');

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLabTest({
      patientId: orderPatientId,
      doctorId: orderDoctorId,
      testType: orderType,
      requestedDate: new Date().toISOString(),
      technicianNotes: orderNotes,
    });
    setOrderNotes('');
    setIsOrderOpen(false);
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingTest || !resultInput) return;
    completeLabTest(completingTest.id, resultInput, techNotesInput);
    setCompletingTest(null);
    setResultInput('');
    setTechNotesInput('');
  };

  const filteredTests = labTests.filter(test => {
    const pat = patients.find(p => p.id === test.patientId);
    const matchesSearch =
      (pat?.name && pat.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      test.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.result && test.result.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === 'all' || test.testType === typeFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && test.completed) ||
      (statusFilter === 'pending' && !test.completed);

    return matchesSearch && matchesType && matchesStatus;
  });

  const pendingCount = labTests.filter(t => !t.completed).length;
  const completedCount = labTests.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Diagnostic Laboratory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pathology assays, radiologic imaging orders, and electronic diagnostic results
          </p>
        </div>

        <button
          onClick={() => setIsOrderOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Order Laboratory Test</span>
        </button>
      </div>

      {/* Laboratory metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border-l-4 border-purple-600 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400">Total Diagnostic Tests</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{labTests.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FlaskConical className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border-l-4 border-amber-500 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400">Pending in Analysis</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border-l-4 border-emerald-600 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400">Completed & Verified</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{completedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tests, patients, results..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Test Type:</span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">All Types</option>
              <option value="blood">Blood Test</option>
              <option value="malaria">Malaria Test</option>
              <option value="covid">COVID-19 Test</option>
              <option value="urine">Urine Test</option>
              <option value="xray">X-Ray</option>
              <option value="ultrasound">Ultrasound</option>
              <option value="ct_scan">CT Scan</option>
              <option value="ecg">ECG</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Only</option>
              <option value="completed">Completed Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
              <tr>
                <th className="px-5 py-3.5">Test Type</th>
                <th className="px-5 py-3.5">Patient</th>
                <th className="px-5 py-3.5">Physician</th>
                <th className="px-5 py-3.5">Ordered Date</th>
                <th className="px-5 py-3.5">Results & Findings</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-xs">
                    No diagnostic tests found for current filter.
                  </td>
                </tr>
              ) : (
                filteredTests.map(test => {
                  const pat = patients.find(p => p.id === test.patientId);
                  const doc = doctors.find(d => d.id === test.doctorId);

                  return (
                    <tr key={test.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-900 text-xs uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                          {test.testType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 text-xs">{pat?.name || 'Unknown'}</p>
                        <p className="text-[11px] text-slate-400">{pat?.phone}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-700">
                        Dr. {doc?.name || 'Staff'}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 font-mono">
                        {test.requestedDate.split('T')[0]}
                      </td>
                      <td className="px-5 py-4 text-xs max-w-xs">
                        {test.result ? (
                          <p className="text-slate-700 line-clamp-2 font-mono bg-slate-50 p-1.5 rounded border border-slate-200/80">
                            {test.result}
                          </p>
                        ) : (
                          <span className="text-amber-700 italic text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Awaiting specimen processing
                          </span>
                        )}
                        {test.technicianNotes && (
                          <p className="text-[10px] text-slate-400 mt-1 truncate">
                            Note: {test.technicianNotes}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            test.completed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {test.completed ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {!test.completed ? (
                          <button
                            onClick={() => {
                              setCompletingTest(test);
                              setResultInput('');
                              setTechNotesInput(test.technicianNotes || '');
                            }}
                            className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs"
                          >
                            Enter Results
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setCompletingTest(test);
                              setResultInput(test.result || '');
                              setTechNotesInput(test.technicianNotes || '');
                            }}
                            className="px-2.5 py-1 rounded border border-slate-300 text-slate-600 text-xs hover:bg-slate-100"
                          >
                            Edit Results
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Lab Test Modal */}
      {isOrderOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Microscope className="w-5 h-5 text-purple-300" />
                <h3 className="font-bold text-base">Order Laboratory Diagnostic Test</h3>
              </div>
              <button
                onClick={() => setIsOrderOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                <select
                  value={orderPatientId}
                  onChange={e => setOrderPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ordering Physician *</label>
                <select
                  value={orderDoctorId}
                  onChange={e => setOrderDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialization})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test Type *</label>
                <select
                  value={orderType}
                  onChange={e => setOrderType(e.target.value as LabTestType)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="blood">Blood Test (CBC, Metabolic Panel, Lipid)</option>
                  <option value="malaria">Malaria Smear / Rapid Antigen Test</option>
                  <option value="covid">COVID-19 RT-PCR / Antigen</option>
                  <option value="urine">Urinalysis & Microscopy</option>
                  <option value="xray">Digital X-Ray Radiography</option>
                  <option value="ultrasound">Ultrasound Sonography</option>
                  <option value="ct_scan">CT Scan Computed Tomography</option>
                  <option value="ecg">12-Lead Electrocardiogram (ECG)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physician Clinical Remarks / Reason</label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  placeholder="Clinical indications or specific markers requested..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOrderOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-xs"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enter Test Results Modal */}
      {completingTest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-purple-300" />
                <h3 className="font-bold text-base">Enter Diagnostic Lab Results</h3>
              </div>
              <button
                onClick={() => setCompletingTest(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCompleteSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <p className="font-bold text-purple-900 uppercase">{completingTest.testType} Test</p>
                <p className="text-purple-700 text-[11px] mt-0.5">
                  Ordered on {completingTest.requestedDate.split('T')[0]}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Diagnostic Findings & Quantitative Values *
                </label>
                <textarea
                  required
                  rows={4}
                  value={resultInput}
                  onChange={e => setResultInput(e.target.value)}
                  placeholder="e.g. Fasting Blood Glucose: 92 mg/dL. Normal range 70-99 mg/dL. Negative for ketones."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Technician / Instrument Notes
                </label>
                <input
                  type="text"
                  value={techNotesInput}
                  onChange={e => setTechNotesInput(e.target.value)}
                  placeholder="Equipment used, quality control parameters..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCompletingTest(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Publish Lab Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
