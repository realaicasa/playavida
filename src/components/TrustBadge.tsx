import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Users, Clock, MapPin, ExternalLink, Sparkles, Languages, Info, HelpCircle } from 'lucide-react';
import { TrustBadgeType, Language } from '../types';
import { TRUST_BADGE_DEFINITIONS } from '../lib/legalConfig';

interface TrustBadgeProps {
  type: TrustBadgeType;
  language: Language;
  size?: 'sm' | 'md';
  showTooltip?: boolean;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  type,
  language,
  size = 'sm',
  showTooltip = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const info = TRUST_BADGE_DEFINITIONS[type];

  if (!info) return null;

  const isEs = language === 'es';
  const label = isEs ? info.label_es : info.label_en;
  const explanation = isEs ? info.explanation_es : info.explanation_en;

  // Visual styling variants per badge type
  const getBadgeStyle = () => {
    switch (type) {
      case 'business_managed':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          icon: <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0" />,
        };
      case 'organizer_managed':
        return {
          bg: 'bg-teal-50 border-teal-200 text-teal-800',
          icon: <UserCheck className="w-3 h-3 text-teal-700 shrink-0" />,
        };
      case 'community_reported':
        return {
          bg: 'bg-stone-100 border-stone-200 text-stone-700',
          icon: <Users className="w-3 h-3 text-stone-600 shrink-0" />,
        };
      case 'recently_confirmed':
        return {
          bg: 'bg-sky-50 border-sky-200 text-sky-800',
          icon: <Clock className="w-3 h-3 text-sky-700 shrink-0" />,
        };
      case 'approximate_location':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          icon: <MapPin className="w-3 h-3 text-amber-700 shrink-0" />,
        };
      case 'external_ticketing':
        return {
          bg: 'bg-purple-50 border-purple-200 text-purple-800',
          icon: <ExternalLink className="w-3 h-3 text-purple-700 shrink-0" />,
        };
      case 'sponsored':
        return {
          bg: 'bg-amber-50/70 border-amber-200 text-amber-900',
          icon: <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />,
        };
      case 'machine_translated':
        return {
          bg: 'bg-stone-50 border-stone-200 text-stone-600',
          icon: <Languages className="w-3 h-3 text-stone-500 shrink-0" />,
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => showTooltip && setIsOpen(!isOpen)}
        onMouseEnter={() => showTooltip && setIsOpen(true)}
        onMouseLeave={() => showTooltip && setIsOpen(false)}
        className={`inline-flex items-center gap-1 font-medium border rounded-md transition-colors ${style.bg} ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
        } ${showTooltip ? 'cursor-help' : 'cursor-default'}`}
        aria-label={`${label}: ${explanation}`}
      >
        {style.icon}
        <span className="truncate">{label}</span>
        {showTooltip && (
          <HelpCircle className="w-2.5 h-2.5 opacity-60 hover:opacity-100 ml-0.5" />
        )}
      </button>

      {/* Accessible Tooltip */}
      {showTooltip && isOpen && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 p-2.5 bg-stone-900 text-stone-100 text-[11px] rounded-xl shadow-lg border border-stone-700 pointer-events-none leading-tight space-y-1"
        >
          <div className="font-bold text-white flex items-center gap-1">
            <Info className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{label}</span>
          </div>
          <p className="text-stone-300">{explanation}</p>
        </div>
      )}
    </div>
  );
};
