import React, { useState } from 'react';
import {
  HeartPulse,
  Syringe,
  Bug,
  Pill,
  AlertCircle,
  Stethoscope,
  Activity,
  Scissors,
  Scale,
  FileEdit,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  Pet,
  HealthRecord,
  HealthRecordCategory,
  PetWeightEntry,
} from '../types';

interface HealthCardViewProps {
  pet: Pet;
  healthRecords: HealthRecord[];
  onAddRecord: (record: Omit<HealthRecord, 'id'>) => void;
  onDeleteRecord: (id: string) => void;
  weightHistory: PetWeightEntry[];
  onAddWeight: (entry: Omit<PetWeightEntry, 'id'>) => void;
}

const CATEGORY_CONFIG: Record<
  HealthRecordCategory,
  { label: string; icon: React.FC<{ className?: string }>; badgeColor: string }
> = {
  vacuna: { label: 'Vacunaciones', icon: Syringe, badgeColor: 'bg-indigo-100 text-indigo-700' },
  desparasitacion_interna: { label: 'Desparasit. Interna', icon: Bug, badgeColor: 'bg-blue-100 text-blue-700' },
  desparasitacion_externa: { label: 'Desparasit. Externa', icon: Bug, badgeColor: 'bg-cyan-100 text-cyan-700' },
  medicamento: { label: 'Medicamentos', icon: Pill, badgeColor: 'bg-amber-100 text-amber-700' },
  alergia: { label: 'Alergias', icon: AlertCircle, badgeColor: 'bg-rose-100 text-rose-700' },
  enfermedad: { label: 'Antecedentes', icon: HeartPulse, badgeColor: 'bg-red-100 text-red-700' },
  consulta: { label: 'Consultas', icon: Stethoscope, badgeColor: 'bg-slate-100 text-slate-700' },
  analisis: { label: 'Análisis Lab', icon: Activity, badgeColor: 'bg-purple-100 text-purple-700' },
  intervencion: { label: 'Cirugías', icon: Scissors, badgeColor: 'bg-violet-100 text-violet-700' },
  peso: { label: 'Evolución Peso', icon: Scale, badgeColor: 'bg-emerald-100 text-emerald-700' },
  nota_vet: { label: 'Notas Vet', icon: FileEdit, badgeColor: 'bg-slate-100 text-slate-700' },
};

