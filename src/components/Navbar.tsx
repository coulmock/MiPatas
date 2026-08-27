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
} from 'lucide-react';
import { Pet } from '../types';

export type NavTab =
  | 'inicio'
  | 'salud'
  | 'medicamentos'
  | 'agenda'
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
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  pets,
  selectedPetId,
  onSelectPet,
  onOpenAddPet,
  onOpenLawModal,
}) => {
  const [petDropdownOpen, setPetDropdownOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'inicio', label: 'Dashboard', icon: PawPrint },
    { id: 'salud', label: 'Carnet de Salud', icon: HeartPulse },
    { id: 'medicamentos', label: 'Medicamentos', icon: Pill },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'documentos', label: 'Documentos', icon: FileText },
    { id: 'recordatorios', label: 'Recordatorios', icon: Bell },
    { id: 'ia', label: 'MiPatas AI', icon: Sparkles },
    { id: 'familia', label: 'Familia & Equipo', icon: Users },
    { id: 'perfil', label: 'Ficha Mascota', icon: ShieldCheck },
  ];

  const moreMenuItems: { id: NavTab; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'documentos', label: 'Bóveda de Documentos', desc: 'Informes veterinarios y recetas', icon: FileText },
    { id: 'medicamentos', label: 'Tratamientos y Medicación', desc: 'Pautas activas y registro de tomas', icon: Pill },
    { id: 'recordatorios', label: 'Recordatorios y Pautas', desc: 'Alertas antiparasitarias y vacunas', icon: Bell },
    { id: 'familia', label: 'Familia y Cuidadores', desc: 'Equipo de cuidados y registro de actividad', icon: Users },
    { id: 'perfil', label: 'Ficha Mascota y Ajustes', desc: 'Microchip, pasaporte y datos oficiales', icon: ShieldCheck },
  ];

  const isMoreTabActive = ['documentos', 'medicamentos', 'recordatorios', 'familia', 'perfil'].includes(currentTab);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-4">
            <button
              id="brand-logo-btn"
              type="button"
              onClick={() => onSelectTab('inicio')}
              className="flex items-center space-x-3 text-left focus:outline-hidden group"
              aria-label="Ir al inicio de MiPatas"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
                <PawPrint className="w-4 h-4" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-bold text-xl tracking-tight text-slate-900">
                  MiPatas<span className="text-indigo-600">.</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-medium text-slate-500">
                  ESPAÑA 🇪🇸
                </span>
              </div>
            </button>

            {/* Spanish Law Link */}
            <button
              id="law-info-btn"
              type="button"
              onClick={onOpenLawModal}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/70 transition-colors border border-slate-200"
              title="Información sobre la Ley 7/2023 de Bienestar Animal y Seguro Obligatorio"
              aria-label="Información sobre Ley de Bienestar Animal 7/2023"
            >
              <Scale className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ley Bienestar Animal</span>
            </button>
          </div>

          {/* Center/Right: Pet Selector + Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Pet Switcher Dropdown */}
            {selectedPet && (
              <div className="relative">
                <button
                  id="pet-selector-btn"
                  type="button"
                  onClick={() => setPetDropdownOpen(!petDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors"
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

            {/* Quick Profile/Settings Icon */}
            <button
              id="user-profile-btn"
              type="button"
              onClick={() => onSelectTab('perfil')}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 transition-colors text-xs font-bold"
              aria-label="Abrir Ficha de Mascota y Ajustes"
            >
              <User className="w-4 h-4" />
            </button>
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
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.id === 'ia' && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      isActive ? 'bg-indigo-200/80 text-indigo-900' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 shadow-sm">
        <div className="grid grid-cols-5 gap-1">
          <button
            id="mobile-nav-dashboard"
            type="button"
            onClick={() => onSelectTab('inicio')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors ${
              currentTab === 'inicio' ? 'text-indigo-600 font-bold bg-indigo-50/80' : 'text-slate-500 hover:text-slate-800'
            }`}
            aria-label="Ir a Dashboard"
          >
            <PawPrint className="w-4 h-4 mb-0.5" />
            <span>Inicio</span>
          </button>

          <button
            id="mobile-nav-salud"
            type="button"
            onClick={() => onSelectTab('salud')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors ${
              currentTab === 'salud' ? 'text-indigo-600 font-bold bg-indigo-50/80' : 'text-slate-500 hover:text-slate-800'
            }`}
            aria-label="Ir a Carnet de Salud"
          >
            <HeartPulse className="w-4 h-4 mb-0.5" />
            <span>Salud</span>
          </button>

          <button
            id="mobile-nav-ia"
            type="button"
            onClick={() => onSelectTab('ia')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors ${
              currentTab === 'ia' ? 'text-indigo-600 font-bold bg-indigo-50/80' : 'text-slate-500 hover:text-slate-800'
            }`}
            aria-label="Ir a MiPatas AI"
          >
            <Sparkles className="w-4 h-4 mb-0.5 text-indigo-600" />
            <span>MiPatas AI</span>
          </button>

          <button
            id="mobile-nav-agenda"
            type="button"
            onClick={() => onSelectTab('agenda')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors ${
              currentTab === 'agenda' ? 'text-indigo-600 font-bold bg-indigo-50/80' : 'text-slate-500 hover:text-slate-800'
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
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors relative ${
              isMoreTabActive
                ? 'text-indigo-600 font-bold bg-indigo-50/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            aria-label="Abrir menú Más secciones"
            aria-expanded={mobileMoreOpen}
          >
            <MoreHorizontal className="w-4 h-4 mb-0.5" />
            <span>Más</span>
            {isMoreTabActive && (
              <span className="absolute top-1 right-3 w-1.5 h-1.5 rounded-full bg-indigo-600" />
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
            className="w-full bg-white rounded-t-3xl border-t border-slate-200 p-5 max-h-[80vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 id="mobile-more-title" className="text-base font-bold text-slate-900">
                  Más Secciones y Bóveda
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
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[11px] text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Link to Spanish Law */}
            <div className="pt-2 border-t border-slate-100">
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
