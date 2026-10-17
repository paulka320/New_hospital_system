import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Clock,
  HeartPulse,
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Stethoscope,
  Filter,
} from 'lucide-react';
import { Visit, VisitStatus } from '../../types';
import { useHospital } from '../../context/HospitalContext';

export const ReceptionView: React.FC = () => {
  const { visits, addVisit, updateVisit, patients, doctors } = useHospital();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);

  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    status: 'waiting' as VisitStatus,
    vitals: {
      bloodPressure: '120/80 mmHg',
      heartRate: '72 bpm',
      temperature: '36.8 °C',
      oxygenSaturation: '98 %',
      respiratoryRate: '16 /min',
      weight: '70 kg',
    },
    notes: '',
  });

  const handleOpenCheckIn = () => {
    setEditingVisit(null);
    setFormData({
      patientId: patients[0]?.id || '',
      doctorId: doctors[0]?.id || '',
      status: 'waiting',
      vitals: {
        bloodPressure: '120/80 mmHg',
        heartRate: '72 bpm',
        temperature: '36.8 °C',
        oxygenSaturation: '98 %',
        respiratoryRate: '16 /min',
        weight: '70 kg',
      },
      notes: '',
    });
    setIsCheckInOpen(true);
  };

  const handleOpenEdit = (v: Visit) => {
    setEditingVisit(v);
    setFormData({
      patientId: v.patientId,
      doctorId: v.doctorId || doctors[0]?.id || '',
      status: v.status,
      vitals: {
        bloodPressure: v.vitals?.bloodPressure || '120/80 mmHg',
        heartRate: v.vitals?.heartRate || '72 bpm',
        temperature: v.vitals?.temperature || '36.8 °C',
        oxygenSaturation: v.vitals?.oxygenSaturation || '98 %',
        respiratoryRate: v.vitals?.respiratoryRate || '16 /min',
        weight: v.vitals?.weight || '70 kg',
      },
      notes: v.notes || '',
    });
    setIsCheckInOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVisit) {
      updateVisit(editingVisit.id, {
        doctorId: formData.doctorId,
        status: formData.status,
        vitals: formData.vitals,
        notes: formData.notes,
      });
    } else {
      addVisit({
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        visitDate: new Date().toISOString().split('T')[0],
        status: formData.status,
        vitals: formData.vitals,
        notes: formData.notes,
      });
    }
    setIsCheckInOpen(false);
  };

  const filteredVisits = visits.filter(v => {
    if (statusFilter === 'all') return true;
    return v.status === statusFilter;
  });

  const waitingCount = visits.filter(v => v.status === 'waiting').length;
  const inProgressCount = visits.filter(v => v.status === 'in_progress').length;
  const completedCount = visits.filter(v => v.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Reception & Patient Triage Desk</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time lobby check-in, vital signs logging, and queue monitoring
          </p>
        </div>

        <button
          onClick={handleOpenCheckIn}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Check-in Patient</span>
        </button>
      </div>

      {/* Triage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border-l-4 border-amber-500 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400">Waiting in Lobby</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{waitingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border-l-4 border-indigo-600 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400">In Clinical Exam</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{inProgressCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border-l-4 border-emerald-600 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400">Completed Today</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{completedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Active Patient Visits</h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">All Visits</option>
              <option value="waiting">Waiting</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
              <tr>
                <th className="px-5 py-3.5">Visit Date</th>
                <th className="px-5 py-3.5">Patient</th>
                <th className="px-5 py-3.5">Assigned Doctor</th>
                <th className="px-5 py-3.5">Vital Signs</th>
                <th className="px-5 py-3.5">Queue Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-xs">
                    No active triage visits in queue.
                  </td>
                </tr>
              ) : (
                filteredVisits.map(visit => {
                  const pat = patients.find(p => p.id === visit.patientId);
                  const doc = doctors.find(d => d.id === visit.doctorId);

                  return (
                    <tr key={visit.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-slate-800">
                        {visit.visitDate}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 text-xs">{pat?.name || 'Unknown'}</p>
                        <p className="text-[11px] text-slate-400">ID: {pat?.id}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-700">
                        Dr. {doc?.name || 'On Duty'}
                      </td>
                      <td className="px-5 py-4">
                        {visit.vitals ? (
                          <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-700">
                            {visit.vitals.bloodPressure && (
                              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                BP: {visit.vitals.bloodPressure}
                              </span>
                            )}
                            {visit.vitals.heartRate && (
                              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                HR: {visit.vitals.heartRate}
                              </span>
                            )}
                            {visit.vitals.temperature && (
                              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                Temp: {visit.vitals.temperature}
                              </span>
                            )}
                            {visit.vitals.oxygenSaturation && (
                              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                SpO2: {visit.vitals.oxygenSaturation}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">No vitals logged</span>
                        )}
                        {visit.notes && <p className="text-[11px] text-slate-500 mt-1">{visit.notes}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            visit.status === 'waiting'
                              ? 'bg-amber-100 text-amber-800'
                              : visit.status === 'in_progress'
                              ? 'bg-indigo-100 text-indigo-800'
                              : visit.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {visit.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {visit.status === 'waiting' && (
                            <button
                              onClick={() => updateVisit(visit.id, { status: 'in_progress' })}
                              className="px-2.5 py-1 text-xs rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold"
                            >
                              Call to Exam
                            </button>
                          )}
                          {visit.status === 'in_progress' && (
                            <button
                              onClick={() => updateVisit(visit.id, { status: 'completed' })}
                              className="px-2.5 py-1 text-xs rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold"
                            >
                              Discharge
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(visit)}
                            className="px-2.5 py-1 text-xs rounded border border-slate-300 text-slate-600 hover:bg-slate-100"
                          >
                            Update Vitals
                          </button>
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

      {/* Check-In / Vitals Modal */}
      {isCheckInOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base">
                  {editingVisit ? 'Update Patient Vitals' : 'Patient Check-in & Triage'}
                </h3>
              </div>
              <button
                onClick={() => setIsCheckInOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                  <select
                    disabled={!!editingVisit}
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
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Physician *</label>
                  <select
                    value={formData.doctorId}
                    onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialization})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Queue Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as VisitStatus })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="waiting">Waiting in Lobby</option>
                  <option value="in_progress">In Consultation</option>
                  <option value="completed">Completed / Discharged</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="font-bold text-slate-800 text-xs uppercase mb-3">Triage Vital Signs</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Blood Pressure</label>
                    <input
                      type="text"
                      value={formData.vitals.bloodPressure}
                      onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, bloodPressure: e.target.value } })}
                      placeholder="120/80 mmHg"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Heart Rate / Pulse</label>
                    <input
                      type="text"
                      value={formData.vitals.heartRate}
                      onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, heartRate: e.target.value } })}
                      placeholder="72 bpm"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Body Temperature</label>
                    <input
                      type="text"
                      value={formData.vitals.temperature}
                      onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, temperature: e.target.value } })}
                      placeholder="36.8 °C"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">SpO2 Oxygen Sat</label>
                    <input
                      type="text"
                      value={formData.vitals.oxygenSaturation}
                      onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, oxygenSaturation: e.target.value } })}
                      placeholder="98 %"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Respiratory Rate</label>
                    <input
                      type="text"
                      value={formData.vitals.respiratoryRate}
                      onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, respiratoryRate: e.target.value } })}
                      placeholder="16 /min"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Patient Weight</label>
                    <input
                      type="text"
                      value={formData.vitals.weight}
                      onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, weight: e.target.value } })}
                      placeholder="70 kg"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nurse / Reception Triage Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Patient presenting symptoms or mobility assistance required..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckInOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Save Check-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
