import React, { useEffect } from 'react';
import {
  ShieldCheck,
  Building2,
  X,
  FileCheck,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Pet } from '../types';

interface SpanishLawModalProps {
  pet: Pet;
  onClose: () => void;
}

export const SpanishLawModal: React.FC<SpanishLawModalProps> = ({
  pet,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="law-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto border border-slate-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-base">
              🇪🇸
            </div>
            <div>
              <h2 id="law-modal-title" className="text-base font-bold text-slate-900">
                Normativa Española: Ley 7/2023 de Bienestar Animal
              </h2>
              <p className="text-xs text-slate-500">
                Obligaciones legales para propietarios de mascotas en {pet.community || 'España'}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Cerrar ventana de Ley Bienestar Animal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed">
          {/* 1. Seguro RC Obligatorio */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <div className="flex items-center space-x-2 text-indigo-950 font-bold text-sm mb-1">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>1. Seguro de Responsabilidad Civil (Perros)</span>
            </div>
            <p className="text-slate-600">
              Según el artículo 30.3 de la Ley 7/2023, en el caso de la tenencia de perros y durante toda la vida del animal, la persona titular deberá contratar y mantener en vigor un seguro de responsabilidad civil por daños a terceros, que incluya en su cobertura a las personas responsables del animal, por un importe de cuantía suficiente.
            </p>
            <div className="mt-2 text-xs font-semibold text-indigo-900">
              Estado de {pet.name}: {pet.hasMandatoryCivilInsurance ? '✅ Seguro Póliza Registrada' : '⚠️ Pendiente de registrar póliza'}.
            </div>
          </div>

          {/* 2. Microchip y REIAC */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-1">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>2. Identificación Obligatoria (Microchip REIAC)</span>
            </div>
            <p className="text-slate-600">
              La identificación mediante microchip homologado (ISO 11784/11785) e inscripción en el registro de la Comunidad Autónoma ({pet.community}) integrado en la Red Española de Identificación de Animales de Compañía (REIAC) es obligatoria antes de los 3 meses de edad para perros, gatos y hurones.
            </p>
          </div>

          {/* 3. Vacunación de la Rabia */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-1">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>3. Vacunación Antirrábica según CC.AA.</span>
            </div>
            <p className="text-slate-600">
              En la gran mayoría de las Comunidades Autónomas de España (incluida la Comunidad de Madrid, Andalucía, Castilla-La Mancha, etc.), la vacuna de la rabia es <strong>obligatoria con pauta anual</strong>. En otras comunidades como Cataluña o Galicia, se recomienda o se rige por su propia ordenanza sanitaria.
            </p>
          </div>

          {/* 4. Tiempo máximo en soledad */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-1">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>4. Tiempo Máximo sin Supervisión</span>
            </div>
            <p className="text-slate-600">
              La ley prohíbe dejar sin supervisión a cualquier animal de compañía durante más de <strong>3 días consecutivos</strong>; en el caso de los perros, este plazo no podrá ser superior a <strong>24 horas consecutivas</strong>.
            </p>
          </div>

          {/* 5. Curso de Tenencia Responsable */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-1">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>5. Curso de Tenencia Responsable</span>
            </div>
            <p className="text-slate-600">
              Las personas titulares o que deseen adoptar un perro deberán acreditar la realización de un curso de formación para la tenencia de perros con validez indefinida y gratuito, según se desarrolle reglamentariamente.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
