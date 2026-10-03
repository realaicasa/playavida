import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Navigation,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Waves,
  Sun,
  Award,
  ChevronRight,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Building2,
  CalendarDays,
  List,
  ShieldAlert,
} from 'lucide-react';
import { motion } from 'motion/react';
import { LocationCode, Language, PublicBusinessProjection, CommunityEvent, CommunityGroup } from '../types';
import { playaVidaStore } from '../lib/storage';

interface RivieraMayaMapProps {
  currentLocation: LocationCode | 'ALL';
  onSelectLocation: (loc: LocationCode | 'ALL') => void;
  language: Language;
  onOpenBusiness: (biz: PublicBusinessProjection) => void;
  onSelectEvent?: (event: CommunityEvent) => void;
  onSelectGroup?: (group: CommunityGroup) => void;
}

interface CoastalHub {
  code: LocationCode;
  name: string;
  sub: string;
  taglineEs: string;
  taglineEn: string;
  highlights: string[];
  kmFromCancun: number;
  vibeEs: string;
  vibeEn: string;
  coords: { x: number; y: number }; // percentage on SVG
}

const HUBS: CoastalHub[] = [
  {
    code: 'CUN',
    name: 'Cancún',
    sub: 'Zona Hotelera & Nichupté',
    taglineEs: 'La puerta cosmopolita del Caribe Mexicano',
    taglineEn: 'The cosmopolitan gateway to the Mexican Caribbean',
    highlights: ['Zona Hotelera', 'Laguna Nichupté', 'Puerto Juárez', 'Mercado 28'],
    kmFromCancun: 0,
    vibeEs: 'Cosmopolita, náutico, gastronomía internacional',
    vibeEn: 'Cosmopolitan, nautical, international cuisine',
    coords: { x: 74, y: 15 },
  },
  {
    code: 'PM',
    name: 'Puerto Morelos',
    sub: 'Pueblo con Encanto & Arrecife',
    taglineEs: 'El refugio bohemio y pesquero de arrecifes cristalinos',
    taglineEn: 'The bohemian fishing village with crystal reefs',
    highlights: ['Arrecife Nacional', 'Ojo de Agua', 'Ruta de los Cenotes', 'Playa Central'],
    kmFromCancun: 36,
    vibeEs: 'Bohemio, relajado, mariscos frescos, buceo',
    vibeEn: 'Bohemian, chilled, fresh seafood, reef diving',
    coords: { x: 62, y: 38 },
  },
  {
    code: 'PDC',
    name: 'Playa del Carmen',
    sub: 'Corazón de la Riviera Maya',
    taglineEs: 'Epicentro vibrante de nómadas, arte y gastronomía',
    taglineEn: 'Vibrant epicenter of nomads, art, and culinary gems',
    highlights: ['5ta Avenida', 'Playacar', 'Calle 38', 'Ferry a Cozumel'],
    kmFromCancun: 68,
    vibeEs: 'Cafés de especialidad, coworking, vida nocturna, caminable',
    vibeEn: 'Specialty coffee, coworking, nightlife, walkable',
    coords: { x: 50, y: 58 },
  },
  {
    code: 'COZ',
    name: 'Cozumel',
    sub: 'Isla & Gran Arrecife Maya',
    taglineEs: 'Paraíso insular de buceo de clase mundial y aguas turquesas',
    taglineEn: 'Island sanctuary of world-class scuba diving and turquoise shallows',
    highlights: ['Arrecife Palancar', 'San Miguel', 'El Cielo', 'Ferry Muelle'],
    kmFromCancun: 72,
    vibeEs: 'Buceo profundo, vida isleña, tranquilidad marina',
    vibeEn: 'Deep diving, island lifestyle, marine serenity',
    coords: { x: 70, y: 60 },
  },
  {
    code: 'AKU',
    name: 'Akumal',
    sub: 'Bahía de las Tortugas',
    taglineEs: 'Santuario natural de tortugas marinas y pastos coralinos',
    taglineEn: 'Natural marine sanctuary for sea turtles and coral bays',
    highlights: ['Bahía de Akumal', 'Laguna Yal-Kú', 'Centro Ecológico CEA', 'Pasto Marino'],
    kmFromCancun: 104,
    vibeEs: 'Ecoturismo, tortugas, snorkel responsable, naturaleza',
    vibeEn: 'Ecotourism, sea turtles, responsible snorkeling, nature',
    coords: { x: 42, y: 75 },
  },
  {
    code: 'TUL',
    name: 'Tulum',
    sub: 'Jungle Wellness & Cenotes',
    taglineEs: 'Santuario de bienestar, diseño sustentable y cenotes',
    taglineEn: 'Sanctuary of wellness, sustainable design, and cenotes',
    highlights: ['La Veleta', 'Aldea Zamá', 'Beach Road', 'Cenote Calavera'],
    kmFromCancun: 131,
    vibeEs: 'Yoga, diseño orgánico, eco-chic, selva mística',
    vibeEn: 'Yoga, organic design, eco-chic, mystic jungle',
    coords: { x: 32, y: 88 },
  },
];

