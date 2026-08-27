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
  ShieldCheck,
  Scale,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Zap,
  Lock,
  QrCode,
  Check,
  X,
  Star,
  HelpCircle,
  Stethoscope,
  Smile,
  Shield,
  Clock,
  Award,
  Smartphone,
  Share2,
} from 'lucide-react';
import { planPermissions } from '../utils/planPermissions';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLaunchDemo: () => void;
  onOpenLawModal: () => void;
}

interface Testimonial {
  id: string;
  ownerName: string;
  petName: string;
  petSpecies: string;
  location: string;
  avatar: string;
  petPhoto: string;
  rating: number;
  quote: string;
  highlight: string;
}

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    ownerName: 'Elena Martínez',
    petName: 'Max',
    petSpecies: 'Golden Retriever',
    location: 'Madrid',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    petPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    highlight: '¡Imprescindible para la Ley 7/2023!',
    quote:
      'Tener el carnet de vacunas y el seguro de responsabilidad civil siempre en el móvil me da una tranquilidad enorme. Además, los recordatorios de desparasitación son una maravilla.',
  },
  {
    id: '2',
    ownerName: 'Carlos Santillana',
    petName: 'Milo & Bimba',
    petSpecies: 'Gato Común Europeo',
    location: 'Barcelona',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    petPhoto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    highlight: 'El registro de medicamentos en familia es genial',
    quote:
      'Mi pareja y yo compartimos las tomas de los antibióticos de Milo sin volvernos locos preguntando quién le dio la pastilla. Con un toque queda todo anotado.',
  },
  {
    id: '3',
    ownerName: 'Lucía Fernández',
    petName: 'Coco',
    petSpecies: 'Bulldog Francés',
    location: 'Valencia',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    petPhoto: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    highlight: 'MiPatas AI me sacó de dudas un domingo',
    quote:
      'Coco se comió un trozo de planta y la IA de MiPatas me orientó rápidamente sobre los síntomas de alarma antes de acudir a urgencias veterinarias. Servicio de 10.',
  },
];

