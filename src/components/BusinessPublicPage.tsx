import React, { useState } from 'react';
import {
  ArrowLeft,
  QrCode,
  Share2,
  AlertTriangle,
  PhoneCall,
  MapPin,
  Globe,
  Award,
  Sparkles,
  CheckCircle2,
  Calendar,
  Star,
  ExternalLink,
  MessageSquare,
  Lock,
  ChevronRight,
  Bell,
  Check,
} from 'lucide-react';
import {
  PublicBusinessProjection,
  Language,
  BusinessReview,
  BusinessOffer,
  NativeLoyaltyProgram,
  User,
} from '../types';
import { playaVidaStore } from '../lib/storage';
import { translations } from '../lib/i18n';
import { TrustBadge } from './TrustBadge';
import { FavoriteButton } from './FavoriteButton';
import { RESPONSIBILITY_DISCLOSURES } from '../lib/legalConfig';

interface BusinessPublicPageProps {
  business: PublicBusinessProjection;
  language: Language;
  onBack: () => void;
  onOpenContactModal: () => void;
  onOpenQrModal: () => void;
  onOpenReportModal: (entityType: 'business' | 'review' | 'image', ref: string, name: string) => void;
  onOpenAuth: () => void;
  currentUser: User | null;
  onGoToLoyalty: (programId: string) => void;
}

