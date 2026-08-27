import React, { useState } from 'react';
import {
  Pill,
  Clock,
  Calendar,
  Plus,
  Bell,
  Check,
  Trash2,
  X,
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
  onDeleteMedication?: (id: string) => void;
  onRecordDose: (petId: string, medId: string, by: string, note?: string) => void;
}

export const MedicationsView: React.FC<MedicationsViewProps> = ({
  pet,
  medications,
  doseLogs,
  familyMembers,
  onAddMedication,
  onUpdateMedication,
  onDeleteMedication,
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
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [timesOfDayStr, setTimesOfDayStr] = useState('08:30, 20:30');
  const [instructions, setInstructions] = useState('');
  const [prescribedByVet, setPrescribedByVet] = useState(pet.vetDoctorName || 'Clínica Veterinaria');
  const [totalDosesTarget, setTotalDosesTarget] = useState<number>(14);

  const activeMeds = medications.filter((m) => m.isActive);
  const pastMeds = medications.filter((m) => !m.isActive);

  const handleCreateMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    const times = timesOfDayStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onAddMedication({
      petId: pet.id,
      name: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      startDate,
      endDate,
      timesOfDay: times.length > 0 ? times : ['08:30'],
      instructions: instructions.trim(),
      isActive: true,
      prescribedByVet: prescribedByVet.trim(),
      totalDosesTarget: Number(totalDosesTarget) || 10,
      dosesGivenCount: 0,
    });

    // Reset form & close
    setName('');
    setDosage('');
    setInstructions('');
    setShowAddModal(false);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (err) {
      // silent
    }
  };

  const handleConfirmDose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedForDose) return;

    onRecordDose(
      pet.id,
      selectedMedForDose.id,
      adminName,
      doseNote.trim() || undefined
    );

    setSelectedMedForDose(null);
    setDoseNote('');

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      // silent
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Control de Medicación y Tratamientos
          </h1>
          <p className="text-xs text-slate-500">
            Registro de tomas, pautas activas y adherencia veterinaria para {pet.name}.
          </p>
        </div>

        <button
          id="open-add-med-btn"
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Tratamiento</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setTab('activos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
            tab === 'activos'
              ? 'bg-indigo-50 text-indigo-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Tratamientos Activos</span>
          <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-indigo-200/80 text-indigo-900">
            {activeMeds.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab('tomas')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
            tab === 'tomas'
              ? 'bg-indigo-50 text-indigo-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Historial de Tomas</span>
          <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-200 text-slate-700">
            {doseLogs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab('historial')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
            tab === 'historial'
              ? 'bg-indigo-50 text-indigo-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Tratamientos Pasados</span>
          <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-200 text-slate-700">
            {pastMeds.length}
          </span>
        </button>
      </div>

      {/* TAB: ACTIVOS */}
      {tab === 'activos' && (
        <div>
          {activeMeds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMeds.map((med) => {
                const percent = med.totalDosesTarget
                  ? Math.min(100, Math.round(((med.dosesGivenCount || 0) / med.totalDosesTarget) * 100))
                  : 0;

                return (
                  <div
                    key={med.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">
                            En Curso
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-1">
                            {med.name}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => onUpdateMedication(med.id, { isActive: false })}
                            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 px-2 py-1 rounded-md"
                          >
                            Concluir
                          </button>
                          {onDeleteMedication && (
                            <button
                              type="button"
                              onClick={() => onDeleteMedication(med.id)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Eliminar tratamiento"
                              aria-label={`Eliminar medicamento ${med.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
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
                      type="button"
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
              <p className="text-sm font-semibold text-slate-700">No hay tratamientos activos</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 mb-4">
                Si el veterinario le receta antibióticos, colirios o antiinflamatorios, regístralos aquí.
              </p>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-xs hover:bg-indigo-100 transition-colors"
              >
                + Añadir Medicamento
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB: TOMAS REGISTRADAS */}
      {tab === 'tomas' && (
        <div className="space-y-3">
          {doseLogs.length > 0 ? (
            doseLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{log.medicationName}</div>
                    <div className="text-slate-500">
                      Administrado por <strong>{log.administeredBy}</strong>
                      {log.note && ` • "${log.note}"`}
                    </div>
                  </div>
                </div>
                <div className="text-right text-slate-400 text-[11px] font-mono">
                  {new Date(log.timestamp).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-8 text-center bg-white rounded-2xl border border-slate-200">
              No hay tomas registradas recientemente.
            </p>
          )}
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
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onUpdateMedication(m.id, { isActive: true })}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-colors"
                >
                  Reactivar
                </button>
                {onDeleteMedication && (
                  <button
                    type="button"
                    onClick={() => onDeleteMedication(m.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Eliminar del historial"
                    aria-label={`Eliminar medicamento ${m.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dose-modal-title"
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="dose-modal-title" className="text-base font-bold text-slate-900">
                    Confirmar Toma de Medicamento
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedMedForDose.name} ({selectedMedForDose.dosage})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMedForDose(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                aria-label="Cerrar modal de confirmación de dosis"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDose} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  ¿Quién administra la dosis?
                </label>
                <select
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                >
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                  <option value="Clínica Veterinaria">Clínica Veterinaria</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nota u observación (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Con un trocito de pavo, sin problemas"
                  value={doseNote}
                  onChange={(e) => setDoseNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedMedForDose(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors"
                >
                  Confirmar Toma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AÑADIR NUEVO TRATAMIENTO */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-med-modal-title"
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 id="add-med-modal-title" className="text-base font-bold text-slate-900">
                  Nuevo Tratamiento / Medicación
                </h3>
                <p className="text-xs text-slate-500">
                  Prescripción veterinaria para {pet.name}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                aria-label="Cerrar modal de nuevo tratamiento"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMedication} className="space-y-3.5 text-xs">
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
                    Total de Tomas Prescritas
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={totalDosesTarget}
                    onChange={(e) => setTotalDosesTarget(parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Veterinario que prescribe
                </label>
                <input
                  type="text"
                  placeholder="Ej. Dr. Carlos Ruiz - Clínica San Antón"
                  value={prescribedByVet}
                  onChange={(e) => setPrescribedByVet(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pautas especiales o modo de administración
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej. Administrar siempre con el estómago lleno para proteger la mucosa gástrica."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors"
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
