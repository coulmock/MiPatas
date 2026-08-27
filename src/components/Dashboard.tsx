import React, { useState } from 'react';
import {
  HeartPulse,
  Pill,
  Calendar,
  Sparkles,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
  Scale,
  ShieldCheck,
  Building2,
  Bell,
  Stethoscope,
  Activity,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Pet,
  HealthRecord,
  Medication,
  CalendarEvent,
  Reminder,
  DoseLog,
  ActivityLog,
  FamilyMember,
} from '../types';
import { NavTab } from './Navbar';

interface DashboardProps {
  pet: Pet;
  allPets: Pet[];
  healthRecords: HealthRecord[];
  medications: Medication[];
  calendarEvents: CalendarEvent[];
  reminders: Reminder[];
  doseLogs: DoseLog[];
  recentActivities: ActivityLog[];
  familyMembers: FamilyMember[];
  onNavigate: (tab: NavTab) => void;
  onRecordDose: (petId: string, medId: string, by: string, note?: string) => void;
  onToggleReminder: (reminderId: string) => void;
  onOpenAddEventModal: () => void;
  onOpenAddHealthModal: () => void;
  onOpenWeightModal: () => void;
  onOpenLawModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  pet,
  healthRecords,
  medications,
  calendarEvents,
  reminders,
  doseLogs,
  recentActivities,
  familyMembers,
  onNavigate,
  onRecordDose,
  onToggleReminder,
  onOpenAddEventModal,
  onOpenAddHealthModal,
  onOpenWeightModal,
  onOpenLawModal,
}) => {
  const [giveDoseModalMed, setGiveDoseModalMed] = useState<Medication | null>(null);
  const [selectedAdminName, setSelectedAdminName] = useState<string>(
    familyMembers[0]?.name || 'María Gómez'
  );
  const [doseNotes, setDoseNotes] = useState<string>('');

  // Calculate age string
  const getAgeString = (birthDateStr: string) => {
    try {
      const birth = new Date(birthDateStr);
      const now = new Date();
      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      if (months < 0) {
        years--;
        months += 12;
      }
      if (years === 0) return `${months} meses`;
      return `${years} años${months > 0 ? ` y ${months} meses` : ''}`;
    } catch {
      return 'Edad no especificada';
    }
  };

  // Find next vaccine
  const vaccines = healthRecords.filter((r) => r.category === 'vacuna' && r.dueDate);
  const nextVaccine = vaccines.sort(
    (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
  )[0];

  // Find next calendar event
  const upcomingEvents = calendarEvents
    .filter((e) => !e.isCompleted && new Date(e.date).getTime() >= new Date().setHours(0, 0, 0, 0))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextEvent = upcomingEvents[0];

  // Active medications
  const activeMedications = medications.filter((m) => m.isActive);

  // Today's pending reminders
  const pendingReminders = reminders.filter((r) => !r.isCompleted);

  // Critical Alerts detection
  const criticalAlerts: {
    id: string;
    title: string;
    desc: string;
    type: 'warning' | 'urgent';
    actionTab?: NavTab;
  }[] = [];

  // Check mandatory insurance
  if (!pet.hasMandatoryCivilInsurance || !pet.insurancePolicyNumber) {
    criticalAlerts.push({
      id: 'alert-insurance',
      title: 'Seguro de Responsabilidad Civil Pendiente',
      desc: 'Obligatorio en España según la Ley 7/2023 de Bienestar Animal para perros.',
      type: 'urgent',
      actionTab: 'perfil',
    });
  }

  // Check upcoming vaccine within 30 days
  if (nextVaccine && nextVaccine.dueDate) {
    const daysToVaccine = Math.ceil(
      (new Date(nextVaccine.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysToVaccine <= 30 && daysToVaccine >= 0) {
      criticalAlerts.push({
        id: 'alert-vaccine',
        title: `Próxima vacuna: ${nextVaccine.title}`,
        desc: `Vence en ${daysToVaccine} días (${nextVaccine.dueDate}). Revisa la cita con tu clínica.`,
        type: 'warning',
        actionTab: 'salud',
      });
    } else if (daysToVaccine < 0) {
      criticalAlerts.push({
        id: 'alert-vaccine-overdue',
        title: `Vacuna vencida: ${nextVaccine.title}`,
        desc: `Caducó el ${nextVaccine.dueDate}. Es fundamental actualizar la cartilla veterinaria.`,
        type: 'urgent',
        actionTab: 'salud',
      });
    }
  }

  const handleGiveDoseSubmit = () => {
    if (!giveDoseModalMed) return;
    onRecordDose(pet.id, giveDoseModalMed.id, selectedAdminName, doseNotes);
    setGiveDoseModalMed(null);
    setDoseNotes('');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}
  };

  return (
    <div className="space-y-6 pb-16">
      {/* SECTION 1: WARM & FRIENDLY HERO STATUS PANEL */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/60 rounded-3xl p-6 text-white border-2 border-amber-500/20 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Pet Info & Status Badge */}
          <div className="flex items-center space-x-5">
            <div
              className="relative cursor-pointer group"
              onClick={() => onNavigate('perfil')}
            >
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 group-hover:scale-105 transition-all shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-lg shadow-xs">
                {pet.species === 'perro' ? 'Perro 🐶' : 'Gato 🐱'}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{pet.name}</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Salud al día
                </span>
              </div>

              <p className="text-sm text-slate-300 mt-1 font-medium">
                {pet.breed} • {getAgeString(pet.birthDate)} • {pet.sex === 'hembra' ? 'Hembra' : 'Macho'}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <div className="flex items-center space-x-1.5 bg-slate-800/90 px-3 py-1.5 rounded-xl text-slate-200 border border-slate-700">
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold">{pet.weightKg} kg</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-slate-800/90 px-3 py-1.5 rounded-xl text-slate-200 border border-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono text-[11px] font-bold">REIAC: {pet.microchipNumber?.slice(-6) || 'Activo'}</span>
                </div>
                <div className="hidden sm:flex items-center space-x-1.5 bg-slate-800/90 px-3 py-1.5 rounded-xl text-slate-200 border border-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-medium">{pet.community}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              id="dash-quick-ai-btn"
              onClick={() => onNavigate('ia')}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl text-xs font-black shadow-md shadow-amber-500/25 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Consultar MiPatas AI</span>
            </button>

            <div className="flex gap-2 w-full">
              <button
                id="dash-quick-appt-btn"
                onClick={onOpenAddEventModal}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors border border-slate-700"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Cita</span>
              </button>

              <button
                id="dash-quick-weight-btn"
                onClick={onOpenWeightModal}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors border border-slate-700"
              >
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Peso</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CRITICAL ALERTS (IF ANY) */}
      {criticalAlerts.length > 0 && (
        <div className="space-y-2">
          {criticalAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                alert.type === 'urgent'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-start space-x-3">
                <AlertTriangle
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    alert.type === 'urgent' ? 'text-rose-600' : 'text-amber-600'
                  }`}
                />
                <div>
                  <h4 className="text-sm font-bold">{alert.title}</h4>
                  <p className="text-xs text-slate-700 mt-0.5">{alert.desc}</p>
                </div>
              </div>
              {alert.actionTab && (
                <button
                  onClick={() => onNavigate(alert.actionTab!)}
                  className="px-3 py-1.5 rounded-lg bg-white text-xs font-semibold shadow-xs hover:bg-slate-50 border border-slate-200 shrink-0 text-slate-800 transition-colors"
                >
                  Gestionar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* STATS OVERVIEW CARDS (WARM FRIENDLY 4-COL GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Próxima Cita / Evento */}
        <div
          onClick={() => onNavigate('agenda')}
          className="bg-white p-6 rounded-3xl border-2 border-amber-100/90 shadow-2xs cursor-pointer hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider">
                Próxima Cita
              </h3>
              <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
            </div>
            {nextEvent ? (
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-lg font-black text-slate-900 truncate">
                    {nextEvent.title}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mt-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{nextEvent.date} {nextEvent.time ? `(${nextEvent.time})` : ''}</span>
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">0 citas</span>
                  <span className="text-xs font-bold text-slate-400">Al día</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Sin eventos programados hoy.</p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-amber-50 flex items-center justify-between text-xs font-black text-amber-600 group-hover:text-amber-700">
            <span>Ver agenda</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Stat 2: Vacunas */}
        <div
          onClick={() => onNavigate('salud')}
          className="bg-white p-6 rounded-3xl border-2 border-amber-100/90 shadow-2xs cursor-pointer hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider">
                Vacunación
              </h3>
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <HeartPulse className="w-3.5 h-3.5" />
              </div>
            </div>
            {nextVaccine ? (
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-lg font-black text-slate-900 truncate">
                    {nextVaccine.title}
                  </span>
                </div>
                <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <span>Vence: {nextVaccine.dueDate}</span>
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-600">100%</span>
                  <span className="text-xs font-bold text-emerald-600">Completas</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Todas las vacunas al día.</p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-amber-50 flex items-center justify-between text-xs font-black text-amber-600 group-hover:text-amber-700">
            <span>Carnet de salud</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Stat 3: Tratamientos */}
        <div
          onClick={() => onNavigate('medicamentos')}
          className="bg-white p-6 rounded-3xl border-2 border-amber-100/90 shadow-2xs cursor-pointer hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider">
                Tratamientos
              </h3>
              <div className="w-7 h-7 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <Pill className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{activeMedications.length}</span>
              <span className={`text-xs font-black ${activeMedications.length > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                {activeMedications.length > 0 ? 'En curso' : 'Sin pauta'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {activeMedications.length > 0
                ? activeMedications[0].name
                : 'Ningún medicamento activo.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-50 flex items-center justify-between text-xs font-black text-amber-600 group-hover:text-amber-700">
            <span>Gestionar tomas</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Stat 4: Peso & Condición */}
        <div
          onClick={onOpenWeightModal}
          className="bg-white p-6 rounded-3xl border-2 border-amber-100/90 shadow-2xs cursor-pointer hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider">
                Peso & Condición
              </h3>
              <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Scale className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{pet.weightKg} kg</span>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Ideal</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Escala BCS 5/9 óptima.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-50 flex items-center justify-between text-xs font-black text-amber-600 group-hover:text-amber-700">
            <span>Ver evolución</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* SECTION 2: MAIN GRID (LEFT: TREATMENTS / RIGHT: RECENT ACTIVITY) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Active Treatments Table/List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Treatments Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Tomas y Medicamentos en Curso</h2>
              <button
                id="dash-view-meds-btn"
                onClick={() => onNavigate('medicamentos')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 uppercase tracking-wide"
              >
                Ver todos
              </button>
            </div>

            {activeMedications.length > 0 ? (
              <div className="p-5 space-y-4">
                {activeMedications.map((med) => {
                  const progressPercent = med.totalDosesTarget
                    ? Math.min(100, Math.round(((med.dosesGivenCount || 0) / med.totalDosesTarget) * 100))
                    : 50;

                  return (
                    <div
                      key={med.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm text-slate-900">{med.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                            {med.timesOfDay?.join(', ') || '08:30'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          <span className="font-medium text-slate-800">{med.dosage}</span> • {med.instructions}
                        </p>

                        {/* Sleek Progress Bar */}
                        {med.totalDosesTarget && (
                          <div className="w-full max-w-xs pt-1.5">
                            <div className="flex justify-between text-[11px] text-slate-500 font-medium mb-1">
                              <span>Progreso</span>
                              <span>
                                {med.dosesGivenCount || 0} de {med.totalDosesTarget} dosis ({progressPercent}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full rounded-full transition-all"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        id={`give-dose-btn-${med.id}`}
                        onClick={() => setGiveDoseModalMed(med)}
                        className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Dar dosis ahora</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No hay tratamientos activos en este momento para {pet.name}.
              </div>
            )}
          </div>

          {/* Today's Reminders List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Recordatorios de Hoy</h2>
              <button
                onClick={() => onNavigate('recordatorios')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 uppercase tracking-wide"
              >
                Gestionar ({pendingReminders.length})
              </button>
            </div>

            <div className="p-5 space-y-2.5">
              {pendingReminders.slice(0, 4).map((rem) => (
                <div
                  key={rem.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-3 hover:bg-slate-100/70 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={rem.isCompleted}
                    onChange={() => onToggleReminder(rem.id)}
                    className="mt-0.5 w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${rem.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {rem.title}
                    </p>
                    {rem.reasonSpanishLaw && (
                      <p className="text-[10px] text-indigo-700 font-medium mt-0.5">
                        ⚖️ {rem.reasonSpanishLaw}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Vence: {rem.dueDate} {rem.dueTime || ''}
                    </p>
                  </div>
                </div>
              ))}
              {pendingReminders.length === 0 && (
                <div className="text-xs text-slate-400 text-center py-4">
                  Sin recordatorios pendientes para hoy.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Activity Feed (Sleek Interface timeline pattern) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Actividad Reciente</h2>
              <button
                onClick={() => onNavigate('familia')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 uppercase tracking-wide"
              >
                Historial
              </button>
            </div>

            <div className="p-5 space-y-6">
              {recentActivities.slice(0, 4).map((act, index) => {
                const isLast = index === Math.min(recentActivities.length - 1, 3);
                const badgeColor =
                  index % 3 === 0
                    ? 'bg-emerald-100 text-emerald-600'
                    : index % 3 === 1
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-indigo-100 text-indigo-600';
                const dotColor =
                  index % 3 === 0
                    ? 'bg-emerald-500'
                    : index % 3 === 1
                    ? 'bg-blue-500'
                    : 'bg-indigo-500';

                return (
                  <div key={act.id} className="flex gap-3 relative">
                    {!isLast && (
                      <div className="w-0.5 bg-slate-100 absolute left-4 top-8 bottom-[-24px]" />
                    )}
                    <div className={`w-8 h-8 rounded-full ${badgeColor} flex items-center justify-center shrink-0 z-10`}>
                      <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {act.userName}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          ({act.userRole})
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                        {act.description}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sleek Assistant Card */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white border border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>MiPatas AI</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              ¿Dudas sobre salud, normativa o vacunas para {pet.name}?
            </p>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('ia')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors truncate"
              >
                💬 "¿Cuándo toca la próxima vacuna de rabia?"
              </button>
              <button
                onClick={() => onNavigate('ia')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors truncate"
              >
                💬 "¿Qué exige la Ley 7/2023 sobre seguros?"
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: REGISTRAR DOSIS */}
      {giveDoseModalMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Registrar Dosis Administrada
                </h3>
                <p className="text-xs text-slate-500">
                  {giveDoseModalMed.name} ({giveDoseModalMed.dosage})
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  ¿Quién administra el medicamento?
                </label>
                <select
                  value={selectedAdminName}
                  onChange={(e) => setSelectedAdminName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
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
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nota u observación (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Se lo tomó con un trocito de jamón"
                  value={doseNotes}
                  onChange={(e) => setDoseNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-500 border border-slate-100">
                Se registrará con la hora actual ({new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}) en el registro de actividad.
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setGiveDoseModalMed(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                id="confirm-dose-btn"
                type="button"
                onClick={handleGiveDoseSubmit}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
              >
                Confirmar Dosis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
