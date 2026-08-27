import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Plus,
  Trash2,
  ShieldCheck,
  Syringe,
  Bug,
  Pill,
  Check,
} from 'lucide-react';
import { Pet, Reminder, HealthRecordCategory } from '../types';

interface RemindersViewProps {
  pet: Pet;
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (reminder: Omit<Reminder, 'id'>) => void;
  onDeleteReminder: (id: string) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  pet,
  reminders,
  onToggleReminder,
  onAddReminder,
  onDeleteReminder,
}) => {
  const [tab, setTab] = useState<'pendientes' | 'completados'>('pendientes');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add reminder form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HealthRecordCategory>('vacuna');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('09:00');
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('once');
  const [reasonLaw, setReasonLaw] = useState('');
  const [urgency, setUrgency] = useState<'baja' | 'media' | 'alta'>('media');

  const pending = reminders.filter((r) => !r.isCompleted);
  const completed = reminders.filter((r) => r.isCompleted);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddReminder({
      petId: pet.id,
      title: title.trim(),
      category,
      dueDate,
      dueTime: dueTime || undefined,
      frequency,
      isCompleted: false,
      reasonSpanishLaw: reasonLaw.trim() || undefined,
      urgency,
    });

    setShowAddModal(false);
    setTitle('');
    setReasonLaw('');
  };

  const getCategoryIcon = (cat: HealthRecordCategory) => {
    switch (cat) {
      case 'vacuna':
        return <Syringe className="w-4 h-4 text-indigo-600" />;
      case 'desparasitacion_interna':
      case 'desparasitacion_externa':
        return <Bug className="w-4 h-4 text-indigo-600" />;
      case 'medicamento':
        return <Pill className="w-4 h-4 text-indigo-600" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Recordatorios y Obligaciones
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Avisos preventivos, vacunas oficiales, desparasitaciones y normativa para {pet.name}.
            </p>
          </div>
        </div>

        <button
          id="add-custom-reminder-btn"
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo Recordatorio</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1.5 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTab('pendientes')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            tab === 'pendientes'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          Pendientes ({pending.length})
        </button>
        <button
          onClick={() => setTab('completados')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            tab === 'completados'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          Completados ({completed.length})
        </button>
      </div>

      {/* Reminder Cards List */}
      <div className="space-y-3">
        {(tab === 'pendientes' ? pending : completed).map((rem) => (
          <div
            key={rem.id}
            className={`p-5 rounded-2xl bg-white border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              rem.isCompleted
                ? 'border-slate-200 opacity-60 bg-slate-50'
                : rem.urgency === 'alta'
                ? 'border-rose-200 bg-rose-50/20 shadow-sm'
                : 'border-slate-200 shadow-sm hover:border-indigo-200'
            }`}
          >
            <div className="flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100/50">
                {getCategoryIcon(rem.category)}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                    {rem.category.replace('_', ' ')}
                  </span>

                  {rem.frequency !== 'once' && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Recurrente ({rem.frequency})
                    </span>
                  )}

                  {rem.urgency === 'alta' && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      Prioridad Alta
                    </span>
                  )}
                </div>

                <h3 className={`text-sm sm:text-base font-bold ${rem.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                  {rem.title}
                </h3>

                {rem.reasonSpanishLaw && (
                  <p className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{rem.reasonSpanishLaw}</span>
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Fecha de vencimiento: <strong className="text-slate-700">{rem.dueDate}</strong> {rem.dueTime ? `a las ${rem.dueTime}` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => onToggleReminder(rem.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  rem.isCompleted
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{rem.isCompleted ? 'Reabrir' : 'Completar'}</span>
              </button>

              <button
                onClick={() => onDeleteReminder(rem.id)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 transition-colors"
                title="Eliminar recordatorio"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {(tab === 'pendientes' ? pending : completed).length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">
              {tab === 'pendientes' ? '¡Todo al día!' : 'No hay recordatorios completados'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {tab === 'pendientes'
                ? 'No tienes tareas ni avisos preventivos pendientes.'
                : 'Los recordatorios que completes se listarán aquí.'}
            </p>
          </div>
        )}
      </div>

      {/* MODAL: ADD REMINDER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto border border-slate-200 animate-in fade-in zoom-in duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Crear Nuevo Recordatorio para {pet.name}
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Concepto del Recordatorio *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Pipeta antiparasitaria mensual, Poner collar Leishmania, Renovar póliza..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as HealthRecordCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  >
                    <option value="vacuna">Vacunación Oficial</option>
                    <option value="desparasitacion_interna">Desparasitación Interna</option>
                    <option value="desparasitacion_externa">Desparasitación Externa</option>
                    <option value="medicamento">Toma de Medicamento</option>
                    <option value="consulta">Revisión Veterinaria</option>
                    <option value="nota_vet">Seguro / Documentación</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Periodicidad</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  >
                    <option value="once">Puntual (una sola vez)</option>
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                    <option value="quarterly">Trimestral (cada 3 meses)</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hora del Aviso</label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Fundamento Normativo o Sanitario (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Ley 7/2023 Bienestar Animal, Ordenanza Municipal Madrid..."
                  value={reasonLaw}
                  onChange={(e) => setReasonLaw(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nivel de Urgencia</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                >
                  <option value="baja">Baja (rutina)</option>
                  <option value="media">Media (importante)</option>
                  <option value="alta">Alta (obligación legal o salud crítica)</option>
                </select>
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
                  Guardar Recordatorio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
