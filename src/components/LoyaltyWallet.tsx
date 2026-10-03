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
  MapPin,
  Tag,
  Star,
  Camera,
  Upload,
  CheckCircle2,
  Image,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { Language, User, CustomerLoyaltyCard, NativeLoyaltyProgram, PublicBusinessProjection } from '../types';
import { playaVidaStore } from '../lib/storage';
import { translations } from '../lib/i18n';
import { LoyaltyProgramModal } from './LoyaltyProgramModal';
import { WalletDeck3D } from './WalletDeck3D';

interface LoyaltyWalletProps {
  currentUser: User | null;
  language: Language;
  onOpenAuth: () => void;
  selectedProgramId?: string | null;
  onVisitBusiness?: (business: PublicBusinessProjection) => void;
  onOpenQrModal?: (reference: string, title: string) => void;
}

export const LoyaltyWallet: React.FC<LoyaltyWalletProps> = ({
  currentUser,
  language,
  onOpenAuth,
  selectedProgramId,
  onVisitBusiness,
  onOpenQrModal,
}) => {
  const t = translations[language];
  const isEs = language === 'es';
  const programs = playaVidaStore.getLoyaltyPrograms();

  const [cards, setCards] = useState<CustomerLoyaltyCard[]>(
    currentUser ? playaVidaStore.getCustomerCards(currentUser.id) : []
  );

  const [activeCardId, setActiveCardId] = useState<string | null>(
    cards[0]?.id || null
  );

  const [showCustomerQr, setShowCustomerQr] = useState(false);
  const [selectedProgramForModal, setSelectedProgramForModal] = useState<NativeLoyaltyProgram | null>(null);
  const [walletViewMode, setWalletViewMode] = useState<'3d_deck' | 'classic'>('3d_deck');
  const [photoPreview, setPhotoPreview] = useState<{ [bonusId: string]: string }>({});
  const [claimSuccessMessage, setClaimSuccessMessage] = useState<string | null>(null);

  const handlePhotoSelect = (bonusId: string, file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setPhotoPreview((prev) => ({ ...prev, [bonusId]: e.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClaimBonus = (bonusId: string) => {
    if (!currentUser || !activeProgram) return;
    const bonus = activeProgram.bonus_features?.find((b) => b.id === bonusId);
    if (!bonus) return;

    const photoUrl = photoPreview[bonusId];
    const updated = playaVidaStore.claimBonusStamp(currentUser.id, activeProgram.id, bonusId, photoUrl);
    if (updated) {
      setCards(playaVidaStore.getCustomerCards(currentUser.id));
      setClaimSuccessMessage(
        isEs
          ? `¡Genial! Se ha sumado +${bonus.extra_stamps} sello(s) a tu tarjeta por el reto: "${bonus.title_es}"`
          : `Awesome! +${bonus.extra_stamps} stamp(s) added for quest: "${bonus.title_en}"`
      );
      setTimeout(() => setClaimSuccessMessage(null), 6000);
    }
  };

  // If a program was passed from business page, auto-enroll or select
  React.useEffect(() => {
    if (currentUser && selectedProgramId) {
      const card = playaVidaStore.enrollInLoyalty(currentUser.id, selectedProgramId);
      const updated = playaVidaStore.getCustomerCards(currentUser.id);
      setCards(updated);
      setActiveCardId(card.id);
    }
  }, [currentUser, selectedProgramId]);

  if (!currentUser) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 text-center max-w-lg mx-auto space-y-5 my-8 shadow-md"
      >
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200/80 shadow-xs">
          <Award className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-['Outfit',sans-serif] text-2xl font-bold text-stone-900">
            {t.loyalty_headline}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {t.loyalty_subtitle}
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="w-full py-3.5 px-6 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
        >
          {isEs ? 'Iniciar sesión para ver mis tarjetas' : 'Sign in to access your wallet'}
        </button>
      </motion.div>
    );
  }

  const activeCard = cards.find((c) => c.id === activeCardId) || cards[0];
  const activeProgram = programs.find((p) => p.id === activeCard?.program_id);

  const handleEnroll = (progId: string) => {
    const card = playaVidaStore.enrollInLoyalty(currentUser.id, progId);
    const updated = playaVidaStore.getCustomerCards(currentUser.id);
    setCards(updated);
    setActiveCardId(card.id);
    setSelectedProgramForModal(null);
  };

  const handleRedeemVoucher = (voucherRef: string) => {
    if (!activeCard) return;
    playaVidaStore.redeemVoucher(activeCard.id, voucherRef);
    setCards(playaVidaStore.getCustomerCards(currentUser.id));
  };

  const handleVisitBusinessById = (businessId: string) => {
    const business = playaVidaStore.getBusinessById(businessId);
    if (business && onVisitBusiness) {
      onVisitBusiness(business);
    }
  };

  return (
    <div className="space-y-10">
      {/* Title Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-stone-900">
            {t.loyalty_headline}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">{t.loyalty_subtitle}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {cards.length > 0 && (
            <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-semibold">
              <button
                onClick={() => setWalletViewMode('3d_deck')}
                className={`py-1.5 px-3 rounded-xl transition-all ${
                  walletViewMode === '3d_deck'
                    ? 'bg-amber-500 text-white shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🎴 {isEs ? 'Baraja 3D' : '3D Deck'}
              </button>
              <button
                onClick={() => setWalletViewMode('classic')}
                className={`py-1.5 px-3 rounded-xl transition-all ${
                  walletViewMode === 'classic'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                📋 {isEs ? 'Detallado' : 'Detailed'}
              </button>
            </div>
          )}

          {activeCard && (
            <button
              onClick={() => setShowCustomerQr(true)}
              className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>{t.show_customer_qr}</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* 3D Stacked Deck Mode */}
      {cards.length > 0 && activeCard && walletViewMode === '3d_deck' && (
        <WalletDeck3D
          cards={cards}
          activeCardId={activeCardId}
          onSelectCard={(id) => setActiveCardId(id)}
          onVisitBusiness={handleVisitBusinessById}
          onShowQr={() => setShowCustomerQr(true)}
          onRedeemVoucher={handleRedeemVoucher}
          language={language}
        />
      )}

      {/* Active Stamp Card Section with Classic Layout */}
      {cards.length > 0 && activeCard && walletViewMode === 'classic' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Selector on the left */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {t.my_cards} ({cards.length})
              </span>
            </h3>
            <div className="space-y-2">
              {cards.map((c) => {
                const isSel = c.id === activeCard.id;
                const linkedProg = programs.find((p) => p.id === c.program_id);
                return (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={c.id}
                    onClick={() => setActiveCardId(c.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      isSel
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-white text-stone-800 border-stone-200 hover:border-amber-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold truncate block">{c.business_name}</span>
                        <span
                          className={`text-[10px] ${
                            isSel ? 'text-amber-100' : 'text-stone-400'
                          }`}
                        >
                          Ref: {linkedProg?.program_reference || c.program_id}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold font-mono py-1 px-2.5 rounded-full shrink-0 ${
                          isSel ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.stamps_count} {isEs ? 'sellos' : 'stamps'}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Active Stamp Card Display */}
          <div className="lg:col-span-2 space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={activeCard.id}
              className="bg-gradient-to-br from-amber-50 via-white to-amber-50/60 rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-lg space-y-6"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                    {isEs ? 'Tarjeta Oficial de Lealtad' : 'Official Loyalty Card'}
                  </span>
                  <h3 className="font-['Outfit',sans-serif] text-2xl font-bold text-stone-900">
                    {activeCard.business_name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVisitBusinessById(activeCard.business_id)}
                    className="py-1.5 px-3 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200 shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <span>{isEs ? 'Ver Minisitio' : 'View Minisite'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setShowCustomerQr(true)}
                    className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{isEs ? 'Mi QR' : 'My QR'}</span>
                  </button>
                </div>
              </div>

              {/* Stamp Grid (10 stamps standard base) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-stone-600">
                  <span>
                    {isEs ? 'Progreso:' : 'Progress:'} <strong>{activeCard.stamps_count}</strong> {isEs ? 'sellos acumulados' : 'stamps collected'}
                  </span>
                  <span className="text-amber-700 font-semibold">
                    {10 - (activeCard.stamps_count % 10)} {isEs ? 'sellos para la siguiente recompensa' : 'stamps to next tier'}
                  </span>
                </div>

                {/* 10 circles representation with 3D animation */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3 py-2">
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const stampNum = idx + 1;
                    const isCollected = (activeCard.stamps_count % 10) >= stampNum || activeCard.stamps_count >= 10;
                    return (
                      <motion.div
                        whileHover={{ scale: 1.08 }}
                        key={idx}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                          isCollected
                            ? 'bg-amber-500 border-amber-600 text-white shadow-sm scale-102 ring-2 ring-amber-300/40'
                            : 'bg-white border-stone-200 text-stone-400'
                        }`}
                      >
                        {isCollected ? (
                          <Award className="w-5 h-5 text-white animate-pulse" />
                        ) : (
                          <span className="text-xs font-bold font-mono">{stampNum}</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Tier Milestones Rules */}
              {activeProgram && (
                <div className="p-4 bg-white/90 rounded-2xl border border-amber-200/80 space-y-2">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                    {isEs ? 'Niveles de Recompensa Activos:' : 'Active Reward Tiers:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {activeProgram.reward_tiers.map((tier, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border ${
                          activeCard.stamps_count >= tier.threshold
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium'
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        <div className="font-bold text-[11px] text-amber-700">
                          {tier.threshold} {isEs ? 'sellos' : 'stamps'} {activeCard.stamps_count >= tier.threshold && '✓'}
                        </div>
                        <div className="mt-0.5 line-clamp-2">
                          {isEs ? tier.reward_es : tier.reward_en}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bonus Quests & Extra Stamps Section */}
              {activeProgram?.bonus_features && activeProgram.bonus_features.length > 0 && (
                <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-amber-50/90 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-200/70 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-2xs">
                        <Sparkles className="w-4 h-4 text-amber-100" />
                      </div>
                      <div>
                        <h4 className="font-['Outfit',sans-serif] text-sm sm:text-base font-bold text-stone-900 leading-tight">
                          {isEs ? 'Misiones & Sellos de Bonificación' : 'Bonus Quests & Extra Stamps'}
                        </h4>
                        <p className="text-[11px] text-amber-900/80">
                          {isEs ? 'Completa retos para acelerar tus recompensas' : 'Complete bonus actions to earn extra stamps faster'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                      {activeProgram.bonus_features.length} {isEs ? 'retos' : 'quests'}
                    </span>
                  </div>

                  {claimSuccessMessage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{claimSuccessMessage}</span>
                    </motion.div>
                  )}

                  <div className="space-y-3 pt-1">
                    {activeProgram.bonus_features.map((bonus) => {
                      const completed = activeCard.completed_bonuses?.find((cb) => cb.bonus_id === bonus.id);
                      const currentPhoto = photoPreview[bonus.id];

                      return (
                        <div
                          key={bonus.id}
                          className={`p-3.5 rounded-xl border transition-all ${
                            completed
                              ? 'bg-white/80 border-emerald-300 shadow-2xs'
                              : 'bg-white border-amber-200/90 shadow-2xs hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white font-mono">
                                  +{bonus.extra_stamps} {isEs ? 'sello extra' : 'extra stamp'}
                                </span>
                                {bonus.requires_photo_upload && (
                                  <span className="text-[10px] font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Camera className="w-3 h-3" />
                                    <span>{isEs ? 'Requiere foto' : 'Photo required'}</span>
                                  </span>
                                )}
                              </div>
                              <h5 className="font-bold text-stone-900 text-xs sm:text-sm">
                                {isEs ? bonus.title_es : bonus.title_en}
                              </h5>
                              <p className="text-xs text-stone-600 leading-relaxed">
                                {isEs ? bonus.description_es : bonus.description_en}
                              </p>
                              {bonus.requires_photo_upload && (
                                <p className="text-[11px] text-amber-800 font-medium italic">
                                  {isEs
                                    ? (bonus.photo_prompt_es || 'Sube una foto de tu topping, arte latte o asistencia para acreditar el sello.')
                                    : (bonus.photo_prompt_en || 'Upload a photo of your topping, latte art, or visit to get stamped.')}
                                </p>
                              )}
                            </div>

                            {/* Completed Status Badge */}
                            {completed && (
                              <div className="flex flex-col items-end shrink-0">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>{isEs ? '¡Completado!' : 'Completed!'}</span>
                                </span>
                                {completed.photo_url && (
                                  <img
                                    src={completed.photo_url}
                                    alt="Comprobante"
                                    className="w-10 h-10 object-cover rounded-lg border border-emerald-300 mt-1 shadow-2xs"
                                  />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Action area when NOT completed */}
                          {!completed && (
                            <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-2">
                              {bonus.requires_photo_upload && (
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-stone-50 hover:bg-stone-100 border border-dashed border-stone-300 rounded-xl text-xs font-medium text-stone-700 transition-colors">
                                    <Camera className="w-4 h-4 text-teal-700" />
                                    <span>
                                      {currentPhoto
                                        ? (isEs ? 'Cambiar foto seleccionada' : 'Change selected photo')
                                        : (isEs ? 'Tomar / Seleccionar foto de tu arte latte o topping' : 'Take / Upload photo')}
                                    </span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                          handlePhotoSelect(bonus.id, e.target.files[0]);
                                        }
                                      }}
                                    />
                                  </label>

                                  {currentPhoto && (
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={currentPhoto}
                                        alt="Preview"
                                        className="w-9 h-9 object-cover rounded-lg border border-amber-300 shadow-2xs"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleClaimBonus(bonus.id)}
                                        className="py-2 px-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        <span>{isEs ? 'Reclamar Sello Extra' : 'Claim Extra Stamp'}</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}

                              {!bonus.requires_photo_upload && (
                                <button
                                  type="button"
                                  onClick={() => handleClaimBonus(bonus.id)}
                                  className="w-full sm:w-auto py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <Award className="w-3.5 h-3.5 text-amber-200" />
                                  <span>{isEs ? 'Confirmar Asistencia & Reclamar Sello' : 'Confirm Attendance & Claim Stamp'}</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Vouchers earned */}
              {activeCard.available_vouchers.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-emerald-600" />
                    <span>{t.available_vouchers_title}</span>
                  </h4>
                  <div className="space-y-2">
                    {activeCard.available_vouchers.map((v) => (
                      <div
                        key={v.voucher_reference}
                        className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-3"
                      >
                        <div>
                          <span className="text-xs font-bold text-emerald-900 block">
                            {isEs ? v.title_es : v.title_en}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-700">
                            Ref: {v.voucher_reference} • Nivel {v.tier_threshold} {isEs ? 'sellos' : 'stamps'}
                          </span>
                        </div>
                        {v.status === 'available' ? (
                          <button
                            onClick={() => handleRedeemVoucher(v.voucher_reference)}
                            className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
                          >
                            {t.use_voucher}
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-stone-400">
                            {isEs ? 'Canjeado ✓' : 'Redeemed ✓'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Note */}
              <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span>{t.loyalty_separation_note}</span>
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}

      {/* PARTICIPATING BUSINESSES DIRECTORY (Matching the community section style requested by user) */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-4">
          <div>
            <h3 className="font-['Outfit',sans-serif] text-2xl font-extrabold text-stone-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-teal-700" />
              <span>{isEs ? 'Negocios Participantes con Recompensas' : 'Participating Loyalty Businesses'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {isEs
                ? 'Haz clic en cualquier negocio para conocer sus recompensas, unirte a su programa y visitar su minisitio oficial con QR único.'
                : 'Click any business to view reward tiers, enroll in their program, and visit their official mini-site with unique QR.'}
            </p>
          </div>
          <span className="text-xs font-bold text-stone-500 bg-stone-100 py-1 px-3 rounded-full self-start">
            {programs.length} {isEs ? 'programas activos' : 'active programs'}
          </span>
        </div>

        {/* Grid of participating businesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog) => {
            const isEnrolled = cards.some((c) => c.program_id === prog.id);
            const business = playaVidaStore.getBusinessById(prog.business_id);
            const imageUrl =
              business?.cover_url ||
              'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80';

            return (
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                key={prog.id}
                onClick={() => setSelectedProgramForModal(prog)}
                className="group bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-xl transition-all overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Image Cover */}
                <div className="relative h-40 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={prog.business_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

                  {/* Location & Ref Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-mono font-bold py-0.5 px-2.5 rounded-full border border-white/20">
                      {prog.program_reference}
                    </span>
                    <span className="bg-white/90 backdrop-blur-md text-stone-800 text-[10px] font-bold py-0.5 px-2 rounded-full">
                      {prog.location_code}
                    </span>
                  </div>

                  {/* Enrolled Badge */}
                  {isEnrolled && (
                    <div className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold py-1 px-2.5 rounded-full shadow-xs flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>{isEs ? 'Inscrito' : 'Enrolled'}</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] font-semibold text-amber-300 block truncate">
                      {prog.business_name}
                    </span>
                    <h4 className="font-bold text-base text-white truncate">
                      {isEs ? prog.name_es : prog.name_en}
                    </h4>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {isEs ? prog.description_es : prog.description_en}
                  </p>

                  {/* Tiers highlight */}
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                      <Gift className="w-3.5 h-3.5 text-amber-600" />
                      <span>{prog.reward_tiers.length} {isEs ? 'niveles de premios' : 'reward tiers'}</span>
                    </div>
                    <span className="text-[11px] text-amber-700 font-semibold">
                      {isEs ? `Desde ${prog.stamps_required_base} sellos` : `From ${prog.stamps_required_base} stamps`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-teal-700 group-hover:text-teal-800 flex items-center gap-1">
                      <span>{isEs ? 'Ver Detalles y Unirse' : 'View Details & Join'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>

                    {business && (
                      <span className="text-[11px] text-stone-400 font-medium">
                        {business.category}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Program Modal (Prompt: click to open modal about each and choose to join and visit their minisite with unique qr) */}
      <LoyaltyProgramModal
        program={selectedProgramForModal}
        isOpen={Boolean(selectedProgramForModal)}
        onClose={() => setSelectedProgramForModal(null)}
        language={language}
        currentUser={currentUser}
        isEnrolled={
          selectedProgramForModal
            ? cards.some((c) => c.program_id === selectedProgramForModal.id)
            : false
        }
        onEnroll={handleEnroll}
        onVisitBusinessMinisite={handleVisitBusinessById}
        onOpenQrModal={(ref, title) => {
          if (onOpenQrModal) {
            onOpenQrModal(ref, title);
          }
        }}
      />

      {/* Customer Dynamic QR modal */}
      {showCustomerQr && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-stone-200 space-y-4 shadow-2xl text-center"
          >
            <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
              {language === 'es' ? 'QR Oficial de Cliente' : 'Official Customer QR'}
            </h3>
            <p className="text-xs text-stone-500 leading-normal">
              {language === 'es'
                ? 'Presenta este código al personal del establecimiento para registrar tus sellos digitales.'
                : 'Present this QR code to the staff at checkout to collect your digital stamps.'}
            </p>

            {/* Live QR display box */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 inline-block mx-auto shadow-2xs">
              <div className="bg-white border border-stone-300 rounded-xl p-3.5 flex flex-col items-center justify-center space-y-2">
                <QRCodeSVG
                  value={`PLAYAVIDA:LOYALTY:${currentUser.public_reference}:${activeCard?.program_id || 'GENERAL'}`}
                  size={160}
                  level="M"
                  includeMargin
                />
                <span className="text-[11px] font-mono font-bold text-teal-800">
                  {currentUser.public_reference}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowCustomerQr(false)}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              {language === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
