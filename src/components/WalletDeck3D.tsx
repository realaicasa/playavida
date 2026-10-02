import React, { useState } from 'react';
import {
  Award,
  QrCode,
  Sparkles,
  Gift,
  Building2,
  ChevronRight,
  ShieldCheck,
  Check,
  Wifi,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomerLoyaltyCard, Language } from '../types';
import { playaVidaStore } from '../lib/storage';

interface WalletDeck3DProps {
  cards: CustomerLoyaltyCard[];
  activeCardId: string | null;
  onSelectCard: (id: string) => void;
  onVisitBusiness: (businessId: string) => void;
  onShowQr: () => void;
  onRedeemVoucher: (voucherRef: string) => void;
  language: Language;
}

const CARD_THEMES = [
  {
    bg: 'from-stone-900 via-stone-850 to-stone-950',
    border: 'border-amber-400/40',
    accentText: 'text-amber-300',
    chip: 'bg-amber-400/20 border-amber-300/60 text-amber-300',
    stampActive: 'bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-md',
    stampEmpty: 'bg-stone-800/80 border-stone-700 text-stone-500',
    glow: 'rgba(245, 158, 11, 0.15)',
  },
  {
    bg: 'from-teal-950 via-emerald-900 to-stone-950',
    border: 'border-emerald-400/40',
    accentText: 'text-emerald-300',
    chip: 'bg-emerald-400/20 border-emerald-300/60 text-emerald-300',
    stampActive: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-stone-950 shadow-md',
    stampEmpty: 'bg-stone-800/80 border-stone-700 text-stone-500',
    glow: 'rgba(16, 185, 129, 0.15)',
  },
  {
    bg: 'from-cyan-950 via-teal-900 to-stone-950',
    border: 'border-cyan-400/40',
    accentText: 'text-cyan-300',
    chip: 'bg-cyan-400/20 border-cyan-300/60 text-cyan-300',
    stampActive: 'bg-gradient-to-br from-cyan-400 to-blue-500 text-stone-950 shadow-md',
    stampEmpty: 'bg-stone-800/80 border-stone-700 text-stone-500',
    glow: 'rgba(6, 182, 212, 0.15)',
  },
  {
    bg: 'from-amber-950 via-stone-900 to-orange-950',
    border: 'border-orange-400/40',
    accentText: 'text-orange-300',
    chip: 'bg-orange-400/20 border-orange-300/60 text-orange-300',
    stampActive: 'bg-gradient-to-br from-orange-400 to-amber-500 text-stone-950 shadow-md',
    stampEmpty: 'bg-stone-800/80 border-stone-700 text-stone-500',
    glow: 'rgba(249, 115, 22, 0.15)',
  },
];

