import React, { useState } from 'react';
import {
  X,
  Check,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  PawPrint,
  CheckCircle2,
} from 'lucide-react';
import { PlanTier } from '../types';
import { planPermissions } from '../utils/planPermissions';

interface PricingModalProps {
  isOpen: boolean;
  currentPlan: PlanTier;
  onClose: () => void;
  onSelectPlan: (plan: PlanTier) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  currentPlan,
  onClose,
  onSelectPlan,
}) => {
  const [isAnnual, setIsAnnual] = useState(false);

  if (!isOpen) return null;

  const { free, pro } = planPermissions.pricing;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white relative text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            aria-label="Cerrar tabla de precios"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Planes Transparentes y Sin Compromiso</span>
          </div>

          <h2 id="pricing-modal-title" className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Elige el plan ideal para tu mascota
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2">
            Comienza gratis con lo esencial o desbloquea el asistente inteligente, bóveda de documentos clínicos y cuidado compartido.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="mt-6 inline-flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !isAnnual ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Facturación Mensual
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isAnnual ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Facturación Anual</span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[9px] uppercase">
                -18%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F8FAFC]">
          {/* Base Plan */}
          <div
            className={`p-6 rounded-3xl bg-white border flex flex-col justify-between transition-all ${
              currentPlan === 'free'
                ? 'border-slate-300 ring-2 ring-slate-200 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{free.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{free.tagline}</p>
                </div>
                {currentPlan === 'free' && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                    Tu plan actual
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline space-x-1">
                <span className="text-3xl font-black text-slate-900">0 €</span>
                <span className="text-xs text-slate-500 font-medium">/ siempre gratis</span>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-xs">
                <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                  Incluye:
                </div>
                {free.features.map((f, i) => (
                  <div
                    key={i}
                    className={`flex items-start space-x-2.5 ${
                      f.included ? 'text-slate-700' : 'text-slate-400 line-through opacity-60'
                    }`}
                  >
                    {f.included ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    )}
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4">
              <button
                type="button"
                onClick={() => {
                  onSelectPlan('free');
                  onClose();
                }}
                disabled={currentPlan === 'free'}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${
                  currentPlan === 'free'
                    ? 'bg-slate-100 text-slate-500 cursor-default'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                }`}
              >
                {currentPlan === 'free' ? 'Plan Base Activo' : 'Cambiar a Plan Base (Prueba)'}
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div
            className={`p-6 rounded-3xl bg-white border-2 relative flex flex-col justify-between transition-all ${
              currentPlan === 'pro'
                ? 'border-indigo-600 ring-2 ring-indigo-100 shadow-md'
                : 'border-indigo-500 shadow-lg'
            }`}
          >
            {/* Ribbon */}
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              Recomendado
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-slate-900">{pro.name}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-800 text-[10px] font-black">
                      PRO
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{pro.tagline}</p>
                </div>
                {currentPlan === 'pro' && (
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-200">
                    Tu plan actual
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline space-x-1.5">
                <span className="text-3xl font-black text-indigo-950">
                  {isAnnual ? '49,00 €' : '4,99 €'}
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {isAnnual ? '/ año (2 meses gratis)' : '/ mes'}
                </span>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-xs">
                <div className="font-bold text-indigo-950 text-[11px] uppercase tracking-wider">
                  Todo lo del Plan Base más:
                </div>
                {pro.features.map((f, i) => (
                  <div
                    key={i}
                    className={`flex items-start space-x-2.5 ${
                      f.highlight ? 'text-indigo-950 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        f.highlight ? 'text-indigo-600' : 'text-emerald-600'
                      }`}
                    />
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4">
              <button
                id="select-pro-plan-btn"
                type="button"
                onClick={() => {
                  onSelectPlan('pro');
                  onClose();
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 ${
                  currentPlan === 'pro'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg'
                }`}
              >
                {currentPlan === 'pro' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Plan Pro Activo</span>
                  </>
                ) : (
                  <>
                    <span>Actualizar a Pro (4,99 €/mes)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 text-center text-[11px] text-slate-500">
          🔒 Pagos 100% seguros y cifrados en servidores de la UE. Sin permanencia ni costes ocultos.
        </div>
      </div>
    </div>
  );
};
