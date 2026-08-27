import React, { useState } from 'react';
import {
  PawPrint,
  ShieldCheck,
  Building2,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  FileCheck2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Pet, PetSpecies, PetSex } from '../types';
import { SPANISH_COMMUNITIES } from '../data/initialData';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePet: (petData: Omit<Pet, 'id'>) => void;
  isFirstTime?: boolean;
}

const COMMON_DOG_BREEDS = [
  'Golden Retriever',
  'Labrador Retriever',
  'Pastor Alemán',
  'Beagle',
  'Podenco Español',
  'Galgo Español',
  'Yorkshire Terrier',
  'Border Collie',
  'Caniche (Poodle)',
  'Bulldog Francés',
  'Mestizo / Criollo',
  'Bodeguero Andaluz',
  'Mastín Español',
  'Bichón Maltés',
];

const DEFAULT_PHOTOS: Record<PetSpecies, string> = {
  perro: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
  gato: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
  otro: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=600&q=80',
};

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSavePet,
  isFirstTime = false,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('perro');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('2023-05-10');
  const [sex, setSex] = useState<PetSex>('hembra');
  const [weightKg, setWeightKg] = useState<number>(15);
  const [color, setColor] = useState('Marrón y blanco');
  const [photoUrl, setPhotoUrl] = useState('');

  // Step 2: Legal & Identification
  const [microchipNumber, setMicrochipNumber] = useState('');
  const [community, setCommunity] = useState('Comunidad de Madrid');
  const [isSterilized, setIsSterilized] = useState(false);

  // Step 3: Vet & Insurance
  const [vetClinicName, setVetClinicName] = useState('Clínica Veterinaria Central');
  const [vetDoctorName, setVetDoctorName] = useState('Dr. Carlos Ruiz');
  const [vetPhone, setVetPhone] = useState('+34 910 123 456');
  const [insuranceCompany, setInsuranceCompany] = useState('Mapfre Mascotas');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('POL-RC-78901');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      const finalPet: Omit<Pet, 'id'> = {
        name: name.trim(),
        species,
        breed: breed.trim() || (species === 'perro' ? 'Mestizo' : 'Común Europeo'),
        birthDate,
        sex,
        weightKg: Number(weightKg) || 10,
        color: color.trim() || 'Desconocido',
        microchipNumber: microchipNumber.trim() || `9410000${Math.floor(10000000 + Math.random() * 90000000)}`,
        microchipRegistry: `REIAC / RIAC ${community}`,
        isSterilized,
        vetClinicName: vetClinicName.trim() || 'Clínica Veterinaria San Antón',
        vetDoctorName: vetDoctorName.trim(),
        vetPhone: vetPhone.trim(),
        insuranceCompany: insuranceCompany.trim(),
        insurancePolicyNumber: insurancePolicyNumber.trim(),
        hasMandatoryCivilInsurance: true,
        photoUrl: photoUrl.trim() || DEFAULT_PHOTOS[species],
        notes: notes.trim(),
        community,
      };

      onSavePet(finalPet);
      setStep(4);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // silent
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 bg-slate-900 text-white relative">
          {!isFirstTime && step !== 4 && (
            <button
              id="close-onboarding-btn"
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
            <PawPrint className="w-4 h-4 text-indigo-400" />
            <span>{isFirstTime ? 'Bienvenido a MiPatas España' : 'Nueva Mascota'}</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {step === 1 && '1. Identidad de tu compañero'}
            {step === 2 && '2. Microchip y Registro Oficial'}
            {step === 3 && '3. Veterinario y Seguro Obligatorio'}
            {step === 4 && '¡Todo listo y bajo control! 🎉'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {step === 1 && 'Introduce los datos básicos de tu perro o gato.'}
            {step === 2 && 'Adaptado a la normativa española y REIAC.'}
            {step === 3 && 'Cumplimiento de la Ley 7/2023 de Bienestar Animal.'}
            {step === 4 && 'El carnet digital, agenda y recordatorios han sido activados.'}
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center space-x-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === i
                    ? 'w-8 bg-indigo-500'
                    : step > i
                    ? 'w-4 bg-indigo-300'
                    : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Species selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Especie
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['perro', 'gato', 'otro'] as PetSpecies[]).map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => {
                        setSpecies(sp);
                        if (!photoUrl) setPhotoUrl(DEFAULT_PHOTOS[sp]);
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-semibold transition-colors ${
                        species === sp
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xl mb-1">
                        {sp === 'perro' ? '🐕' : sp === 'gato' ? '🐈' : '🐾'}
                      </span>
                      <span className="capitalize">{sp}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nombre de la mascota *
                </label>
                <input
                  id="pet-name-input"
                  type="text"
                  placeholder="Ej. Luna, Max, Thor, Nala..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs"
                  autoFocus
                />
              </div>

              {/* Breed */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Raza
                </label>
                <input
                  id="pet-breed-input"
                  type="text"
                  placeholder="Ej. Golden Retriever, Mestizo, Podenco..."
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs mb-2"
                />
                {species === 'perro' && (
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_DOG_BREEDS.slice(0, 6).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBreed(b)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid: BirthDate & Sex & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Fecha Nacimiento
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Sexo
                  </label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value as PetSex)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                  >
                    <option value="hembra">Hembra ♀</option>
                    <option value="macho">Macho ♂</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="120"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Color & Photo URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Color / Manto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Canela, Atigrado, Negro..."
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Foto (URL o muestra)
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Legal & Identification */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-950 flex items-start space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Identificación Oficial REIAC</div>
                  <div className="text-slate-600 mt-0.5">
                    En España es legalmente obligatorio que perros y gatos estén identificados mediante microchip homologado ISO 11784/11785.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Número de Microchip (15 dígitos)
                </label>
                <input
                  id="pet-microchip-input"
                  type="text"
                  maxLength={15}
                  placeholder="Ej. 941000028471923"
                  value={microchipNumber}
                  onChange={(e) => setMicrochipNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono text-xs tracking-wider"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  {microchipNumber.length === 15 ? (
                    <span className="text-indigo-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Formato de 15 dígitos válido para REIAC
                    </span>
                  ) : (
                    'Introduce los 15 dígitos que aparecen en la cartilla o pasaporte.'
                  )}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Comunidad Autónoma de Residencia
                </label>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                >
                  {SPANISH_COMMUNITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Determina la periodicidad obligatoria de la vacuna antirrábica y registros locales.
                </p>
              </div>

              {/* Sterilization Toggle */}
              <div className="pt-2">
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="pr-4">
                    <div className="text-xs font-bold text-slate-800">Esterilizado / Castrado</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Importante para cálculos de requerimientos calóricos y recordatorios hormonales.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSterilized}
                    onChange={(e) => setIsSterilized(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
                  />
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Vet & Insurance */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2.5">
                <Building2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Ley 7/2023 — Seguro de Responsabilidad Civil</div>
                  <div className="text-slate-600 mt-0.5">
                    La ley española exige a las personas titulares de perros contratar y mantener en vigor un seguro de responsabilidad civil por daños a terceros.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Clínica Veterinaria de Cabecera *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Hospital Veterinario San Antón"
                  value={vetClinicName}
                  onChange={(e) => setVetClinicName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Veterinario/a habitual
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Dra. Elena Santos"
                    value={vetDoctorName}
                    onChange={(e) => setVetDoctorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Teléfono Urgencias Vet
                  </label>
                  <input
                    type="text"
                    placeholder="+34 912 345 678"
                    value={vetPhone}
                    onChange={(e) => setVetPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Compañía Aseguradora
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Mapfre, Santalucía, Barkibu..."
                    value={insuranceCompany}
                    onChange={(e) => setInsuranceCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nº de Póliza
                  </label>
                  <input
                    type="text"
                    placeholder="POL-12345-RC"
                    value={insurancePolicyNumber}
                    onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Notas adicionales sobre la mascota
                </label>
                <textarea
                  rows={2}
                  placeholder="Alergias conocidas, hábitos, miedos, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  ¡{name || 'Tu mascota'} está registrada con éxito!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  Hemos inicializado su carnet de salud digital, su agenda de cuidados periódicos y su asistente inteligente MiPatas AI.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2 max-w-md mx-auto">
                <div className="flex items-center text-slate-800 font-medium">
                  <Check className="w-4 h-4 mr-1.5 text-indigo-600" />
                  Carnet de vacunación y desparasitación creado
                </div>
                <div className="flex items-center text-slate-800 font-medium">
                  <Check className="w-4 h-4 mr-1.5 text-indigo-600" />
                  Recordatorios automáticos según normativa ({community})
                </div>
                <div className="flex items-center text-slate-800 font-medium">
                  <Check className="w-4 h-4 mr-1.5 text-indigo-600" />
                  MiPatas AI listo para responder preguntas y analizar informes
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {step > 1 && step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              id="onboarding-next-btn"
              type="button"
              onClick={handleNext}
              disabled={step === 1 && !name.trim()}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>{step === 3 ? 'Finalizar y Guardar' : 'Siguiente'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="onboarding-finish-btn"
              type="button"
              onClick={onClose}
              className="w-full px-5 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Ir a mi Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
