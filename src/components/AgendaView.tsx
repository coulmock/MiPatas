import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Bell,
  Stethoscope,
  Syringe,
  Scissors,
  Bug,
  Footprints,
  GraduationCap,
  Home,
  ShieldCheck,
  Pill,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Pet, CalendarEvent, EventCategory } from '../types';

interface AgendaViewProps {
  pet: Pet;
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
  onToggleEvent: (id: string) => void;
}

const EVENT_CONFIG: Record<
  EventCategory,
  { label: string; icon: React.FC<{ className?: string }>; color: string }
> = {
  veterinario: { label: 'Veterinario', icon: Stethoscope, color: 'blue' },
  vacunacion: { label: 'Vacunación', icon: Syringe, color: 'emerald' },
  peluqueria: { label: 'Peluquería', icon: Scissors, color: 'purple' },
  desparasitacion: { label: 'Desparasitación', icon: Bug, color: 'teal' },
  paseo: { label: 'Paseo', icon: Footprints, color: 'amber' },
  educacion: { label: 'Adiestramiento', icon: GraduationCap, color: 'indigo' },
  guarderia: { label: 'Guardería', icon: Home, color: 'orange' },
  seguro: { label: 'Seguro & Ley', icon: ShieldCheck, color: 'slate' },
  medicamento: { label: 'Medicación', icon: Pill, color: 'rose' },
  otro: { label: 'Otros', icon: CalendarIcon, color: 'gray' },
};

