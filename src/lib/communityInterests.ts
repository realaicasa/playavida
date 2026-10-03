export interface CommunityInterestItem {
  id: string;
  label_es: string;
  label_en: string;
  category?: string;
}

export const BASE_30_INTERESTS: CommunityInterestItem[] = [
  { id: 'animal_rescue', label_es: 'Rescate Animal & Fauna', label_en: 'Animal Rescue & Wildlife' },
  { id: 'architecture_eco', label_es: 'Arquitectura & Eco-Diseño', label_en: 'Architecture & Eco-Design' },
  { id: 'artisan_crafts', label_es: 'Artesanías & Cerámica', label_en: 'Artisan Crafts & Pottery' },
  { id: 'latin_dance', label_es: 'Bachata & Baile Latino', label_en: 'Bachata & Latin Dancing' },
  { id: 'beach_volleyball', label_es: 'Voleibol Playero & Pádel', label_en: 'Beach Volleyball & Paddle' },
  { id: 'bird_watching', label_es: 'Observación de Aves & Manglares', label_en: 'Bird Watching & Mangroves' },
  { id: 'breathwork_sound', label_es: 'Respiración & Baños de Sonido', label_en: 'Breathwork & Sound Baths' },
  { id: 'cenote_freedive', label_es: 'Cenotes & Apnea Libre', label_en: 'Cenotes & Freediving' },
  { id: 'chef_dining', label_es: 'Gastronomía & Cenas de Chef', label_en: 'Chef Tastings & Fine Dining' },
  { id: 'reef_conservation', label_es: 'Conservación de Arrecifes & Playas', label_en: 'Coral Reef & Ocean Conservation' },
  { id: 'coworking_nomad', label_es: 'Coworking & Nómadas Digitales', label_en: 'Coworking & Digital Nomads' },
  { id: 'cycling_trails', label_es: 'Ciclismo & Senderos en Selva', label_en: 'Cycling & Jungle Trails' },
  { id: 'electronic_music', label_es: 'Música Electrónica & DJs', label_en: 'Electronic Music & DJs' },
  { id: 'holistic_healing', label_es: 'Sanación Holística & Herbolaria', label_en: 'Holistic Healing & Herbalism' },
  { id: 'kitesurf_wind', label_es: 'Kitesurf & Deportes de Viento', label_en: 'Kitesurfing & Wind Sports' },
  { id: 'language_exchange', label_es: 'Intercambio de Idiomas & Políglotas', label_en: 'Language Exchange & Polyglots' },
  { id: 'live_acoustic', label_es: 'Música en Vivo & Sesiones Acústicas', label_en: 'Live Acoustic & Jam Sessions' },
  { id: 'specialty_coffee', label_es: 'Café de Especialidad & Tostadores', label_en: 'Local Coffee & Roasteries' },
  { id: 'mezcal_culture', label_es: 'Cultura del Mezcal & Tequila', label_en: 'Mezcal & Agave Culture' },
  { id: 'meditation_temazcal', label_es: 'Meditación Consciente & Temazcal', label_en: 'Mindful Meditation & Temazcal' },
  { id: 'organic_permaculture', label_es: 'Agricultura Orgánica & Huertos', label_en: 'Organic Farming & Permaculture' },
  { id: 'photography_film', label_es: 'Fotografía & Creación Visual', label_en: 'Photography & Filmmaking' },
  { id: 'plant_based', label_es: 'Cocina Vegana & Plant-Based', label_en: 'Plant-Based & Vegan Lifestyle' },
  { id: 'sailing_catamaran', label_es: 'Navegación a Vela & Catamarán', label_en: 'Sailing & Catamaran Cruising' },
  { id: 'scuba_diving', label_es: 'Buceo con Tanque & Vida Marina', label_en: 'Scuba Diving & Coral Life' },
  { id: 'street_food_culture', label_es: 'Ruta de Tacos & Cocina Tradicional', label_en: 'Street Tacos & Mexican Food' },
  { id: 'sustainable_tech', label_es: 'Tecnología Sostenible & Creadores IA', label_en: 'Sustainable Tech & AI Builders' },
  { id: 'running_triathlon', label_es: 'Triatlón, Running & Atletismo', label_en: 'Triathlon & Running' },
  { id: 'sustainable_fashion', label_es: 'Moda Vintage & Sostenible', label_en: 'Vintage & Sustainable Fashion' },
  { id: 'yoga_pilates', label_es: 'Yoga & Práctica de Pilates', label_en: 'Yoga & Pilates Practice' },
];
