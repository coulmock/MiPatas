import {
  BehaviorTopic,
  TrainingExercise,
  WellbeingTip,
  DailySuggestion,
} from '../types';

// ============================================================================
// 13 BEHAVIOR TOPICS ("Entiende a tu perro")
// ============================================================================

export const BEHAVIOR_TOPICS: BehaviorTopic[] = [
  {
    id: 'ladra-puerta',
    question: '¿Por qué ladra cuando suena el timbre o llaman a la puerta?',
    category: 'comportamiento',
    categoryLabel: 'Comportamiento en Casa',
    whatItMeans:
      'El ladrido ante el timbre suele ser una respuesta de alerta territorial o de anticipación excitada. Para el perro, el timbre es un sonido predictivo que anuncia la llegada inminente de un estímulo novedoso o de una persona.',
    possibleCauses: [
      'Alerta territorial: siente la necesidad de advertir a la familia de que alguien se aproxima al hogar.',
      'Excitación y frustración: anticipa visitas, juego o atención intensa y no sabe cómo gestionar la energía.',
      'Inseguridad o miedo: la presencia de desconocidos cerca del umbral genera tensión e incertidumbre.',
      'Refuerzo involuntario: gritarle "¡Calla!" suele interpretarse por el perro como que el humano también se une a ladrar.',
    ],
    whatToObserve: [
      '¿Tiene el cuerpo tenso y las orejas erguidas (alerta) o el rabo metido y el cuerpo bajo (inseguridad)?',
      '¿Ladra solo un par de veces o entra en un bucle repetitivo del que le cuesta desconectar?',
      '¿Va corriendo hacia la puerta o busca la mirada de su tutor?',
    ],
    howToReact: [
      'Mantén la calma absoluta: si tú te agitas o corres hacia la puerta, aumentarás su nivel de excitación.',
      'Enséñale una conducta incompatible: pídele con voz tranquila que vaya a su colchoneta ("A tu sitio") antes de abrir.',
      'Premia los momentos de silencio cuando el estímulo se detenga o cuando cambie el foco de atención.',
      'Desensibiliza el timbre: haz sonar el timbre a volumen bajo en momentos aleatorios sin que nadie entre, premiando la calma.',
    ],
    whatToAvoid: [
      'Nunca uses castigos físicos, collares de descarga o de ahogo, ni le tapes el hocico; esto elevará su ansiedad.',
      'Evita gritar órdenes repetitivas en tono enfadado mientras ladra.',
      'No le abras la puerta mientras esté en un pico de histeria o saltando descontrolado.',
    ],
    whenToConsultProfessional:
      'Si el ladrido viene acompañado de gruñidos defensivos, intentos de marcar o morder a las visitas al entrar, o si muestra pánico extremo ante cualquier ruido en el rellano, consulta con un educador canino acreditado o etólogo.',
    suggestedExerciseId: 'gestion-timbre',
    tags: ['timbre', 'ladridos', 'puerta', 'visitas', 'alerta'],
  },
  {
    id: 'sigue-casa',
    question: '¿Por qué me sigue a todas partes por la casa?',
    category: 'convivencia',
    categoryLabel: 'Apego y Convivencia',
    whatItMeans:
      'Los perros son animales sociales que encuentran seguridad y entretenimiento cerca de su grupo de referencia. Seguirte puede reflejar un vínculo sano (comportamiento de "sombra"), pero también puede indicar hiperapego, aburrimiento o necesidad de seguridad.',
    possibleCauses: [
      'Vínculo afectivo y curiosidad natural: quieren saber qué haces y compartir tiempo contigo.',
      'Búsqueda de seguridad: en perros inseguros o rescatados recientemente, tu presencia reduce su nivel de estrés.',
      'Anticipación de recursos: aprenden que tus movimientos a la cocina o al armario de la correa preceden premios o paseos.',
      'Falta de estimulación mental o descanso de baja calidad.',
    ],
    whatToObserve: [
      '¿Puede quedarse dormido en otra habitación si estás ocupado o se levanta instantáneamente con cada movimiento tuyo?',
      '¿Muestra señales de jadeo, tensión o lloriqueo cuando una puerta se cierra entre vosotros?',
      '¿Es capaz de disfrutar de un juguete interactivo o masticable estando tú en otra estancia?',
    ],
    howToReact: [
      'Fomenta su autonomía con juegos de masticación relajante o alfombras de olfato en una zona tranquila de la casa.',
      'Normaliza levantarte y moverte por la casa sin prestarle atención constante cada vez que te sigue.',
      'Enséñale a disfrutar de su propia "zona de relax" o cama confortable mediante premios progresivos.',
    ],
    whatToAvoid: [
      'No le empujes ni le regañes cuando te siga; no lo hace por molestarte.',
      'Evita despedidas y saludos exageradamente dramáticos que aumenten el contraste entre tu presencia y tu ausencia.',
    ],
    whenToConsultProfessional:
      'Si no tolera perderte de vista ni un segundo, araña puertas cerradas, aúlla desesperado al irte al baño o manifiesta síntomas claros de ansiedad por separación.',
    suggestedExerciseId: 'ir-a-su-cama',
    tags: ['sombra', 'apego', 'soledad', 'autonomía'],
  },
  {
    id: 'lame-manos',
    question: '¿Por qué me lame las manos, la cara o a sí mismo?',
    category: 'comunicacion',
    categoryLabel: 'Lenguaje y Comunicación',
    whatItMeans:
      'El lamido es una de las herramientas de comunicación más polifacéticas del perro. Puede expresar afecto, apaciguamiento (señal de calma para pedir espacio), exploración del entorno o una forma de autorrelajarse liberando endorfinas.',
    possibleCauses: [
      'Afecto y vínculo social: gesto heredado del aseo mutuo y cuidado maternal.',
      'Señal de apaciguamiento: cuando percibe tensión humana o una manipulación invasiva, lame para comunicar "todo está bien, por favor ten calma".',
      'Sabor de la piel humana (sal, cremas, restos de comida).',
      'Autorregulación del estrés o molestia física: lamer superficies o sus propias patas libera endorfinas relajantes.',
    ],
    whatToObserve: [
      'Si lame tu mano mientras le acaricias, fíjate si gira la cabeza o bosteza (podría estar pidiendo que pares).',
      '¿Lame de forma pausada y tranquila o de forma frenética y compulsiva?',
      '¿Se lame siempre la misma zona anatómica de su propio cuerpo?',
    ],
    howToReact: [
      'Si es un lamido afectuoso y tranquilo, acéptalo brevemente o redirige hacia una caricia suave en el pecho o costado.',
      'Haz la prueba de la pausa en la caricia: deja de acariciar 3 segundos; si busca tu mano suavemente, quiere seguir; si se aparta, agradece el espacio.',
      'Si lame por estrés, proporciónale una esterilla de lamido (Lickimat) con comida húmeda.',
    ],
    whatToAvoid: [
      'No le apartes bruscamente con un golpe ni le grites.',
      'No dejes que lama cremas con medicamentos humanos o sustancias potencialmente tóxicas.',
    ],
    whenToConsultProfessional:
      'Si el lamido se convierte en una conducta compulsiva hacia muebles, suelo o se produce heridas en su piel por lamido persistente (acude al veterinario primero para descartar dermatitis o dolor articular).',
    suggestedExerciseId: 'manipulacion-cooperativa',
    tags: ['lamido', 'afecto', 'señales de calma', 'estrés'],
  },
  {
    id: 'grune-comida',
    question: '¿Por qué gruñe si me acerco a su comida o a su juguete?',
    category: 'comportamiento',
    categoryLabel: 'Protección de Recursos',
    whatItMeans:
      'El gruñido sobre la comida o juguetes es una conducta natural de protección de recursos (posesividad). El perro siente que un recurso valioso para su supervivencia está en peligro de ser arrebatado y utiliza el gruñido como una advertencia preventiva para evitar el conflicto.',
    possibleCauses: [
      'Miedo a perder el objeto o alimento valioso.',
      'Experiencias pasadas donde los humanos le retiraban el cuenco o juguetes como "prueba de dominancia" (práctica errónea y desaconsejada).',
      'Alto valor percibido del recurso (huesos carnosos, comida especialmente sabrosa).',
      'Dolor bucal o físico que aumenta su susceptibilidad defensiva.',
    ],
    whatToObserve: [
      'Postura corporal rígida, mirada fija ("ojo de ballena" con esclera blanca visible), cuerpo sobre el cuenco.',
      'Distancia crítica a la que empieza a tensarse cuando alguien se aproxima.',
      '¿Ocurre solo con ciertas personas de la familia o con otros animales?',
    ],
    howToReact: [
      '¡Respeta el gruñido! El gruñido es comunicación sana; si lo castigas, eliminarás la alarma y el perro pasará a morder sin aviso.',
      'Retrocede tranquilamente y dale espacio.',
      'Trabaja la asociación positiva desde la distancia: acércate a una distancia segura donde esté relajado y lánzale un trocito de comida aún mejor (pollo cocido, queso) y retírate.',
      'Practica siempre el "Juego de intercambio" (Trueque): nunca quites nada a la fuerza, ofrece algo mejor a cambio.',
    ],
    whatToAvoid: [
      'JAMÁS le quites el cuenco de comida mientras come para "demostrar quién manda". Esto es la causa número 1 de problemas graves de posesividad.',
      'No le grites ni le castigues por gruñir.',
      'No permitas que niños pequeños se acerquen a un perro que está comiendo o con un objeto valioso.',
    ],
    whenToConsultProfessional:
      'La protección de recursos puede escalar rápidamente. Es imprescindible contactar con un etólogo clínico o educador canino profesional respetuoso y libre de aversivos.',
    suggestedExerciseId: 'suelta-intercambio',
    tags: ['gruñido', 'comida', 'recursos', 'posesividad', 'seguridad'],
  },
  {
    id: 'destruye-solo',
    question: '¿Por qué muerde y rompe cosas cuando se queda solo?',
    category: 'ansiedad',
    categoryLabel: 'Gestión de la Soledad',
    whatItMeans:
      'La conducta destructiva durante la soledad puede deberse a múltiples factores: dolor dental o exploración en cachorros, aburrimiento/frustración por falta de actividad, o un cuadro de ansiedad relacionada con la separación (ARS). Morder libera endorfinas que ayudan al perro a calmar su sistema nervioso.',
    possibleCauses: [
      'Ansiedad por separación o frustración por confinamiento/aislamiento.',
      'Falta de estimulación física, mental u olfativa durante el día.',
      'Etapa de dentición (en cachorros de 3 a 8 meses).',
      'Masticación como herramienta de autorrelajación ante el estrés ambiental.',
    ],
    whatToObserve: [
      '¿Destruye puertas, marcos o ventanas (rutas de salida del tutor)?',
      '¿Muerde objetos con tu olor (ropa, cojines, mando a distancia)?',
      '¿Aparece jadeo, salivación excesiva o micciones acompañando a los destrozos?',
    ],
    howToReact: [
      'Graba un vídeo de los primeros 30-40 minutos tras tu salida para evaluar si hay sufrimiento emocional real.',
      'Asegúrate de que antes de quedarse solo ha tenido un paseo olfativo de calidad con tiempo para oler y relajarse.',
      'Ofrécele mordedores naturales seguros (asta de ciervo pulida, madera de olivo, raíces) o juguetes rellenables congelados (tipo Kong).',
      'Comienza a practicar salidas muy breves (desde 30 segundos) aumentando gradualmente el tiempo sin cruzar su umbral de tolerancia.',
    ],
    whatToAvoid: [
      'NUNCA le regañes al llegar a casa viendo los destrozos. El perro no asociará el castigo con lo ocurrido horas antes, sino con tu llegada, haciéndole temerte al volver.',
      'No le encierres en transportines pequeños como castigo o para evitar que muerda.',
    ],
    whenToConsultProfessional:
      'Si se autolesiona las patas o la boca contra puertas, si no come nada mientras está solo o si aúlla continuamente, es un caso de ansiedad por separación que requiere terapia profesional especializada.',
    suggestedExerciseId: 'alfombra-olfato',
    tags: ['destrozo', 'ansiedad', 'soledad', 'masticacion', 'kong'],
  },
  {
    id: 'tira-correa',
    question: '¿Por qué tira tanto de la correa durante el paseo?',
    category: 'rutinas',
    categoryLabel: 'Paseo y Gestión de Entorno',
    whatItMeans:
      'Los perros caminan de forma natural al doble de velocidad que los humanos y exploran el mundo principalmente a través del olfato. Tirar de la correa no es rebeldía: es el resultado de la curiosidad, la prisa por llegar a olores interesantes y el refuerzo involuntario (si tira y avanza, aprende que tirar funciona).',
    possibleCauses: [
      'Correa demasiado corta (menos de 2 metros): genera tensión constante y frustración.',
      'Excitación acumulada por paseos escasos o poco enriquecedores.',
      'Refuerzo aprendido: el perro tira, nosotros cedemos el paso y el perro llega a su objetivo.',
      'Miedo o reactividad a estímulos del entorno (coches, ruidos, otros perros).',
      'Uso de material inadecuado (collares que asfixian y activan el reflejo de oposición).',
    ],
    whatToObserve: [
      '¿Tira durante todo el paseo o solo los primeros 10 minutos al salir de casa?',
      '¿Tira en dirección a un estímulo concreto (otro perro, un parque) o va desorientado?',
      '¿Se detiene a olisquear con tranquilidad cuando se lo permites?',
    ],
    howToReact: [
      'Utiliza un arnés ergonómico en forma de "Y" o "H" que deje libres sus hombros y cuello, con una correa fija de al menos 2 a 3 metros.',
      'El método del "árbol": cuando la correa se tense, detén tu marcha con suavidad sin pegar tirones; cuando la correa se afloje o te mire, reanuda el paso alegremente.',
      'Dedica partes del paseo exclusivamente al olfato ("paseo olfativo"), dejando que el perro decida el ritmo.',
      'Premia de forma frecuente cada vez que camine a tu lado con la correa destensada.',
    ],
    whatToAvoid: [
      'Evita los tirones secos de correa (golpes de castigo); dañan su musculatura cervical y elevan el nivel de estrés.',
      'No uses correas extensibles tipo Flexi en ciudad: enseñan al perro a mantener la correa en tensión constante.',
      'Evita collares de castigo, estrangulamiento o púas.',
    ],
    whenToConsultProfessional:
      'Si el tiro de correa se acompaña de ladridos descontrolados, abalanzamientos agresivos contra peatones, bicicletas o perros, o te resulta físicamente imposible gestionarlo.',
    suggestedExerciseId: 'caminar-correa-destensada',
    tags: ['correa', 'paseo', 'tirones', 'arnes', 'olfato'],
  },
  {
    id: 'salta-saludar',
    question: '¿Por qué salta sobre las personas al saludar?',
    category: 'comportamiento',
    categoryLabel: 'Interacción Social',
    whatItMeans:
      'En la comunicación canina, los perros buscan acceder a la cara de otros individuos para saludar, oler y recoger información química. Al ser los humanos bípedos y más altos, el salto es la forma instintiva del perro de acortar la distancia física y expresar emoción.',
    possibleCauses: [
      'Felicidad desbordada y falta de autocontrol al reencontrarse con personas.',
      'Historial de refuerzo: cuando era cachorro, todos le acariciaban y festejaban el salto.',
      'Búsqueda activa de atención (incluso una reprimenda verbal es percibida como atención).',
    ],
    whatToObserve: [
      '¿Salta solo con familiares o también con extraños por la calle?',
      '¿Muestra la boca relajada y el rabo en abanico (juego) o está hipervigilante?',
      '¿Se calma pasados 30 segundos si nadie le habla?',
    ],
    howToReact: [
      'Enseña la regla de "4 patas en el suelo = caricias y atención".',
      'Cuando salte, cruza los brazos, gira tu cuerpo suavemente y no hables ni hagas contacto visual hasta que apoye sus cuatro patas.',
      'En el instante en que sus 4 patas toquen el suelo, agáchate a su altura y salúdale con caricias suaves en el pecho.',
      'Pide a las visitas que sigan la misma pauta para mantener la coherencia.',
    ],
    whatToAvoid: [
      'No le empujes con las manos mientras salta, ya que muchos perros lo interpretan como un juego de lucha.',
      'No le des rodillazos en el pecho ni pises sus patas traseras (técnicas obsoletas y lesivas).',
    ],
    whenToConsultProfessional:
      'Si el salto va acompañado de mordisqueos que rasgan la ropa o provocan hematomas, o si por su gran tamaño supone un riesgo para niños o personas mayores.',
    suggestedExerciseId: 'saludo-cuatro-patas',
    tags: ['salto', 'saludo', 'visitas', 'autocontrol'],
  },
  {
    id: 'se-esconde',
    question: '¿Por qué se esconde debajo de la mesa o en rincones?',
    category: 'comunicacion',
    categoryLabel: 'Emociones y Sensibilidad',
    whatItMeans:
      'Esconderse o buscar espacios protegidos tipo "cueva" es una estrategia adaptativa de autoprotección. Indica que el perro se siente abrumado, asustado, con sobrecarga sensorial o que puede estar experimentando malestar físico o dolor.',
    possibleCauses: [
      'Miedo a ruidos fuertes (tormentas, petardos, obras, electrodomésticos).',
      'Sobrecarga social por visitas ruidosas o niños jugando en casa.',
      'Dolor físico o enfermedad: los animales suelen aislarse cuando se sienten vulnerables.',
      'Necesidad natural de desconexión y sueño profundo sin interrupciones.',
    ],
    whatToObserve: [
      '¿Tiembla, tiene las pupilas dilatadas o jadea intensamente en su escondite?',
      '¿Ocurre tras un ruido específico o de manera espontánea a ciertas horas?',
      '¿Rechaza comer o salir a pasear?',
    ],
    howToReact: [
      'Respeta su refugio: nunca le saques a la fuerza de su escondite.',
      'Prepárale una "zona segura" acogedora con mantas, su olor familiar y luz tenue.',
      'Pon música relajante (ruido blanco o música clásica para perros) si hay ruidos en el exterior.',
      'Si se acerca a ti buscando consuelo, acaríciale de forma calmada y transmítele tranquilidad.',
    ],
    whatToAvoid: [
      'No le obligues a exponerse al estímulo que le aterra ("inundación"), ya que agravará el trauma.',
      'No le riñas ni le ridiculices por tener miedo.',
    ],
    whenToConsultProfessional:
      'Si el aislamiento es repentino (llevar al veterinario para descartar dolor interno) o si padece fobia acústica severa que le paralice durante horas.',
    suggestedExerciseId: 'tumbado-relax',
    tags: ['miedo', 'esconderse', 'petardos', 'seguridad', 'dolor'],
  },
  {
    id: 'llora-irse',
    question: '¿Por qué llora, aúlla o gime cuando salgo de casa?',
    category: 'ansiedad',
    categoryLabel: 'Gestión de la Soledad',
    whatItMeans:
      'El llanto y el aullido son llamadas de socorro filogenéticas. Los cánidos usan vocalizaciones para reagrupar a la manada cuando un miembro se aleja. Si tu perro no ha aprendido a gestionar la soledad, la partida de su figura de apego le genera un pico agudo de pánico.',
    possibleCauses: [
      'Falta de habituación progresiva a la soledad desde cachorro o tras una adopción.',
      'Cambios drásticos de rutina (vuelta al trabajo tras vacaciones, mudanzas).',
      'Predisposición genética o vivencias de abandono previo.',
      'Hiperapego no gestionado.',
    ],
    whatToObserve: [
      '¿Cuánto tiempo dura el llanto: 2 minutos y luego se acuesta, o se prolonga durante horas?',
      '¿Empieza a ponerse nervioso antes de que salgas (al coger las llaves, ponerte los zapatos o la chaqueta)?',
    ],
    howToReact: [
      'Desensibiliza las señales de salida: coge las llaves, ponte el abrigo y siéntate en el sofá a leer sin marcharte.',
      'Haz salidas progresivas de segundos a minutos, siempre regresando antes de que entre en angustia.',
      'Deja juguetes de masticación o alfombras de olfato momentos antes de salir.',
    ],
    whatToAvoid: [
      'No entres a consolarle en pleno ataque de histeria si puedes evitarlo; espera a una micro-pausa de silencio.',
      'Evita usar collares antiladridos: enmascaran el síntoma aumentando exponencialmente el sufrimiento psicológico.',
    ],
    whenToConsultProfessional:
      'La ansiedad por separación es uno de los problemas comportamentales que mayor sufrimiento causa al animal y a los vecinos. Debe ser tratada con un especialista en conducta canina.',
    suggestedExerciseId: 'alfombra-olfato',
    tags: ['aullidos', 'llanto', 'soledad', 'ansiedad por separación'],
  },
  {
    id: 'lame-patas',
    question: '¿Por qué se lame o mordisquea las patas compulsivamente?',
    category: 'comportamiento',
    categoryLabel: 'Salud y Conducta',
    whatItMeans:
      'El lamido insistente de las patas casi siempre tiene un origen físico o dermatológico que debe ser evaluado primero por un veterinario. En ausencia de patología médica, puede convertirse en una conducta estereotipada provocada por estrés crónico o aburrimiento.',
    possibleCauses: [
      'Causa médica: alergia ambiental (polen, ácaros), alergia alimentaria o dermatitis por contacto.',
      'Espigas clavadas, cortes en almohadillas, quemaduras por asfalto caliente o sal de deshielo.',
      'Hongos o infecciones bacterianas (Malassezia) entre los dedos.',
      'Dolor articular o artrosis en las extremidades.',
      'Estrés crónico, ansiedad o falta de estimulación.',
    ],
    whatToObserve: [
      '¿Las almohadillas o el pelaje interdigital están enrojecidos, húmedos o de color cobrizo por la saliva?',
      '¿Lame una sola pata o las cuatro?',
      '¿Ocurre más después del paseo o por la noche en reposo?',
    ],
    howToReact: [
      'Revisa cuidadosamente entre sus almohadillas con buena luz en busca de espigas, grietas o cuerpos extraños.',
      'Limpia sus patas con agua tibia y sécalas minuciosamente tras los paseos.',
      'Pide cita veterinaria prioritaria para examen dermatológico.',
    ],
    whatToAvoid: [
      'No apliques cremas humanas con corticoides o antibióticos sin prescripción veterinaria (podría intoxicarse al lamerlas).',
      'No te limites a ponerle un cono o calcetín sin tratar la causa de base.',
    ],
    whenToConsultProfessional:
      'Visita inmediata al veterinario si hay cojera, hinchazón, sangrado, mal olor en las patas o si el lamido interrumpe su descanso.',
    suggestedExerciseId: 'manipulacion-cooperativa',
    tags: ['patas', 'alergias', 'espigas', 'dermatología', 'estrés'],
  },
  {
    id: 'mueve-cola',
    question: '¿Mover la cola siempre significa que mi perro está feliz?',
    category: 'comunicacion',
    categoryLabel: 'Lenguaje Corporal',
    whatItMeans:
      'Mito muy extendido: mover la cola NO es sinónimo automático de felicidad. El movimiento de la cola indica únicamente un estado de alta activación emocional o excitación. Puede significar alegría, pero también tensión, frustración, alerta defensiva o disposición al conflicto.',
    possibleCauses: [
      'Alegría y juego: movimiento amplio en círculo ("helicóptero") o de lado a lado acompañado de cuerpo relajado.',
      'Inseguridad o alerta: cola en posición alta y rígida, con movimiento corto y rápido como un metrónomo.',
      'Sumisión o miedo: cola baja o entre las patas con movimientos tímidos en la punta.',
    ],
    whatToObserve: [
      'Observa el cuerpo entero: tensión muscular, mirada fija, comisuras de la boca, orejas y posición del peso corporal.',
      'La altura de la base de la cola respecto a la línea dorsal de su raza.',
    ],
    howToReact: [
      'Aprende a leer el contexto completo antes de acercarte a un perro desconocido que mueve la cola con rigidez.',
      'Si tu perro mueve la cola con tensión ante otro perro, dale espacio y redirige con calma.',
    ],
    whatToAvoid: [
      'No asumas que un perro es amigable solo porque mueve la cola.',
      'No toques a un perro si su cola se mueve con rigidez extrema y mirada fija.',
    ],
    whenToConsultProfessional:
      'Si tienes dudas interpretando las señales corporales de tu perro en interacciones con otros canes o personas.',
    suggestedExerciseId: 'sentado-foco',
    tags: ['cola', 'lenguaje', 'señales de calma', 'comunicación'],
  },
  {
    id: 'come-cosas',
    question: '¿Por qué come hierba, tierra o cosas prohibidas en la calle?',
    category: 'alimentacion',
    categoryLabel: 'Conducta Alimentaria',
    whatItMeans:
      'Comer hierba es una conducta canina normal y ancestral que puede tener fines digestivos o gustativos. Sin embargo, ingerir piedras, colillas, plásticos o heces (coprofagia o pica) puede indicar carencias nutricionales, problemas gastrointestinales o estrés.',
    possibleCauses: [
      'Comer hierba: ayuda al tránsito intestinal, aporte de fibra o simple preferencia por brotes tiernos.',
      'Exploración oral y juego en cachorros.',
      'Conducta de "pica" por déficit de nutrientes, parásitos internos o dolor de estómago.',
      'Coprofagia: curiosidad, problemas de absorción o imitación maternal.',
    ],
    whatToObserve: [
      '¿Vomita con frecuencia tras comer hierba?',
      '¿Ingiere objetos no digestibles (piedras, calcetines, maderas)?',
      '¿Su peso y analítica sanguínea están en orden?',
    ],
    howToReact: [
      'Enseña de forma urgente el comando "Suelta" y el ejercicio de "Deja" para evitar que ingiera tóxicos en la calle.',
      'Permítele comer pequeñas cantidades de hierba limpia (lejos de carreteras fumigadas con pesticidas).',
      'Revisa su dieta con tu veterinario para asegurar que el pienso cubra todas sus necesidades.',
    ],
    whatToAvoid: [
      'No le persigas corriendo para quitarle algo de la boca: pensará que es un juego o se lo tragará a toda prisa por miedo a perderlo.',
      'Evita que coma hierba tratada con herbicidas o en parques tratados.',
    ],
    whenToConsultProfessional:
      'Urgencia veterinaria si ingiere piedras, anzuelos, huesos cocinados o venenos. Consulta médica si la conducta de pica es persistente.',
    suggestedExerciseId: 'suelta-intercambio',
    tags: ['hierba', 'pica', 'calle', 'suelta', 'tóxicos'],
  },
  {
    id: 'pipi-casa',
    question: '¿Por qué se hace pipí en casa si ya sabía hacerlo fuera?',
    category: 'rutinas',
    categoryLabel: 'Higiene y Pises',
    whatItMeans:
      'La pérdida repentina de los hábitos higiénicos (regresión) suele esconder un problema médico subyacente (infección de orina, cálculos) o un pico de estrés provocado por cambios en el entorno familiar.',
    possibleCauses: [
      'Infección del tracto urinario (cistitis), problemas renales o diabetes.',
      'Marcaje por celo, presencia de hembras en la zona o cambios territoriales.',
      'Estrés o ansiedad por mudanzas, nuevos miembros en el hogar, ruidos o cambios de horario.',
      'Incontinencia en perros senior por pérdida de tono muscular o disfunción cognitiva.',
    ],
    whatToObserve: [
      '¿Orina en pequeñas cantidades con mucha frecuencia o charcos grandes?',
      '¿Muestra dolor, lame sus genitales tras orinar o hay presencia de sangre?',
      '¿Ocurre mientras duerme (incontinencia pasiva) o de forma deliberada?',
    ],
    howToReact: [
      'Paso 1 OBLIGATORIO: Analítica de orina veterinaria para descartar cistitis.',
      'Limpia las zonas con limpiador enzimático (los limpiadores con lejía o amoníaco fijan el olor a orina y les incitan a repetir).',
      'Vuelve a la pauta de paseos frecuentes y premia efusivamente cuando orine en el exterior.',
    ],
    whatToAvoid: [
      'NUNCA le restriegues el hocico en el pipí ni le riñas pasadas horas: genera miedo y provocará que orine a escondidas.',
    ],
    whenToConsultProfessional:
      'Acude al veterinario de inmediato para descartar patología urinaria antes de abordar cualquier causa comportamental.',
    suggestedExerciseId: 'tumbado-relax',
    tags: ['pipí', 'higiene', 'cistitis', 'marcaje', 'limpieza'],
  },
];