export const AgendaView: React.FC<AgendaViewProps> = ({
  pet,
  events,
  onAddEvent,
  onDeleteEvent,
  onToggleEvent,
}) => {
  const [viewType, setViewType] = useState<'lista' | 'mes'>('mes');
  const [filterCategory, setFilterCategory] = useState<EventCategory | 'todas'>('todas');
  const [showAddModal, setShowAddModal] = useState(false);

  // Month Calendar Navigation
  const [currentDate, setCurrentDate] = useState(new Date());

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('veterinario');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:45');
  const [location, setLocation] = useState(pet.vetClinicName || '');
  const [notes, setNotes] = useState('');
  const [reminderMinutes, setReminderMinutes] = useState(1440);

  const filteredEvents = events.filter((e) => {
    if (filterCategory === 'todas') return true;
    return e.category === filterCategory;
  });

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent({
      petId: pet.id,
      title: title.trim(),
      category,
      date,
      time: time || undefined,
      endTime: endTime || undefined,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      reminderBeforeMinutes: reminderMinutes,
      isCompleted: false,
    });

    setShowAddModal(false);
    setTitle('');
    setNotes('');
  };

  // Calendar Generation Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const startingDay = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Agenda Exclusiva de {pet.name}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Citas veterinarias, peluquería, vacunas, desparasitaciones y paseos programados.
            </p>
          </div>
        </div>

        <button
          id="add-event-btn"
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Agendar Evento</span>
        </button>
      </div>

      {/* Filter Chips & View Mode Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewType('mes')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewType === 'mes'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vista Mensual
            </button>
            <button
              onClick={() => setViewType('lista')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewType === 'lista'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vista Lista
            </button>
          </div>

          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            {filteredEvents.length} eventos programados
          </span>
        </div>

        {/* Category filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setFilterCategory('todas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              filterCategory === 'todas'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Todas ({events.length})
          </button>
          {(Object.keys(EVENT_CONFIG) as EventCategory[]).map((catKey) => {
            const cfg = EVENT_CONFIG[catKey];
            const Icon = cfg.icon;
            const count = events.filter((e) => e.category === catKey).length;
            return (
              <button
                key={catKey}
                onClick={() => setFilterCategory(catKey)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  filterCategory === catKey
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cfg.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      filterCategory === catKey ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* MONTH CALENDAR VIEW */}
      {viewType === 'mes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center space-x-1">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
              <div key={day} className="font-semibold text-slate-400 py-1.5 uppercase text-[10px]">
                {day}
              </div>
            ))}

            {/* Empty prefix cells */}
            {Array.from({ length: startingDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-20 bg-slate-50/50 rounded-xl" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayEvents = events.filter((e) => e.date === formattedDate);
              const isToday =
                new Date().toISOString().split('T')[0] === formattedDate;

              return (
                <div
                  key={dayNum}
                  onClick={() => {
                    setDate(formattedDate);
                    setShowAddModal(true);
                  }}
                  className={`h-16 sm:h-20 p-1 sm:p-1.5 rounded-xl border text-left flex flex-col justify-between cursor-pointer transition-colors hover:border-indigo-400 hover:bg-indigo-50/20 ${
                    isToday
                      ? 'border-indigo-600 bg-indigo-50/40 font-bold'
                      : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center'
                          : 'text-slate-700'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    )}
                  </div>

                  {/* Mini Event Badges */}
                  <div className="space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="text-[9px] px-1 py-0.2 rounded bg-indigo-100 text-indigo-900 font-medium truncate leading-tight"
                      >
                        {ev.time ? `${ev.time} ` : ''}{ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[8px] text-slate-400 font-medium pl-0.5">
                        +{dayEvents.length - 2} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EVENT LIST VIEW */}
      <div className="space-y-3">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((evt) => {
            const cfg = EVENT_CONFIG[evt.category] || EVENT_CONFIG.otro;
            const Icon = cfg.icon;

            return (
              <div
                key={evt.id}
                className={`p-5 rounded-2xl bg-white border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  evt.isCompleted
                    ? 'border-slate-200 opacity-60 bg-slate-50'
                    : 'border-slate-200 shadow-sm hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {cfg.label}
                      </span>
                      {evt.reminderBeforeMinutes && (
                        <span className="text-[10px] text-indigo-700 font-medium flex items-center gap-0.5">
                          <Bell className="w-3 h-3" /> Recordatorio activo
                        </span>
                      )}
                    </div>

                    <h3 className={`text-sm sm:text-base font-bold ${evt.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {evt.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
                        <strong>{evt.date}</strong>
                      </span>
                      {evt.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          {evt.time} {evt.endTime ? `- ${evt.endTime}` : ''}
                        </span>
                      )}
                      {evt.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {evt.location}
                        </span>
                      )}
                    </div>

                    {evt.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1">
                        {evt.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onToggleEvent(evt.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      evt.isCompleted
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                    }`}
                  >
                    {evt.isCompleted ? 'Completado ✓' : 'Marcar Hecho'}
                  </button>

                  <button
                    onClick={() => onDeleteEvent(evt.id)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">Sin eventos en la agenda</h3>
            <p className="text-xs text-slate-400 mt-1">
              Programa paseos, visitas al veterinario o recordatorios de seguro.
            </p>
          </div>
        )}
      </div>

      {/* MODAL: ADD CALENDAR EVENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto border border-slate-200 animate-in fade-in zoom-in duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Agendar Nuevo Evento para {pet.name}
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Título del Evento *</label>
                <input
                  type="text"
                  placeholder="Ej. Revisión anual veterinaria, Baño y corte, Vacuna Rabia..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tipo de Evento</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                >
                  {(Object.keys(EVENT_CONFIG) as EventCategory[]).map((cat) => (
                    <option key={cat} value={cat}>
                      {EVENT_CONFIG[cat].label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hora Fin</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lugar / Ubicación</label>
                <input
                  type="text"
                  placeholder="Ej. Clínica San Antón, Parque del Retiro, En casa..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Recordatorio Automático Previo
                </label>
                <select
                  value={reminderMinutes}
                  onChange={(e) => setReminderMinutes(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                >
                  <option value={15}>15 minutos antes</option>
                  <option value={60}>1 hora antes</option>
                  <option value={120}>2 horas antes</option>
                  <option value={1440}>1 día antes</option>
                  <option value={2880}>2 días antes</option>
                  <option value={4320}>3 días antes</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notas adicionales</label>
                <textarea
                  rows={2}
                  placeholder="Instrucciones, recordatorios de ayuno, qué llevar..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  Guardar en Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
