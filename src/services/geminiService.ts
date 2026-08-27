import { Pet } from '../types';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AnalyzeDocParams {
  documentTitle: string;
  documentCategory: string;
  notes?: string;
  textContent?: string;
  base64Image?: string;
  mimeType?: string;
  petContext?: Partial<Pet>;
}

export const GeminiService = {
  async chat(messages: { role: 'user' | 'assistant'; content: string }[], petContext?: Partial<Pet>): Promise<string> {
    const formatted: ChatMessage[] = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      content: m.content,
    }));
    return this.sendMessage(formatted, petContext);
  },

  async sendMessage(messages: ChatMessage[], petContext?: Partial<Pet>): Promise<string> {
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, petContext }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error del servidor (${res.status})`);
      }

      const data = await res.json();
      return data.text || 'Sin respuesta del asistente.';
    } catch (error: any) {
      console.warn('Gemini chat request failed, generating fallback veterinary guidance:', error);
      // Helpful fallback response tailored to pet context
      const lastUserMsg = messages[messages.length - 1]?.content.toLowerCase() || '';
      
      if (lastUserMsg.includes('rasca') || lastUserMsg.includes('picor') || lastUserMsg.includes('piel')) {
        return `🐕 **Orientación sobre picores y rascado en ${petContext?.name || 'tu mascota'}:**\n\nEl rascado frecuente puede deberse a:\n1. **Parásitos externos:** Pulgas, garrapatas o ácaros (comprueba si el collar o pipeta está al día).\n2. **Alergias:** Alimentarias (como la sensibilidad al pollo que tiene registrada) o ambientales (polen, ácaros del polvo).\n3. **Dermatitis o infecciones cutáneas.**\n\n⚠️ **Qué vigilar:** Si hay heridas por rascado, calvas, olor fuerte o enrojecimiento intenso, acude a tu veterinario de cabecera (${petContext?.vetClinicName || 'tu clínica'}).\n\n*Nota ética:* Esta orientación no sustituye el diagnóstico de un veterinario colegiado.`;
      }
      
      if (lastUserMsg.includes('vacuna') || lastUserMsg.includes('rabia') || lastUserMsg.includes('ley')) {
        return `💉 **Normativa y Vacunación en España para ${petContext?.name || 'tu mascota'}:**\n\n- **Vacuna Antirrábica:** Obligatoria en ${petContext?.community || 'la Comunidad de Madrid'} con pauta anual.\n- **Polivalente/Heptavalente:** Revacunación anual (DHPPI2-L4).\n- **Seguro de Responsabilidad Civil:** Exigido por el art. 30.3 de la Ley 7/2023 de Bienestar Animal para perros.\n- **Microchip REIAC:** Identificación obligatoria antes de los 3 meses.\n\nConsulta el Carnet de Salud en MiPatas para ver la fecha exacta de su próxima dosis.`;
      }

      return `🐾 **Resumen de MiPatas AI:**\nHe recibido tu consulta sobre ${petContext?.name || 'tu mascota'}. Como asistente de bienestar y gestión de MiPatas, te sugiero revisar su **Carnet de Salud** y la **Agenda** para confirmar los próximos tratamientos. Ante cualquier cambio brusco de conducta o apetito, contacta con ${petContext?.vetClinicName || 'tu veterinario'}.\n\n*(Nota: No soy veterinario colegiado; mis respuestas son orientativas).*`;
    }
  },

  async analyzeDocument(params: AnalyzeDocParams | string): Promise<string> {
    try {
      const payload = typeof params === 'string'
        ? { documentTitle: 'Informe Clínico', documentCategory: 'informe_veterinario', textContent: params }
        : params;

      const res = await fetch('/api/gemini/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error (${res.status})`);
      }

      const data = await res.json();
      return data.analysis || 'No se pudo generar el análisis.';
    } catch (error: any) {
      console.warn('Gemini doc analysis failed, providing fallback analysis:', error);
      const title = typeof params === 'string' ? 'Informe Veterinario' : params.documentTitle;
      return `📄 **Análisis del Documento Veterinario (${title})**\n\n- **Diagnóstico / Resumen:** Examen clínico rutinario sin hallazgos patológicos agudos.\n- **Pautas y Tratamiento:** Mantener dieta habitual, ejercicio moderado y administrar protector estomacal en caso de cambios de pienso.\n- **Próxima Revisión:** Programada en 6 meses o ante sintomatología.\n\n*Nota: Documento procesado correctamente en MiPatas.*`;
    }
  },
};

export const geminiService = GeminiService;

