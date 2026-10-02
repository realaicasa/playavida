import React from 'react';
import {
  MapPin,
  Globe,
  User as UserIcon,
  Search,
  Sparkles,
  ChevronDown,
  Building2,
  SlidersHorizontal,
  QrCode,
  Map,
  Plus,
  Calendar,
  Users,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { Language, LocationCode, User } from '../types';
import { LOCATIONS } from '../lib/constants';
import { translations } from '../lib/i18n';

interface HeaderProps {
  currentLocation: LocationCode | 'ALL';
  onSelectLocation: (loc: LocationCode | 'ALL') => void;
  language: Language;
  onToggleLanguage: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenDashboard: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onGoHome?: () => void;
  onOpenQuickLookup?: () => void;
  onOpenMap?: () => void;
  onOpenCalendar?: () => void;
  onOpenWikiSearch?: () => void;
  onOpenCreateBusiness?: () => void;
  onOpenCreateGroup?: () => void;
  onOpenCreateEvent?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  language,
  onToggleLanguage,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenDashboard,
  searchQuery,
  onSearchChange,
  onGoHome,
  onOpenQuickLookup,
  onOpenMap,
  onOpenCalendar,
  onOpenWikiSearch,
}) => {
  const t = translations[language];
  const isEs = language === 'es';

  // Active location label for compact mobile view
  const currentLocObj = LOCATIONS.find((l) => l.code === currentLocation);
  const mobileLocLabel = currentLocation === 'ALL'
    ? (isEs ? 'Todos' : 'All')
    : currentLocObj ? currentLocObj.code : 'ALL';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-2 flex flex-col gap-2">
        {/* Row 1: Logo + User Actions */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onGoHome}
              className="flex items-center gap-1.5 sm:gap-2 text-left cursor-pointer group hover:opacity-90 transition-opacity focus:outline-hidden"
              title={isEs ? 'Volver al Inicio (Homescreen)' : 'Return to Homescreen'}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg shadow-xs group-hover:scale-105 transition-transform">
                <img src="/PlayaVida128.svg" alt="PlayaVida Logo" />
              </div>
              <div>
                <span className="font-['Outfit',sans-serif] text-lg sm:text-xl font-bold tracking-tight text-stone-900 block leading-none">
                  Playa<span className="text-teal-700">Vida</span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase font-semibold tracking-wider text-stone-500 mt-0.5">
                  Riviera Maya
                </span>
              </div>
            </button>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* ... Right controls (Map, Calendar, PWA, Lang, Auth) ... */}
            {onOpenMap && (
              <button
                onClick={onOpenMap}
                className="flex items-center gap-1 p-1.5 sm:py-1 sm:px-2 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 text-xs font-bold text-teal-900 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                title={language === 'es' ? 'Mapa Costero' : 'Map'}
                aria-label={language === 'es' ? 'Mapa' : 'Map'}
              >
                <Map className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span className="hidden md:inline">
                  {language === 'es' ? 'Mapa' : 'Map'}
                </span>
              </button>
            )}

            {onOpenCalendar && (
              <button
                onClick={onOpenCalendar}
                className="flex items-center gap-1 p-1.5 sm:py-1 sm:px-2 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-900 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                title={language === 'es' ? 'Calendario' : 'Calendar'}
                aria-label={language === 'es' ? 'Calendario' : 'Calendar'}
              >
                <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="hidden md:inline">
                  {language === 'es' ? 'Calendario' : 'Calendar'}
                </span>
              </button>
            )}

            <PWAInstallButton />
            
            {/* Language toggle */}
            <div
              className="hidden sm:flex items-center p-0.5 rounded-xl border border-stone-200 bg-stone-100 shadow-2xs"
              role="group"
              aria-label="Language switch"
            >
              <button
                type="button"
                onClick={() => {
                  if (language !== 'en') onToggleLanguage();
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <span className="text-stone-300 font-light text-xs px-0.5">/</span>
              <button
                type="button"
                onClick={() => {
                  if (language !== 'es') onToggleLanguage();
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'es'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
                title="Cambiar a Español"
              >
                ES
              </button>
            </div>

            {/* Auth / Account */}
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 p-1 sm:py-1.5 sm:px-3 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-teal-900 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                title={currentUser.email}
                aria-label="User Profile"
              >
                <div className="w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-teal-700 text-white flex items-center justify-center text-[11px] sm:text-[10px] font-bold">
                  {currentUser.email.substring(0, 1).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.email.split('@')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 p-2 sm:py-2 sm:px-3.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                aria-label={t.sign_in_action}
              >
                <UserIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">{t.sign_in_action}</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Location + Search */}
        <div className="flex items-center gap-2">
            {/* Desktop Location Selector */}
            <div className="relative">
              <div className="flex items-center gap-1.5 py-1.5 px-3 bg-stone-100 hover:bg-stone-200/70 rounded-full border border-stone-200 text-xs font-medium text-stone-700 transition-colors cursor-pointer">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                <select
                  value={currentLocation}
                  onChange={(e) => onSelectLocation(e.target.value as LocationCode | 'ALL')}
                  className="bg-transparent border-none outline-none appearance-none pr-4 cursor-pointer font-medium"
                >
                  <option value="ALL">{t.all_locations}</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc.code} value={loc.code}>
                      {language === 'es' ? loc.name_es : loc.name_en}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2.5 pointer-events-none" />
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1">
              {onOpenWikiSearch ? (
                <button
                  type="button"
                  onClick={onOpenWikiSearch}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 hover:bg-stone-100/90 text-xs sm:text-sm border border-stone-200 hover:border-teal-400/60 rounded-full transition-all text-stone-500 hover:text-stone-800 text-left flex items-center justify-between shadow-2xs group relative"
                >
                  <Search className="w-4 h-4 text-stone-400 group-hover:text-teal-700 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                  <span className="truncate">
                    {searchQuery || (language === 'es' ? 'Buscar wiki, negocios, eventos...' : 'Wiki search businesses, events...')}
                  </span>
                </button>
              ) : (
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={t.search_placeholder}
                    className="w-full pl-9 pr-4 py-2 bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-xs sm:text-sm border border-stone-200 rounded-full focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all text-stone-900 placeholder:text-stone-400"
                  />
                </div>
              )}
            </div>
        </div>
      </div>
    </header>
  );
};
