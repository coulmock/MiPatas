import React, { useState } from 'react';
import {
  PawPrint,
  HeartPulse,
  Pill,
  Calendar,
  FileText,
  Bell,
  Sparkles,
  Users,
  User,
  Plus,
  Scale,
  ShieldCheck,
  ChevronDown,
  MoreHorizontal,
  X,
  ChevronRight,
  Zap,
  LogOut,
  CreditCard,
  GraduationCap,
} from 'lucide-react';
import { Pet, PlanTier, AuthUser } from '../types';

export type NavTab =
  | 'inicio'
  | 'salud'
  | 'medicamentos'
  | 'agenda'
  | 'educa'
  | 'documentos'
  | 'recordatorios'
  | 'ia'
  | 'familia'
  | 'perfil';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pets: Pet[];
  selectedPetId?: string;
  onSelectPet: (petId: string) => void;
  onOpenAddPet: () => void;
  onOpenLawModal: () => void;
  planTier: PlanTier;
  authUser: AuthUser | null;
  isDemoMode: boolean;
  onOpenPricing: () => void;
  onSignOut: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  pets,
  selectedPetId,
  onSelectPet,
  onOpenAddPet,
  onOpenLawModal,
  planTier,
  authUser,
  isDemoMode,
  onOpenPricing,
  onSignOut,
  onOpenAuthModal,
}) => {
  const [petDropdownOpen, setPetDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];

  const navItems: {
    id: NavTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    isProOnly?: boolean;
  }[] = [
    { id: 'inicio', label: 'Dashboard', icon: PawPrint },
    { id: 'salud', label: 'Carnet de Salud', icon: HeartPulse },
    { id: 'educa', label: 'Educa & Entiende', icon: GraduationCap },
    { id: 'medicamentos', label: 'Medicamentos', icon: Pill },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'documentos', label: 'Documentos', icon: FileText, isProOnly: true },
    { id: 'recordatorios', label: 'Recordatorios', icon: Bell },
    { id: 'ia', label: 'MiPatas AI', icon: Sparkles, isProOnly: true },
    { id: 'familia', label: 'Familia & Equipo', icon: Users, isProOnly: true },
    { id: 'perfil', label: 'Ficha Mascota', icon: ShieldCheck },
  ];

  const moreMenuItems: {
    id: NavTab;
    label: string;
    desc: string;
    icon: React.FC<{ className?: string }>;
    isProOnly?: boolean;
  }[] = [
    { id: 'ia', label: 'MiPatas AI', desc: 'Asistente veterinario y legal inteligente', icon: Sparkles, isProOnly: true },
    { id: 'documentos', label: 'Bóveda de Documentos', desc: 'Informes veterinarios y recetas', icon: FileText, isProOnly: true },
    { id: 'medicamentos', label: 'Tratamientos y Medicación', desc: 'Pautas activas y registro de tomas', icon: Pill },
    { id: 'recordatorios', label: 'Recordatorios y Pautas', desc: 'Alertas antiparasitarias y vacunas', icon: Bell },
    { id: 'familia', label: 'Familia y Cuidadores', desc: 'Equipo de cuidados y registro colaborativo', icon: Users, isProOnly: true },
    { id: 'perfil', label: 'Ficha Mascota y Ajustes', desc: 'Microchip, pasaporte y datos oficiales', icon: ShieldCheck },
  ];

  const isMoreTabActive = ['ia', 'documentos', 'medicamentos', 'recordatorios', 'familia', 'perfil'].includes(currentTab);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-2xs">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              id="brand-logo-btn"
              type="button"
              onClick={() => onSelectTab('inicio')}
              className="flex items-center space-x-2.5 text-left focus:outline-hidden group"
              aria-label="Ir al inicio de MiPatas"
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <PawPrint className="w-4 h-4 fill-current" />
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900">
                  MiPatas<span className="text-amber-500">.</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                  ESPAÑA 🇪🇸
                </span>
              </div>
            </button>

            {/* Spanish Law Link */}
            <button
              id="law-info-btn"
              type="button"
              onClick={onOpenLawModal}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-amber-800 hover:bg-amber-50 transition-colors border border-amber-200/80"
              title="Información sobre la Ley 7/2023 de Bienestar Animal y Seguro Obligatorio"
              aria-label="Información sobre Ley de Bienestar Animal 7/2023"
            >
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>Ley Bienestar Animal</span>
            </button>
          </div>

          {/* Center/Right: Plan badge + Pet Selector + User menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Plan Tier Badge / Upgrade trigger */}
            <button
              id="navbar-plan-badge-btn"
              type="button"
              onClick={onOpenPricing}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-black transition-colors ${
                planTier === 'pro'
                  ? 'bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200 shadow-2xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/80'
              }`}
              title="Ver planes y precios"
            >
              <Zap className={`w-3.5 h-3.5 ${planTier === 'pro' ? 'text-amber-600' : 'text-amber-500'}`} />
              <span>{planTier === 'pro' ? 'Plan Pro' : 'Plan Base'}</span>
              {planTier === 'free' && (
                <span className="hidden md:inline-block text-[10px] text-amber-700 ml-1 font-extrabold underline">
                  Subir a Pro
                </span>
              )}
            </button>

            {/* Pet Switcher Dropdown */}
            {selectedPet && (
              <div className="relative">
                <button
                  id="pet-selector-btn"
                  type="button"
                  onClick={() => setPetDropdownOpen(!petDropdownOpen)}
                  className="flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors"
                  aria-expanded={petDropdownOpen}
                  aria-label={`Seleccionar mascota activa, actual: ${selectedPet.name}`}
                >
                  <img
                    src={selectedPet.photoUrl}
                    alt={selectedPet.name}
                    className="w-6 h-6 rounded-full object-cover border border-indigo-200"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-semibold text-slate-900">{selectedPet.name}</span>
                    <span className="text-[11px] text-slate-500 ml-1.5">({selectedPet.breed})</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {petDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setPetDropdownOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-lg border border-slate-200 p-2 z-30 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                      <div className="p-1 space-y-1">
                        <div className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                          Mascotas Registradas ({pets.length})
                        </div>
                        {pets.map((pet) => (
                          <button
                            key={pet.id}
                            id={`select-pet-${pet.id}`}
                            type="button"
                            onClick={() => {
                              onSelectPet(pet.id);
                              setPetDropdownOpen(false);
                            }}
                            className={`w-full flex items-center space-x-2.5 p-2 rounded-xl text-left transition-colors ${
                              pet.id === selectedPet.id
                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <img
                              src={pet.photoUrl}
                              alt={pet.name}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold truncate">{pet.name}</div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {pet.breed} • {pet.weightKg} kg
                              </div>
                            </div>
                            {pet.id === selectedPet.id && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="p-1 pt-1.5">
                        <button
                          id="add-pet-menu-btn"
                          type="button"
                          onClick={() => {
                            setPetDropdownOpen(false);
                            onOpenAddPet();
                          }}
                          className="w-full flex items-center space-x-2 p-2 rounded-xl text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-indigo-600" />
                          <span>Añadir otra mascota</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* User Account / Profile Menu */}
            <div className="relative">
              <button
                id="user-profile-btn"
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 transition-colors text-xs font-bold"
                aria-label="Abrir menú de usuario"
                aria-expanded={userDropdownOpen}
              >
                <User className="w-4 h-4" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setUserDropdownOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-200 p-2 z-30 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-3">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {authUser ? authUser.name : isDemoMode ? 'Usuario Demo' : 'Usuario MiPatas'}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {authUser ? authUser.email : 'demo@mipatas.es'}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Plan:
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            planTier === 'pro'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {planTier === 'pro' ? 'PRO (4,99 €/mes)' : 'BASE (0 €/mes)'}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onSelectTab('perfil');
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                      >
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        <span>Ficha y DNI Digital</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenPricing();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                      >
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        <span>Gestionar Planes y Precios</span>
                      </button>
                    </div>

                    <div className="p-1 pt-1.5">
                      {authUser || isDemoMode ? (
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onSignOut();
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Cerrar sesión</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenAuthModal();
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4 text-indigo-600" />
                          <span>Iniciar sesión / Crear cuenta</span>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Bar */}
        <nav className="hidden md:flex space-x-1 overflow-x-auto pb-2.5 pt-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`desktop-nav-${item.id}`}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/20'
                    : 'text-slate-600 hover:bg-amber-50/70 hover:text-amber-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.isProOnly && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : planTier === 'pro'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    PRO
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-100 px-2 py-1.5 shadow-md">
        <div className="grid grid-cols-5 gap-1">
          <button
            id="mobile-nav-dashboard"
            type="button"
            onClick={() => onSelectTab('inicio')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-colors ${
              currentTab === 'inicio' ? 'text-amber-600 font-black bg-amber-50' : 'text-slate-500 hover:text-slate-800'
            }`}
            aria-label="Ir a Dashboard"
          >
            <PawPrint className="w-4 h-4 mb-0.5 fill-current" />
            <span>Inicio</span>
          </button>

          <button
            id="mobile-nav-salud"
            type="button"
            onClick={() => onSelectTab('salud')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-colors ${
              currentTab === 'salud' ? 'text-amber-600 font-black bg-amber-50' : 'text-slate-500 hover:text-slate-800'
            }`}
            aria-label="Ir a Carnet de Salud"
          >
            <HeartPulse className="w-4 h-4 mb-0.5" />
            <span>Salud</span>
          </button>

          <button
            id="mobile-nav-educa"
            type="button"
            onClick={() => onSelectTab('educa')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-colors ${
              currentTab === 'educa' ? 'text-amber-600 font-black bg-amber-50' : 'text-slate-500 hover:text-slate-800'
            }`}
            aria-label="Ir a Educa & Entiende"
          >
            <GraduationCap className="w-4 h-4 mb-0.5" />
            <span>Educa</span>
          </button>

          <button
            id="mobile-nav-agenda"
            type="button"
            onClick={() => onSelectTab('agenda')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-colors ${
              currentTab === 'agenda' ? 'text-amber-600 font-black bg-amber-50' : 'text-slate-500 hover:text-slate-800'
            }`}
            aria-label="Ir a Agenda"
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span>Agenda</span>
          </button>

          {/* 5th Mobile Button: Opens the Bottom Sheet Menu */}
          <button
            id="mobile-nav-more"
            type="button"
            onClick={() => setMobileMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-colors relative ${
              isMoreTabActive
                ? 'text-amber-600 font-black bg-amber-50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            aria-label="Abrir menú Más secciones"
            aria-expanded={mobileMoreOpen}
          >
            <MoreHorizontal className="w-4 h-4 mb-0.5" />
            <span>Más</span>
            {isMoreTabActive && (
              <span className="absolute top-1 right-3 w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile "Más" Bottom Sheet Modal */}
      {mobileMoreOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-more-title"
          onClick={() => setMobileMoreOpen(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl border-t border-slate-200 p-5 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 id="mobile-more-title" className="text-base font-bold text-slate-900">
                  Más Secciones & Bóveda
                </h3>
                <p className="text-xs text-slate-500">
                  Acceso completo a todas las áreas de gestión
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileMoreOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800"
                aria-label="Cerrar menú de secciones"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-1.5">
              {moreMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileMoreOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-colors ${
                      isActive
                        ? 'bg-indigo-50 border border-indigo-100 text-indigo-900'
                        : 'hover:bg-slate-50 border border-transparent text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold">{item.label}</span>
                          {item.isProOnly && (
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                                planTier === 'pro'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              PRO
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Plan Switcher in Mobile Drawer */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMoreOpen(false);
                  onOpenPricing();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">
                      {planTier === 'pro' ? 'Tu Plan Pro (4,99 €/mes)' : 'Tu Plan Base (0 €/mes)'}
                    </div>
                    <div className="text-[11px] text-indigo-700">Ver y comparar planes disponibles</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-600" />
              </button>

              {/* Quick Link to Spanish Law */}
              <button
                type="button"
                onClick={() => {
                  setMobileMoreOpen(false);
                  onOpenLawModal();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Ley 7/2023 Bienestar Animal</div>
                    <div className="text-[11px] text-amber-800">Seguro RC, microchip REIAC y normativa</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-700" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
