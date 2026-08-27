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

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-4">
            <button
              id="brand-logo-btn"
              onClick={() => onSelectTab('inicio')}
              className="flex items-center space-x-3 text-left focus:outline-hidden group"
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
              onClick={onOpenLawModal}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/70 transition-colors border border-slate-200"
              title="Información sobre la Ley 7/2023 de Bienestar Animal y Seguro Obligatorio"
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
                  onClick={() => setPetDropdownOpen(!petDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors"
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
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-lg border border-slate-200 p-2 z-30 divide-y divide-slate-100">
                      <div className="p-1 space-y-1">
                        <div className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                          Mascotas Registradas ({pets.length})
                        </div>
                        {pets.map((pet) => (
                          <button
                            key={pet.id}
                            id={`select-pet-${pet.id}`}
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
              onClick={() => onSelectTab('perfil')}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 transition-colors text-xs font-bold"
              title="Ficha y Ajustes"
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-2 py-1.5 shadow-sm">
        <div className="grid grid-cols-5 gap-1">
          <button
            id="mobile-nav-dashboard"
            onClick={() => onSelectTab('inicio')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors ${
              currentTab === 'inicio' ? 'text-indigo-600 font-bold bg-indigo-50/80' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PawPrint className="w-4 h-4 mb-0.5" />
            <span>Inicio</span>
          </button>

          <button
            id="mobile-nav-salud"
            onClick={() => onSelectTab('salud')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors ${
              currentTab === 'salud' ? 'text-indigo-600 font-bold bg-indigo-50/80' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <HeartPulse className="w-4 h-4 mb-0.5" />
            <span>Salud</span>
          </button>

          <button
            id="mobile-nav-ia"
            onClick={() => onSelectTab('ia')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors ${
              currentTab === 'ia' ? 'text-indigo-600 font-bold bg-indigo-50/80' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5 text-indigo-600" />
            <span>AI Asistente</span>
          </button>

          <button
            id="mobile-nav-agenda"
            onClick={() => onSelectTab('agenda')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors ${
              currentTab === 'agenda' ? 'text-indigo-600 font-bold bg-indigo-50/80' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span>Agenda</span>
          </button>

          <button
            id="mobile-nav-documentos"
            onClick={() => onSelectTab('documentos')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors ${
              currentTab === 'documentos' || currentTab === 'medicamentos' || currentTab === 'recordatorios' || currentTab === 'familia' || currentTab === 'perfil'
                ? 'text-indigo-600 font-bold bg-indigo-50/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 mb-0.5" />
            <span>Bóveda & Más</span>
          </button>
        </div>
      </div>
    </header>
  );
};