export const HealthCardView: React.FC<HealthCardViewProps> = ({
  pet,
  healthRecords,
  onAddRecord,
  onDeleteRecord,
  weightHistory,
  onAddWeight,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<HealthRecordCategory | 'todas'>('todas');
  const [viewMode, setViewMode] = useState<'timeline' | 'peso'>('timeline');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);

  // New Record Form State
  const [newCategory, setNewCategory] = useState<HealthRecordCategory>('vacuna');
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDueDate, setNewDueDate] = useState('');
  const [newVetName, setNewVetName] = useState(pet.vetDoctorName || 'Dra. Elena Santos');
  const [newClinic, setNewClinic] = useState(pet.vetClinicName || 'Hospital Veterinario');
  const [newBatch, setNewBatch] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newSeverity, setNewSeverity] = useState<'leve' | 'moderada' | 'grave'>('moderada');

  // Weight entry form state
  const [weightValue, setWeightValue] = useState<number>(pet.weightKg || 25);
  const [weightDate, setWeightDate] = useState(new Date().toISOString().split('T')[0]);
  const [weightNotes, setWeightNotes] = useState('Control rutinario');

  const filteredRecords = healthRecords.filter((r) => {
    if (selectedFilter === 'todas') return true;
    return r.category === selectedFilter;
  });

  const sortedRecords = [...filteredRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddRecord({
      petId: pet.id,
      category: newCategory,
      title: newTitle.trim(),
      date: newDate,
      dueDate: newDueDate ? newDueDate : undefined,
      vetName: newVetName.trim() || undefined,
      clinic: newClinic.trim() || undefined,
      batchNumber: newBatch.trim() || undefined,
      notes: newNotes.trim() || undefined,
      status: 'activo',
      severity: newCategory === 'alergia' || newCategory === 'enfermedad' ? newSeverity : undefined,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewBatch('');
    setNewNotes('');
    setNewDueDate('');
  };

  const handleCreateWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightValue) return;

    onAddWeight({
      petId: pet.id,
      date: weightDate,
      weightKg: weightValue,
      notes: weightNotes.trim() || undefined,
      bodyConditionScore: 5,
    });

    setShowWeightModal(false);
  };

  // SVG Weight Graph Calculations
  const sortedWeights = [...weightHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const minWeight = Math.min(...sortedWeights.map((w) => w.weightKg), pet.weightKg) - 1;
  const maxWeight = Math.max(...sortedWeights.map((w) => w.weightKg), pet.weightKg) + 1;
  const range = maxWeight - minWeight || 1;

  return (
    <div className="space-y-6 pb-16">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Carnet de Salud Digital
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Historial clínico, vacunas y evolución de {pet.name} ({pet.breed}).
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowWeightModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>+ Registrar Peso</span>
          </button>

          <button
            id="add-health-record-btn"
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nueva Entrada</span>
          </button>
        </div>
      </div>

      {/* View Switcher & Category Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {/* Sub-view tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Timeline Cronológico
            </button>
            <button
              onClick={() => setViewMode('peso')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'peso'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Curva de Peso & BCS
            </button>
          </div>

          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            {sortedRecords.length} registros clínicos
          </span>
        </div>

        {/* Category horizontal filters */}
        {viewMode !== 'peso' && (
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedFilter('todas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                selectedFilter === 'todas'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Todas ({healthRecords.length})
            </button>
            {(Object.keys(CATEGORY_CONFIG) as HealthRecordCategory[]).map((catKey) => {
              const cfg = CATEGORY_CONFIG[catKey];
              const Icon = cfg.icon;
              const count = healthRecords.filter((r) => r.category === catKey).length;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedFilter(catKey)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                    selectedFilter === catKey
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cfg.label}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedFilter === catKey ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* VIEW: WEIGHT EVOLUTION & BCS CHART */}
      {viewMode === 'peso' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Curva de Evolución de Peso
                </h3>
                <p className="text-xs text-slate-500">
                  Control ponderal en el tiempo para {pet.name}. Peso actual:{' '}
                  <span className="font-bold text-indigo-700">{pet.weightKg} kg</span>.
                </p>
              </div>
              <button
                onClick={() => setShowWeightModal(true)}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-xs hover:bg-indigo-700 transition-colors self-start sm:self-auto"
              >
                + Añadir Pesaje
              </button>
            </div>

            {/* Interactive SVG Chart */}
            <div className="relative h-64 w-full bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
              {/* Y-Axis guide lines */}
              <div className="absolute inset-x-8 inset-y-6 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-slate-300 text-[10px] text-slate-400 pb-0.5">
                  {maxWeight.toFixed(1)} kg
                </div>
                <div className="border-b border-dashed border-slate-300 text-[10px] text-slate-400 pb-0.5">
                  {((maxWeight + minWeight) / 2).toFixed(1)} kg
                </div>
                <div className="border-b border-dashed border-slate-300 text-[10px] text-slate-400 pb-0.5">
                  {minWeight.toFixed(1)} kg
                </div>
              </div>

              {/* Points & Line */}
              <svg className="w-full h-full overflow-visible z-10">
                <polyline
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={sortedWeights
                    .map((w, idx) => {
                      const x = (idx / (sortedWeights.length - 1 || 1)) * 90 + 5;
                      const y = 90 - ((w.weightKg - minWeight) / range) * 80;
                      return `${x}%,${y}%`;
                    })
                    .join(' ')}
                />
                {sortedWeights.map((w, idx) => {
                  const x = (idx / (sortedWeights.length - 1 || 1)) * 90 + 5;
                  const y = 90 - ((w.weightKg - minWeight) / range) * 80;
                  return (
                    <g key={w.id} className="cursor-pointer group">
                      <circle
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r="4"
                        className="fill-indigo-600 stroke-white stroke-2 group-hover:scale-125 transition-transform"
                      />
                      <text
                        x={`${x}%`}
                        y={`${y - 10}%`}
                        textAnchor="middle"
                        className="text-[10px] font-semibold fill-slate-800"
                      >
                        {w.weightKg} kg
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* X-Axis Dates */}
              <div className="flex justify-between text-[10px] text-slate-400 px-2 pt-2 border-t border-slate-200">
                {sortedWeights.map((w) => (
                  <span key={w.id}>{w.date.slice(5)}</span>
                ))}
              </div>
            </div>

            {/* Body Condition Score Scale */}
            <div className="mt-6 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1.5">
                Evaluación de Condición Corporal (BCS 1 a 9)
              </h4>
              <p className="text-xs text-indigo-800/90 leading-relaxed">
                Según las revisiones veterinarias, {pet.name} se sitúa en un{' '}
                <span className="font-bold text-indigo-950">BCS 5/9 (Peso Ideal)</span>: costillas
                fácilmente palpables con fina capa de grasa, cintura visible detrás de las costillas vista
                desde arriba y abdomen recogido de perfil.
              </p>
            </div>

            {/* Weights History List */}
            <div className="mt-6 divide-y divide-slate-100">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Historial de Pesajes
              </h4>
              {sortedWeights.map((w) => (
                <div key={w.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-slate-900 text-sm">{w.weightKg} kg</span>
                    <span className="text-slate-500">{w.notes || 'Control'}</span>
                  </div>
                  <span className="text-slate-400 font-mono">{w.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: TIMELINE */}
      {viewMode === 'timeline' && (
        <div className="space-y-4">
          {sortedRecords.length > 0 ? (
            <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {sortedRecords.map((record) => {
                const cfg = CATEGORY_CONFIG[record.category] || CATEGORY_CONFIG.consulta;
                const Icon = cfg.icon;

                return (
                  <div key={record.id} className="relative group">
                    {/* Dot on line */}
                    <div className="absolute -left-6 sm:-left-8 top-2 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs border-2 border-white">
                      <Icon className="w-3 h-3" />
                    </div>

                    {/* Card */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.badgeColor}`}>
                            {cfg.label}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{record.date}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {record.dueDate && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                              Próxima: {record.dueDate}
                            </span>
                          )}
                          <button
                            onClick={() => onDeleteRecord(record.id)}
                            className="p-1 rounded text-slate-300 hover:text-rose-600 transition-colors"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900">
                        {record.title}
                      </h3>

                      {record.notes && (
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                          {record.notes}
                        </p>
                      )}

                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        {record.vetName && <span>👨‍⚕️ {record.vetName}</span>}
                        {record.clinic && <span>🏥 {record.clinic}</span>}
                        {record.batchNumber && (
                          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                            Lote: {record.batchNumber}
                          </span>
                        )}
                        {record.severity && (
                          <span
                            className={`px-2 py-0.5 rounded font-medium text-[10px] ${
                              record.severity === 'grave'
                                ? 'bg-rose-100 text-rose-800'
                                : record.severity === 'moderada'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            Severidad: {record.severity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              <HeartPulse className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No hay registros en esta categoría</h3>
              <p className="text-xs text-slate-400 mt-1">
                Pulsa en "+ Nueva Entrada" para añadir vacunas, cirugías o consultas.
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD HEALTH RECORD */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto border border-slate-200 animate-in fade-in zoom-in duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Nueva Entrada en el Carnet de Salud
            </h3>

            <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Categoría</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as HealthRecordCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                >
                  {(Object.keys(CATEGORY_CONFIG) as HealthRecordCategory[])
                    .filter((c) => c !== 'peso')
                    .map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_CONFIG[c].label}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Título / Concepto *</label>
                <input
                  type="text"
                  placeholder="Ej. Vacuna Antirrábica, Desparasitación Milbemax, Revisión dental..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fecha Realización</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Próxima Cita / Vencimiento
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Veterinario / Colegiado</label>
                  <input
                    type="text"
                    placeholder="Ej. Dra. Elena Santos"
                    value={newVetName}
                    onChange={(e) => setNewVetName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Clínica / Hospital</label>
                  <input
                    type="text"
                    placeholder="Ej. San Antón"
                    value={newClinic}
                    onChange={(e) => setNewClinic(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {newCategory === 'vacuna' && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nº Lote de la Vacuna</label>
                  <input
                    type="text"
                    placeholder="Ej. NOB-RAB-9921"
                    value={newBatch}
                    onChange={(e) => setNewBatch(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              )}

              {(newCategory === 'alergia' || newCategory === 'enfermedad') && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Severidad</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  >
                    <option value="leve">Leve</option>
                    <option value="moderada">Moderada</option>
                    <option value="grave">Grave</option>
                  </select>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notas y Recomendaciones</label>
                <textarea
                  rows={3}
                  placeholder="Detalles clínicos, pautas, reacciones observadas..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
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
                  Guardar en Carnet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD WEIGHT ENTRY */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Registrar Nuevo Pesaje para {pet.name}
            </h3>

            <form onSubmit={handleCreateWeight} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Peso en Kilogramos (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="120"
                  value={weightValue}
                  onChange={(e) => setWeightValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-base font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Fecha</label>
                <input
                  type="date"
                  value={weightDate}
                  onChange={(e) => setWeightDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notas u Observación</label>
                <input
                  type="text"
                  placeholder="Ej. Pesaje en báscula veterinaria tras paseo"
                  value={weightNotes}
                  onChange={(e) => setWeightNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWeightModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
                >
                  Guardar Peso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
