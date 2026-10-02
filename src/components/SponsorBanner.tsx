import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import { Language, SponsorBannerItem } from '../types';
import { translations } from '../lib/i18n';

interface SponsorBannerProps {
  banner: SponsorBannerItem;
  language: Language;
}

export const SponsorBanner: React.FC<SponsorBannerProps> = ({ banner, language }) => {
  const t = translations[language];
  const title = language === 'es' ? banner.headline_es : banner.headline_en;
  const subtitle = language === 'es' ? banner.description_es : banner.description_en;
  const cta = language === 'es' ? banner.cta_label_es : banner.cta_label_en;

  return (
    <aside className="relative rounded-3xl overflow-hidden border border-amber-200/90 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 shadow-2xs p-5 sm:p-6 my-6">
      {/* Explicit Sponsor label */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 py-0.5 px-2.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold tracking-wider uppercase border border-amber-200">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>{t.badge_sponsored}</span>
        </div>
        <span className="text-[10px] font-mono text-stone-400">
          {banner.sponsor_reference}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={banner.image_url}
            alt={title}
            className="w-16 h-16 rounded-2xl object-cover border border-amber-200 shadow-xs shrink-0"
          />
          <div>
            <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900 leading-tight">
              {title}
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-xl leading-relaxed">{subtitle}</p>
          </div>
        </div>

        <a
          href={banner.destination_url}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start sm:self-auto py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <span>{cta || (language === 'es' ? 'Conocer Más' : 'Learn More')}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-90" />
        </a>
      </div>
    </aside>
  );
};