export const BusinessPublicPage: React.FC<BusinessPublicPageProps> = ({
  business,
  language,
  onBack,
  onOpenContactModal,
  onOpenQrModal,
  onOpenReportModal,
  onOpenAuth,
  currentUser,
  onGoToLoyalty,
}) => {
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isOptedIn, setIsOptedIn] = useState(() => {
    return currentUser ? playaVidaStore.isOptedInForPush(currentUser.id, business.business_reference) : false;
  });

  const handleTogglePushOptIn = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (isOptedIn) {
      playaVidaStore.removePushOptIn(currentUser.id, business.business_reference);
      setIsOptedIn(false);
    } else {
      playaVidaStore.recordPushOptIn(currentUser.id, {
        target_reference: business.business_reference,
        target_name: business.name,
        target_type: 'business',
        opted_in_at: new Date().toISOString(),
        receive_incentives: true,
      });
      setIsOptedIn(true);
    }
  };

  const reviews = playaVidaStore.getReviewsForBusiness(business.id);
  const offers = playaVidaStore.getOffers(business.id);
  const loyaltyPrograms = playaVidaStore
    .getLoyaltyPrograms()
    .filter((p) => p.business_id === business.id);

  const description = language === 'es' ? business.description_es : business.description_en;

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: `${business.name} | PlayaVida`,
          text: description,
          url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!newReviewText.trim()) return;

    playaVidaStore.submitReview({
      business_id: business.id,
      author_user_id: currentUser.id,
      author_name: currentUser.email.split('@')[0],
      rating: newRating,
      content: newReviewText.trim(),
      status: 'published',
    });

    setReviewSubmitted(true);
    setNewReviewText('');
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Top sticky back button bar */}
      <div className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-16 z-20 px-3 sm:px-4 py-2.5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Directorio</span>
          </button>

          <div className="flex items-center gap-2">
            <FavoriteButton
              targetType="business"
              targetId={business.id}
              currentUser={currentUser}
              onOpenAuth={onOpenAuth}
            />

            <button
              onClick={handleShare}
              className="flex items-center gap-1 py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? t.link_copied : t.share_page}</span>
            </button>

            <button
              onClick={onOpenQrModal}
              className="flex items-center gap-1 py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">QR</span>
            </button>

            <button
              onClick={() =>
                onOpenReportModal('business', business.business_reference, business.name)
              }
              className="flex items-center gap-1 py-1.5 px-2.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs transition-colors"
              title={t.report_issue}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.report_issue}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main hero & details - PWA refined container */}
      <div className="max-w-3xl mx-auto px-3 sm:px-5 pt-5 space-y-5">
        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
          {/* Cover Banner */}
          <div className="relative h-48 sm:h-60 w-full bg-stone-200">
            <img
              src={business.cover_url}
              alt={business.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

            {/* Reference */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-xs py-1 px-3 rounded-lg border border-stone-200 text-xs font-mono font-semibold text-stone-800 shadow-xs">
              {business.business_reference}
            </div>

            {/* Quick badges */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-2">
              {business.has_loyalty_program && (
                <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-xs">
                  <Award className="w-3.5 h-3.5" />
                  {t.badge_native_loyalty}
                </span>
              )}
            </div>
          </div>

          {/* Header Info */}
          <div className="p-5 sm:p-7 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-5">
              <div className="flex items-end gap-3.5">
                <img
                  src={business.logo_url}
                  alt={business.name}
                  className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover border-4 border-white shadow-lg bg-white shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 block">
                      {business.category}
                    </span>
                    <TrustBadge type="business_managed" language={language} size="sm" />
                  </div>
                  <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                    {business.name}
                  </h1>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{business.location_label}</span>
                  </div>
                </div>
              </div>

              {/* Actions: Primary Contact CTA & Push Opt-in */}
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  onClick={handleTogglePushOptIn}
                  className={`py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 border cursor-pointer ${
                    isOptedIn
                      ? 'bg-amber-50 text-amber-900 border-amber-400 shadow-2xs ring-2 ring-amber-400/20'
                      : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100 hover:border-stone-400'
                  }`}
                  title={language === 'es' ? 'Acepto recibir novedades y beneficios' : 'I agree to receive updates and incentives'}
                >
                  <span
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                      isOptedIn
                        ? 'bg-amber-500 border-amber-600 text-white'
                        : 'border-stone-400 bg-white'
                    }`}
                  >
                    {isOptedIn && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <div className="text-left leading-tight">
                    <span className="block text-xs font-bold">
                      {isOptedIn
                        ? (language === 'es' ? 'Recibiendo Novedades & Incentivos' : 'Updates & Incentives Enabled')
                        : (language === 'es' ? 'Recibir Novedades & Incentivos' : 'Receive Updates & Incentives')}
                    </span>
                    <span className="block text-[10px] text-stone-500 font-normal">
                      {isOptedIn
                        ? (language === 'es' ? '✓ Notificaciones activas' : '✓ Push notifications active')
                        : (language === 'es' ? 'Marcar casilla para aceptar avisos' : 'Check box to opt-in')}
                    </span>
                  </div>
                </button>

                <button
                  onClick={onOpenContactModal}
                  className={`w-full sm:w-auto py-3 px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2.5 shadow-xs ${
                    business.has_contact_enabled
                      ? 'bg-teal-700 hover:bg-teal-800 text-white'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  {business.has_contact_enabled ? (
                    <>
                      <PhoneCall className="w-4 h-4" />
                      <span>{t.open_contact_modal}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-stone-400" />
                      <span>{t.open_contact_modal}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-stone-100 pt-6 space-y-4">
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-3xl">
                {description}
              </p>

              {/* Services & Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    {t.services_offered}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {business.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="py-1 px-2.5 bg-white border border-stone-200 text-stone-800 text-xs font-medium rounded-lg"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    {t.languages_spoken}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {business.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="py-1 px-2.5 bg-white border border-stone-200 text-stone-800 text-xs font-medium rounded-lg flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3 text-stone-400" />
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery (Pro Entitlement feature) */}
        {business.gallery_urls && business.gallery_urls.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
              {t.gallery_title}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {business.gallery_urls.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative h-40 sm:h-48 rounded-xl overflow-hidden bg-stone-100 group border border-stone-200"
                >
                  <img
                    src={imgUrl}
                    alt={`${business.name} foto ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Native Loyalty Card module */}
        {loyaltyPrograms.length > 0 && (
          <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900">
                    {loyaltyPrograms[0].name_es}
                  </h2>
                  <p className="text-xs text-stone-600">
                    {language === 'es'
                      ? loyaltyPrograms[0].description_es
                      : loyaltyPrograms[0].description_en}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onGoToLoyalty(loyaltyPrograms[0].id)}
                className="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Ver Mi Tarjeta de Sellos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Tier previews */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {loyaltyPrograms[0].reward_tiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white rounded-xl border border-amber-200/60 shadow-2xs space-y-1"
                >
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                    Nivel {tier.threshold} sellos
                  </span>
                  <p className="text-xs font-medium text-stone-800">
                    {language === 'es' ? tier.reward_es : tier.reward_en}
                  </p>
                </div>
              ))}
            </div>

            {/* Loyalty promotional disclosure */}
            <p className="text-[11px] text-amber-900/80 italic pt-1">
              {language === 'es' ? RESPONSIBILITY_DISCLOSURES.loyalty_promotional.es : RESPONSIBILITY_DISCLOSURES.loyalty_promotional.en}
            </p>
          </div>
        )}

        {/* Active Offers */}
        {offers.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-700" />
              <h2 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
                Ofertas Especiales Activas
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {offers.map((off) => (
                <div
                  key={off.id}
                  className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="py-0.5 px-2 bg-teal-700 text-white text-[11px] font-bold rounded-md">
                      {off.discount_label}
                    </span>
                    <span className="text-[11px] font-mono text-stone-500">
                      {off.offer_reference}
                    </span>
                  </div>
                  <h3 className="font-semibold text-stone-900 text-sm">
                    {language === 'es' ? off.title_es : off.title_en}
                  </h3>
                  <p className="text-xs text-stone-600">
                    {language === 'es' ? off.description_es : off.description_en}
                  </p>
                  <p className="text-[11px] text-stone-400 italic">
                    {language === 'es' ? off.terms_es : off.terms_en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community Reviews Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
                Reseñas de la Comunidad
              </h2>
              <p className="text-xs text-stone-500">
                Opiniones auténticas e independientes de residentes y visitantes
              </p>
            </div>

            <button
              onClick={() => {
                if (!currentUser) {
                  onOpenAuth();
                } else {
                  setShowReviewForm(!showReviewForm);
                }
              }}
              className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Escribir Reseña</span>
            </button>
          </div>

          {/* Review form */}
          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 animate-in fade-in"
            >
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Tu Experiencia en {business.name}
              </h4>

              {/* Rating selection */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-600">Calificación:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newRating ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Comparte detalles útiles sobre el servicio, la comida o la atención..."
                rows={3}
                className="w-full p-3 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 text-stone-900"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-stone-400">
                  Las reseñas no otorgan puntos ni sellos de lealtad.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="py-1.5 px-3 text-xs text-stone-600 hover:text-stone-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-1.5 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium rounded-lg"
                  >
                    Publicar
                  </button>
                </div>
              </div>

              {reviewSubmitted && (
                <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium text-center">
                  ¡Reseña publicada con éxito!
                </div>
              )}
            </form>
          )}

          {/* Reviews list */}
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 font-semibold text-xs flex items-center justify-center">
                      {rev.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block leading-tight">
                        {rev.author_name}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        {rev.review_reference}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {rev.content}
                </p>

                {/* Business Owner Response (only if business has entitlement) */}
                {rev.business_response && (
                  <div className="mt-3 p-3.5 bg-white rounded-xl border-l-3 border-teal-700 border-stone-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Respuesta de {business.name}</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {rev.business_response.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