export const RivieraMayaMap: React.FC<RivieraMayaMapProps> = ({
  currentLocation,
  onSelectLocation,
  language,
  onOpenBusiness,
  onSelectEvent,
  onSelectGroup,
}) => {
  const isEs = language === 'es';
  const [hoveredHub, setHoveredHub] = useState<CoastalHub | null>(null);
  const [sideTab, setSideTab] = useState<'events' | 'spots' | 'groups'>('events');
  const [viewMode, setViewMode] = useState<'map' | 'directory'>('map');
  const [scale, setScale] = useState(1);

  // Active hub selected or default to PDC
  const activeHub =
    HUBS.find((h) => h.code === currentLocation) ||
    (hoveredHub || HUBS.find((h) => h.code === 'PDC')!);

  // Data in active hub
  const businessesInHub = playaVidaStore.getPublicBusinesses(activeHub.code);
  const eventsInHub = playaVidaStore.getEvents(activeHub.code);
  const groupsInHub = playaVidaStore.getGroups(activeHub.code);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfToday = startOfToday + 24 * 60 * 60 * 1000;
  const endOfWeek = startOfToday + 7 * 24 * 60 * 60 * 1000;

  // Hyper-link to detailed street map
  const openStreetMap = (e: React.MouseEvent, ev: CommunityEvent) => {
    e.stopPropagation();
    if (ev.map_url) {
      window.open(ev.map_url, '_blank', 'noopener,noreferrer');
    } else {
      const query = encodeURIComponent(
        `${ev.street_address || ev.event_location_label}, ${activeHub.name}, Quintana Roo, Mexico`
      );
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
      {/* Header bar */}
      <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF9F6]">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-teal-700" />
            <h3 className="font-['Outfit',sans-serif] text-lg sm:text-xl font-bold text-stone-900">
              {isEs ? 'Mapa Costero: Sedes, Eventos & Calles' : 'Coastal Map: Venues, Events & Streets'}
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {isEs
              ? 'Explora las sedes, fechas, costos y enlaces directos a mapas callejeros en Cancún, Puerto Morelos, Playa del Carmen y Tulum.'
              : 'Explore hubs, dates, costs, and direct hyper-linked street maps in Cancún, Puerto Morelos, Playa del Carmen, and Tulum.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-white text-teal-800 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isEs ? 'Mapa Visual' : 'Visual Map'}</span>
            </button>
            <button
              onClick={() => setViewMode('directory')}
              className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'directory'
                  ? 'bg-white text-teal-800 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{isEs ? 'Lista Accesible' : 'Hub Directory'}</span>
            </button>
          </div>

          <button
            onClick={() => onSelectLocation('ALL')}
            className={`py-1.5 px-3.5 rounded-full text-xs font-semibold transition-all border ${
              currentLocation === 'ALL'
                ? 'bg-teal-800 text-white border-teal-800 shadow-2xs'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {isEs ? 'Todo el Corredor' : 'All Corridor'}
          </button>
        </div>
      </div>

      {/* Accessible Directory Mode */}
      {viewMode === 'directory' ? (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-800 font-['Outfit',sans-serif]">
              {isEs ? 'Directorio de Nodos Costeros de la Riviera Maya' : 'Riviera Maya Coastal Hub Directory'}
            </h4>
            <span className="text-xs text-stone-500">
              {HUBS.length} {isEs ? 'destinos conectados' : 'connected hubs'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HUBS.map((hub) => {
              const bizCount = playaVidaStore.getPublicBusinesses(hub.code).length;
              const evCount = playaVidaStore.getEvents(hub.code).length;
              const grpCount = playaVidaStore.getGroups(hub.code).length;
              const isSelected = currentLocation === hub.code;

              return (
                <div
                  key={hub.code}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-teal-700 bg-teal-50/50 ring-2 ring-teal-600/20'
                      : 'border-stone-200 bg-white hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-bold">
                        {hub.code}
                      </span>
                      <h5 className="font-bold text-base text-stone-900 mt-1">{hub.name}</h5>
                      <p className="text-xs text-stone-500 font-medium">{hub.sub}</p>
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {hub.kmFromCancun} km
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 my-2.5 line-clamp-2">
                    {isEs ? hub.taglineEs : hub.taglineEn}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-stone-500 py-1.5 border-y border-stone-100">
                    <span><strong>{evCount}</strong> {isEs ? 'eventos' : 'events'}</span>
                    <span>•</span>
                    <span><strong>{bizCount}</strong> {isEs ? 'negocios' : 'spots'}</span>
                    <span>•</span>
                    <span><strong>{grpCount}</strong> {isEs ? 'grupos' : 'groups'}</span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onSelectLocation(hub.code)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-teal-800 text-white'
                          : 'bg-stone-100 hover:bg-teal-50 hover:text-teal-800 text-stone-700'
                      }`}
                    >
                      {isSelected
                        ? (isEs ? 'Filtrando aquí' : 'Filtering here')
                        : (isEs ? 'Ver este nodo' : 'Filter by hub')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
        {/* Coastal Map SVG Graphic Canvas */}
        <div className="lg:col-span-6 p-6 sm:p-8 bg-gradient-to-br from-teal-950 via-teal-900 to-stone-950 text-white relative flex flex-col justify-between min-h-[380px] sm:min-h-[460px] select-none">
          {/* Caribbean Sea Ambient Watermark */}
          <div className="absolute top-4 right-5 text-right pointer-events-none opacity-40">
            <span className="font-['Outfit',sans-serif] text-xs font-bold uppercase tracking-widest text-teal-300 flex items-center gap-1 justify-end">
              <Waves className="w-4 h-4" /> Mar Caribe
            </span>
            <span className="text-[10px] text-teal-200/80 font-mono">Carretera Federal 307</span>
          </div>

          {/* Stylized Coastal Highway Curve & Hub Points */}
          <div className="relative w-full h-80 sm:h-96 my-auto overflow-auto border border-teal-900/30 rounded-2xl cursor-grab active:cursor-grabbing bg-teal-950/20">
            <div 
              style={{ 
                transform: `scale(${scale})`, 
                transformOrigin: 'center center', 
                transition: 'transform 0.2s',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
            {/* SVG Coastline & Highway Path */}
            <svg
              className="w-full h-full absolute inset-0"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="coastGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Highway 307 Spine */}
              <path
                d="M 74 15 Q 60 35 62 38 T 50 62 T 32 88"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="2.5 1.5"
                className="opacity-70"
              />

              {/* Cozumel Ferry Line from Playa */}
              <path
                d="M 50 62 L 72 68"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="1.5 1"
                className="opacity-60"
              />

              {/* Cozumel Island Shape */}
              <ellipse
                cx="75"
                cy="70"
                rx="5"
                ry="9"
                fill="#0f766e"
                stroke="#2dd4bf"
                strokeWidth="0.8"
                className="opacity-70"
              />
              <text
                x="76"
                y="83"
                fill="#99f6e4"
                fontSize="3.2"
                textAnchor="middle"
                className="font-mono font-bold"
              >
                Cozumel
              </text>
            </svg>

            {/* Interactive Hub Buttons */}
            {HUBS.map((hub) => {
              const isSelected = currentLocation === hub.code || activeHub.code === hub.code;
              const isHovered = hoveredHub?.code === hub.code;
              const hubEvCount = playaVidaStore.getEvents(hub.code).length;
              const hubBizCount = playaVidaStore.getPublicBusinesses(hub.code).length;

              return (
                <div
                  key={hub.code}
                  style={{
                    left: `${hub.coords.x}%`,
                    top: `${hub.coords.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute z-20"
                >
                  <button
                    onClick={() => onSelectLocation(hub.code)}
                    onMouseEnter={() => setHoveredHub(hub)}
                    onMouseLeave={() => setHoveredHub(null)}
                    className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 shadow-lg backdrop-blur-md cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 font-bold ring-4 ring-amber-400/40 scale-110'
                        : isHovered
                        ? 'bg-white text-stone-900 font-semibold scale-105'
                        : 'bg-stone-900/80 hover:bg-stone-900 text-white border border-teal-500/40'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-stone-950 animate-ping' : 'bg-teal-400'
                      }`}
                    />
                    <span className="text-xs">{hub.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? 'bg-stone-950/15 text-stone-950 font-mono font-extrabold'
                          : 'bg-teal-900/80 text-teal-300 font-mono'
                      }`}
                      title={`${hubEvCount} eventos, ${hubBizCount} comercios`}
                    >
                      {hubEvCount} / {hubBizCount}
                    </span>
                  </button>
                </div>
              );
            })}
            </div>
            
            {/* Zoom Controls */}
            <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-30">
              <button onClick={() => setScale(s => Math.min(s + 0.2, 2))} className="bg-white/20 p-1.5 rounded hover:bg-white/30 backdrop-blur-sm shadow-sm font-bold text-teal-900">+</button>
              <button onClick={() => setScale(s => Math.max(s - 0.2, 1))} className="bg-white/20 p-1.5 rounded hover:bg-white/30 backdrop-blur-sm shadow-sm font-bold text-teal-900">-</button>
            </div>
          </div>
          
          {/* Legend */}
          <div className="pt-3 border-t border-teal-800/60 text-[10px] text-teal-200/80">
            {isEs ? 'Leyenda: [Eventos] / [Comercios]' : 'Legend: [Events] / [Businesses]'}
          </div>

          {/* Bottom Corridor distance legend */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-teal-200/80 flex-wrap gap-2">
            <span>Carretera Federal 307 (Cancún → Tulum: ~130 km)</span>
            <span className="font-mono text-amber-300">
              {activeHub.name}: {activeHub.kmFromCancun} km al sur de Cancún
            </span>
          </div>
        </div>

        {/* Selected Hub Details Panel: Events, Spots, Groups */}
        <div className="lg:col-span-6 p-6 space-y-5 flex flex-col justify-between bg-white max-h-[560px] overflow-y-auto">
          <div className="space-y-4">
            {/* Hub Title & Filter Action */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  {activeHub.sub}
                </span>
                <h4 className="font-['Outfit',sans-serif] text-2xl font-extrabold text-stone-900">
                  {activeHub.name}
                </h4>
              </div>

              <button
                onClick={() => onSelectLocation(activeHub.code)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors ${
                  currentLocation === activeHub.code
                    ? 'bg-teal-800 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                }`}
              >
                {currentLocation === activeHub.code
                  ? isEs
                    ? 'Filtro Activo'
                    : 'Active Filter'
                  : isEs
                  ? 'Filtrar Zona'
                  : 'Filter Zone'}
              </button>
            </div>

            {/* Tabs for Hub Content: Events vs Spots vs Groups */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200 text-xs font-semibold">
              <button
                onClick={() => setSideTab('events')}
                className={`flex-1 py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                  sideTab === 'events'
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-teal-700" />
                <span>{isEs ? 'Eventos' : 'Events'} ({eventsInHub.length})</span>
              </button>

              <button
                onClick={() => setSideTab('spots')}
                className={`flex-1 py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                  sideTab === 'spots'
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>{isEs ? 'Comercios' : 'Spots'} ({businessesInHub.length})</span>
              </button>

              <button
                onClick={() => setSideTab('groups')}
                className={`flex-1 py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                  sideTab === 'groups'
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-teal-700" />
                <span>{isEs ? 'Grupos' : 'Groups'} ({groupsInHub.length})</span>
              </button>
            </div>

            {/* TAB 1: EVENTS IN THIS HUB */}
            {sideTab === 'events' && (
              <div className="space-y-3">
                {eventsInHub.length > 0 ? (
                  eventsInHub.map((ev) => {
                    const evDate = new Date(ev.start_at);
                    const isToday =
                      evDate.getTime() >= startOfToday && evDate.getTime() <= endOfToday;
                    const isThisWeek =
                      evDate.getTime() >= startOfToday && evDate.getTime() <= endOfWeek;

                    const costFormatted =
                      ev.cost_amount === 0 || ev.paid_status === 'free'
                        ? isEs
                          ? 'Gratis'
                          : 'Free'
                        : `$${ev.cost_amount ?? 250} ${ev.cost_currency || 'MXN'}`;

                    return (
                      <div
                        key={ev.id}
                        onClick={() => onSelectEvent?.(ev)}
                        className="group p-3 rounded-2xl border border-stone-200 hover:border-teal-700 hover:bg-stone-50/80 transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {isToday && (
                                <span className="py-0.5 px-1.5 bg-amber-100 text-amber-900 rounded font-bold text-[10px] flex items-center gap-0.5">
                                  <Sun className="w-3 h-3 text-amber-600" />
                                  <span>{isEs ? 'Hoy' : 'Today'}</span>
                                </span>
                              )}
                              {isThisWeek && !isToday && (
                                <span className="py-0.5 px-1.5 bg-teal-100 text-teal-900 rounded font-semibold text-[10px]">
                                  {isEs ? 'Esta semana' : 'This week'}
                                </span>
                              )}
                              <span className="text-[11px] font-bold text-teal-800 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {evDate.toLocaleDateString(isEs ? 'es-MX' : 'en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                  })}{' '}
                                  • {evDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </span>
                            </div>

                            <h5 className="font-['Outfit',sans-serif] text-xs font-bold text-stone-900 group-hover:text-teal-800 truncate">
                              {isEs ? ev.title_es : ev.title_en}
                            </h5>
                          </div>

                          <span className="py-0.5 px-2 bg-stone-100 text-stone-900 rounded-md font-bold text-[11px] shrink-0">
                            {costFormatted}
                          </span>
                        </div>

                        {/* Location and Direct Street Map Link */}
                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                          <div className="flex items-center gap-1 min-w-0">
                            <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                            <span className="truncate">
                              {ev.street_address || ev.event_location_label}
                            </span>
                          </div>

                          {/* Direct Street Map Button */}
                          <button
                            type="button"
                            onClick={(e) => openStreetMap(e, ev)}
                            className="text-[10px] font-bold text-teal-800 hover:text-teal-950 flex items-center gap-0.5 hover:underline shrink-0 pl-2"
                            title={isEs ? 'Ver mapa callejero' : 'View street map'}
                          >
                            <span>{isEs ? 'Callejero' : 'Street Map'}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-stone-400 italic p-4 text-center bg-stone-50 rounded-2xl">
                    {isEs
                      ? 'No hay eventos registrados en esta zona.'
                      : 'No events registered in this zone yet.'}
                  </p>
                )}
              </div>
            )}

            {/* TAB 2: SPOTS IN THIS HUB */}
            {sideTab === 'spots' && (
              <div className="space-y-2">
                {businessesInHub.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => onOpenBusiness(b)}
                    className="group/biz p-2.5 rounded-xl border border-stone-200 hover:border-teal-700/50 hover:bg-stone-50 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={b.logo_url}
                        alt={b.name}
                        className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 group-hover/biz:text-teal-800 truncate">
                          {b.name}
                        </p>
                        <p className="text-[11px] text-stone-400 truncate">{b.category}</p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover/biz:text-teal-700 group-hover/biz:translate-x-0.5 transition-transform" />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: GROUPS IN THIS HUB */}
            {sideTab === 'groups' && (
              <div className="space-y-2">
                {groupsInHub.length > 0 ? (
                  groupsInHub.map((grp) => (
                    <div
                      key={grp.id}
                      onClick={() => onSelectGroup?.(grp)}
                      className="group/grp p-2.5 rounded-xl border border-stone-200 hover:border-teal-700/50 hover:bg-stone-50 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={grp.cover_url}
                          alt={grp.name_es}
                          className="w-9 h-9 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 group-hover/grp:text-teal-800 truncate">
                            {isEs ? grp.name_es : grp.name_en}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            {grp.member_count} {isEs ? 'miembros' : 'members'}
                          </p>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover/grp:text-teal-700 group-hover/grp:translate-x-0.5 transition-transform" />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400 italic p-4 text-center bg-stone-50 rounded-2xl">
                    {isEs ? 'No hay grupos registrados aquí.' : 'No groups registered here yet.'}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => onSelectLocation(activeHub.code)}
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors mt-2"
          >
            <span>
              {isEs
                ? `Ver todo en ${activeHub.name}`
                : `Explore everything in ${activeHub.name}`}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      )}

      {/* Non-endorsement Disclaimer Banner */}
      <div className="px-5 py-3 bg-stone-50/80 border-t border-stone-200/70 flex items-start gap-2.5 text-[11px] text-stone-500">
        <ShieldAlert className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-stone-700">
            {isEs ? 'Aviso Comunitario: ' : 'Community Notice: '}
          </span>
          {isEs
            ? 'La visualización de establecimientos, puntos de reunión y actividades en este mapa costero responde a fines informativos y de vinculación ciudadana. Su aparición no constituye verificación oficial, certificación de seguridad ni aval comercial de la plataforma.'
            : 'Venues, meeting hubs, and activities on this coastal directory are listed for local discovery and networking. Listing does not imply official verification, safety certification, or institutional endorsement.'}
        </p>
      </div>
    </div>
  );
};