// ============================================================================
// TRAINING EXERCISES ("Entrena con MiPatas")
// ============================================================================

export const TRAINING_EXERCISES: TrainingExercise[] = [
  // 1. BASES
  {
    id: 'sentado-foco',
    name: 'Sentado con calma y foco voluntario',
    category: 'bases',
    objective: 'Lograr que el perro ofrezca un sentado voluntario y mantenga contacto visual relajado antes de obtener cualquier recurso.',
    level: 'principiante',
    durationMinutes: 5,
    frequency: '2 sesiones cortas de 5 min al día',
    materials: ['Premios sabrosos de alto valor en trocitos pequeños (pavo, queso suave)', 'Bolsa de premios'],
    steps: [
      'Ponte de pie frente a tu perro con un premio oculto en tu mano cerrada.',
      'Lleva la mano lentamente desde la altura de su nariz hacia arriba y ligeramente hacia atrás sobre su cabeza.',
      'Al seguir el olor con su hocico, su trasero descenderá naturalmente hacia el suelo.',
      'En el microsegundo exacto en que su trasero toque el suelo, marca con un "¡Sí!" alegre y abre tu mano para entregar el premio.',
      'Repite 5 veces. Una vez fluido, introduce la palabra "Sienta" justo antes del movimiento de la mano.',
      'Pronto añade el "foco": espera 1 segundo a que te mire a los ojos antes de entregar la recompensa.',
    ],
    commonMistakes: [
      'Empujar el trasero del perro hacia abajo con la mano (provoca resistencia muscular).',
      'Repetir "sienta, sienta, sienta" muchas veces (el perro aprende a ignorar la palabra).',
      'Hacer sesiones de más de 10 minutos que agoten al perro mentalmente.',
    ],
    tips: [
      'Hazlo antes de ponerle la comida o de abrir la puerta para salir a pasear.',
      'Usa un tono de voz sereno y festivo.',
    ],
    recommendedAgeStage: ['cachorro', 'adulto', 'senior'],
    videoPlaceholder: {
      isPlaceholder: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 180,
    },
    iconName: 'GraduationCap',
  },
  {
    id: 'llamada-positiva',
    name: 'La llamada infalible: "¡Aquí!"',
    category: 'bases',
    objective: 'Construir una llamada sólida y magnética para que regrese a ti alegremente sin dudar.',
    level: 'principiante',
    durationMinutes: 8,
    frequency: 'A diario durante el juego y los paseos',
    materials: ['Premios de máximo valor (salchicha, pollo desmigado)', 'Correa larga de 5 metros'],
    steps: [
      'Empieza en un entorno sin distracciones (el pasillo o el salón de casa).',
      'Aléjate unos metros, ponte en cuclillas (postura acogedora) y di su nombre + "¡Aquí!" con tono entusiasta.',
      'Abre los brazos. En cuanto comience a correr hacia ti, anímale verbalmente.',
      'Al llegar, cógele suavemente del arnés antes de entregarle una "fiesta de premios" (3 o 4 trocitos seguidos).',
      'Poco a poco practica en el parque utilizando una correa larga de 5 o 10 metros para garantizar su seguridad.',
    ],
    commonMistakes: [
      'Llamar al perro para hacerle algo desagradable (cortarle las uñas, bañarlo o atarlo para irse a casa de inmediato).',
      'Regañarle cuando tarda en venir: si viene y le riñes, asociará venir con el castigo.',
      'Perseguir al perro cuando no viene (lo convertirá en el juego de "atrápame").',
    ],
    tips: [
      'El 90% de las llamadas en el parque deben ser para premiarle y volver a dejarle libre a jugar.',
      'La llamada siempre significa la mejor fiesta del día.',
    ],
    recommendedAgeStage: ['cachorro', 'adulto', 'senior'],
    videoPlaceholder: {
      isPlaceholder: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 240,
    },
    iconName: 'Sparkles',
  },
  {
    id: 'suelta-intercambio',
    name: 'El comando "Suelta" con juego de trueque',
    category: 'bases',
    objective: 'Enseñar al perro a soltar cualquier objeto voluntariamente sabiendo que siempre recibirá algo de mayor valor.',
    level: 'intermedio',
    durationMinutes: 6,
    frequency: '3 o 4 veces por semana',
    materials: ['2 juguetes idénticos de cuerda o mordedor', 'Premios de alto valor'],
    steps: [
      'Juega con tu perro con un mordedor motivador.',
      'Cuando lo tenga bien sujeto, saca un premio irresistible y colócalo pegado a su nariz mientras dices con calma "Suelta".',
      'Al oler el premio, abrirá la boca soltando el juguete. En ese instante marca con "¡Bien!" y dale el premio.',
      'Inmediatamente después, devuélvele el juguete para que comprenda que soltar no significa perder su tesoro.',
      'Progresa usando dos juguetes idénticos: mueve el segundo para que suelte el primero por interés en el movimiento.',
    ],
    commonMistakes: [
      'Tironear con fuerza abriendo su mandíbula con los dedos (fomenta la posesividad y el mordisco defensivo).',
      'Quitarle cosas y no darle nada a cambio.',
    ],
    tips: [
      'Este ejercicio es salvavidas ante la ingesta accidental de objetos peligrosos en la calle.',
    ],
    recommendedAgeStage: ['cachorro', 'adulto', 'senior'],
    videoPlaceholder: {
      isPlaceholder: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 210,
    },
    iconName: 'ShieldCheck',
  },
  {
    id: 'tumbado-relax',
    name: 'Tumbado y permanencia en calma',
    category: 'bases',
    objective: 'Fomentar la relajación física y la capacidad de esperar con paciencia en su colchoneta.',
    level: 'principiante',
    durationMinutes: 7,
    frequency: '1 sesión al día antes de cenar',
    materials: ['Colchoneta o esterilla antideslizante', 'Premios blandos'],
    steps: [
      'Pide un "Sienta" en su colchoneta.',
      'Baja un premio en tu mano cerrada desde su hocico en línea recta hacia el suelo y luego deslízalo hacia ti despacio.',
      'El perro bajará el pecho para alcanzarlo; cuando sus codos toquen el suelo, di "Tumbado" y entrega el premio entre sus patas.',
      'Alimenta al perro mientras está tumbado cada 2-3 segundos para prolongar la calma antes de liberarle con la palabra "¡Libre!".',
    ],
    commonMistakes: [
      'Dar el premio levantando la mano en alto (provoca que el perro se vuelva a incorporar).',
      'Exigir muchos minutos de permanencia desde el primer día.',
    ],
    tips: [
      'Entregar el premio directamente en el suelo refuerza la gravedad y la permanencia del tumbado.',
    ],
    recommendedAgeStage: ['cachorro', 'adulto', 'senior'],
    videoPlaceholder: {
      isPlaceholder: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 195,
    },
    iconName: 'Smile',
  },

  // 2. PASEO
  {
    id: 'caminar-correa-destensada',
    name: 'Paseo relajado sin tensión de correa',
    category: 'paseo',
    objective: 'Transformar los tirones en un paseo fluido y cooperativo donde ambos disfrutan sin esfuerzo físico.',
    level: 'intermedio',
    durationMinutes: 10,
    frequency: 'Durante todos los paseos diarios',
    materials: ['Arnés en Y o H anatómico', 'Correa de 2.5 a 3 metros (nunca extensible)'],
    steps: [
      'Comienza a caminar a ritmo constante en una zona con pocos estímulos.',
      'En cuanto notes que la correa se pone tirante, frena tus pies como si fueras un ancla sin dar tirones.',
      'Espera en silencio. En cuanto tu perro afloje la tensión (girando la cabeza, dando un paso atrás o mirándote), di "¡Bien!" y reanuda la marcha.',
      'Prémiale a la altura de tu pierna cuando camine a tu compás con la correa formando una "U" curvada y floja.',
      'Varía de ritmo y haz cambios de sentido alegres para captar su atención de forma natural.',
    ],
    commonMistakes: [
      'Pegar tirones secos con el brazo (activan el reflejo de oposición del perro para tirar más).',
      'Ceder terreno cuando tira con fuerza hacia un árbol o farola.',
    ],
    tips: [
      'Si el perro está muy excitado al salir por el portal, espera 2 minutos en la entrada hasta que baje su nivel de activación.',
    ],
    recommendedAgeStage: ['cachorro', 'adulto', 'senior'],
    videoPlaceholder: {
      isPlaceholder: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 300,
    },
    iconName: 'Compass',
  },
  {
    id: 'cruce-tranquilo',
    name: 'Gestión y cruce tranquilo con otros perros',
    category: 'paseo',
    objective: 'Aprender a gestionar la distancia con otros canes en la acera sin abalanzamientos ni ladridos reactivos.',
    level: 'avanzado',
    durationMinutes: 8,
    frequency: 'En paseos diarios según aparezcan estímulos',
    materials: ['Premios de alto valor olfativo', 'Arnés cómodo'],
    steps: [
      'Detecta al otro perro antes de que tu perro lo fije con la mirada.',
      'Guarda una distancia de seguridad suficiente (curva en semicírculo hacia un lateral de la acera).',
      'Pide el foco de tu perro ("Mírame") o lanza unos premios al suelo para que olfatee mientras el otro perro pasa.',
      'Felicita efusivamente cuando pase de largo sin tensar la correa.',
    ],
    commonMistakes: [
      'Acortar la correa al máximo poniéndola rígida (trasmite alarma e inseguridad por la línea).',
      'Obligar al perro a un cruce frontal en línea recta pegado a la pared.',
    ],
    tips: [
      'En lenguaje canino, el acercamiento frontal directo es percibido como desafiante; las curvas suaves son educadas y relajantes.',
    ],
    recommendedAgeStage: ['adulto', 'senior', 'cachorro'],
    videoPlaceholder: {
      isPlaceholder: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 260,
    },
    iconName: 'Users',
  },
  {
    id: 'olfateo-guiado',
    name: 'Paseo de olfateo consciente (Sembrado de premios)',
    category: 'paseo',
    objective: 'Activar el sistema olfativo parasimpático del perro para reducir cortisol y generar calma duradera.',
    level: 'principiante',
    durationMinutes: 15,
    frequency: 'Al menos 1 vez al día en un parque o zona verde',
    materials: ['Un puñado de premios o bolitas de pienso sabroso', 'Hierba alta o jardín'],
    steps: [
      'Encuentra una zona de césped tranquila libre de peligros.',
      'Di la palabra clave "¡Busca!" y esparce un puñado de premios entre la hierba.',
      'Permite que tu perro busque con el hocico pegado al suelo sin prisa y sin tirar de la correa.',
      'Disfruta observando su concentración: el olfateo reduce el ritmo cardíaco y cansa saludablemente más que 1 hora de carrera.',
    ],
    commonMistakes: [
      'Apurar al perro con la correa mientras olfatea.',
      'Lanzar premios sobre aceras sucias o con restos de comida no controlada.',
    ],
    tips: [
      '20 minutos de olfateo consciente equivalen a una gran sesión de relajación mental.',
    ],
    recommendedAgeStage: ['cachorro', 'adulto', 'senior'],
    videoPlaceholder: {
      isPlaceholder: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 180,
    },
    iconName: 'Droplets',
  },

  // 3. VIDA DIARIA
  {
    id: 'ir-a-su-cama',
    name: 'Ir a su colchoneta ("A tu sitio")',
    category: 'vida_diaria',
    objective: 'Tener una señal clara para que el perro se dirija voluntariamente a su cama cuando hay visitas o cocinamos.',
    level: 'intermedio',
    durationMinutes: 6,
    frequency: '1 o 2 veces al día',
    materials: ['Cama confortable delimitada', 'Premios sabrosos'],
    steps: [
      'Colócate a un paso de su cama. Señala con el brazo extendido y di "A tu sitio".',
      'Lanza un premio sobre la cama.',
      'En cuanto apoye las 4 patas en ella, di "¡Muy bien!" y dale otro premio de tu mano.',
      'Añade un "Tumbado" suave y recompensa con calma.',
      'Aumenta poco a poco la distancia desde la que le envías a su sitio.',
    ],
    commonMistakes: [
      'Enviar al perro a su cama como castigo (la cama debe ser siempre su santuario de paz y placer).',
    ],
    tips: [
      'Coloca un mordedor duradero en su cama para que disfrute de una estancia prolongada de forma natural.',
    ],
    recommendedAgeStage: ['cachorro', 'adulto', 'senior'],
    videoPlaceholder: {
      isPlaceholder: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 220,
    },
    iconName: 'CheckCircle',
  },
  {
    id: 'saludo-cuatro-patas',
    name: 'Saludar con las cuatro patas en el suelo',
    category: 'vida_diaria',
    objective: 'Reemplazar los saltos efusivos al llegar a casa por una conducta tranquila y educada.',
    level: 'intermedio',
    durationMinutes: 5,
    frequency: 'Cada llegada a casa',
    materials: ['Premios preparados en la entrada'],
    steps: [
      'Al entrar en casa, mantén la calma y evita tonos de voz agudos o aspavientos.',
      'Si el perro salta, gira suavemente tu cuerpo y esparce un par de premios en el suelo diciendo "Suelo".',
      'El perro bajará las patas para comer los premios.',
      'Agáchate a su nivel y dale caricias suaves en el pecho mientras mantenga las cuatro patas apoyadas.',
    ],
    commonMistakes: [
      'Empujar o tocar al perro cuando salta (lo interpreta como atención y juego).',
    ],
    tips: [
      'Consistencia de toda la familia: todos deben aplicar la misma pauta de caricia solo con 4 patas abajo.',
    ],
    recommendedAgeStage: ['cachorro', 'adulto'],
    videoPlaceholder: {
      isPlaceholder: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 200,
    },
    iconName: 'PawPrint',
  },
  {
    id: 'manipulacion-cooperativa',
    name: 'Cuidados cooperativos (Cepillado, patas, oídos)',
    category: 'vida_diaria',
    objective: 'Que el perro participe activamente y sin miedo en revisiones veterinarias, corte de uñas y cepillado.',
    level: 'avanzado',
    durationMinutes: 6,
    frequency: '3 veces por semana',
    materials: ['Cepillo suave', 'Esterilla de lamido con paté húmedo'],
    steps: [
      'Coloca una esterilla con paté para que lama tranquilamente.',
      'Toca suavemente una oreja o una pata durante 2 segundos y retira la mano.',
      'Muestra el cepillo sin peinar, deja que lo huela y premia.',
      'Da una pasada suave de cepillo mientras saborea su comida y premia con palabras suaves.',
      'Si retira la pata o muestra tensión, para de inmediato y vuelve a un nivel más sencillo.',
    ],
    commonMistakes: [
      'Inmovilizar al perro por la fuerza para cepillarlo o cortarle las uñas.',
    ],
    tips: [
      'El consentimiento del perro reduce las visitas traumáticas al veterinario a cero.',
    ],
    recommendedAgeStage: ['cachorro', 'adulto', 'senior'],
    videoPlaceholder: {
      isPlaceholder: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 240,
    },
    iconName: 'HeartPulse',
  },
  {
    id: 'gestion-timbre',
    name: 'Desensibilización al timbre de casa',
    category: 'vida_diaria',
    objective: 'Romper la asociación entre el timbre y la llegada explosiva de extraños a la puerta.',
    level: 'intermedio',
    durationMinutes: 7,
    frequency: '2 sesiones al día en momentos aleatorios',
    materials: ['Teléfono móvil con audio de timbre o timbre real', 'Premios sabrosos'],
    steps: [
      'Graba el sonido de tu timbre en el móvil.',
      'Reproduce el sonido a volumen muy bajo mientras tu perro come o descansa.',
      'En el segundo en que suene, lánzale un premio y continúa con tu rutina sin levantarte de la silla.',
      'Aumenta el volumen a lo largo de los días hasta que el sonido no despierte ninguna reacción de alarma.',
      'Enséñale que cuando suene el timbre real, su trabajo es correr hacia su cama a buscar su premio.',
    ],
    commonMistakes: [
      'Empezar directamente con el timbre a volumen máximo y visitas reales esperando en la puerta.',
    ],
    tips: [
      'La paciencia y las repeticiones neutras son la clave de la desensibilización.',
    ],
    recommendedAgeStage: ['cachorro', 'adulto', 'senior'],
    videoPlaceholder: {
      isPlaceholder: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 210,
    },
    iconName: 'Bell',
  },

  // 4. ESTIMULACIÓN MENTAL
  {
    id: 'alfombra-olfato',
    name: 'Búsqueda en alfombra olfativa (Snuffle Mat)',
    category: 'estimulacion_mental',
    objective: 'Estimular la concentración, autonomía y resolución de problemas a través del olfato.',
    level: 'principiante',
    durationMinutes: 10,
    frequency: 'A diario o días de lluvia',
    materials: ['Alfombra de tiras de fieltro o toalla enrollada', 'Pienso o chuches secas'],
    steps: [
      'Esconde bolitas de comida entre los pliegues de la alfombra o dentro de una toalla doblada en acordeón.',
      'Coloca la alfombra en el suelo y da la orden "¡Busca!".',
      'Deja que resuelva el puzzle olfativo a su propio ritmo sin intervenir.',
      'Retira la alfombra cuando haya terminado para mantener el valor del juego.',
    ],
    commonMistakes: [
      'Ayudarle constantemente señalando los premios (le resta autonomía mental).',
    ],
    tips: [
      'Excelente recurso para días lluviosos en los que el paseo exterior es más breve.',
    ],
    recommendedAgeStage: ['cachorro', 'adulto', 'senior'],
    videoPlaceholder: {
      isPlaceholder: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 150,
    },
    iconName: 'Sparkles',
  },
  {
    id: 'muffin-tin-puzzle',
    name: 'Rompecabezas casero con molde de magdalenas y pelotas',
    category: 'estimulacion_mental',
    objective: 'Fomentar la motricidad fina y la curiosidad cognitiva con objetos cotidianos del hogar.',
    level: 'intermedio',
    durationMinutes: 8,
    frequency: '2 o 3 veces por semana',
    materials: ['Bandeja metálica de horno para magdalenas (6 o 12 huecos)', 'Pelotas de tenis limpias', 'Premios'],
    steps: [
      'Coloca premios en varios de los huecos de la bandeja.',
      'Tapa todos los huecos colocando una pelota de tenis encima de cada uno.',
      'Pon la bandeja en el suelo y observa cómo tu perro debe levantar o empujar con la nariz cada pelota para acceder al premio.',
    ],
    commonMistakes: [
      'Usar pelotas demasiado pequeñas que puedan ser tragadas accidentalmente.',
    ],
    tips: [
      'Juego ideal para perros jóvenes y enérgicos que necesitan retos intelectuales.',
    ],
    recommendedAgeStage: ['cachorro', 'adulto'],
    videoPlaceholder: {
      isPlaceholder: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 165,
    },
    iconName: 'Brain',
  },
  {
    id: 'discriminar-juguetes',
    name: 'Búsqueda por nombre de juguete',
    category: 'estimulacion_mental',
    objective: 'Desarrollar el vocabulario canino y la memoria asociativa entre palabras y objetos.',
    level: 'avanzado',
    durationMinutes: 10,
    frequency: '2 sesiones semanales',
    materials: ['2 juguetes muy distintos (ej. "Pelota" y "Mordedor de cuerda")', 'Premios'],
    steps: [
      'Empieza con un solo juguete: juega con él y repite claramente su nombre ("¡Pelota!"). Pídele que lo coja y premia.',
      'Coloca la pelota en el suelo junto a un objeto neutro y di "Trae la pelota". Premia efusivamente cuando elija la pelota.',
      'Introduce el segundo juguete ("Cuerda") y practica alternando las peticiones.',
    ],
    commonMistakes: [
      'Introducir muchos juguetes a la vez antes de consolidar el primero.',
    ],
    tips: [
      'Los perros tienen capacidad para aprender docenas de sustantivos con refuerzo positivo consistente.',
    ],
    recommendedAgeStage: ['adulto', 'cachorro'],
    videoPlaceholder: {
      isPlaceholder: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 270,
    },
    iconName: 'Award',
  },
];

