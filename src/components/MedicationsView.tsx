import React, { useState } from 'react';
import {
  Pill,
  Clock,
  Calendar,
  Plus,
  Bell,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Pet, Medication, DoseLog, FamilyMember } from '../types';

interface MedicationsViewProps {
  pet: Pet;
  medications: Medication[];
  doseLogs: DoseLog[];
  familyMembers: FamilyMember[];
  onAddMedication: (med: Omit<Medication, 'id'>) => void;
  onUpdateMedication: (id: string, updates: Partial<Medication>) => void;
  onRecordDose: (petId: string, medId: string, by: string, note?: string) => void;
}

export const MedicationsView: React.FC<MedicationsViewProps> = ({
  pet,
  medications,
  doseLogs,
  familyMembers,
  onAddMedication,
  onUpdateMedication,
  onRecordDose,
}) => {
  const [tab, setTab] = useState<'activos' | 'historial' | 'tomas'>('activos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMedForDose, setSelectedMedForDose] = useState<Medication | null>(null);

  // Dose giving form state
  const [adminName, setAdminName] = useState(familyMembers[0]?.name || 'María Gómez');
  const [doseNote, setDoseNote] = useState('');

  // Add med form state
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Cada 12 horas con comida');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [instructions, setInstructions] = useState('');
  const [prescribedByVet, setPrescribedByVet] = useState(pet.vetDoctorName || 'Dra. Elena Santos');
  const [timesOfDayStr, setTimesOfDayStr] = useState('08:30, 20:30');
  const [totalDosesTarget, setTotalDosesTarget] = useState<number>(14);

  const activeMeds = medications.filter((m) => m.isActive);
  const pastMeds = medications.filter((m) => !m.isActive);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const times = timesOfDayStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onAddMedication({
      petId: pet.id,
      name: name.trim(),
      dosage: dosage.trim() || '1 dosis',
      frequency: frequency.trim(),
      startDate,
      endDate,
      instructions: instructions.trim(),
      prescribedByVet: prescribedByVet.trim(),
      isActive: true,
      timesOfDay: times.length > 0 ? times : ['09:00'],
      reminderEnabled: true,
      totalDosesTarget: Number(totalDosesTarget) || 14,
    });

    setShowAddModal(false);
    setName('');
    setDosage('');
    setInstructions('');
  };

  const handleConfirmDose = () => {
    if (!selectedMedForDose) return;
    onRecordDose(pet.id, selectedMedForDose.id, adminName, doseNote);
    setSelectedMedForDose(null);
    setDoseNote('');

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.65 },
      });
    } catch {}
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Medicamentos y Tratamientos
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Control de posología, tomas, recordatorios y registro compartido para {pet.name}.
            </p>
          </div>
        </div>

        <button
          id="add-medication-btn"
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo Tratamiento</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1.5 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTab('activos')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            tab === 'activos'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          Tratamientos en Curso ({activeMeds.length})
        </button>
        <button
          onClick={() => setTab('tomas')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            tab === 'tomas'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          Registro de Dosis ({doseLogs.length})
        </button>
        <button
          onClick={() => setTab('historial')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            tab === 'historial'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          Historial Concluido ({pastMeds.length})
        </button>
      </div>

      {/* TAB: ACTIVOS */}
      {tab === 'activos' && (
        <div className="space-y-4">
          {activeMeds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMeds.map((med) => {
                const percent = med.totalDosesTarget
                  ? Math.min(100, Math.round(((med.dosesGivenCount || 0) / med.totalDosesTarget) * 100))
                  : 50;

                return (
                  <div
                    key={med.id}
                    className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">
                            En Curso
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-1">
                            {med.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => onUpdateMedication(med.id, { isActive: false })}
                          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 px-2 py-1 rounded-md"
                        >
                          Concluir
                        </button>
                      </div>

                      <div className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 inline-block mb-3">
                        💊 Dosis: {med.dosage}
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Frecuencia: <strong className="text-slate-800">{med.frequency}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Horarios: <strong className="text-slate-800">{med.timesOfDay?.join(', ') || '08:30'}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Duración: {med.startDate} hasta {med.endDate}</span>
                        </div>
                        {med.prescribedByVet && (
                          <div className="text-[11px] text-slate-400">
                            Prescrito por: {med.prescribedByVet}
                          </div>
                        )}
                      </div>

                      {med.instructions && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed mb-4">
                          📝 {med.instructions}
                        </p>
                      )}

                      {/* Adherence Progress Bar */}
                      {med.totalDosesTarget && (
                        <div className="mb-4">
                          <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                            <span>Adherencia</span>
                            <span className="text-indigo-700 font-semibold">
                              {med.dosesGivenCount || 0} de {med.totalDosesTarget} tomas ({percent}%)
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button: Dar Dosis */}
                    <button
                      id={`med-give-dose-${med.id}`}
                      onClick={() => setSelectedMedForDose(med)}
                      className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Marcar Dosis como Administrada</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">Sin tratamientos activos</h3>
              <p className="text-xs text-slate-400 mt-1">
                {pet.name} no tiene medicamentos pautados actualmente.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB: TOMAS & AUDIT LOG */}
      {tab === 'tomas' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Registro Auditado de Dosis Administradas
            </h3>
            <span className="text-xs text-slate-400">
              Sincronizado con el equipo familiar
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {doseLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between text-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {log.administeredBy} le administró {log.medicationName} ({log.dosage})
                    </div>
                    {log.notes && (
                      <p className="text-slate-600 mt-0.5 italic">"{log.notes}"</p>
                    )}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400 shrink-0 ml-2 font-mono">
                  {new Date(log.timestamp).toLocaleDateString()}{' '}
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {doseLogs.length === 0 && (
              <p className="text-xs text-slate-400 py-6 text-center">
                Aún no hay tomas registradas en el historial.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB: HISTORIAL */}
      {tab === 'historial' && (
        <div className="space-y-3">
          {pastMeds.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between text-xs"
            >
              <div>
                <h4 className="font-bold text-slate-900">{m.name}</h4>
                <p className="text-slate-500">
                  {m.dosage} • Finalizado el {m.endDate}
                </p>
              </div>
              <button
                onClick={() => onUpdateMedication(m.id, { isActive: true })}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-colors"
              >
                Reactivar
              </button>
            </div>
          ))}
          {pastMeds.length === 0 && (
            <p className="text-xs text-slate-400 py-8 text-center bg-white rounded-2xl border border-slate-200">
              No hay tratamientos pasados concluidos.
            </p>
          )}
        </div>
      )}

      {/* MODAL: REGISTRAR TOMA DE DOSIS */}
      {selectedMedForDose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Confirmar Toma de Medicamento
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedMedForDose.name} ({selectedMedForDose.dosage})
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  ¿Quién le ha administrado la dosis?
                </label>
                <select
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                >
                  {familyMembers.map((fm) => (
                    <option key={fm.id} value={`${fm.name} (${fm.role})`}>
                      {fm.name} ({fm.role})
                    </option>
                  ))}
                  <option value="Otro Cuidador">Otro Cuidador</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Observación o cómo se lo tomó (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Con comida húmeda, sin rechazo"
                  value={doseNote}
                  onChange={(e) => setDoseNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-500 border border-slate-100">
                La toma quedará registrada en el historial compartido y visible para todos los miembros familiares.
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedMedForDose(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDose}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
              >
                Guardar Dosis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AÑADIR TRATAMIENTO */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto border border-slate-200 animate-in fade-in zoom-in duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Nuevo Tratamiento / Medicamento para {pet.name}
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nombre del Medicamento *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Synulox 250mg, Posatex Gotas, FortiFlora..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dosis Exacta *</label>
                  <input
                    type="text"
                    placeholder="Ej. 1 comp. y medio (375mg)"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Frecuencia *</label>
                  <input
                    type="text"
                    placeholder="Ej. Cada 12 horas con comida"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Horas de toma (separadas por comas)
                  </label>
                  <input
                    type="text"
                    placeholder="08:30, 20:30"
                    value={timesOfDayStr}
                    onChange={(e) => setTimesOfDayStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Total Dosis Previstas
                  </label>
                  <input
                    type="number"
                    value={totalDosesTarget}
                    onChange={(e) => setTotalDosesTarget(parseInt(e.target.value) || 14)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Veterinario que lo prescribe
                </label>
                <input
                  type="text"
                  placeholder="Ej. Dra. Elena Santos (Col. 4521)"
                  value={prescribedByVet}
                  onChange={(e) => setPrescribedByVet(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Instrucciones específicas de administración
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej. No administrar en ayunas. Disolver en un poco de agua o mezclar con paté."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
                >
                  Guardar Tratamiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
