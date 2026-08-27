import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  Sparkles,
  Search,
  BookOpen,
  HelpCircle,
  Heart,
  Calendar,
  Flame,
  CheckCircle2,
  Circle,
  Clock,
  Play,
  AlertTriangle,
  ChevronRight,
  Send,
  RefreshCw,
  Eye,
  Check,
  X,
  Bot,
  Brain,
  Smile,
  ShieldAlert,
  ArrowLeft,
  Filter,
  Info,
  PawPrint,
  Sliders,
  Dumbbell,
  Compass,
  Award,
  Zap,
} from 'lucide-react';
import {
  Pet,
  PlanTier,
  BehaviorTopic,
  TrainingExercise,
  TrainingExerciseCategory,
  TrainingExerciseLevel,
  WellbeingCategory,
  WellbeingTip,
  DailySuggestion,
  TrainingProgress,
} from '../types';
import {
  BEHAVIOR_TOPICS,
  TRAINING_EXERCISES,
  WELLBEING_TIPS,
  DAILY_SUGGESTIONS_POOL,
} from '../data/educaData';
import { storageService } from '../services/storageService';
import { geminiService } from '../services/geminiService';

interface EducaViewProps {
  pet: Pet;
  onNavigate: (tab: any) => void;
  onOpenPricing?: () => void;
  planTier?: PlanTier;
}

type MainSection = 'hub' | 'entiende' | 'entrena' | 'asistente' | 'bienestar' | 'hoy';

