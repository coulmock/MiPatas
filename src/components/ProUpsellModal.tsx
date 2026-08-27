import React from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  FileText,
  Users,
  PawPrint,
  Bell,
} from 'lucide-react';
import { ProFeatureKey, PRO_FEATURES_INFO } from '../utils/planPermissions';

interface ProUpsellModalProps {
  isOpen: boolean;
  featureKey: ProFeatureKey;
  onClose: () => void;
  onUpgradeToPro: () => void;
}

const ICONS_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  FileText,
  Users,
  Bell,
  PawPrint,
};

export const ProUpsellModal: React.FC<ProUpsellModalProps> = ({
  isOpen,
  featureKey,
  onClose,
  onUpgradeToPro,
}) => {
  if (!isOpen) return null;

  const info = PRO_FEATURES_INFO[featureKey] || PRO_FEATURES_INFO.ia;
  const FeatureIcon = ICONS_MAP[info.iconName] || Sparkles;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upsell-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Top Gradient Banner */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-6 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            aria-label="Cerrar ventana de información Pro"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Función MiPatas Pro</span>
          </div>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/80 border border-indigo-400/30 flex items-center justify-center text-white shadow-lg">
              <FeatureIcon className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <h2 id="upsell-modal-title" className="text-lg font-bold text-white tracking-tight leading-snug">
                {info.title}
              </h2>
              <p className="text-xs text-indigo-200 font-medium">
                Desbloquea el máximo potencial de cuidado veterinario.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            {info.detailedDescription}
          </p>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5">
            <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
              ¿Qué incluye MiPatas Pro?
            </div>
            {info.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Pricing Highlight */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <div>
              <div className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                Plan MiPatas Pro
              </div>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-2xl font-black text-indigo-950 tracking-tight">4,99 €</span>
                <span className="text-xs text-indigo-700 font-medium">/mes</span>
              </div>
              <span className="text-[10px] text-slate-500">Cancela en cualquier momento sin compromiso.</span>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Mascotas ilimitadas
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-1">
            <button
              id="confirm-upgrade-pro-btn"
              type="button"
              onClick={onUpgradeToPro}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Actualizar a Pro — 4,99 €/mes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Continuar con el Plan Base
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