export const WalletDeck3D: React.FC<WalletDeck3DProps> = ({
  cards,
  activeCardId,
  onSelectCard,
  onVisitBusiness,
  onShowQr,
  onRedeemVoucher,
  language,
}) => {
  const isEs = language === 'es';
  const [isHoveredDeck, setIsHoveredDeck] = useState(false);

  const programs = playaVidaStore.getLoyaltyPrograms();

  if (cards.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* 3D Perspective Stage */}
      <div
        className="relative mx-auto w-full max-w-xl min-h-[460px] sm:min-h-[500px] flex flex-col items-center justify-start pt-4 select-none"
        style={{ perspective: 1200 }}
        onMouseEnter={() => setIsHoveredDeck(true)}
        onMouseLeave={() => setIsHoveredDeck(false)}
      >
        <div className="w-full relative">
          {cards.map((card, idx) => {
            const isSelected = card.id === activeCardId;
            const theme = CARD_THEMES[idx % CARD_THEMES.length];
            const linkedProg = programs.find((p) => p.id === card.program_id);
            const totalStamps = 10;
            const collectedCount = card.stamps_count % 10;

            // 3D physics stacking offsets
            const verticalOffset = isSelected
              ? 0
              : isHoveredDeck
              ? (idx + 1) * 72
              : (idx + 1) * 52;
            const scale = isSelected ? 1 : 1 - (idx + 1) * 0.035;
            const zIndex = isSelected ? 40 : 30 - idx;
            const rotateX = isSelected ? 0 : 5;

            return (
              <motion.div
                key={card.id}
                layout
                onClick={() => onSelectCard(card.id)}
                animate={{
                  y: verticalOffset,
                  scale,
                  rotateX,
                  zIndex,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 24,
                }}
                whileHover={{
                  scale: isSelected ? 1.01 : scale * 1.03,
                  cursor: 'pointer',
                }}
                style={{
                  boxShadow: isSelected
                    ? `0 24px 48px -12px ${theme.glow}, 0 10px 20px -8px rgba(0,0,0,0.5)`
                    : '0 12px 24px -8px rgba(0,0,0,0.4)',
                }}
                className={`w-full absolute left-0 right-0 rounded-3xl p-5 sm:p-7 border-2 ${theme.border} bg-gradient-to-br ${theme.bg} text-white transition-all overflow-hidden`}
              >
                {/* Metallic holographic sheen line */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-radial from-white/10 to-transparent pointer-events-none rounded-full -mr-20 -mt-20 blur-xl" />

                {/* Card Top Row */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-7 rounded-lg border ${theme.chip} flex items-center justify-center`}
                    >
                      <Wifi className="w-4 h-4 rotate-90 opacity-80" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono tracking-widest uppercase opacity-70 block">
                        PLAYAVIDA DIGITAL PASS
                      </span>
                      <h4 className="font-['Outfit',sans-serif] text-lg sm:text-xl font-black text-white truncate max-w-[200px] sm:max-w-xs">
                        {card.business_name}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-mono font-bold py-1 px-2.5 rounded-full border ${theme.chip}`}
                    >
                      {card.stamps_count} {isEs ? 'sellos' : 'stamps'}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 block mt-1">
                      {linkedProg?.program_reference || card.program_id}
                    </span>
                  </div>
                </div>

                {/* Stamp Punch Holes Grid */}
                <div className="my-5 py-3 px-3.5 bg-black/35 rounded-2xl border border-white/10 backdrop-blur-xs relative z-10">
                  <div className="flex items-center justify-between text-[11px] font-medium text-stone-300 mb-2 px-1">
                    <span className={theme.accentText}>
                      {isEs ? 'Progreso de Sellos:' : 'Stamp Progress:'}
                    </span>
                    <span>
                      {10 - (card.stamps_count % 10)}{' '}
                      {isEs ? 'sellos restantes' : 'stamps remaining'}
                    </span>
                  </div>

                  <div className="grid grid-cols-10 gap-1 sm:gap-2">
                    {Array.from({ length: totalStamps }).map((_, sIdx) => {
                      const stampNum = sIdx + 1;
                      const isStamped =
                        collectedCount >= stampNum || card.stamps_count >= 10;
                      return (
                        <div
                          key={sIdx}
                          className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-bold border transition-all ${
                            isStamped
                              ? `${theme.stampActive} border-white/40 scale-105`
                              : theme.stampEmpty
                          }`}
                        >
                          {isStamped ? (
                            <Award className="w-3.5 h-3.5" />
                          ) : (
                            <span>{stampNum}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Bottom Bar */}
                <div className="flex items-center justify-between pt-1 relative z-10">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider block">
                      {isEs ? 'Próximo Premio' : 'Reward Tier'}
                    </span>
                    <span className="text-xs font-semibold text-stone-200 truncate block max-w-[220px]">
                      {linkedProg
                        ? isEs
                          ? (linkedProg.reward_tiers?.[0]?.reward_es || linkedProg.reward_name_es || linkedProg.name_es)
                          : (linkedProg.reward_tiers?.[0]?.reward_en || linkedProg.reward_name_en || linkedProg.name_en)
                        : (isEs ? 'Recompensa Exclusiva' : 'Exclusive Reward')}
                    </span>
                  </div>

                  {/* Actions when selected */}
                  {isSelected && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onVisitBusiness(card.business_id);
                        }}
                        className="py-1.5 px-3 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center gap-1"
                      >
                        <span>{isEs ? 'Minisitio' : 'Minisite'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowQr();
                        }}
                        className="py-1.5 px-3 bg-white text-stone-950 hover:bg-stone-100 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>{isEs ? 'QR' : 'QR'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Vouchers earned banner if any */}
                {(() => {
                  const vouchers = card.available_vouchers || card.earned_vouchers || [];
                  const readyVouchers = vouchers.filter((v: any) => v.status === 'available' || v.status === 'issued');
                  if (readyVouchers.length === 0) return null;
                  return (
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-amber-300 font-bold flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5" />
                        <span>
                          {readyVouchers.length}{' '}
                          {isEs ? 'vouchers listos' : 'vouchers ready'}
                        </span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const first = readyVouchers[0];
                          if (first) onRedeemVoucher(first.voucher_reference);
                        }}
                        className="text-[11px] py-1 px-2.5 bg-amber-400 text-stone-950 font-bold rounded-lg hover:bg-amber-300 transition-colors"
                      >
                        {isEs ? 'Canjear Ahora' : 'Redeem Now'}
                      </button>
                    </div>
                  );
                })()}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-xs text-stone-400">
        <p>
          {isEs
            ? '💡 Pasa el cursor o pulsa cualquier tarjeta para expandir la baraja 3D'
            : '💡 Hover or tap any pass to expand and bring it to the top'}
        </p>
      </div>
    </div>
  );
};
