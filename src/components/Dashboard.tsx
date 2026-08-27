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
  Bath,
  Scissors,
  Droplets,
  Smile,
  Cake,
  Info,
  Syringe,
  GraduationCap,
  Flame,
  BookOpen,
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
import { DAILY_SUGGESTIONS_POOL } from '../data/educaData';
import { storageService } from '../services/storageService';

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

  // Calculate detailed 11pets age format (e.g. 4a+7m+12d)
  const getDetailedAge = (birthDateStr: string) => {
    try {
      const birth = new Date(birthDateStr);
      const now = new Date();
      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();
      if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      return `${years}a + ${months}m + ${days}d`;
    } catch {
      return '4a + 3m';
    }
  };

  // Format birthdate
  const formatBirthDate = (birthDateStr: string) => {
    try {
      const d = new Date(birthDateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = String(d.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    } catch {
      return birthDateStr;
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

  // 11pets Care Wheel Item Definition
  const careWheelItems = [
    {
      id: 'bath',
      label: 'Baño',
      icon: Bath,
      date: '27/06/26',
      status: 'warning', // orange/amber
      color: 'from-amber-500 to-orange-500',
      badgeBg: 'bg-orange-500',
      onClick: () => onOpenAddEventModal(),
    },
    {
      id: 'hair',
      label: 'Peluquería',
      icon: Scissors,
      date: '06/07/26',
      status: 'success', // green
      color: 'from-emerald-500 to-teal-500',
      badgeBg: 'bg-emerald-500',
      onClick: () => onOpenAddEventModal(),
    },
    {
      id: 'fleas',
      label: 'Pipeta / Pulgas',
      icon: Droplets,
      date: '24/07/26',
      status: 'success',
      color: 'from-emerald-500 to-teal-500',
      badgeBg: 'bg-emerald-500',
      onClick: () => onNavigate('salud'),
    },
    {
      id: 'vaccines',
      label: 'Vacunación',
      icon: Syringe,
      date: nextVaccine?.dueDate ? formatBirthDate(nextVaccine.dueDate) : '15/09/26',
      status: nextVaccine ? 'success' : 'neutral',
      color: 'from-emerald-500 to-teal-500',
      badgeBg: 'bg-emerald-500',
      onClick: () => onNavigate('salud'),
    },
    {
      id: 'deworming',
      label: 'Desparasitación',
      icon: Pill,
      date: '19/10/26',
      status: 'success',
      color: 'from-emerald-500 to-teal-500',
      badgeBg: 'bg-emerald-500',
      onClick: () => onNavigate('salud'),
    },
    {
      id: 'teeth',
      label: 'Dientes',
      icon: Smile,
      date: '08/07/26',
      status: 'success',
      color: 'from-emerald-500 to-teal-500',
      badgeBg: 'bg-emerald-500',
      onClick: () => onOpenAddEventModal(),
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* 11PETS SIGNATURE PET PROFILE HEADER */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-200/90 shadow-md shadow-amber-500/5 relative overflow-hidden">
        {/* Top yellow highlight bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
          {/* Pet Photo & Main Attributes */}
          <div className="flex items-center space-x-5">
            <div
              className="relative cursor-pointer group shrink-0"
              onClick={() => onNavigate('perfil')}
              title="Ver perfil completo de la mascota"
            >
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-amber-300 group-hover:scale-105 group-hover:border-amber-400 transition-all shadow-md"
              />
              <span className="absolute -bottom-2 -right-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black rounded-xl shadow-xs">
                {pet.species === 'perro' ? 'Perro 🐶' : 'Gato 🐱'}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center space-x-2.5">
                <span className={`text-xl sm:text-2xl font-black ${pet.sex === 'macho' ? 'text-blue-600' : 'text-pink-600'}`}>
                  {pet.sex === 'macho' ? '♂' : '♀'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  {pet.name}
                </h1>
                <button
                  id="pet-info-modal-btn"
                  type="button"
                  onClick={onOpenLawModal}
                  className="p-1.5 rounded-full hover:bg-amber-100/70 text-slate-400 hover:text-amber-700 transition-colors"
                  title="Ver pasaporte legal y Ley 7/2023"
                  aria-label="Ver pasaporte legal"
                >
                  <Info className="w-5 h-5 text-amber-600" />
                </button>
              </div>

              <p className="text-sm font-bold text-slate-700">
                {pet.breed || 'Mascota registrada'}
              </p>

              {/* 11pets style Birthday & Age Tickers */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-bold">
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <Cake className="w-3.5 h-3.5 text-amber-500" />
                  <span>{formatBirthDate(pet.birthDate)}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-mono">{getDetailedAge(pet.birthDate)}</span>
                </div>
              </div>

              {/* Badges: Weight, Microchip REIAC, Community */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onOpenWeightModal}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 text-xs font-bold transition-colors"
                  title="Modificar peso"
                >
                  <Scale className="w-3.5 h-3.5 text-amber-600" />
                  <span>{pet.weightKg} kg</span>
                </button>

                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/80 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>REIAC: {pet.microchipNumber?.slice(-6) || 'Activo'}</span>
                </div>

                <div className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{pet.community}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              id="dash-quick-ai-btn"
              type="button"
              onClick={() => onNavigate('ia')}
              className="flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-amber-500 via-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl text-xs font-black shadow-md shadow-amber-500/20 hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Consultar MiPatas AI</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="dash-quick-appt-btn"
                type="button"
                onClick={onOpenAddEventModal}
                className="flex items-center justify-center space-x-1.5 px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-2xl border border-amber-200/80 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                <span>Cita</span>
              </button>

              <button
                id="dash-quick-weight-btn"
                type="button"
                onClick={onOpenWeightModal}
                className="flex items-center justify-center space-x-1.5 px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-2xl border border-amber-200/80 transition-colors shadow-2xs"
              >
                <Scale className="w-3.5 h-3.5 text-amber-600" />
                <span>Peso</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 11PETS SIGNATURE: CIRCULAR CARE STATUS GAUGES ("AT A GLANCE CARE DIALS") */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Cuidados de un vistazo</span>
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Estado en tiempo real de los cuidados preventivos de {pet.name}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('salud')}
            className="text-xs font-black text-amber-600 hover:text-amber-700 uppercase tracking-wide flex items-center space-x-1"
          >
            <span>Ver carnet</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Circular Care Dials (Exact 11pets layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4">
          {careWheelItems.map((item) => {
            const IconComponent = item.icon;
            const isWarning = item.status === 'warning';
            const arcBorderColor = isWarning ? 'border-orange-500' : 'border-emerald-500';

            return (
              <div
                key={item.id}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center text-center cursor-pointer group"
                title={`Gestionar ${item.label}`}
              >
                {/* Dial Circle with Ring & Date Badge */}
                <div className="relative mb-2">
                  {/* Gauge Arc Ring (11pets icon style) */}
                  <div
                    className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full border-4 ${arcBorderColor} border-t-transparent flex items-center justify-center bg-white shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-50/50 flex items-center justify-center text-slate-800 group-hover:text-amber-600 transition-colors">
                      <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.8]" />
                    </div>
                  </div>

                  {/* 11pets Date Pill on the bottom of the dial */}
                  <div
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-black text-white ${item.badgeBg} shadow-xs whitespace-nowrap`}
                  >
                    {item.date}
                  </div>
                </div>

                {/* Dial Label */}
                <span className="text-xs font-extrabold text-slate-800 group-hover:text-amber-600 transition-colors mt-1">
                  {item.label}
                </span>
              </div>
            );
          })}
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

          {/* NEW MODULE: "Hoy con tu perro — Educa & Entiende" Widget */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/80 rounded-3xl border-2 border-amber-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 flex items-center space-x-1.5">
                    <span>Hoy con {pet.name}</span>
                    <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Educa
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Ideas de 5 a 15 min de estimulación y educación respetuosa
                  </p>
                </div>
              </div>

              <button
                id="dash-open-educa-btn"
                type="button"
                onClick={() => onNavigate('educa')}
                className="text-xs font-black text-amber-700 hover:text-amber-800 flex items-center space-x-0.5"
              >
                <span>Ver módulo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DAILY_SUGGESTIONS_POOL.slice(0, 2).map((sug) => (
                <div
                  key={sug.id}
                  onClick={() => onNavigate('educa')}
                  className="p-3 rounded-2xl bg-white border border-amber-100 hover:border-amber-300 hover:shadow-2xs transition-all cursor-pointer flex items-center space-x-3 group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{sug.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-slate-900 truncate group-hover:text-amber-700">
                      {sug.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center space-x-1 mt-0.5">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>{sug.durationMinutes} min</span>
                    </div>
                  </div>
                </div>
              ))}
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
