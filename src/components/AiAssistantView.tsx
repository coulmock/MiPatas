import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Pet, AiChatMessage, HealthRecord, Medication } from '../types';
import { geminiService } from '../services/geminiService';
import { ConfirmModal } from './ConfirmModal';

interface AiAssistantViewProps {
  pet: Pet;
  healthRecords: HealthRecord[];
  medications: Medication[];
}

const QUICK_PROMPTS = [
  {
    icon: '⚖️',
    title: 'Ley 7/2023 & Seguros',
    prompt: '¿Qué exige la Ley de Bienestar Animal en España sobre seguro de responsabilidad civil y microchip para mi perro?',
  },
  {
    icon: '💉',
    title: 'Vacuna de la Rabia en mi CC.AA.',
    prompt: '¿Cada cuánto tiempo es obligatoria la vacuna de la rabia en mi Comunidad Autónoma y qué otras vacunas me recomiendas?',
  },
  {
    icon: '🐛',
    title: 'Pauta Leishmania & Parásitos',
    prompt: '¿Cuál es el mejor calendario de prevención contra la Leishmaniosis (flebotomos) y desparasitación para mi mascota?',
  },
  {
    icon: '🩺',
    title: 'Interpretar Síntoma Cotidiano',
    prompt: 'Mi perro tiene heces blandas desde ayer pero tiene buen apetito y ánimo. ¿Qué cuidados básicos puedo aplicar y cuándo debo ir a urgencias?',
  },
  {
    icon: '🥗',
    title: 'Alimentos Tóxicos Comunes',
    prompt: '¿Cuáles son los alimentos domésticos más peligrosos y tóxicos en España para mi mascota (uvas, cebolla, chocolate, etc.)?',
  },
];

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  pet,
  healthRecords,
  medications,
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `¡Hola! Soy **MiPatas AI**, tu asistente veterinario y regulatorio especializado para **${pet.name}** (${pet.breed}, ${pet.weightKg} kg, ${pet.community}).

Puedo ayudarte con:
- 🇪🇸 **Normativa española** (Ley 7/2023, REIAC, seguros de responsabilidad civil).
- 💉 **Calendarios de vacunación y desparasitación** (Rabia, Leishmania, pipetas, pastillas).
- 🩺 **Primeros auxilios e interpretación de síntomas cotidianos**.
- 📋 **Recomendaciones de nutrición, higiene y pautas de medicación**.

*Recuerda: Mis consejos son de orientación y bienestar; ante cualquier urgencia o síntoma agudo acude siempre a tu clínica veterinaria.* ¿Qué te gustaría consultar hoy sobre ${pet.name}?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build context of current pet
      const petContext = {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.birthDate,
        weightKg: pet.weightKg,
        community: pet.community,
        isSterilized: pet.isSterilized,
        hasInsurance: pet.hasMandatoryCivilInsurance,
        activeMedications: medications.filter((m) => m.isActive).map((m) => `${m.name} (${m.dosage})`),
        allergies: healthRecords.filter((r) => r.category === 'alergia').map((r) => r.title),
      };

      const aiResponse = await geminiService.chat(
        [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        petContext
      );

      const botMsg: AiChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: 'Lo siento, hubo un problema al procesar tu consulta. Por favor, intenta de nuevo.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Conversación reiniciada. ¿Qué consulta tienes sobre **${pet.name}**?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 text-white shadow-sm border border-slate-800">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight">MiPatas AI</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Veterinario & Ley 7/2023
              </span>
            </div>
            <p className="text-xs text-slate-300 font-normal mt-0.5">
              Asistente clínico y legal adaptado a {pet.name} ({pet.community}).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold self-start sm:self-auto transition-colors"
          aria-label="Reiniciar conversación de chat con MiPatas AI"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar Chat</span>
        </button>
      </div>

      {/* Medical Safety Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start space-x-2.5 text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Aviso Sanitario:</strong> MiPatas AI ofrece pautas informativas basadas en la normativa española y literatura veterinaria. No sustituye el diagnóstico ni la consulta presencial de un profesional colegiado. Ante emergencias graves, contacta con tu clínica ({pet.vetClinicName || 'Hospital Veterinario'}).
        </p>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-1">
          Preguntas Rápidas Frecuentes
        </span>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.prompt)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-900 border border-slate-200 hover:border-indigo-200 text-xs font-medium shrink-0 shadow-xs transition-colors"
            >
              <span>{qp.icon}</span>
              <span>{qp.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-slate-800 text-white'
                  : 'bg-indigo-600 text-white shadow-xs'
              }`}
            >
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] sm:max-w-[75%] ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white font-normal rounded-tr-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs whitespace-pre-line'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center space-x-2 rounded-tl-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse delay-75" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse delay-150" />
              <span className="pl-1 text-slate-600 font-medium">MiPatas AI está analizando tu consulta...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Chat Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm"
      >
        <input
          type="text"
          placeholder={`Haz una pregunta sobre ${pet.name} (salud, vacunas, Ley 7/2023)...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 bg-transparent outline-none font-medium"
        />
        <button
          id="send-ai-btn"
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-xs transition-colors shrink-0"
          aria-label="Enviar mensaje a MiPatas AI"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Clear Chat Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        title="¿Reiniciar conversación con MiPatas AI?"
        description={`Se limpiará el historial de mensajes de la sesión actual con ${pet.name}. Podrás iniciar una nueva consulta en cualquier momento.`}
        confirmLabel="Reiniciar conversación"
        cancelLabel="Mantener chat"
        variant="warning"
        onConfirm={handleConfirmClearChat}
        onClose={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
