import React, { useState } from 'react';
import {
  X,
  Award,
  Gift,
  Building2,
  Check,
  ChevronRight,
  Sparkles,
  MapPin,
  QrCode,
  ShieldCheck,
  Tag,
  Bell,
  Camera,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NativeLoyaltyProgram, Language, User, PublicBusinessProjection } from '../types';
import { playaVidaStore } from '../lib/storage';
import { translations } from '../lib/i18n';

interface LoyaltyProgramModalProps {
  program: NativeLoyaltyProgram | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentUser: User | null;
  isEnrolled: boolean;
  onEnroll: (programId: string) => void;
  onVisitBusinessMinisite: (businessId: string) => void;
  onOpenQrModal: (reference: string, title: string) => void;
}

export const LoyaltyProgramModal: React.FC<LoyaltyProgramModalProps> = ({
  program,
  isOpen,
  onClose,
  language,
  currentUser,
  isEnrolled,
  onEnroll,
  onVisitBusinessMinisite,
  onOpenQrModal,
}) => {
  const [receiveIncentives, setReceiveIncentives] = useState(true);
  if (!isOpen || !program) return null;

  const t = translations[language];
  const isEs = language === 'es';
  const name = isEs ? program.name_es : program.name_en;
  const description = isEs ? program.description_es : program.description_en;

  const handleEnrollClick = () => {
    if (currentUser && receiveIncentives) {
      playaVidaStore.recordPushOptIn(currentUser.id, {
        target_reference: program.program_reference,
        target_name: program.business_name,
        target_type: 'loyalty',
        opted_in_at: new Date().toISOString(),
        receive_incentives: true,
      });
    }
    onEnroll(program.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Warm Amber Accent */}
        <div className="p-6 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-amber-100 text-xs font-mono font-bold tracking-wider uppercase">
            <Award className="w-4 h-4 text-amber-200" />
            <span>{program.program_reference}</span>
          </div>

          <h3 className="font-['Outfit',sans-serif] text-2xl font-bold text-white mt-1 leading-snug">
            {name}
          </h3>

          <div className="flex items-center gap-2 text-amber-100 text-xs mt-1">
            <Building2 className="w-3.5 h-3.5" />
            <span className="font-semibold">{program.business_name}</span>
            <span>•</span>
            <span>{program.location_code}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
              {isEs ? 'Mecánica del Programa' : 'Program Details'}
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Reward Tiers */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-600" />
              <span>{isEs ? 'Niveles de Recompensa Desbloqueables' : 'Unlockable Reward Tiers'}</span>
            </h4>

            <div className="space-y-2">
              {program.reward_tiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {tier.threshold}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-900 block">
                      {tier.threshold} {isEs ? 'sellos acumulados' : 'stamps required'}
                    </span>
                    <p className="text-xs font-medium text-stone-800 mt-0.5">
                      {isEs ? tier.reward_es : tier.reward_en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bonus Features & Quests */}
          {program.bonus_features && program.bonus_features.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{isEs ? 'Misiones & Sellos de Bonificación' : 'Bonus Quests & Extra Stamps'}</span>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  +{program.bonus_features.length} {isEs ? 'oportunidades' : 'opportunities'}
                </span>
              </h4>

              <div className="space-y-2">
                {program.bonus_features.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50/70 to-amber-50/70 border border-amber-200 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      +{b.extra_stamps}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-stone-900">
                          {isEs ? b.title_es : b.title_en}
                        </span>
                        {b.requires_photo_upload && (
                          <span className="text-[9px] font-bold text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Camera className="w-2.5 h-2.5" />
                            <span>{isEs ? 'Foto' : 'Photo'}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                        {isEs ? b.description_es : b.description_en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Push notification and incentives opt-in checkbox */}
          {!isEnrolled && (
            <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs text-stone-700 cursor-pointer hover:bg-amber-50 transition-colors">
              <input
                type="checkbox"
                checked={receiveIncentives}
                onChange={(e) => setReceiveIncentives(e.target.checked)}
                className="mt-0.5 rounded border-amber-400 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-stone-900 flex items-center gap-1">
                  <Bell className="w-3 h-3 text-amber-600" />
                  <span>
                    {isEs
                      ? 'Deseo recibir alertas de recompensas e incentivos'
                      : 'Notify me about reward unlocks and exclusive incentives'}
                  </span>
                </span>
                <p className="text-[11px] text-stone-500">
                  {isEs
                    ? 'Avisos directos cuando estés a 1 o 2 sellos de canjear y promociones de temporada.'
                    : 'Get notified when you are close to earning a reward and special perks.'}
                </p>
              </div>
            </label>
          )}

          {/* Security & Verification note */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-stone-900">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>{isEs ? 'Registro Seguro y Verificado' : 'Secure & Verified Program'}</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-normal">
              {isEs
                ? 'Tus sellos se registran en una tarjeta digital con QR personal. Al visitar el negocio, presenta tu código QR al personal.'
                : 'Your stamps are recorded in your personal digital card. Show your QR code at checkout.'}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-100 flex flex-col sm:flex-row gap-2.5 shrink-0">
          <button
            onClick={handleEnrollClick}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
              isEnrolled
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {isEnrolled ? (
              <>
                <Check className="w-4 h-4" />
                <span>{isEs ? '✓ Ya estás Inscrito (Ver Tarjeta)' : '✓ Enrolled (View Card)'}</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4" />
                <span>{isEs ? 'Inscribirme al Programa' : 'Join Loyalty Program'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onClose();
              onVisitBusinessMinisite(program.business_id);
            }}
            className="flex-1 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <span>{isEs ? 'Visitar Minisitio del Negocio' : 'Visit Business Mini-site'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
