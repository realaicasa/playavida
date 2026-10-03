export interface InterestCategory {
  id: string;
  name_es: string;
  name_en: string;
  icon: string; // lucide icon identifier
  description_es: string;
  description_en: string;
  defaultScore: number;
}

export const USER_INTEREST_CATEGORIES: InterestCategory[] = [
  {
    id: 'yoga_health_gym',
    name_es: 'Yoga, Salud & Fitness',
    name_en: 'Yoga, Health & Fitness',
    icon: 'Activity',
    description_es: 'Estudios de yoga, fitness funcional, nutrición y bienestar físico.',
    description_en: 'Yoga studios, functional fitness, nutrition and physical wellness.',
    defaultScore: 8,
  },
  {
    id: 'public_speaking_dev',
    name_es: 'Oratoria & Desarrollo Personal',
    name_en: 'Public Speaking & Personal Development',
    icon: 'Mic',
    description_es: 'Liderazgo, talleres de comunicación, mentalidad y coaching.',
    description_en: 'Leadership, communication workshops, mindset and coaching.',
    defaultScore: 6,
  },
  {
    id: 'sound_healing_meditation',
    name_es: 'Sound Healing & Meditación',
    name_en: 'Sound Healing & Meditation',
    icon: 'Sparkles',
    description_es: 'Cuencos tibetanos, ceremonias de cacao, temazcal y mindfulness.',
    description_en: 'Singing bowls, cacao ceremonies, temazcal and mindfulness.',
    defaultScore: 7,
  },
  {
    id: 'beachsports_water',
    name_es: 'Deportes de Playa & Acuáticos',
    name_en: 'Beach Sports & Water Activities',
    icon: 'Waves',
    description_es: 'Kitesurf, buceo en arrecifes, paddleboard, voleibol de playa y snorkel.',
    description_en: 'Kitesurfing, reef diving, paddleboarding, beach volleyball and snorkeling.',
    defaultScore: 8,
  },
  {
    id: 'paddle_tennis',
    name_es: 'Pádel & Tenis',
    name_en: 'Paddle Tennis',
    icon: 'Trophy',
    description_es: 'Torneos de pádel, canchas locales, clases y ligas de fin de semana.',
    description_en: 'Paddle tennis tournaments, local courts, coaching and weekend leagues.',
    defaultScore: 7,
  },
  {
    id: 'indoor_sports',
    name_es: 'Deportes Bajo Techo (Billar, Boliche)',
    name_en: 'Indoor Sports (Billiards, Bowling)',
    icon: 'Target',
    description_es: 'Billar, boliche de 10 pines, dardos y juegos de salón con amigos.',
    description_en: 'Billiards, 10-pin bowling, darts and indoor club games.',
    defaultScore: 5,
  },
  {
    id: 'photography',
    name_es: 'Fotografía & Creación Visual',
    name_en: 'Photography & Visual Arts',
    icon: 'Camera',
    description_es: 'Salidas fotográficas al amanecer, retrato, dron y fotografía submarina.',
    description_en: 'Sunrise photo walks, portraiture, drone shots and underwater imaging.',
    defaultScore: 6,
  },
  {
    id: 'cycling',
    name_es: 'Ciclismo Urbano & Rutas',
    name_en: 'Cycling & Coastal Rides',
    icon: 'Bike',
    description_es: 'Rutas ciclistas costeras, grupos de gravel y paseos nocturnos en bici.',
    description_en: 'Coastal bike paths, gravel routes and friendly sunset group rides.',
    defaultScore: 6,
  },
  {
    id: 'dining_out',
    name_es: 'Gastronomía & Salir a Comer',
    name_en: 'Dining & Culinary Culture',
    icon: 'Utensils',
    description_es: 'Cocina caribeña, cafeterías de especialidad, marisquerías y catas.',
    description_en: 'Caribbean cuisine, specialty coffee, seafood spots and tasting menus.',
    defaultScore: 9,
  },
  {
    id: 'church_faith',
    name_es: 'Comunidad de Fe & Iglesias',
    name_en: 'Church-Based & Faith Activities',
    icon: 'HeartHandshake',
    description_es: 'Servicios bilingües, grupos de oración y actividades comunitarias de fe.',
    description_en: 'Bilingual services, prayer circles and faith-based community gatherings.',
    defaultScore: 4,
  },
  {
    id: 'adventures_cenotes',
    name_es: 'Aventuras Fuera de la Ciudad & Cenotes',
    name_en: 'Out-of-Town Adventures & Cenotes',
    icon: 'Compass',
    description_es: 'Expediciones a cenotes vírgenes, ruinas mayas y reservas naturales.',
    description_en: 'Unspoiled cenote treks, Mayan ruins and biosphere reserves.',
    defaultScore: 9,
  },
  {
    id: 'crypto_tech',
    name_es: 'Cripto, Web3 & Tecnología',
    name_en: 'Crypto & Technology',
    icon: 'Cpu',
    description_es: 'Nómadas digitales, Bitcoin meetups, desarrollo de software e IA.',
    description_en: 'Digital nomads, Bitcoin meetups, software development and AI.',
    defaultScore: 7,
  },
  {
    id: 'dancing_nightlife',
    name_es: 'Baile & Vida Nocturna',
    name_en: 'Dancing & Nightlife',
    icon: 'Music',
    description_es: 'Salsa, bachata en la playa, DJs de música electrónica y bares acústicos.',
    description_en: 'Salsa, beach bachata, electronic DJ sets and acoustic sunset lounges.',
    defaultScore: 7,
  },
  {
    id: 'community_support',
    name_es: 'Apoyo Comunitario Local',
    name_en: 'Community Support',
    icon: 'HandHeart',
    description_es: 'Redes vecinales, ayuda solidaria y proyectos barriales colaborativos.',
    description_en: 'Neighborhood mutual aid, community resilience and cooperative projects.',
    defaultScore: 8,
  },
  {
    id: 'group_meetups',
    name_es: 'Encuentros Grupales & Convivencia',
    name_en: 'Group Meetups & Mixers',
    icon: 'Users',
    description_es: 'Intercambios de idiomas, reuniones de expatriados y tardes de juegos.',
    description_en: 'Language exchanges, expat mixers, trivia nights and social gatherings.',
    defaultScore: 9,
  },
  {
    id: 'family_activities',
    name_es: 'Actividades Familiares & Niños',
    name_en: 'Family Activities & Kids',
    icon: 'Smile',
    description_es: 'Talleres infantiles, parques ecológicos, playas tranquilas y eventos familiares.',
    description_en: 'Kids workshops, eco-parks, safe beaches and family-friendly weekend events.',
    defaultScore: 6,
  },
  {
    id: 'coworking_spaces',
    name_es: 'Coworking & Espacios de Trabajo',
    name_en: 'Coworking & Remote Work',
    icon: 'Laptop',
    description_es: 'Cafés con buen Wi-Fi, oficinas compartidas y jornadas de co-working.',
    description_en: 'Reliable fiber Wi-Fi cafes, shared desks and community co-working days.',
    defaultScore: 8,
  },
  {
    id: 'business_networking',
    name_es: 'Networking Empresarial & Negocios',
    name_en: 'Business Networking',
    icon: 'Briefcase',
    description_es: 'Reuniones de emprendedores, mentorías B2B y alianzas comerciales locales.',
    description_en: 'Founder meetups, B2B peer mentoring and local business collaborations.',
    defaultScore: 7,
  },
  {
    id: 'arts_culture',
    name_es: 'Arte, Cultura & Música en Vivo',
    name_en: 'Arts & Culture',
    icon: 'Palette',
    description_es: 'Galerías independientes, teatro, cine club y acústicos locales.',
    description_en: 'Independent galleries, indie theatre, film screenings and live music.',
    defaultScore: 7,
  },
  {
    id: 'volunteering_conservation',
    name_es: 'Voluntariado & Conservación',
    name_en: 'Volunteering & Conservation',
    icon: 'Trees',
    description_es: 'Limpiezas de playa, protección de tortugas marinas y rescate animal.',
    description_en: 'Beach cleanups, sea turtle nesting protection and animal welfare shelters.',
    defaultScore: 8,
  },
];

export const getInterestLabel = (score: number, language: 'es' | 'en' = 'es'): { label: string; color: string } => {
  if (score <= 0) {
    return {
      label: language === 'es' ? 'No Considerar (Opt-out)' : 'Do Not Use (Opt-out)',
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    };
  }
  if (score >= 9) {
    return {
      label: language === 'es' ? 'Pasión Central (9-10)' : 'Core Passion (9-10)',
      color: 'text-teal-700 bg-teal-50 border-teal-200',
    };
  }
  if (score >= 7) {
    return {
      label: language === 'es' ? 'Gran Interés (7-8)' : 'High Interest (7-8)',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    };
  }
  if (score >= 4) {
    return {
      label: language === 'es' ? 'Moderado / Ocasional (4-6)' : 'Moderate / Occasional (4-6)',
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    };
  }
  return {
    label: language === 'es' ? 'Bajo / Sin Interés (1-3)' : 'Low / No Interest (1-3)',
    color: 'text-stone-500 bg-stone-100 border-stone-200',
  };
};
