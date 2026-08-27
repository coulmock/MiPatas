import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'MiPatas', timestamp: new Date().toISOString() });
  });

  // MiPatas AI Assistant Chat Endpoint
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { messages, petContext } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Formato de mensajes inválido.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY no está configurada en el servidor.',
        });
      }

      const ai = getAiClient();

      const systemInstruction = `
Eres MiPatas AI, el asistente inteligente y amigable de la aplicación española "MiPatas — Tu mascota. Todo bajo control.".

OBJETIVO PRINCIPAL:
Ayudar, informar, organizar y orientar a los propietarios de mascotas en España sobre cuidados diarios, recordatorios, dudas cotidianas, resumen de historiales y explicación de conceptos veterinarios.

DIRECTIVAS CRÍTICAS DE SEGURIDAD Y VETERINARIA:
1. NUNCA te presentes como un veterinario colegiado ni emitas diagnósticos médicos definitivos.
2. Si el usuario describe síntomas graves (dificultad respiratoria, convulsiones, vómitos con sangre, ingestión de tóxicos como chocolate/uvas/lirios/raticidas, torsión gástrica, letargo extremo, dolor agudo, atropello, contacto con procesionaria del pino), indica de forma clara y prioritaria que debe acudir de inmediato a un hospital veterinario de urgencias 24h.
3. Responde siempre en español de España (vocabulario: "veterinario", "cartilla", "desparasitación", "pienso", "chuchería/premio", "paseador", "residencia canina", "comunidad autónoma").
4. Incluye referencias a la normativa española cuando sea pertinente (Ley 7/2023 de Protección de los Derechos y el Bienestar de los Animales en España, microchip obligatorio REIAC/RIAC, seguro obligatorio de responsabilidad civil para perros, vacunación antirrábica según CC.AA.).
5. Mantén un tono empático, tranquilizador, claro y estructurado con viñetas cuando convenga.

CONTEXTO DEL ANIMAL ACTUAL:
${petContext ? JSON.stringify(petContext, null, 2) : 'No se ha seleccionado mascota específica.'}
`;

      // Build conversation contents
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || 'Lo siento, no pude procesar la respuesta en este momento.';
      res.json({ text: responseText });
    } catch (error: any) {
      console.error('Error in /api/gemini/chat:', error);
      res.status(500).json({
        error: error.message || 'Error al comunicarse con MiPatas AI.',
      });
    }
  });

  // MiPatas AI Document / Veterinary Report Analyzer Endpoint
  app.post('/api/gemini/analyze-document', async (req, res) => {
    try {
      const { documentTitle, documentCategory, notes, textContent, base64Image, mimeType, petContext } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY no está configurada.',
        });
      }

      const ai = getAiClient();

      const systemInstruction = `
Eres el módulo de análisis de documentos clínicos de MiPatas AI (España).
Analiza el documento veterinario o informe proporcionado y genera un resumen claro y accesible para el propietario de la mascota:
- Título/Tipo de documento detectado
- Diagnóstico o hallazgos clave (en lenguaje llano y comprensible)
- Tratamiento o pautas recomendadas
- Fechas o revisiones que conviene anotar en la agenda
- Alertas o signos de alarma a vigilar
- Recordatorio ético: "Este análisis es informativo y no sustituye la consulta con tu veterinario colegiado."
Responde con formato Markdown claro y profesional.
`;

      const promptParts: any[] = [
        {
          text: `Documento: "${documentTitle}" (Categoría: ${documentCategory}).
Notas del propietario: "${notes || 'Ninguna'}".
Texto del documento: "${textContent || 'No se extrajo texto crudo.'}".
Contexto de la mascota: ${JSON.stringify(petContext || {})}.
Por favor, analiza este documento y ofrece un resumen estructurado y práctico.`
        }
      ];

      if (base64Image && mimeType) {
        promptParts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Image,
          },
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: { parts: promptParts },
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.4,
        },
      });

      res.json({ analysis: response.text || 'No se pudo generar el análisis.' });
    } catch (error: any) {
      console.error('Error in /api/gemini/analyze-document:', error);
      res.status(500).json({
        error: error.message || 'Error al analizar el documento.',
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MiPatas server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