export const EducaView: React.FC<EducaViewProps> = ({
  pet,
  onNavigate,
  onOpenPricing,
  planTier = 'free',
}) => {
  // Navigation & Sub-sections
  const [activeSection, setActiveSection] = useState<MainSection>('hub');

  // Training Progress
  const [progress, setProgress] = useState<TrainingProgress>(() =>
    storageService.getTrainingProgress(pet.id)
  );

  useEffect(() => {
    setProgress(storageService.getTrainingProgress(pet.id));
  }, [pet.id]);

  // Modals & Active Selections
  const [selectedTopic, setSelectedTopic] = useState<BehaviorTopic | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<TrainingExercise | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // 1. ENTIENDE STATE
  const [topicSearch, setTopicSearch] = useState('');
  const [topicCategoryFilter, setTopicCategoryFilter] = useState<string>('todos');

  // 2. ENTRENA STATE
  const [exerciseCategoryFilter, setExerciseCategoryFilter] = useState<
    TrainingExerciseCategory | 'todas'
  >('todas');
  const [exerciseLevelFilter, setExerciseLevelFilter] = useState<
    TrainingExerciseLevel | 'todos'
  >('todos');

  // 3. ASISTENTE IA STATE
  const [chatMessages, setChatMessages] = useState<
    { id: string; role: 'user' | 'assistant'; content: string; timestamp: string }[]
  >([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Wizard quick questions context
  const [wizardAge, setWizardAge] = useState(pet.ageStage || 'adulto');
  const [wizardDuration, setWizardDuration] = useState('unas semanas');
  const [wizardFrequency, setWizardFrequency] = useState('diario');
  const [wizardTrigger, setWizardTrigger] = useState('');
  const [showContextWizard, setShowContextWizard] = useState(false);

  // 4. BIENESTAR STATE
  const [selectedWellbeingTab, setSelectedWellbeingTab] = useState<WellbeingCategory>('fisico');

  // Helper to deduce age stage if not directly set
  const petAgeStage = useMemo(() => {
    if (pet.ageStage) return pet.ageStage;
    try {
      const birth = new Date(pet.birthDate);
      const now = new Date();
      const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
      if (diffMonths < 12) return 'cachorro';
      if (diffMonths > 96) return 'senior';
      return 'adulto';
    } catch {
      return 'adulto';
    }
  }, [pet.birthDate, pet.ageStage]);

  // Filtered behavior topics
  const filteredTopics = useMemo(() => {
    return BEHAVIOR_TOPICS.filter((t) => {
      const matchesSearch =
        topicSearch === '' ||
        t.question.toLowerCase().includes(topicSearch.toLowerCase()) ||
        t.whatItMeans.toLowerCase().includes(topicSearch.toLowerCase()) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(topicSearch.toLowerCase()));
      const matchesCategory =
        topicCategoryFilter === 'todos' || t.category === topicCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [topicSearch, topicCategoryFilter]);

  // Filtered training exercises
  const filteredExercises = useMemo(() => {
    return TRAINING_EXERCISES.filter((ex) => {
      const matchesCat =
        exerciseCategoryFilter === 'todas' || ex.category === exerciseCategoryFilter;
      const matchesLevel =
        exerciseLevelFilter === 'todos' || ex.level === exerciseLevelFilter;
      return matchesCat && matchesLevel;
    });
  }, [exerciseCategoryFilter, exerciseLevelFilter]);

  // Filtered wellbeing tips
  const filteredWellbeingTips = useMemo(() => {
    return WELLBEING_TIPS.filter((tip) => tip.category === selectedWellbeingTab);
  }, [selectedWellbeingTab]);

  // Handle toggle exercise completion
  const handleToggleExercise = (exerciseId: string) => {
    const updated = storageService.toggleExerciseCompletion(pet.id, exerciseId);
    setProgress(updated);
  };

  // AI Chat handler
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputMessage.trim();
    if (!prompt || isAiLoading) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setInputMessage('');
    setIsAiLoading(true);

    try {
      // Build context including pet details and wizard parameters if available
      let contextualizedPrompt = prompt;
      if (showContextWizard || wizardTrigger) {
        contextualizedPrompt = `Contexto del perro: ${pet.name} (${pet.breed}, edad: ${wizardAge}, peso: ${pet.weightKg}kg).
Detonante identificado: ${wizardTrigger || 'No especificado'}.
Tiempo que lleva ocurriendo: ${wizardDuration}. Frecuencia: ${wizardFrequency}.
Consulta del usuario: ${prompt}`;
      }

      const historyForApi = newHistory.map((m, idx) => ({
        role: m.role,
        content: idx === newHistory.length - 1 ? contextualizedPrompt : m.content,
      }));

      const responseText = await geminiService.chat(historyForApi, {
        name: pet.name,
        breed: pet.breed,
        weightKg: pet.weightKg,
        birthDate: pet.birthDate,
        community: pet.community,
        species: pet.species,
      });

      const aiMsg = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant' as const,
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      setShowContextWizard(false);
    } catch (err: any) {
      const fallbackMsg = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant' as const,
        content:
          'No pude conectar con el servicio en este momento. Por favor revisa las fichas de comportamiento en "Entiende a tu perro" o consulta con un educador canino profesional.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Quick prompt presets
  const quickAiPrompts = [
    { label: '🚪 Se queda solo y llora', query: '¿Cómo enseño a mi perro a quedarse solo en casa de forma progresiva sin ansiedad?' },
    { label: '🦮 Tira mucho de la correa', query: 'Mi perro tira fuertemente de la correa cuando salimos de paseo. ¿Qué plan de 7 días puedo seguir?' },
    { label: '🔔 Ladra cada vez que tocan al timbre', query: '¿Cómo desensibilizar a mi perro para que no ladre cuando suena el timbre de la puerta?' },
    { label: '🦷 Muerde las manos al jugar', query: 'Mi perro se excita mucho y muerde las manos o ropa durante el juego. ¿Cómo redirigirlo positivamente?' },
  ];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* MODULE HEADER BANNER */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-[32px] p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative backdrops */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Educa & Entiende • MiPatas</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Educación, Lenguaje y Bienestar Canino
            </h1>

            <p className="text-amber-100 text-sm font-medium leading-relaxed">
              Guías de comunicación positiva, biblioteca de ejercicios prácticos y acompañamiento respetuoso adaptado a{' '}
              <span className="font-bold text-white underline decoration-amber-300 underline-offset-2">
                {pet.name}
              </span>{' '}
              ({pet.breed || 'Perro'}, etapa {petAgeStage}).
            </p>
          </div>

          {/* Practice Streak Card */}
          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 shrink-0 flex items-center space-x-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-400/30 flex items-center justify-center text-amber-200">
              <Flame className="w-6 h-6 text-amber-300 animate-pulse fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-black text-white">{progress.practiceDaysStreak}</span>
                <span className="text-xs font-bold text-amber-200">días</span>
              </div>
              <p className="text-[11px] font-medium text-amber-100">
                {progress.exercisesCompletedIds.length} ejercicios completados
              </p>
            </div>
          </div>
        </div>

        {/* Sub-nav Buttons inside Banner if not in Hub */}
        {activeSection !== 'hub' && (
          <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
            <button
              id="educa-back-to-hub"
              type="button"
              onClick={() => setActiveSection('hub')}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Menú Principal</span>
            </button>

            <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveSection('entiende')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  activeSection === 'entiende' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-100 hover:bg-white/10'
                }`}
              >
                Entiende
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('entrena')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  activeSection === 'entrena' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-100 hover:bg-white/10'
                }`}
              >
                Entrena
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('asistente')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  activeSection === 'asistente' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-100 hover:bg-white/10'
                }`}
              >
                Asistente IA
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('bienestar')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  activeSection === 'bienestar' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-100 hover:bg-white/10'
                }`}
              >
                Bienestar
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('hoy')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  activeSection === 'hoy' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-100 hover:bg-white/10'
                }`}
              >
                Hoy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. HUB VIEW: 5 BIG INTERACTIVE CARDS */}
      {/* ========================================================================= */}
      {activeSection === 'hub' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: Entiende a tu perro */}
            <div
              id="card-hub-entiende"
              onClick={() => setActiveSection('entiende')}
              className="bg-white rounded-3xl p-6 border-2 border-amber-100/90 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                    Entiende a tu perro
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200/60">
                    13 Fichas
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Decodificador de conductas: ladridos al timbre, persecución en casa, lamidos, protección de recursos y señales de calma.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-amber-50 flex items-center justify-between text-xs font-black text-amber-600 group-hover:text-amber-700">
                <span>Explorar lenguaje y conductas</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Entrena con MiPatas */}
            <div
              id="card-hub-entrena"
              onClick={() => setActiveSection('entrena')}
              className="bg-white rounded-3xl p-6 border-2 border-amber-100/90 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                    Entrena con MiPatas
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-800 px-2 py-0.5 rounded-full border border-orange-200/60">
                    {TRAINING_EXERCISES.length} Ejercicios
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Ejercicios guiados paso a paso: bases de educación, paseo sin tirones, vida diaria y estimulación cognitiva.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-orange-50 flex items-center justify-between text-xs font-black text-orange-600 group-hover:text-orange-700">
                <span>Ver biblioteca de ejercicios</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Ayúdame con mi perro (IA) */}
            <div
              id="card-hub-asistente"
              onClick={() => setActiveSection('asistente')}
              className="bg-white rounded-3xl p-6 border-2 border-amber-300/80 bg-gradient-to-b from-white to-amber-50/40 hover:border-amber-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                    Ayúdame con mi perro
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    IA Guiada
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Asistente conductual con recopilación de contexto y propuesta de planes progresivos de 7 días basados en refuerzo positivo.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-amber-100 flex items-center justify-between text-xs font-black text-amber-700 group-hover:text-amber-800">
                <span>Consultar caso a la IA</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Bienestar */}
            <div
              id="card-hub-bienestar"
              onClick={() => setActiveSection('bienestar')}
              className="bg-white rounded-3xl p-6 border-2 border-amber-100/90 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Bienestar Integral
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    4 Pilares
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Salud física, enriquecimiento mental, armonía social y descanso reparador (14-16h de sueño).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-50 flex items-center justify-between text-xs font-black text-emerald-600 group-hover:text-emerald-700">
                <span>Ver pilares y plan de descanso</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 5: Hoy con tu perro */}
            <div
              id="card-hub-hoy"
              onClick={() => setActiveSection('hoy')}
              className="bg-white rounded-3xl p-6 border-2 border-amber-100/90 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between md:col-span-2 lg:col-span-2"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                    ☀️ Retos Diarios
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                  Hoy con {pet.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                  Micro-acciones de 5 a 15 minutos para enriquecer el día a día sin abrumaros.
                </p>

                {/* Quick preview of 2 daily items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DAILY_SUGGESTIONS_POOL.slice(0, 2).map((sug) => (
                    <div
                      key={sug.id}
                      className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      <span className="text-xl">{sug.emoji}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">{sug.title}</div>
                        <div className="text-[11px] text-slate-500 font-medium">⏱️ {sug.durationMinutes} min</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-indigo-50 flex items-center justify-between text-xs font-black text-indigo-600 group-hover:text-indigo-700">
                <span>Ver todas las sugerencias de hoy</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Safety & Ethical Foundation Disclaimer */}
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-3.5">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 space-y-1">
              <p className="font-bold text-amber-950">
                Compromiso ético y de bienestar animal (MiPatas España)
              </p>
              <p className="leading-relaxed">
                Todas las pautas de este módulo se fundamentan en el <strong>refuerzo positivo y la ciencia del comportamiento</strong>.
                Nunca sustituyen la evaluación presencial de un veterinario o etólogo clínico acreditado. Ante conductas de agresividad,
                mordidas, miedo paralizante o cambios repentinos de comportamiento, descarta siempre dolor físico con tu veterinario habitual.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ENTIENDE A TU PERRO: SEARCH & TOPICS LIST */}
      {/* ========================================================================= */}
      {activeSection === 'entiende' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span>Entiende a tu perro</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Respuestas rigurosas a las preguntas y dudas más habituales sobre conducta y comunicación.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-behavior-topics"
                type="text"
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                placeholder="Buscar por conducta, ladridos, timbres..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs"
              />
              {topicSearch && (
                <button
                  type="button"
                  onClick={() => setTopicSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'todos', label: 'Todas las áreas' },
              { id: 'comportamiento', label: 'Comportamiento en casa' },
              { id: 'comunicacion', label: 'Lenguaje y señales' },
              { id: 'ansiedad', label: 'Gestión de la soledad' },
              { id: 'rutinas', label: 'Paseo y rutinas' },
              { id: 'alimentacion', label: 'Alimentación' },
              { id: 'convivencia', label: 'Apego y convivencia' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setTopicCategoryFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  topicCategoryFilter === cat.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                id={`topic-card-${topic.id}`}
                onClick={() => setSelectedTopic(topic)}
                className="bg-white rounded-3xl p-5 border-2 border-amber-100 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                      {topic.categoryLabel}
                    </span>
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors mb-2 leading-snug">
                    {topic.question}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-3 leading-relaxed">
                    {topic.whatItMeans}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700">
                  <span>Ver análisis y consejos</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {filteredTopics.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-100">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">No encontramos resultados para tu búsqueda</p>
              <p className="text-xs text-slate-400 mt-1">Prueba con otras palabras o limpia los filtros.</p>
              <button
                type="button"
                onClick={() => {
                  setTopicSearch('');
                  setTopicCategoryFilter('todos');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold hover:bg-amber-100"
              >
                Restablecer filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ENTRENA CON MIPATAS: EXERCISE LIBRARY */}
      {/* ========================================================================= */}
      {activeSection === 'entrena' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-orange-600" />
                <span>Entrena con MiPatas</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Biblioteca de adiestramiento respetuoso. Sesiones cortas de 5 a 10 minutos.
              </p>
            </div>

            {/* Streak Counter Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-900 text-xs font-bold shrink-0">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{progress.practiceDaysStreak} días de racha</span>
            </div>
          </div>

          {/* Category & Level Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center space-x-1.5 overflow-x-auto">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">Categoría:</span>
              {[
                { id: 'todas', label: 'Todas' },
                { id: 'bases', label: 'Bases' },
                { id: 'paseo', label: 'Paseo' },
                { id: 'vida_diaria', label: 'Vida Diaria' },
                { id: 'estimulacion_mental', label: 'Estimulación Mental' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setExerciseCategoryFilter(cat.id as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    exerciseCategoryFilter === cat.id
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">Nivel:</span>
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'principiante', label: 'Principiante' },
                { id: 'intermedio', label: 'Intermedio' },
                { id: 'avanzado', label: 'Avanzado' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setExerciseLevelFilter(lvl.id as any)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                    exerciseLevelFilter === lvl.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExercises.map((exercise) => {
              const isCompleted = progress.exercisesCompletedIds.includes(exercise.id);

              return (
                <div
                  key={exercise.id}
                  id={`exercise-card-${exercise.id}`}
                  className={`bg-white rounded-3xl p-5 border-2 transition-all flex flex-col justify-between ${
                    isCompleted
                      ? 'border-emerald-200 bg-emerald-50/20 shadow-2xs'
                      : 'border-amber-100 hover:border-amber-400 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Header tags & completion toggle */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            exercise.level === 'principiante'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : exercise.level === 'intermedio'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {exercise.level}
                        </span>

                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{exercise.durationMinutes} min</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleExercise(exercise.id);
                        }}
                        className={`p-1.5 rounded-full transition-colors ${
                          isCompleted
                            ? 'text-emerald-600 hover:bg-emerald-100'
                            : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                        }`}
                        title={isCompleted ? 'Marcar como pendiente' : 'Marcar como completado'}
                        aria-label={`Completar ejercicio ${exercise.name}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <h3
                      onClick={() => setSelectedExercise(exercise)}
                      className="text-base font-black text-slate-900 hover:text-orange-600 cursor-pointer transition-colors mb-1.5"
                    >
                      {exercise.name}
                    </h3>

                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mb-4">
                      {exercise.objective}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedExercise(exercise);
                        setShowVideoModal(true);
                      }}
                      className="inline-flex items-center space-x-1.5 text-xs font-black text-orange-600 hover:text-orange-700"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Ver ejercicio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedExercise(exercise)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900"
                    >
                      Ficha de pasos →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ASISTENTE IA GUIADO: "AYÚDAME CON MI PERRO" */}
      {/* ========================================================================= */}
      {activeSection === 'asistente' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Ayúdame con mi perro (Asistente IA)</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Orientación estructurada con hipótesis, ejercicios prácticos y plan progresivo de 7 días.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowContextWizard(!showContextWizard)}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <span>{showContextWizard ? 'Ocultar Asistente de Contexto' : 'Ajustar Contexto del Caso'}</span>
            </button>
          </div>

          {/* Context Wizard Box */}
          {showContextWizard && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center space-x-1.5">
                  <PawPrint className="w-4 h-4 text-amber-600" />
                  <span>Datos de contexto para {pet.name}</span>
                </span>
                <span className="text-[11px] text-slate-500">Ayuda a la IA a personalizar el plan</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-bold">
                <div>
                  <label className="text-slate-600 block mb-1">Etapa de edad</label>
                  <select
                    value={wizardAge}
                    onChange={(e) => setWizardAge(e.target.value as any)}
                    className="w-full p-2 bg-white border border-amber-200 rounded-xl text-slate-800"
                  >
                    <option value="cachorro">Cachorro (&lt; 1 año)</option>
                    <option value="adulto">Adulto (1-8 años)</option>
                    <option value="senior">Senior (&gt; 8 años)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1">¿Desde cuándo ocurre?</label>
                  <select
                    value={wizardDuration}
                    onChange={(e) => setWizardDuration(e.target.value)}
                    className="w-full p-2 bg-white border border-amber-200 rounded-xl text-slate-800"
                  >
                    <option value="unos días (repentino)">Unos días (cambio repentino)</option>
                    <option value="unas semanas">Unas semanas</option>
                    <option value="varios meses">Varios meses</option>
                    <option value="desde que era cachorro/llegó">Desde siempre</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1">Frecuencia</label>
                  <select
                    value={wizardFrequency}
                    onChange={(e) => setWizardFrequency(e.target.value)}
                    className="w-full p-2 bg-white border border-amber-200 rounded-xl text-slate-800"
                  >
                    <option value="diario / constante">Diario / Constante</option>
                    <option value="solo en paseos">Solo en paseos</option>
                    <option value="solo al quedarse solo">Solo al quedarse solo</option>
                    <option value="esporádico">Esporádico</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1">Detonante principal</label>
                  <input
                    type="text"
                    value={wizardTrigger}
                    onChange={(e) => setWizardTrigger(e.target.value)}
                    placeholder="Ej. timbre, otros perros, llaves..."
                    className="w-full p-2 bg-white border border-amber-200 rounded-xl text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quick Prompts */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {quickAiPrompts.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(item.query)}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 border border-amber-200 text-xs font-bold text-slate-700 hover:text-amber-900 whitespace-nowrap transition-colors shadow-2xs shrink-0"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Conversation Box */}
          <div className="bg-white rounded-3xl border-2 border-amber-100 shadow-sm overflow-hidden flex flex-col min-h-[480px]">
            <div className="p-4 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">MiPatas Educa AI</div>
                  <div className="text-[10px] text-slate-500">Orientación positiva para {pet.name}</div>
                </div>
              </div>

              {chatMessages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setChatMessages([])}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Nueva consulta</span>
                </button>
              )}
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[500px]">
              {chatMessages.length === 0 ? (
                <div className="text-center py-10 max-w-md mx-auto space-y-3">
                  <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">
                    ¿Qué comportamiento te gustaría entender o trabajar hoy?
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Pregunta sobre cualquier duda conductual. La IA estructurará la respuesta con hipótesis, qué observar, qué evitar y un plan progresivo orientativo.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-amber-500 text-white font-medium rounded-tr-none'
                          : 'bg-slate-50 border border-slate-200/80 text-slate-800 font-normal rounded-tl-none space-y-2 whitespace-pre-line'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}

              {isAiLoading && (
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 bg-amber-50 p-3 rounded-2xl w-fit">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                  <span>Elaborando pauta conductual y plan de 7 días para {pet.name}...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  id="educa-chat-input"
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Describe la situación o conducta de ${pet.name}...`}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-amber-500"
                />
                <button
                  id="educa-chat-submit"
                  type="submit"
                  disabled={!inputMessage.trim() || isAiLoading}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  <span>Enviar</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BIENESTAR: 4 PILLARS & CUSTOM PLAN */}
      {/* ========================================================================= */}
      {activeSection === 'bienestar' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-emerald-600" />
                <span>Bienestar Integral Canino</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Los 4 pilares fundamentales para un perro física y emocionalmente sano.
              </p>
            </div>
          </div>

          {/* Custom Calculated Plan Box for this Pet */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                  🌿 Plan de Bienestar Recomendado para {pet.name}
                </span>
                <span className="text-xs font-bold text-emerald-100">
                  {pet.weightKg} kg • Etapa {petAgeStage}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white/15 backdrop-blur-xs p-3 rounded-2xl">
                  <div className="text-lg font-black">{petAgeStage === 'cachorro' || petAgeStage === 'senior' ? '16-18h' : '14-16h'}</div>
                  <div className="text-[11px] font-bold text-emerald-100 mt-0.5">Sueño diario</div>
                </div>
                <div className="bg-white/15 backdrop-blur-xs p-3 rounded-2xl">
                  <div className="text-lg font-black">20-30 min</div>
                  <div className="text-[11px] font-bold text-emerald-100 mt-0.5">Olfato libre</div>
                </div>
                <div className="bg-white/15 backdrop-blur-xs p-3 rounded-2xl">
                  <div className="text-lg font-black">15 min</div>
                  <div className="text-[11px] font-bold text-emerald-100 mt-0.5">Masticación</div>
                </div>
                <div className="bg-white/15 backdrop-blur-xs p-3 rounded-2xl">
                  <div className="text-lg font-black">BCS 5/9</div>
                  <div className="text-[11px] font-bold text-emerald-100 mt-0.5">Condición óptima</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Pillars Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'fisico', label: '1. Físico', icon: Dumbbell, color: 'text-blue-600 bg-blue-50' },
              { id: 'mental', label: '2. Mental', icon: Brain, color: 'text-purple-600 bg-purple-50' },
              { id: 'social', label: '3. Social', icon: Smile, color: 'text-amber-600 bg-amber-50' },
              { id: 'descanso', label: '4. Descanso', icon: Clock, color: 'text-emerald-600 bg-emerald-50' },
            ].map((pillar) => {
              const Icon = pillar.icon;
              const isSelected = selectedWellbeingTab === pillar.id;

              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => setSelectedWellbeingTab(pillar.id as any)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center space-x-3 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pillar.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">{pillar.label}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Pilar de salud</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tips List for the selected pillar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredWellbeingTips.map((tip) => (
              <div
                key={tip.id}
                className="bg-white rounded-3xl p-6 border-2 border-emerald-100/90 shadow-2xs space-y-4"
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    Recomendado para: {tip.recommendedFor || 'Todos'}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-2 mb-1">
                    {tip.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {tip.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="text-xs font-black text-slate-700">Pautas prácticas:</div>
                  {tip.actionPoints.map((point, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. HOY CON TU PERRO: QUICK DAILY SUGGESTIONS */}
      {/* ========================================================================= */}
      {activeSection === 'hoy' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>Hoy con {pet.name}</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Ideas rápidas y divertidas de 5 a 15 minutos para fortalecer vuestro vínculo hoy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DAILY_SUGGESTIONS_POOL.map((sug) => (
              <div
                key={sug.id}
                className="bg-white rounded-3xl p-6 border-2 border-indigo-100 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{sug.emoji}</span>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-indigo-500" />
                      <span>{sug.durationMinutes} min</span>
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 mb-1.5">
                    {sug.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                    {sug.description}
                  </p>
                </div>

                {sug.linkedExerciseId && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        const targetEx = TRAINING_EXERCISES.find((ex) => ex.id === sug.linkedExerciseId);
                        if (targetEx) setSelectedExercise(targetEx);
                      }}
                      className="text-xs font-black text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                    >
                      <span>Abrir ejercicio guiado</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAIL MODAL: BEHAVIOR TOPIC ("Entiende a tu perro") */}
      {/* ========================================================================= */}
      {selectedTopic && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                  {selectedTopic.categoryLabel}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {selectedTopic.question}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTopic(null)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 6 Dedicated Sections */}
            <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
              {/* 1. ¿Qué significa? */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                <div className="font-black text-amber-950 flex items-center space-x-1.5">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>1. ¿Qué significa esta conducta?</span>
                </div>
                <p className="text-slate-800">{selectedTopic.whatItMeans}</p>
              </div>

              {/* 2. Posibles causas */}
              <div className="space-y-2">
                <div className="font-black text-slate-900 flex items-center space-x-1.5">
                  <Brain className="w-4 h-4 text-amber-600" />
                  <span>2. Posibles causas habituales</span>
                </div>
                <ul className="space-y-1.5 pl-2">
                  {selectedTopic.possibleCauses.map((cause, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Qué observar */}
              <div className="space-y-2">
                <div className="font-black text-slate-900 flex items-center space-x-1.5">
                  <Eye className="w-4 h-4 text-amber-600" />
                  <span>3. Qué observar en su lenguaje corporal</span>
                </div>
                <ul className="space-y-1.5 pl-2">
                  {selectedTopic.whatToObserve.map((obs, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Cómo reaccionar positivamente */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="font-black text-emerald-950 flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>4. Cómo reaccionar de forma positiva</span>
                </div>
                <ul className="space-y-1.5 pl-1">
                  {selectedTopic.howToReact.map((react, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{react}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. Qué evitar */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                <div className="font-black text-rose-950 flex items-center space-x-1.5">
                  <X className="w-4 h-4 text-rose-600" />
                  <span>5. Qué evitar estrictamente</span>
                </div>
                <ul className="space-y-1.5 pl-1">
                  {selectedTopic.whatToAvoid.map((avoid, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <X className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span>{avoid}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 6. Cuándo consultar */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-1">
                <div className="font-black text-slate-900 flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-slate-700" />
                  <span>6. Cuándo acudir a un profesional (Veterinario / Etólogo)</span>
                </div>
                <p className="text-slate-600">{selectedTopic.whenToConsultProfessional}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {selectedTopic.suggestedExerciseId && (
                <button
                  type="button"
                  onClick={() => {
                    const targetEx = TRAINING_EXERCISES.find((ex) => ex.id === selectedTopic.suggestedExerciseId);
                    setSelectedTopic(null);
                    if (targetEx) {
                      setSelectedExercise(targetEx);
                      setActiveSection('entrena');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-900 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-orange-600" />
                  <span>Ver ejercicio recomendado</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedTopic(null)}
                className="ml-auto px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Cerrar ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAIL MODAL: TRAINING EXERCISE */}
      {/* ========================================================================= */}
      {selectedExercise && !showVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-800 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/60">
                    Nivel {selectedExercise.level}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    ⏱️ {selectedExercise.durationMinutes} min • {selectedExercise.frequency}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900">{selectedExercise.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExercise(null)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Objective & Materials */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200">
                <div className="font-black text-orange-950 mb-1">🎯 Objetivo:</div>
                <p className="text-slate-800">{selectedExercise.objective}</p>
              </div>

              <div>
                <div className="font-black text-slate-900 mb-1.5">🎒 Materiales necesarios:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedExercise.materials.map((mat, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-2 pt-2">
                <div className="font-black text-slate-900 text-sm">👣 Pasos guiados:</div>
                <div className="space-y-2.5">
                  {selectedExercise.steps.map((step, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-slate-700 leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1.5">
                <div className="font-black text-rose-950 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Errores comunes a evitar:</span>
                </div>
                <ul className="space-y-1 pl-1">
                  {selectedExercise.commonMistakes.map((err, i) => (
                    <li key={i} className="flex items-start space-x-1.5 text-slate-700">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{err}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro Tips */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                <div className="font-black text-amber-950 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Consejos Pro de MiPatas:</span>
                </div>
                <ul className="space-y-1 pl-1">
                  {selectedExercise.tips.map((tip, i) => (
                    <li key={i} className="flex items-start space-x-1.5 text-slate-700">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black flex items-center space-x-2 shadow-xs transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Ver vídeo explicativo</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleToggleExercise(selectedExercise.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-colors flex items-center space-x-1.5 ${
                    progress.exercisesCompletedIds.includes(selectedExercise.id)
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {progress.exercisesCompletedIds.includes(selectedExercise.id)
                      ? 'Completado ✓'
                      : 'Marcar como completado'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedExercise(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIDEO MODAL (PLACEHOLDER WITH POLISHED NOTICE) */}
      {/* ========================================================================= */}
      {showVideoModal && selectedExercise && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-slate-950 text-white rounded-3xl max-w-xl w-full border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                  Vídeo Tutorial
                </span>
                <h3 className="text-base font-black text-white mt-1">{selectedExercise.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Placeholder Container */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center p-6 group">
              {selectedExercise.videoPlaceholder.thumbnailUrl && (
                <img
                  src={selectedExercise.videoPlaceholder.thumbnailUrl}
                  alt={selectedExercise.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-300"
                />
              )}

              <div className="relative z-10 space-y-3 max-w-xs">
                <div className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                </div>
                <div>
                  <div className="text-sm font-black text-white">Vídeo próximamente</div>
                  <p className="text-xs text-slate-300 font-medium mt-1">
                    Estamos produciendo la grabación en alta definición con educadores caninos colegiados.
                  </p>
                </div>
              </div>

              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded-md">
                ⏱️ ~{Math.round((selectedExercise.videoPlaceholder.durationSeconds || 180) / 60)} min
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowVideoModal(false);
                }}
                className="text-amber-400 font-bold hover:underline"
              >
                ← Volver a los pasos escritos
              </button>

              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
