import React, { useState } from 'react';
import {
  MapPin,
  QrCode,
  ShieldCheck,
  Award,
  Sparkles,
  Lock,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { motion } from 'motion/react';
import { PublicBusinessProjection, Language } from '../types';
import { translations } from '../lib/i18n';
import { playaVidaStore } from '../lib/storage';
import { TrustBadge } from './TrustBadge';

interface BusinessCardProps {
  business: PublicBusinessProjection;
  language: Language;
  onOpenPublicPage: (business: PublicBusinessProjection) => void;
  onOpenContactModal: (business: PublicBusinessProjection) => void;
  onOpenQrModal: (business: PublicBusinessProjection) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  language,
  onOpenPublicPage,
  onOpenContactModal,
  onOpenQrModal,
}) => {
  const t = translations[language];
  const isEs = language === 'es';
  const description = isEs ? business.description_es : business.description_en;
  const [isFavorite, setIsFavorite] = useState(() =>
    playaVidaStore.isFavorite('business', business.id)
  );

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = playaVidaStore.toggleFavorite('business', business.id);
    setIsFavorite(nextState);
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-3xl border border-stone-200/90 hover:border-teal-700/40 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Cover image & badges */}
        <div className="relative h-48 w-full bg-stone-900 overflow-hidden">
          <img
            src={business.cover_url}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent pointer-events-none" />

          {/* Reference pill */}
          <div className="absolute top-3.5 left-3.5 bg-stone-900/80 backdrop-blur-md py-1 px-3 rounded-full border border-white/20 text-[11px] font-mono font-bold text-white shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{business.business_reference}</span>
          </div>

          {/* Top-right actions: Favorite Heart & QR trigger */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
            <button
              onClick={handleToggleFavorite}
              title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              className={`p-2 rounded-full backdrop-blur-md border shadow-md transition-all hover:scale-105 ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 border-stone-200'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-700'
                }`}
              />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenQrModal(business);
              }}
              title={isEs ? 'Código QR del negocio' : 'Business QR code'}
              className="p-2 bg-white/90 hover:bg-white text-stone-800 hover:text-teal-700 rounded-full backdrop-blur-md border border-stone-200 shadow-md transition-all hover:scale-105"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>

          {/* Status or special tags */}
          <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 flex-wrap">
            {business.has_loyalty_program && (
              <span className="inline-flex items-center gap-1 py-1 px-2.5 bg-amber-500/90 text-white text-[10px] font-bold rounded-full backdrop-blur-md shadow-xs border border-amber-400/30">
                <Award className="w-3.5 h-3.5" />
                {t.badge_native_loyalty}
              </span>
            )}
            {business.has_active_offers && (
              <span className="inline-flex items-center gap-1 py-1 px-2.5 bg-teal-600/90 text-white text-[10px] font-bold rounded-full backdrop-blur-md shadow-xs border border-teal-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                {isEs ? 'Oferta Activa' : 'Active Offer'}
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-3">
          {/* Logo & Category */}
          <div className="flex items-start gap-3.5">
            <img
              src={business.logo_url}
              alt={business.name}
              className="w-13 h-13 rounded-2xl object-cover border-2 border-white -mt-10 shadow-lg bg-white shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  {business.category}
                </span>
                <TrustBadge type="business_managed" language={language} size="sm" />
              </div>
              <h3
                onClick={() => onOpenPublicPage(business)}
                className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900 truncate hover:text-teal-800 cursor-pointer transition-colors leading-snug"
              >
                {business.name}
              </h3>
            </div>
          </div>

          {/* Location label */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">{business.location_label}</span>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Services tags */}
          {business.services.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {business.services.slice(0, 3).map((service, idx) => (
                <span
                  key={idx}
                  className="py-0.5 px-2.5 bg-stone-100 text-stone-600 rounded-lg text-[11px] font-medium"
                >
                  {service}
                </span>
              ))}
              {business.services.length > 3 && (
                <span className="text-[10px] text-stone-400 font-semibold">
                  +{business.services.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer actions */}
      <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center gap-2">
        <button
          onClick={() => onOpenPublicPage(business)}
          className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
        >
          <span>{t.view_details}</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={() => onOpenContactModal(business)}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            business.has_contact_enabled
              ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
          }`}
          title={business.has_contact_enabled ? 'Ver contacto directo' : 'Contacto protegido'}
        >
          {business.has_contact_enabled ? (
            <>
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Contacto</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-500">Contacto</span>
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
};
