export const editableSectionKeys = [
  'site',
  'hero',
  'features',
  'about',
  'programs',
  'contact',
  'footer',
  'newsSection',
]

export const defaultSiteData = {
  site: {
    schoolName: 'Gimnasio Carrie',
    tagline: 'Amor, respeto y aprendizaje',
    whatsappUrl: 'https://wa.me/573001234567',
    enrollLabel: 'Matricúlate',
    phone: '300 123 4567',
    email: 'info@gimnasiocarrie.edu.co',
    schedule: 'Lun - Vie: 7:00 a.m. - 4:00 p.m.',
    addressLines: ['Calle 123 #45-67', 'Barrio La Esperanza', 'Cali, Colombia'],
    socialLinks: {
      facebook: '#',
      instagram: '#',
      youtube: '#',
    },
  },
  hero: {
    kicker: 'Bienvenidos',
    titleLine1: 'Educación con',
    titleBlue: 'Amor',
    titleGreen: 'Respeto',
    titleRed: 'Aprendizaje',
    description:
      'Formamos niños con valores, inclusión y desarrollo integral para construir un mejor futuro.',
    primaryButtonText: 'Matricúlate',
    secondaryButtonText: 'Conoce más',
    imageUrl: '/assets/reference/hero-kids-ref.png',
  },
  features: [
    {
      icon: 'users',
      title: 'Inclusión Educativa',
      description:
        'Creamos un entorno donde cada niño se siente valorado y acompañado.',
      color: 'blue',
    },
    {
      icon: 'book-open',
      title: 'Aprendizaje Personalizado',
      description:
        'Adaptamos experiencias y ritmos para fortalecer talentos y confianza.',
      color: 'green',
    },
    {
      icon: 'badge',
      title: 'Profesores Especializados',
      description:
        'Un equipo sensible y preparado para acompañar cada etapa del desarrollo.',
      color: 'red',
    },
    {
      icon: 'heart',
      title: 'Desarrollo Emocional',
      description:
        'Promovemos autoestima, empatía y convivencia positiva todos los días.',
      color: 'yellow',
    },
  ],
  about: {
    kicker: '¿Quiénes somos?',
    title: 'Un colegio con corazón y propósito',
    body1:
      'En Gimnasio Carrie trabajamos cada día para ofrecer una educación de calidad basada en el amor, el respeto y el aprendizaje significativo.',
    body2:
      'Nuestro enfoque inclusivo permite que cada niño descubra su potencial en un ambiente seguro, alegre y motivador.',
    buttonText: 'Conoce nuestra historia',
    imageUrl: '/assets/reference/about-photo-ref.png',
  },
  programs: {
    title: 'Aprendemos, jugamos y crecemos juntos',
    items: [
      {
        title: 'Arte y creatividad',
        imageUrl: '/assets/reference/program-1-ref.png',
      },
      {
        title: 'Ciencia y exploración',
        imageUrl: '/assets/reference/program-2-ref.png',
      },
      {
        title: 'Lectura y comunicación',
        imageUrl: '/assets/reference/program-3-ref.png',
      },
      {
        title: 'Deporte y bienestar',
        imageUrl: '/assets/reference/program-4-ref.png',
      },
      {
        title: 'Valores y convivencia',
        imageUrl: '/assets/reference/program-5-ref.png',
      },
    ],
  },
  contact: {
    parentsKicker: 'Para padres',
    parentsTitle: 'Acompañamos a las familias en cada paso',
    parentPoints: [
      'Comunicación constante',
      'Seguimiento académico',
      'Escuela para padres',
      'Actividades y eventos',
    ],
    visitButtonText: 'Agenda una visita',
    familyImageUrl: '/assets/reference/family-ref.png',
    locationKicker: '¿Dónde estamos?',
    locationTitle: 'Cali, Colombia',
    mapImageUrl: '/assets/reference/map-ref.png',
    formKicker: 'Contacto',
    formTitle: 'Escríbenos y agenda tu recorrido',
    formDescription:
      'Cuéntanos la edad de tu hijo, tus preguntas o el horario que prefieres para visitarnos. Responderemos lo antes posible.',
  },
  footer: {
    copyrightText: 'Todos los derechos reservados.',
    links: [
      { label: 'Nosotros', href: '#nosotros' },
      { label: 'Galería', href: '#galeria' },
      { label: 'Contacto', href: '#contacto' },
    ],
  },
  newsSection: {
    kicker: 'Actualidad',
    title: 'Eventos y noticias para nuestra comunidad',
    description:
      'Comparte con las familias las actividades importantes, celebraciones y novedades del colegio.',
  },
}

export const defaultPosts = [
  {
    type: 'event',
    title: 'Festival de talento y creatividad',
    slug: 'festival-de-talento-y-creatividad',
    excerpt:
      'Una jornada para compartir música, arte y proyectos realizados por nuestros estudiantes.',
    content:
      'Invitamos a las familias a vivir una mañana llena de creatividad, presentaciones y experiencias pedagógicas preparadas por nuestros niños.',
    imageUrl: '/assets/reference/program-1-ref.png',
    location: 'Auditorio principal',
    eventDate: '2026-05-18',
    published: 1,
    sortOrder: 1,
  },
  {
    type: 'news',
    title: 'Nueva jornada de escuela para padres',
    slug: 'nueva-jornada-de-escuela-para-padres',
    excerpt:
      'Abrimos un nuevo ciclo de encuentros para fortalecer el acompañamiento en casa.',
    content:
      'Trabajaremos estrategias de comunicación, rutinas saludables y acompañamiento emocional para las familias de nuestra comunidad.',
    imageUrl: '/assets/reference/family-ref.png',
    location: 'Salón múltiple',
    eventDate: '2026-05-24',
    published: 1,
    sortOrder: 1,
  },
]

export function cloneDefaultSiteData() {
  return JSON.parse(JSON.stringify(defaultSiteData))
}

export function cloneDefaultPosts() {
  return JSON.parse(JSON.stringify(defaultPosts))
}

export function mergeSiteData(partialData = {}) {
  const merged = cloneDefaultSiteData()

  for (const key of editableSectionKeys) {
    if (partialData[key] !== undefined) {
      merged[key] = partialData[key]
    }
  }

  return merged
}
