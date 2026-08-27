import React from 'react';
import { Sparkles, Trash2, ArrowRight } from 'lucide-react';

interface DemoBannerProps {
  onExitDemo: () => void;
  onCreateAccount: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  onExitDemo,
  onCreateAccount,
}) => {
  return (
    <div
      id="demo-mode-banner"
      className="bg-amber-500 text-slate-950 px-4 py-2.5 shadow-md border-b border-amber-600/30 sticky top-0 z-50 animate-in slide-in-from-top duration-200"
      role="region"
      aria-label="Aviso de modo demo interactivo"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center space-x-2 text-center sm:text-left">
          <div className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3" />
          </div>
          <div>
            <span className="font-bold uppercase tracking-wider text-[11px]">
              Estás en Modo Demo Interactiva:
            </span>{' '}
            <span className="text-slate-900 font-medium">
              Viendo datos de ejemplo (Luna & Bruno). Ningún dato es real.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            id="exit-demo-btn"
            type="button"
            onClick={onExitDemo}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-slate-950 font-semibold transition-colors border border-amber-600/40 text-[11px]"
            title="Borrar datos de ejemplo y empezar con tu mascota real"
          >
            <Trash2 className="w-3 h-3 text-slate-900" />
            <span>Salir del modo demo y empezar de cero</span>
          </button>

          <button
            id="register-from-demo-btn"
            type="button"
            onClick={onCreateAccount}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold transition-colors shadow-xs text-[11px]"
          >
            <span>Crear mi cuenta</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