// ============================================================================
// WELLBEING TIPS & PILLARS ("Bienestar")
// ============================================================================

export const WELLBEING_TIPS: WellbeingTip[] = [
  // FÍSICO
  {
    id: 'fisico-paseos',
    category: 'fisico',
    title: 'Calidad de paseo sobre cantidad de kilómetros',
    description: 'Para la salud física y articular de tu perro, un paseo rico en olfateo, cambios de superficie y ritmos libres es mucho más saludable que carreras continuas sobre asfalto duro.',
    actionPoints: [
      'Permite al menos 15-20 minutos de olfateo libre sin tirones en cada salida.',
      'Alterna superficies naturales (tierra, césped, arena) para cuidar sus almohadillas y articulaciones.',
      'Adapta la intensidad según la temperatura ambiental (evita horas centrales en verano por riesgo de golpe de calor y quemaduras).',
    ],
    recommendedFor: 'Todos los perros',
  },
  {
    id: 'fisico-hidratacion',
    category: 'fisico',
    title: 'Hidratación óptima y estado corporal BCS',
    description: 'Mantener un peso óptimo (Escala BCS 4-5 de 9) puede prolongar la esperanza de vida de tu perro hasta en 2 años, previniendo artrosis, diabetes y sobrecarga cardíaca.',
    actionPoints: [
      'Agua fresca disponible las 24 horas en cuencos de acero inoxidable o cerámica limpios.',
      'Evalúa mensualmente su silueta: debes palpar sus costillas sin presión excesiva y observar cintura definida desde arriba.',
    ],
    recommendedFor: 'Perros adultos y seniors',
  },

  // MENTAL
  {
    id: 'mental-masticacion',
    category: 'mental',
    title: 'El poder calmante de la masticación diaria',
    description: 'Masticar elementos naturales seguros estimula la secreción de serotonina y dopamina, reduciendo los niveles de cortisol y el estrés acumulado durante el día.',
    actionPoints: [
      'Ofrece mordedores deshidratados 100% naturales (nervio de toro, piel de vacuno prensada, orejas de conejo).',
      'Utiliza juguetes de caucho rellenables (congelados con paté, yogur natural sin azúcar y plátano).',
      'Dedica 15 minutos diarios a la masticación en su zona de descanso.',
    ],
    recommendedFor: 'Cachorros y perros enérgicos',
  },
  {
    id: 'mental-resolucion',
    category: 'mental',
    title: 'Puzzles y retos de estimulación cognitiva',
    description: 'El aburrimiento es la causa de más del 70% de las conductas destructivas en casa. Los retos de búsqueda refuerzan la autoconfianza y la resiliencia mental.',
    actionPoints: [
      'Alfombras de olfato 2-3 veces por semana.',
      'Juegos de "sembrado" de comida en el césped del parque.',
      'Juegos de trile caseros con vasos de plástico invertidos.',
    ],
    recommendedFor: 'Todos los perros',
  },

  // SOCIAL
  {
    id: 'social-comunicacion',
    category: 'social',
    title: 'Respeto a las distancias y señales de calma',
    description: 'No todos los perros necesitan ni desean saludar a todos los perros que se cruzan. Forzar interacciones cara a cara con correa genera reactividad e incomodidad.',
    actionPoints: [
      'Aprende a identificar las señales de calma: lamerse el hocico, girar la cabeza, bostezar o quedarse inmóvil.',
      'Pregunta siempre al tutor del otro perro antes de permitir un acercamiento.',
      'Fomenta paseos paralelos con perros equilibrados en lugar de juegos explosivos continuos.',
    ],
    recommendedFor: 'Perros tímidos o reactivos',
  },
  {
    id: 'social-vinculo',
    category: 'social',
    title: 'Vínculo basado en la confianza y el refuerzo positivo',
    description: 'La educación respetuosa fortalece la seguridad emocional del perro hacia su familia humana, eliminando la necesidad de castigos aversivos o intimidación.',
    actionPoints: [
      'Premia las conductas espontáneas que te gusten (echarse con calma, mirarte en el paseo).',
      'Sé predecible: las rutinas claras reducen la incertidumbre del perro.',
      'Dedica momentos de caricias y juego afectuoso sin órdenes ni exigencias.',
    ],
    recommendedFor: 'Toda la familia',
  },

  // DESCANSO
  {
    id: 'descanso-horas',
    category: 'descanso',
    title: 'Horas de sueño reparador sin interrupciones',
    description: 'Un perro adulto necesita dormir entre 14 y 16 horas al día, y los cachorros y seniors hasta 18-20 horas. Un perro con privación de sueño será irritable, hiperactivo y reactivo.',
    actionPoints: [
      'Coloca su cama en un lugar tranquilo de la casa, fuera de zonas de paso constante o corrientes de aire.',
      'Regla de oro familiar: cuando el perro está en su cama durmiendo, nadie le toca ni le despierta.',
      'Evita sobreestimular al perro en las 2 horas previas a la noche.',
    ],
    recommendedFor: 'Cachorros y perros hiperactivos',
  },
  {
    id: 'descanso-zona-segura',
    category: 'descanso',
    title: 'El santuario o "Zona Segura" en el hogar',
    description: 'Disponer de un espacio propio donde sentirse 100% protegido es esencial para gestionar tormentas, petardos, ruidos de obras o visitas numerosas.',
    actionPoints: [
      'Habilita un rincón acolchado con mantas y prendas con olor a la familia.',
      'Usa difusores de feromonas caninas apaciguadoras (Adaptil) si hay eventos estresantes previsibles.',
      'Mantén persianas bajadas y música suave si hay ruidos molestos en el exterior.',
    ],
    recommendedFor: 'Perros sensibles o miedosos',
  },
];

