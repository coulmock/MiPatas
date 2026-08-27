import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Phone,
  MapPin,
  Edit3,
  Copy,
  Check,
  Plus,
  Trash2,
  QrCode,
} from 'lucide-react';
import { Pet, PetWeightEntry } from '../types';

interface PetProfileViewProps {
  pet: Pet;
  allPets: Pet[];
  onSelectPet: (id: string) => void;
  onOpenAddPet: () => void;
  onUpdatePet: (petId: string, updates: Partial<Pet>) => void;
  onDeletePet: (petId: string) => void;
  weightHistory: PetWeightEntry[];
  onOpenWeightModal: () => void;
  onOpenLawModal: () => void;
}

export const PetProfileView: React.FC<PetProfileViewProps> = ({
  pet,
  allPets,
  onSelectPet,
  onOpenAddPet,
  onUpdatePet,
  onDeletePet,
  onOpenLawModal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copiedChip, setCopiedChip] = useState(false);
  const [showIdCard, setShowIdCard] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(pet.name);
  const [editBreed, setEditBreed] = useState(pet.breed);
  const [editWeight, setEditWeight] = useState(pet.weightKg);
  const [editColor, setEditColor] = useState(pet.color);
  const [editChip, setEditChip] = useState(pet.microchipNumber);
  const [editVetClinic, setEditVetClinic] = useState(pet.vetClinicName);
  const [editVetPhone, setEditVetPhone] = useState(pet.vetPhone || '');
  const [editVetAddress, setEditVetAddress] = useState(pet.vetAddress || '');
  const [editInsuranceCompany, setEditInsuranceCompany] = useState(pet.insuranceCompany || '');
  const [editInsurancePolicy, setEditInsurancePolicy] = useState(pet.insurancePolicyNumber || '');
  const [editNotes, setEditNotes] = useState(pet.notes || '');
  const [editPhotoUrl, setEditPhotoUrl] = useState(pet.photoUrl);
  const [editIsSterilized, setEditIsSterilized] = useState(pet.isSterilized);

  const handleCopyChip = () => {
    navigator.clipboard.writeText(pet.microchipNumber);
    setCopiedChip(true);
    setTimeout(() => setCopiedChip(false), 2000);
  };

  const handleSaveEdit = () => {
    onUpdatePet(pet.id, {
      name: editName.trim(),
      breed: editBreed.trim(),
      weightKg: Number(editWeight) || pet.weightKg,
      color: editColor.trim(),
      microchipNumber: editChip.trim(),
      vetClinicName: editVetClinic.trim(),
      vetPhone: editVetPhone.trim(),
      vetAddress: editVetAddress.trim(),
      insuranceCompany: editInsuranceCompany.trim(),
      insurancePolicyNumber: editInsurancePolicy.trim(),
      notes: editNotes.trim(),
      photoUrl: editPhotoUrl.trim() || pet.photoUrl,
      isSterilized: editIsSterilized,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Pet Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {allPets.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPet(p.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-colors shrink-0 ${
                p.id === pet.id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <img
                src={p.photoUrl}
                alt={p.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-200"
              />
              <span className="text-xs">{p.name}</span>
            </button>
          ))}
          <button
            onClick={onOpenAddPet}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-medium shrink-0 transition-colors"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Añadir mascota</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowIdCard(!showIdCard)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <QrCode className="w-4 h-4 text-slate-600" />
            <span>{showIdCard ? 'Ocultar DNI' : 'DNI Canino Digital'}</span>
          </button>

          <button
            onClick={() => {
              setEditName(pet.name);
              setEditBreed(pet.breed);
              setEditWeight(pet.weightKg);
              setEditColor(pet.color);
              setEditChip(pet.microchipNumber);
              setEditVetClinic(pet.vetClinicName);
              setEditVetPhone(pet.vetPhone || '');
              setEditVetAddress(pet.vetAddress || '');
              setEditInsuranceCompany(pet.insuranceCompany || '');
              setEditInsurancePolicy(pet.insurancePolicyNumber || '');
              setEditNotes(pet.notes || '');
              setEditPhotoUrl(pet.photoUrl);
              setEditIsSterilized(pet.isSterilized);
              setIsEditing(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar Ficha</span>
          </button>
        </div>
      </div>

      {/* DNI CANINO DIGITAL / PASAPORTE PREVIEW CARD */}
      {showIdCard && (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-6 shadow-xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🇪🇸</span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                  REINO DE ESPAÑA • REIAC
                </div>
                <div className="text-xs font-bold tracking-tight text-white">
                  TARJETA DE IDENTIFICACIÓN ANIMAL (DNI MASCOTA)
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-400/30">
              ISO 11784/11785
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            <div className="sm:col-span-1 text-center">
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-white/20 shadow-md mx-auto"
              />
              <div className="text-[10px] font-semibold text-indigo-300 mt-2 uppercase">
                {pet.species}
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1.5 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Nombre:</span>
                <div className="text-base font-bold text-white">{pet.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Raza:</span>
                  <div className="font-semibold text-slate-200">{pet.breed}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Sexo / Manto:</span>
                  <div className="font-semibold text-slate-200">
                    {pet.sex === 'hembra' ? 'Hembra ♀' : 'Macho ♂'} • {pet.color}
                  </div>
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Microchip Oficial:</span>
                <div className="font-mono text-indigo-300 font-bold tracking-wider">{pet.microchipNumber}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">CC.AA. / Registro:</span>
                <div className="font-medium text-slate-300">{pet.community} (REIAC)</div>
              </div>
            </div>

            <div className="sm:col-span-1 bg-white/5 p-3 rounded-xl border border-white/10 text-center flex flex-col items-center justify-center">
              <QrCode className="w-10 h-10 text-indigo-400 mb-1" />
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">
                ID: {pet.id}
              </span>
              <span className="text-[9px] text-indigo-300 mt-0.5">Válido en la UE</span>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED PET PROFILE MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Basic Info & Health Snapshot */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
            <div className="relative inline-block mb-4">
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-28 h-28 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm mx-auto"
              />
              <span className="absolute -bottom-2 right-2 px-2.5 py-0.5 bg-indigo-600 text-white text-xs font-semibold rounded-full shadow-xs">
                {pet.sex === 'hembra' ? '♀ Hembra' : '♂ Macho'}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{pet.name}</h2>
            <p className="text-xs font-medium text-slate-500">{pet.breed}</p>

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-left">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Nacimiento
                </span>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">{pet.birthDate}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Peso Actual
                </span>
                <div className="text-xs font-bold text-indigo-700 mt-0.5">{pet.weightKg} kg</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Manto / Color
                </span>
                <div className="text-xs font-semibold text-slate-800 mt-0.5 truncate">{pet.color}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Esterilización
                </span>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">
                  {pet.isSterilized ? '✅ Esterilizado' : '❌ No esterilizado'}
                </div>
              </div>
            </div>

            {/* Microchip Card */}
            <div className="mt-4 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Microchip REIAC (15 dígitos)
                </span>
                <button
                  onClick={handleCopyChip}
                  className="text-[10px] font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-0.5"
                >
                  {copiedChip ? <Check className="w-3 h-3 text-indigo-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedChip ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <div className="font-mono text-sm font-bold text-indigo-950 tracking-wider">
                {pet.microchipNumber}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Registro: {pet.microchipRegistry || `RIAC ${pet.community}`}
              </p>
            </div>
          </div>
        </div>

        {/* Middle & Right Column: Veterinary, Insurance, Spanish Law, Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Veterinary Clinic & Emergency Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Atención Veterinaria & Urgencias
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clínica de cabecera y contacto de emergencia.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Clínica Veterinaria
                </div>
                <div className="text-sm font-bold text-slate-900">{pet.vetClinicName}</div>
                {pet.vetDoctorName && (
                  <p className="text-xs text-slate-600 font-medium">
                    👨‍⚕️ Veterinario: {pet.vetDoctorName}
                  </p>
                )}
                {pet.vetAddress && (
                  <p className="text-xs text-slate-500 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{pet.vetAddress}</span>
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
                    Teléfono Urgencias 24H
                  </div>
                  <div className="text-base font-bold text-indigo-950 mt-1">
                    {pet.vetPhone || '+34 912 345 678'}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Servicio veterinario de urgencia 24h ante intoxicación o traumatismo.
                  </p>
                </div>

                <a
                  href={`tel:${pet.vetPhone || '+34912345678'}`}
                  className="mt-3 inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Llamar a la Clínica</span>
                </a>
              </div>
            </div>
          </div>

          {/* Insurance Card (Ley 7/2023 Compliant) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Seguro de Responsabilidad Civil
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cumplimiento de la Ley 7/2023 de Bienestar Animal en España.
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenLawModal}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-800"
              >
                Ver normativa
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Aseguradora
                </div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {pet.insuranceCompany || 'No especificada'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Nº de Póliza
                </div>
                <div className="text-xs font-mono font-bold text-slate-800 mt-1">
                  {pet.insurancePolicyNumber || 'Sin póliza'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Renovación
                </div>
                <div className="text-xs font-bold text-indigo-700 mt-1">
                  {pet.insuranceRenewalDate || '2026-11-15'}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Notas y Observaciones Personales
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {pet.notes || 'Sin notas especiales registradas.'}
            </p>
          </div>
        </div>
      </div>

      {/* EDIT PET MODAL */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-pet-modal-title"
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 max-h-[85vh] overflow-y-auto border border-slate-200 animate-in zoom-in-95 duration-150">
            <h3 id="edit-pet-modal-title" className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Editar Ficha de {pet.name}
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Nombre</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Raza</label>
                  <input
                    type="text"
                    value={editBreed}
                    onChange={(e) => setEditBreed(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editWeight}
                    onChange={(e) => setEditWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Color</label>
                  <input
                    type="text"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Microchip (15 dígitos)</label>
                  <input
                    type="text"
                    maxLength={15}
                    value={editChip}
                    onChange={(e) => setEditChip(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 mt-1 font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Clínica Veterinaria</label>
                  <input
                    type="text"
                    value={editVetClinic}
                    onChange={(e) => setEditVetClinic(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Teléfono Clínica</label>
                  <input
                    type="text"
                    value={editVetPhone}
                    onChange={(e) => setEditVetPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Compañía de Seguro</label>
                  <input
                    type="text"
                    value={editInsuranceCompany}
                    onChange={(e) => setEditInsuranceCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Póliza Nº</label>
                  <input
                    type="text"
                    value={editInsurancePolicy}
                    onChange={(e) => setEditInsurancePolicy(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Foto URL</label>
                <input
                  type="text"
                  value={editPhotoUrl}
                  onChange={(e) => setEditPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Notas de salud / conducta</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="edit-sterilized"
                  checked={editIsSterilized}
                  onChange={(e) => setEditIsSterilized(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
                />
                <label htmlFor="edit-sterilized" className="text-slate-800 font-semibold cursor-pointer">
                  Mascota esterilizada / castrada
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
              {allPets.length > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    onDeletePet(pet.id);
                    setIsEditing(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar Mascota
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
