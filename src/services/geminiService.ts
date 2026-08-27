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

// Utility to detect static-only hosting environments (e.g. GitHub Pages)
export const isStaticEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname.endsWith('github.io') || hostname.endsWith('.pages.dev');
};

export const GeminiService = {
  async chat(messages: { role: 'user' | 'assistant'; content: string }[], petContext?: Partial<Pet>): Promise<string> {
    const formatted: ChatMessage[] = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      content: m.content,
    }));
    return this.sendMessage(formatted, petContext);
  },

  async sendMessage(messages: ChatMessage[], petContext?: Partial<Pet>): Promise<string> {
    // If we're on a static hosting environment like GitHub Pages, deliver graceful offline guidance immediately
    if (isStaticEnvironment()) {
      return this.generateStaticResponse(messages, petContext);
    }

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, petContext }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Servidor no disponible (${res.status})`);
      }

      const data = await res.json();
      return data.text || 'Sin respuesta del asistente.';
    } catch (error: any) {
      console.warn('Gemini chat request fallback:', error);
      return this.generateStaticResponse(messages, petContext);
    }
  },

  generateStaticResponse(messages: ChatMessage[], petContext?: Partial<Pet>): string {
    const lastUserMsg = messages[messages.length - 1]?.content.toLowerCase() || '';

    let specificTopic = '';
    if (lastUserMsg.includes('seguro') || lastUserMsg.includes('ley') || lastUserMsg.includes('7/2023') || lastUserMsg.includes('normativa') || lastUserMsg.includes('responsabilidad civil')) {
      specificTopic = `\n\n📌 **Normativa Ley 7/2023 en España para ${petContext?.name || 'tu mascota'}:**\n- **Seguro de Responsabilidad Civil:** Obligatorio para todos los perros en España por daños a terceros.\n- **Identificación REIAC:** Microchip de 15 dígitos obligatorio antes de los 3 meses de edad.\n- **Tiempo en soledad:** Máximo 24h consecutivas sin supervisión para perros.`;
    } else if (lastUserMsg.includes('vacuna') || lastUserMsg.includes('rabia') || lastUserMsg.includes('leishmania') || lastUserMsg.includes('desparasit')) {
      specificTopic = `\n\n💉 **Pauta Sanitaria en ${petContext?.community || 'España'}:**\n- **Rabia:** Obligatoria en la mayoría de CC.AA. con revacunación anual.\n- **Desparasitación interna:** Trimestral (cada 3 meses).\n- **Protección externa (Leishmania):** Pipetas o collares antiparasitarios contra el flebotomo, especialmente de primavera a otoño.`;
    } else if (lastUserMsg.includes('comida') || lastUserMsg.includes('tóxico') || lastUserMsg.includes('alimento') || lastUserMsg.includes('chocolate')) {
      specificTopic = `\n\n⚠️ **Alimentos prohibidos comunes:** Chocolate, uvas/pasas, cebolla, ajo, aguacate, masa cruda con levadura y edulcorantes (xilitol). Ante cualquier sospecha de ingesta, acude de inmediato a urgencias.`;
    }

    return `ℹ️ **Aviso — Modo Estático (GitHub Pages):**
Esta función de IA en tiempo real requiere un servidor backend activo. En esta versión estática se muestra información orientativa basada en los datos registrados de **${petContext?.name || 'tu mascota'}**.

📋 **Ficha de consulta:**
- **Mascota:** ${petContext?.name || 'Mascota'} (${petContext?.breed || 'Raza no especificada'}, ${petContext?.weightKg ? petContext.weightKg + ' kg' : 'peso registrado'})
- **Comunidad Autónoma:** ${petContext?.community || 'España'}
- **Veterinario:** ${petContext?.vetClinicName || 'Clínica veterinaria habitual'}${specificTopic}

*Nota: Para consultas clínicas diagnósticas, acude siempre a tu centro veterinario colegiado.*`;
  },

  async analyzeDocument(params: AnalyzeDocParams | string): Promise<string> {
    const title = typeof params === 'string' ? 'Documento Veterinario' : params.documentTitle;

    if (isStaticEnvironment()) {
      return `ℹ️ **Análisis en Modo Estático (GitHub Pages)**

Esta función de análisis automatizado con Gemini Vision requiere un backend con servidor activo.

📄 **Documento Registrado:** "${title}"
✅ El documento ha sido archivado correctamente en tu bóveda local de MiPatas. Puedes consultar los tratamientos y pautas directamente en el **Carnet de Salud** y la **Agenda**.`;
    }

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
      console.warn('Gemini doc analysis request fallback:', error);
      return `ℹ️ **Análisis en Modo Estático / Servidor no disponible**

📄 **Documento Registrado:** "${title}"
✅ Documento archivado correctamente en el dispositivo. Las pautas asociadas pueden consultarse en el Carnet de Salud de tu mascota.`;
    }
  },
};

export const geminiService = GeminiService;