// ============================================================================
// DAILY SUGGESTIONS ("Hoy con tu perro")
// ============================================================================

export const DAILY_SUGGESTIONS_POOL: DailySuggestion[] = [
  {
    id: 'sug-olfato',
    emoji: '👃',
    durationMinutes: 10,
    title: '10 min de olfato libre',
    description: 'Siembra unos premios en la hierba del parque para activar su calma natural.',
    linkedExerciseId: 'olfateo-guiado',
    category: 'paseo',
  },
  {
    id: 'sug-llamada',
    emoji: '🎯',
    durationMinutes: 5,
    title: '3 llamadas festivas',
    description: 'Practica la llamada con premio sorpresa y vuelve a dejarle libre enseguida.',
    linkedExerciseId: 'llamada-positiva',
    category: 'bases',
  },
  {
    id: 'sug-masticacion',
    emoji: '🦴',
    durationMinutes: 15,
    title: 'Sesión de masticación',
    description: 'Ofrécele un juguete rellenable congelado o mordedor natural en su cama.',
    linkedExerciseId: 'tumbado-relax',
    category: 'descanso',
  },
  {
    id: 'sug-sentado',
    emoji: '🎓',
    durationMinutes: 5,
    title: 'Sentado con foco voluntario',
    description: '5 repeticiones premiando el contacto visual sereno antes de la cena.',
    linkedExerciseId: 'sentado-foco',
    category: 'bases',
  },
  {
    id: 'sug-correa',
    emoji: '🦮',
    durationMinutes: 10,
    title: 'Paseo con correa en "U"',
    description: 'Practica parar suavemente cuando haya tensión y premiar la correa floja.',
    linkedExerciseId: 'caminar-correa-destensada',
    category: 'paseo',
  },
  {
    id: 'sug-puzzle',
    emoji: '🧩',
    durationMinutes: 8,
    title: 'Rompecabezas de alfombra',
    description: 'Esconde premios en una toalla o alfombra de tiras para ejercitar su mente.',
    linkedExerciseId: 'alfombra-olfato',
    category: 'mental',
  },
];
