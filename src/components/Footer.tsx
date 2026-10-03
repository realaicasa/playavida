import React from 'react';
import { Shield, FileText, Smartphone, AlertTriangle, Scale, Heart, MapPin, Globe, Sparkles, Award, Plus, Building2, Users, Calendar, Home } from 'lucide-react';
import { Language, LocationCode, User } from '../types';
import { translations } from '../lib/i18n';
import { LOCATIONS } from '../lib/constants';

interface FooterProps {
  language: Language;
  onToggleLanguage: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenInstall: () => void;
  onOpenDisclaimer: () => void;
  onOpenLegal: () => void;
  onOpenQRcasas: () => void;
  onSelectLocation?: (loc: LocationCode | 'ALL') => void;
  currentUser: User | null;
  onOpenCreateBusiness?: () => void;
  onOpenCreateGroup?: () => void;
  onOpenCreateEvent?: () => void;
  onOpenSponsorInfo?: () => void;
  onOpenAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onToggleLanguage,
  onOpenPrivacy,
  onOpenTerms,
  onOpenInstall,
  onOpenDisclaimer,
  onOpenLegal,
  onOpenQRcasas,
  onSelectLocation,
  currentUser,
  onOpenCreateBusiness,
  onOpenCreateGroup,
  onOpenCreateEvent,
  onOpenSponsorInfo,
  onOpenAuth,
}) => {
  const t = translations[language];
  const isEs = language === 'es';

  const handleCreateAction = (action?: () => void) => {
    if (currentUser) {
      action?.();
    } else {
      onOpenAuth();
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-24 md:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <button onClick={() => window.location.href = '/'} className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform overflow-hidden">
                <img src="/PlayaVida128.svg" alt="PlayaVida Logo" className="w-full h-full object-contain" />
              </button>
              <button onClick={() => window.location.href = '/'}>
                <span className="font-['Outfit',sans-serif] text-xl font-bold tracking-tight text-white block leading-none">
                  Playa<span className="text-teal-400">Vida</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-teal-400/90 block mt-0.5">
                  Riviera Maya • Quintana Roo
                </span>
              </button>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
              {t.footer_tagline}
            </p>

            {/* Install PWA & Directory CTA Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={onOpenInstall}
                className="inline-flex items-center gap-2 py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all border border-stone-700"
              >
                <Smartphone className="w-4 h-4 text-teal-400" />
                <span>{t.footer_install}</span>
              </button>
              <button
                onClick={onOpenQRcasas}
                className="inline-flex items-center gap-2 py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-stone-900 rounded-xl text-xs font-bold shadow-md transition-all uppercase tracking-wide"
              >
                <Home className="w-4 h-4" />
                <span>{isEs ? 'Directorio Alojamiento' : 'Accommodation Directory'}</span>
              </button>
              <button
                onClick={() => handleCreateAction(onOpenSponsorInfo)}
                className="inline-flex items-center gap-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md transition-all uppercase tracking-wide"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEs ? 'Patrocinar' : 'Sponsor'}</span>
              </button>
            </div>
          </div>

          {/* Creation Options */}
          <div className="space-y-3">
             <h4 className="font-['Outfit',sans-serif] text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-teal-400" />
              <span>{isEs ? 'Crear Contenido' : 'Create Content'}</span>
            </h4>
            <div className="space-y-2">
              <button onClick={() => handleCreateAction(onOpenCreateBusiness)} className="text-xs flex items-center gap-2 text-stone-400 hover:text-white transition-colors">
                <Building2 className="w-3.5 h-3.5" /> {isEs ? 'Registrar Negocio' : 'Register Business'}
              </button>
              <button onClick={() => handleCreateAction(onOpenCreateGroup)} className="text-xs flex items-center gap-2 text-stone-400 hover:text-white transition-colors">
                <Users className="w-3.5 h-3.5" /> {isEs ? 'Iniciar Grupo' : 'Start Group'}
              </button>
              <button onClick={() => handleCreateAction(onOpenCreateEvent)} className="text-xs flex items-center gap-2 text-stone-400 hover:text-white transition-colors">
                <Calendar className="w-3.5 h-3.5" /> {isEs ? 'Publicar Evento' : 'Publish Event'}
              </button>
              <button onClick={() => handleCreateAction(onOpenSponsorInfo)} className="text-xs flex items-center gap-2 text-stone-400 hover:text-white transition-colors">
                <Sparkles className="w-3.5 h-3.5" /> {isEs ? 'Sponsor' : 'Sponsor'}
              </button>
            </div>
          </div>

          {/* Col 2: Covered Regional Hubs */}
          <div className="space-y-3">
            <h4 className="font-['Outfit',sans-serif] text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.footer_hubs}</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              {LOCATIONS.slice(0, 5).map((loc) => (
                <li key={loc.code}>
                  <button
                    onClick={() => onSelectLocation && onSelectLocation(loc.code as LocationCode)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {isEs ? loc.name_es : loc.name_en}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Compliance & Legal Modals */}
          <div className="space-y-3">
            <h4 className="font-['Outfit',sans-serif] text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.footer_compliance_title}</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-stone-500" />
                  <span>{t.footer_privacy}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-stone-500" />
                  <span>{t.footer_terms}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenInstall}
                  className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5 text-stone-500" />
                  <span>{t.footer_install}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDisclaimer}
                  className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-stone-500" />
                  <span>{t.footer_disclaimer}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLegal}
                  className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
                >
                  <Scale className="w-3.5 h-3.5 text-stone-500" />
                  <span>{t.footer_legal}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Native Guarantees & Language */}
          <div className="space-y-3">
            <h4 className="font-['Outfit',sans-serif] text-xs font-bold uppercase tracking-wider text-white">
              {isEs ? 'Comunidad PlayaVida' : 'PlayaVida Community'}
            </h4>
            <div className="p-3.5 bg-stone-800/80 rounded-2xl border border-stone-700/80 space-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <Award className="w-4 h-4" />
                <span>{isEs ? '100% Sin Algoritmos Opacos' : '100% Unbiased Discovery'}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {isEs
                  ? 'Diseñado para empoderar a la comunidad local de Playa del Carmen con código QR real y sellos sin intermediarios.'
                  : 'Designed to empower local businesses and residents in Playa del Carmen with live QR codes and native loyalty.'}
              </p>
            </div>

            <div className="pt-1 flex items-center gap-3">
              <button
                onClick={onToggleLanguage}
                className="flex items-center gap-1.5 py-1.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg border border-stone-700 text-xs font-semibold transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                <span>{language === 'es' ? 'English (US)' : 'Español (MX)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>{t.footer_copyright}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>PWA Build v2.4</span>
            <span>•</span>
            <span className="text-teal-400 font-medium">{isEs ? 'Red Comunitaria' : 'Community Network'}</span>
            <span>•</span>
            <button onClick={() => window.location.href = '/intro.html'} className="hover:underline cursor-pointer">
              {isEs ? 'Ver Intro' : 'View Intro'}
            </button>
            <span>•</span>
            <button onClick={onOpenPrivacy} className="hover:underline cursor-pointer">
              {t.footer_privacy}
            </button>
            <span>•</span>
            <button onClick={onOpenLegal} className="hover:underline cursor-pointer">
              {t.footer_legal}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
