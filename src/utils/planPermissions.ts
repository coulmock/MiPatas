import { PlanTier } from '../types';

export type ProFeatureKey = 'ia' | 'documentos' | 'familia' | 'auto_reminders' | 'unlimited_pets';

export interface FeatureDetail {
  key: ProFeatureKey;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  benefits: string[];
  badgeText: string;
  iconName: string;
}

export const PRO_FEATURES_INFO: Record<ProFeatureKey, FeatureDetail> = {
  ia: {
    key: 'ia',
    title: 'MiPatas AI — Asistente Veterinario Inteligente',
    shortDescription: 'Consultas ilimitadas de salud, nutrición, prevención y lectura de informes clínicos.',
    detailedDescription:
      'Tu asistente clínico 24/7 impulsado por inteligencia artificial. Resuelve dudas sobre síntomas leves, pautas nutricionales según raza y edad, primeros auxilios caninos y análisis guiado de analíticas y recetas.',
    benefits: [
      'Consultas ilimitadas 24/7 sin esperas',
      'Explicación en lenguaje claro de informes veterinarios complejos',
      'Recomendaciones preventivas adaptadas a la raza y peso de tu mascota',
      'Protocolos de primeros auxilios y detección de alertas de urgencia',
    ],
    badgeText: 'PRO',
    iconName: 'Sparkles',
  },
  documentos: {
    key: 'documentos',
    title: 'Bóveda Segura de Documentos Clínicos',
    shortDescription: 'Almacena y extrae datos de analíticas, cartillas, recetas, pólizas y facturas veterinarias.',
    detailedDescription:
      'Guarda todos los informes médicos, recetas y certificados en un solo lugar seguro y accesible desde cualquier dispositivo, con extracción inteligente de diagnósticos, lotes de vacunas y fechas de vencimiento.',
    benefits: [
      'Almacenamiento ilimitado en la nube de PDFs e imágenes',
      'Extracción automática con IA de fechas, dosis y recomendaciones',
      'Búsqueda por etiquetas y descarga instantánea en urgencias',
      'Cumplimiento de archivo legal de pólizas de Responsabilidad Civil',
    ],
    badgeText: 'PRO',
    iconName: 'FileText',
  },
  familia: {
    key: 'familia',
    title: 'Familia & Cuidadores Compartidos',
    shortDescription: 'Coordina los cuidados de tu mascota con familiares, paseadores, guarderías y veterinarios.',
    detailedDescription:
      'Sincroniza en tiempo real la administración de medicamentos, paseos y comidas con todo tu círculo de confianza. Evita dosis duplicadas u olvidos gracias al registro colaborativo.',
    benefits: [
      'Invitaciones ilimitadas a cuidadores, paseadores y familiares',
      'Registro en tiempo real de tomas de medicación ("¿quién le dio la pastilla?")',
      'Muro colaborativo de actividad y notas del día a día',
      'Permisos personalizados de edición y consulta',
    ],
    badgeText: 'PRO',
    iconName: 'Users',
  },
  auto_reminders: {
    key: 'auto_reminders',
    title: 'Recordatorios Inteligentes Automáticos',
    shortDescription: 'Avisos automáticos de revacunación, pipetas, seguro obligatorio y desparasitaciones periódicas.',
    detailedDescription:
      'El sistema calcula automáticamente los plazos de revacunación anual según tu Comunidad Autónoma (Ley 7/2023) y la periodicidad de collares y pipetas antiparasitarias.',
    benefits: [
      'Cálculo automático de fechas según normativa autonómica (rabia, leishmania)',
      'Avisos de renovación de seguros de Responsabilidad Civil',
      'Alertas personalizadas por email y notificaciones',
      'Historial de cumplimiento preventivo',
    ],
    badgeText: 'PRO',
    iconName: 'Bell',
  },
  unlimited_pets: {
    key: 'unlimited_pets',
    title: 'Mascotas Ilimitadas',
    shortDescription: 'Gestiona todas las mascotas de tu hogar sin restricciones en una sola cuenta.',
    detailedDescription:
      'En el Plan Base puedes gestionar 1 mascota. Con MiPatas Pro tienes espacio para perros, gatos y todas las mascotas de tu familia con sus historiales médicos independientes.',
    benefits: [
      'Añade perros, gatos y otras mascotas sin límite',
      'Historial clínico y carnet digital independiente para cada una',
      'Cambio instantáneo de mascota desde la cabecera',
      'Fichas oficiales y carnets REIAC organizados',
    ],
    badgeText: 'PRO',
    iconName: 'PawPrint',
  },
};

export const planPermissions = {
  /**
   * Checks if a plan tier has access to a specific feature.
   */
  canAccess(feature: ProFeatureKey, plan: PlanTier): boolean {
    if (plan === 'pro') return true;
    // On free plan, all ProFeatureKeys are restricted
    return false;
  },

  /**
   * Checks whether the user can add another pet given current pet count.
   * Free allows 1 pet, Pro allows unlimited.
   */
  canAddPet(currentPetCount: number, plan: PlanTier): boolean {
    if (plan === 'pro') return true;
    return currentPetCount < 1;
  },

  /**
   * Returns max pets allowed for the plan tier.
   */
  getMaxPets(plan: PlanTier): number {
    return plan === 'pro' ? Infinity : 1;
  },

  /**
   * Details about plan pricing.
   */
  pricing: {
    free: {
      id: 'free' as PlanTier,
      name: 'Base',
      tagline: 'Lo esencial para 1 mascota',
      monthlyPrice: '0 €',
      period: 'gratis para siempre',
      priceNumber: 0,
      features: [
        { text: '1 mascota registrada', included: true },
        { text: 'Dashboard de salud general', included: true },
        { text: 'Ficha oficial y DNI Canino Digital', included: true },
        { text: 'Carnet de salud (registro manual)', included: true },
        { text: 'Agenda y calendario de citas', included: true },
        { text: 'Pautas de medicamentos manuales', included: true },
        { text: 'Recordatorios básicos manuales', included: true },
        { text: 'MiPatas AI (Asistente veterinario)', included: false },
        { text: 'Bóveda de documentos clínicos e informes', included: false },
        { text: 'Familia y cuidadores multi-usuario', included: false },
        { text: 'Recordatorios inteligentes automáticos', included: false },
        { text: 'Mascotas ilimitadas', included: false },
      ],
    },
    pro: {
      id: 'pro' as PlanTier,
      name: 'Pro',
      tagline: 'Cuidado integral sin límites para toda la familia',
      monthlyPrice: '4,99 €',
      yearlyPrice: '49,00 €',
      period: '/mes',
      priceNumber: 4.99,
      features: [
        { text: 'Mascotas ilimitadas', included: true, highlight: true },
        { text: 'MiPatas AI: Asistente veterinario ilimitado 24/7', included: true, highlight: true },
        { text: 'Bóveda de Documentos + Extracción automática IA', included: true, highlight: true },
        { text: 'Familia & Cuidadores: Registro compartido de tomas', included: true, highlight: true },
        { text: 'Recordatorios inteligentes automáticos (Ley 7/2023)', included: true, highlight: true },
        { text: 'Dashboard y Carnet de Salud completo', included: true },
        { text: 'Ficha oficial DNI Canino y Pasaporte Digital', included: true },
        { text: 'Agenda y calendario de citas sin límite', included: true },
        { text: 'Registro y seguimiento de peso con gráficas', included: true },
        { text: 'Acceso prioritario a nuevas funcionalidades', included: true },
      ],
    },
  },
};
