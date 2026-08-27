import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  PawPrint,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { authService } from '../services/authService';
import { AuthUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: AuthUser, isNewRegistration: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'register',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Introduce una dirección de correo electrónico válida.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (mode === 'register' && !acceptTerms) {
      setErrorMessage('Debes aceptar la política de privacidad y términos para continuar.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const { user, error } = await authService.signUp(email, password, name);
        if (error || !user) {
          setErrorMessage(error || 'Error al registrar la cuenta. Inténtalo de nuevo.');
        } else {
          onSuccess(user, true);
        }
      } else {
        const { user, error } = await authService.signIn(email, password);
        if (error || !user) {
          setErrorMessage(error || 'Credenciales no válidas.');
        } else {
          onSuccess(user, false);
        }
      }
    } catch {
      setErrorMessage('Ocurrió un error inesperado al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    if (mode === 'register') {
      setName('Laura Morales');
      setEmail('laura.morales@ejemplo.es');
      setPassword('mipatas1234');
      setAcceptTerms(true);
    } else {
      setEmail('maria.gomez@gmail.com');
      setPassword('mipatas1234');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Header with Brand */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            aria-label="Cerrar ventana de acceso"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <PawPrint className="w-4 h-4" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              MiPatas<span className="text-indigo-400">.</span>
            </span>
          </div>

          <h2 id="auth-modal-title" className="text-lg font-bold text-white tracking-tight">
            {mode === 'register' ? 'Crea tu cuenta gratuita' : 'Bienvenido de nuevo'}
          </h2>
          <p className="text-xs text-indigo-200 mt-1">
            {mode === 'register'
              ? 'Empieza a gestionar la salud de tu mascota con total tranquilidad.'
              : 'Accede a tu carnet digital, tratamientos y recordatorios.'}
          </p>

          {/* Mode Tabs */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-white/10 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-indigo-950 shadow-xs'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              Crear cuenta gratis
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-indigo-950 shadow-xs'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              Iniciar sesión
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2 text-rose-700 text-xs animate-in fade-in duration-100">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre y Apellidos
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Laura Morales"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Contraseña
              </label>
              {mode === 'login' && (
                <span className="text-[11px] text-indigo-600 hover:text-indigo-800 cursor-pointer">
                  ¿Olvidaste tu contraseña?
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="pt-1">
              <label className="flex items-start space-x-2 text-[11px] text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span>
                  Acepto los Términos del Servicio y la Política de Privacidad conforme al RGPD en España.
                </span>
              </label>
            </div>
          )}

          <div className="pt-2 space-y-2">
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Procesando...</span>
              ) : mode === 'register' ? (
                <>
                  <span>Crear Cuenta Gratis (Plan Base)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Quick Fill Demo helper for testing */}
            <button
              type="button"
              onClick={handleQuickFill}
              className="w-full py-1.5 text-[11px] font-medium text-slate-500 hover:text-indigo-600 flex items-center justify-center space-x-1 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Autocompletar datos de prueba</span>
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3 text-center text-[11px] text-slate-500">
            {mode === 'register' ? (
              <p>
                ¿Ya tienes una cuenta registrada?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Iniciar sesión
                </button>
              </p>
            ) : (
              <p>
                ¿Todavía no tienes cuenta en MiPatas?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                  className="font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Crear cuenta gratis
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