const FAQS: FaqItem[] = [
  {
    category: 'Legal',
    question: '¿Es obligatorio el seguro de responsabilidad civil para perros en España?',
    answer:
      'Sí. Conforme a la Ley 7/2023 de Protección de los Derechos y el Bienestar de los Animales, todas las personas titulares de perros en España deben disponer de un seguro de responsabilidad civil por daños a terceros durante toda la vida del animal. En MiPatas puedes guardar el número de póliza y aseguradora para llevarlo siempre a mano.',
  },
  {
    category: 'Salud',
    question: '¿Cómo funciona la cartilla sanitaria digital y el microchip REIAC?',
    answer:
      'MiPatas te permite registrar el código de microchip de 15 dígitos bajo el estándar ISO 11784/11785, homologado por la Red Española de Identificación de Animales de Compañía (REIAC). Además, gestionas el historial de vacunaciones (rabia, polivalente), desparasitaciones y analíticas con avisos de vencimiento.',
  },
  {
    category: 'Familia',
    question: '¿Puedo compartir el cuidado y las tomas de medicación con mi familia o paseador?',
    answer:
      '¡Por supuesto! En el Plan Pro puedes invitar a familiares, cuidadores o paseadores a tu equipo. Cada vez que alguien administra una dosis o anota un paseo, el registro se actualiza al instante para todos los miembros, evitando dosis duplicadas u olvidos.',
  },
  {
    category: 'IA',
    question: '¿Qué tipo de consultas resuelve el asistente MiPatas AI Veterinario?',
    answer:
      'MiPatas AI está entrenado con pautas clínicas veterinarias y normativa española. Puedes consultarle sobre pautas de vacunación por Comunidad Autónoma, recomendaciones nutricionales según raza y edad, consejos de bienestar y primeros auxilios. Recuerda que siempre complementa y nunca sustituye el diagnóstico presencial de tu veterinario.',
  },
  {
    category: 'Privacidad',
    question: '¿Mis datos clínicos y documentos están protegidos bajo el RGPD?',
    answer:
      'Absolutamente. Toda la información médica y documentos adjuntos se almacenan con cifrado de nivel bancario en servidores ubicados en la Unión Europea, en estricto cumplimiento del Reglamento General de Protección de Datos (RGPD UE 2016/679) y la LOPDGDD española.',
  },
  {
    category: 'Planes',
    question: '¿El Plan Base es realmente gratuito para siempre?',
    answer:
      'Sí, 100% gratuito y sin tarjetas de crédito requeridas. Incluye la gestión completa de 1 mascota, DNI canino digital REIAC, carnet de vacunación manual, agenda de citas veterinarias y control de tratamientos.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onLaunchDemo,
  onOpenLawModal,
}) => {
  const [isAnnualPricing, setIsAnnualPricing] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { free, pro } = planPermissions.pricing;

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Public Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 rounded-2xl flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                <PawPrint className="w-5 h-5 fill-current" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-black text-2xl tracking-tight text-slate-900">
                  MiPatas<span className="text-amber-500">.</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-extrabold border border-amber-200/70">
                  ESPAÑA 🇪🇸
                </span>
              </div>
            </div>

            {/* Middle Nav Anchors */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-600">
              <a href="#funcionalidades" className="hover:text-amber-600 transition-colors">
                Funcionalidades
              </a>
              <button
                type="button"
                onClick={onOpenLawModal}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 hover:bg-amber-100/80 transition-colors border border-amber-200/60"
              >
                <Scale className="w-3.5 h-3.5 text-amber-600" />
                <span>Ley 7/2023 Bienestar</span>
              </button>
              <a href="#testimonios" className="hover:text-amber-600 transition-colors">
                Opiniones
              </a>
              <a href="#precios" className="hover:text-amber-600 transition-colors">
                Precios
              </a>
              <a href="#faq" className="hover:text-amber-600 transition-colors">
                Preguntas frecuentes
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                id="landing-login-btn"
                type="button"
                onClick={onOpenLogin}
                className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-amber-700 hover:bg-amber-50/60 rounded-2xl transition-colors"
              >
                Iniciar sesión
              </button>
              <button
                id="landing-register-btn"
                type="button"
                onClick={onOpenRegister}
                className="px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-2xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all"
              >
                Crear cuenta gratis
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section — 11pets Warm & Friendly Style */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 bg-gradient-to-b from-amber-50/50 via-[#FFFDF9] to-[#FFFDF9]">
        {/* Soft Background Accents */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-amber-200/30 via-orange-200/20 to-yellow-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Friendly Hero Pitch */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Spanish Law & Trust Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-950 text-xs font-bold shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Adaptado al 100% a la Ley 7/2023 & Microchip REIAC</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Cuidar de tu mascota jamás fue tan{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600">
                  fácil y cariñoso.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                El carnet sanitario digital, registro de medicamentos con dosis compartidas, avisos de vacunas por Comunidad Autónoma y asistente veterinario con IA para dueños felices en España.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  id="hero-register-cta"
                  type="button"
                  onClick={onOpenRegister}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-base shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all flex items-center justify-center space-x-2.5 group"
                >
                  <PawPrint className="w-5 h-5 fill-current" />
                  <span>Empezar gratis ahora</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-demo-cta"
                  type="button"
                  onClick={onLaunchDemo}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-amber-50/60 text-slate-800 font-bold text-sm border-2 border-amber-200 shadow-sm hover:border-amber-300 transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Ver demo interactiva</span>
                </button>
              </div>

              {/* Feature Quick Badges */}
              <div className="pt-6 border-t border-amber-100 grid grid-cols-3 gap-3 text-left">
                <div className="bg-white/80 p-3 rounded-2xl border border-amber-100 shadow-2xs">
                  <div className="flex items-center space-x-1.5 text-amber-600 font-black text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>DNI Digital</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Microchip REIAC 15 dígitos</div>
                </div>

                <div className="bg-white/80 p-3 rounded-2xl border border-amber-100 shadow-2xs">
                  <div className="flex items-center space-x-1.5 text-orange-600 font-black text-xs">
                    <HeartPulse className="w-4 h-4" />
                    <span>Salud al Día</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Vacunas y desparasitación</div>
                </div>

                <div className="bg-white/80 p-3 rounded-2xl border border-amber-100 shadow-2xs">
                  <div className="flex items-center space-x-1.5 text-amber-600 font-black text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>MiPatas AI</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Consejos clínicos 24/7</div>
                </div>
              </div>
            </div>

            {/* Right Column: Joyful Visual Collage (11pets inspired) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Main Animal Visual Card */}
                <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-100 space-y-4">
                  {/* Cheerful Pets Photo */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-amber-100 shadow-inner">
                    <img
                      src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=80"
                      alt="Perro y gato felices"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                    {/* Floating Health Badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div>
                        <div className="text-base font-black flex items-center space-x-1.5">
                          <span>Luna & Bruno</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold">
                            100% Protegidos
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-200">Vacuna de rabia y desparasitación al día</p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Status Snippets */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80">
                      <div className="flex items-center space-x-1 text-amber-700 font-black text-[10px] uppercase">
                        <Pill className="w-3.5 h-3.5 text-amber-600" />
                        <span>Tratamiento</span>
                      </div>
                      <div className="font-bold text-slate-900 mt-1">Milbemax (Toma dada)</div>
                      <div className="text-[10px] text-slate-500">Por María hace 2h</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                      <div className="flex items-center space-x-1 text-emerald-700 font-black text-[10px] uppercase">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Seguro RC</span>
                      </div>
                      <div className="font-bold text-slate-900 mt-1">Mapfre Válido 🇪🇸</div>
                      <div className="text-[10px] text-slate-500">Obligatorio Ley 7/2023</div>
                    </div>
                  </div>

                  {/* MiPatas AI Pill Bubble */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-amber-950">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>MiPatas AI recuerda:</span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      "¡Todo listo para las vacaciones! La vacuna antirrábica de Luna es válida en toda España y la UE hasta 2026."
                    </p>
                  </div>
                </div>

                {/* Floating Decorative Stamp */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-tr from-amber-500 to-orange-500 text-white p-3 rounded-2xl shadow-lg rotate-6 flex items-center space-x-1.5 text-xs font-black">
                  <Award className="w-4 h-4" />
                  <span>Nº 1 en España</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section — 11pets Cards Style */}
      <section id="funcionalidades" className="py-20 bg-white border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Funcionalidades Completas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Todo lo que tu mascota necesita en una sola app
            </h2>
            <p className="text-slate-600 text-base font-medium">
              Diseñado con rigor veterinario y un interfaz amigable para hacer que cuidar de tu mejor amigo sea un placer diario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-7 rounded-3xl bg-[#FFFDF9] border-2 border-amber-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Carnet Sanitario Digital</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Historial completo de vacunas, desparasitaciones internas y externas, evolución del peso, alergias y cirugías con control de números de lote.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-3xl bg-[#FFFDF9] border-2 border-amber-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">DNI Canino & Ley 7/2023</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tarjeta de identificación con número de microchip REIAC (15 dígitos), datos autonómicos, póliza de Responsabilidad Civil y código QR de emergencia.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-3xl bg-[#FFFDF9] border-2 border-amber-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Control de Medicamentos</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pautas farmacológicas con horarios, registro de dosis administradas y trazabilidad exacta del cuidador que dio la toma.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-3xl bg-[#FFFDF9] border-2 border-amber-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-slate-900">MiPatas AI Veterinario</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                  PRO
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Asistente inteligente 24/7 para dudas sobre vacunas por CC.AA., nutrición adecuada a su peso y primeros auxilios ante cualquier síntoma.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-3xl bg-[#FFFDF9] border-2 border-amber-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-slate-900">Bóveda de Documentos</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                  PRO
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Guarda informes veterinarios, analíticas y pólizas en PDF con extracción automática con IA de diagnósticos y fechas de revisión.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-3xl bg-[#FFFDF9] border-2 border-amber-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-slate-900">Familia & Cuidadores</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                  PRO
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Comparte la ficha con familiares, paseadores o guarderías caninas. Todos sincronizados con el historial y avisos de paseos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section id="testimonios" className="py-20 bg-amber-50/40 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Testimonios Reales</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Familias felices en toda España
            </h2>
            <p className="text-slate-600 text-base font-medium">
              Más de 15.000 propietarios y veterinarios confían en MiPatas para mantener a sus mascotas sanas y seguras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-7 border-2 border-amber-100 shadow-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  {/* Stars */}
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {/* Highlight */}
                  <div className="font-bold text-slate-900 text-base">"{t.highlight}"</div>

                  {/* Quote */}
                  <p className="text-slate-600 text-sm leading-relaxed">{t.quote}</p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-amber-50 flex items-center space-x-3.5">
                  <img
                    src={t.avatar}
                    alt={t.ownerName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-amber-300"
                  />
                  <div>
                    <div className="font-black text-sm text-slate-900">{t.ownerName}</div>
                    <div className="text-xs text-slate-500 font-medium">
                      Mamá/Papá de <span className="text-amber-700 font-bold">{t.petName}</span> • {t.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spanish Law CTA Banner Section */}
      <section className="py-14 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase">
                <Scale className="w-4 h-4" />
                <span>Normativa Española Vigente</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                ¿Tienes dudas sobre la Ley 7/2023 de Bienestar Animal?
              </h3>
              <p className="text-amber-100 text-sm max-w-2xl font-medium">
                Conoce las exigencias de microchip REIAC, póliza de Responsabilidad Civil y vacunas obligatorias según tu Comunidad Autónoma.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenLawModal}
              className="px-6 py-3.5 rounded-2xl bg-white text-amber-950 hover:bg-amber-50 font-black text-sm shadow-lg transition-all shrink-0 flex items-center space-x-2"
            >
              <span>Consultar Normativa por CC.AA.</span>
              <ChevronRight className="w-4 h-4 text-amber-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-20 bg-[#FFFDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Planes y Tarifas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Precios claros, sin letra pequeña
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              Empieza 100% gratis hoy mismo y actualiza a Pro cuando quieras funciones avanzadas e inteligencia artificial.
            </p>

            {/* Billing Toggle */}
            <div className="pt-4 inline-flex items-center p-1.5 rounded-2xl bg-amber-100/70 border border-amber-200">
              <button
                type="button"
                onClick={() => setIsAnnualPricing(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  !isAnnualPricing
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Facturación Mensual
              </button>
              <button
                type="button"
                onClick={() => setIsAnnualPricing(true)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isAnnualPricing
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Facturación Anual</span>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold text-[9px] uppercase">
                  -18% dto
                </span>
              </button>
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-3xl bg-white border-2 border-amber-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900">{free.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{free.tagline}</p>

                <div className="mt-4 flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-slate-900">0 €</span>
                  <span className="text-xs text-slate-500 font-bold">/ siempre gratis</span>
                </div>

                <div className="mt-6 pt-6 border-t border-amber-50 space-y-3 text-xs">
                  <div className="font-black text-slate-900 text-[11px] uppercase tracking-wider">
                    Incluido en el Plan Base:
                  </div>
                  {free.features.map((f, i) => (
                    <div
                      key={i}
                      className={`flex items-start space-x-2.5 ${
                        f.included ? 'text-slate-700 font-medium' : 'text-slate-400 line-through opacity-60'
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
                  onClick={onOpenRegister}
                  className="w-full py-3.5 px-4 rounded-2xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm"
                >
                  Empezar gratis
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-3xl bg-white border-2 border-amber-500 shadow-xl relative flex flex-col justify-between">
              <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                ⭐ Más Elegido
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-black text-slate-900">{pro.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                    PRO
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{pro.tagline}</p>

                <div className="mt-4 flex items-baseline space-x-1.5">
                  <span className="text-4xl font-black text-amber-950">
                    {isAnnualPricing ? '49,00 €' : '4,99 €'}
                  </span>
                  <span className="text-xs text-slate-600 font-bold">
                    {isAnnualPricing ? '/ año (ahorras 2 meses)' : '/ mes'}
                  </span>
                </div>

                <div className="mt-6 pt-6 border-t border-amber-50 space-y-3 text-xs">
                  <div className="font-black text-amber-950 text-[11px] uppercase tracking-wider">
                    Todo lo de Base más:
                  </div>
                  {pro.features.map((f, i) => (
                    <div
                      key={i}
                      className={`flex items-start space-x-2.5 ${
                        f.highlight ? 'text-amber-950 font-bold' : 'text-slate-700 font-medium'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          f.highlight ? 'text-amber-500' : 'text-emerald-600'
                        }`}
                      />
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="w-full py-3.5 px-4 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>Crear cuenta y activar Pro</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 bg-white border-t border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Dudas y Preguntas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Preguntas Frecuentes
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              Todo lo que necesitas saber sobre el uso de MiPatas y la normativa de bienestar animal en España.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-3xl border-2 transition-all overflow-hidden ${
                    isOpen ? 'border-amber-300 bg-amber-50/40 shadow-xs' : 'border-amber-100 bg-[#FFFDF9] hover:border-amber-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base focus:outline-hidden"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-amber-600 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-0 text-sm text-slate-600 leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-900 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-slate-800">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-xs">
                  <PawPrint className="w-4 h-4 fill-current" />
                </div>
                <span className="font-black text-xl tracking-tight text-white">
                  MiPatas<span className="text-amber-500">.</span>
                </span>
              </div>
              <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
                Plataforma de salud, carnet sanitario y bienestar integral para mascotas en España. Cumplimiento de la Ley 7/2023 de Protección de los Animales y normativa REIAC.
              </p>
            </div>

            <div>
              <div className="font-black text-white uppercase text-[11px] tracking-wider mb-4">
                Plataforma
              </div>
              <ul className="space-y-2.5">
                <li>
                  <a href="#funcionalidades" className="hover:text-amber-400 transition-colors">
                    Carnet Sanitario Digital
                  </a>
                </li>
                <li>
                  <a href="#funcionalidades" className="hover:text-amber-400 transition-colors">
                    MiPatas AI Veterinario
                  </a>
                </li>
                <li>
                  <a href="#precios" className="hover:text-amber-400 transition-colors">
                    Planes y Precios
                  </a>
                </li>
                <li>
                  <button type="button" onClick={onOpenLawModal} className="hover:text-amber-400 transition-colors">
                    Ley 7/2023 Bienestar Animal
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-black text-white uppercase text-[11px] tracking-wider mb-4">
                Seguridad & Legal
              </div>
              <ul className="space-y-2.5 text-slate-400">
                <li>
                  <span className="hover:text-white cursor-pointer">Aviso Legal</span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">Privacidad RGPD (UE 2016/679)</span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">Términos de Servicio</span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer">Contacto: ayuda@mipatas.es</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <div>© {new Date().getFullYear()} MiPatas España. Diseñado para el bienestar animal.</div>
            <div className="flex items-center space-x-4">
              <span>Servidores seguros en la UE 🇪🇺</span>
              <span>•</span>
              <span>Cifrado SSL 256-bit</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
