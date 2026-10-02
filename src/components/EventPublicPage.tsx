import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Share2,
  Ticket,
  ExternalLink,
  Users,
  Building2,
  Heart,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Sparkles,
  ShieldCheck,
  Radio,
  ChevronRight,
  Award,
  Sparkle,
  Plus,
  X,
  Search,
  Check,
  Gift,
  Store,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { CommunityEvent, Language, User, PublicBusinessProjection, CommunityGroup, EventSponsor } from '../types';
import { playaVidaStore } from '../lib/storage';
import { translations } from '../lib/i18n';
import { TrustBadge } from './TrustBadge';
import { RESPONSIBILITY_DISCLOSURES } from '../lib/legalConfig';

interface EventPublicPageProps {
  event: CommunityEvent;
  language: Language;
  onBack: () => void;
  onOpenQrModal: () => void;
  onOpenReportModal: (entityType: 'event' | 'business' | 'review', ref: string, name: string) => void;
  onOpenAuth: () => void;
  currentUser: User | null;
  onViewBusiness: (business: PublicBusinessProjection) => void;
  onViewGroup?: (group: CommunityGroup) => void;
  onSelectEvent: (event: CommunityEvent) => void;
  onGoToLoyalty?: (programId: string) => void;
}

export const EventPublicPage: React.FC<EventPublicPageProps> = ({
  event,
  language,
  onBack,
  onOpenQrModal,
  onOpenReportModal,
  onOpenAuth,
  currentUser,
  onViewBusiness,
  onViewGroup,
  onSelectEvent,
  onGoToLoyalty,
}) => {
  const t = translations[language];
  const isEs = language === 'es';

  const [currentEvent, setCurrentEvent] = useState<CommunityEvent>(event);
  const [copied, setCopied] = useState(false);
  const [isRsvped, setIsRsvped] = useState(false);
  const [rsvpFeedback, setRsvpFeedback] = useState(false);

  // Add Sponsor Modal & State
  const [isAddSponsorModalOpen, setIsAddSponsorModalOpen] = useState(false);
  const [sponsorSearch, setSponsorSearch] = useState('');
  const [sponsorTypeTab, setSponsorTypeTab] = useState<'business' | 'group'>('business');
  const [selectedEntity, setSelectedEntity] = useState<PublicBusinessProjection | CommunityGroup | null>(null);
  const [sponsorTier, setSponsorTier] = useState<'featured' | 'co_host' | 'partner'>('featured');
  const [highlightOffer, setHighlightOffer] = useState('');
  const [addFeedback, setAddFeedback] = useState<string | null>(null);

  useEffect(() => {
    setCurrentEvent(event);
  }, [event]);

  // Determine if current user can add/manage sponsors
  const userBusinesses = useMemo(() => {
    if (!currentUser) return [];
    return playaVidaStore.getPublicBusinesses().filter((b) => b.created_by_user_id === currentUser.id);
  }, [currentUser]);

  const isBusinessAdmin = userBusinesses.length > 0 || currentUser?.role === 'admin';
  const isOrganizer = !!currentUser && (currentEvent.creator_user_id === currentUser.id || isBusinessAdmin);

  const allBusinesses = useMemo(() => playaVidaStore.getPublicBusinesses(), []);
  const allGroups = useMemo(() => playaVidaStore.getGroups(), []);

  const filteredBusinesses = useMemo(() => {
    if (!sponsorSearch.trim()) return allBusinesses.slice(0, 10);
    const q = sponsorSearch.toLowerCase().trim();
    return allBusinesses.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.category && b.category.toLowerCase().includes(q)) ||
        (b.location_label && b.location_label.toLowerCase().includes(q))
    );
  }, [allBusinesses, sponsorSearch]);

  const filteredGroups = useMemo(() => {
    if (!sponsorSearch.trim()) return allGroups.slice(0, 10);
    const q = sponsorSearch.toLowerCase().trim();
    return allGroups.filter(
      (g) =>
        g.name_es.toLowerCase().includes(q) ||
        g.name_en.toLowerCase().includes(q) ||
        (g.category && g.category.toLowerCase().includes(q))
    );
  }, [allGroups, sponsorSearch]);

  const handleSaveSponsor = () => {
    if (!selectedEntity) return;

    let newSponsor: EventSponsor;
    if (sponsorTypeTab === 'business') {
      const biz = selectedEntity as PublicBusinessProjection;
      newSponsor = {
        id: `sp_${Date.now()}_${biz.id}`,
        type: 'business',
        name: biz.name,
        business_id: biz.id,
        logo_url: biz.logo_url || biz.cover_image_url,
        tier: sponsorTier,
        highlight_offer: highlightOffer.trim() || ((biz.offers_count && biz.offers_count > 0) ? (isEs ? 'Oferta especial para asistentes' : 'Special offer for attendees') : undefined),
        loyalty_program_id: biz.has_loyalty_program ? `loy_${biz.id}` : undefined,
      };
    } else {
      const grp = selectedEntity as CommunityGroup;
      newSponsor = {
        id: `sp_${Date.now()}_${grp.id}`,
        type: 'group',
        name: isEs ? grp.name_es : grp.name_en,
        group_id: grp.id,
        logo_url: grp.cover_url || grp.cover_image_url,
        tier: sponsorTier,
        highlight_offer: highlightOffer.trim() || undefined,
      };
    }

    const updated = playaVidaStore.addEventSponsor(currentEvent.id, newSponsor);
    if (updated) {
      setCurrentEvent({ ...updated });
    }
    setAddFeedback(isEs ? '¡Patrocinador vinculado con éxito!' : 'Sponsor linked successfully!');
    setTimeout(() => {
      setAddFeedback(null);
      setIsAddSponsorModalOpen(false);
      setSelectedEntity(null);
      setHighlightOffer('');
      setSponsorSearch('');
    }, 1000);
  };

  const handleRemoveSponsor = (e: React.MouseEvent, sponsorId: string) => {
    e.stopPropagation();
    const updated = playaVidaStore.removeEventSponsor(currentEvent.id, sponsorId);
    if (updated) {
      setCurrentEvent({ ...updated });
    }
  };

  const [isOptedIn, setIsOptedIn] = useState<boolean>(() => {
    return currentUser ? playaVidaStore.isOptedInForPush(currentUser.id, currentEvent.event_reference) : false;
  });

  const handleTogglePushOptIn = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (isOptedIn) {
      playaVidaStore.removePushOptIn(currentUser.id, currentEvent.event_reference);
      setIsOptedIn(false);
    } else {
      playaVidaStore.recordPushOptIn(currentUser.id, {
        target_reference: currentEvent.event_reference,
        target_name: isEs ? currentEvent.title_es : currentEvent.title_en,
        target_type: 'event',
        opted_in_at: new Date().toISOString(),
        receive_incentives: true,
      });
      setIsOptedIn(true);
    }
  };

  // Organizer resolution: Check if linked to a business or group
  const organizerBusiness = currentEvent.organizer_business_id
    ? playaVidaStore.getBusinessById(currentEvent.organizer_business_id)
    : playaVidaStore.getPublicBusinesses().find((b: PublicBusinessProjection) => b.name.toLowerCase() === currentEvent.organizer_name.toLowerCase());

  const organizerGroup = currentEvent.organizer_group_id
    ? playaVidaStore.getGroupById(currentEvent.organizer_group_id)
    : playaVidaStore.getGroups().find((g) => g.name_es.toLowerCase() === currentEvent.organizer_name.toLowerCase() || g.name_en.toLowerCase() === currentEvent.organizer_name.toLowerCase());

  const organizerKey = organizerBusiness?.id || organizerGroup?.id || currentEvent.organizer_name;

  const [isFollowing, setIsFollowing] = useState<boolean>(() => {
    return currentUser ? playaVidaStore.isFollowingOrganizer(currentUser.id, organizerKey) : false;
  });

  const [followerCount, setFollowerCount] = useState<number>(() => {
    return playaVidaStore.getOrganizerFollowerCount(organizerKey, 156);
  });

  const title = isEs ? currentEvent.title_es : currentEvent.title_en;
  const description = isEs ? currentEvent.description_es : currentEvent.description_en;
  const startDate = new Date(currentEvent.start_at);
  const endDate = currentEvent.end_at ? new Date(currentEvent.end_at) : null;

  const eventUrl = `${window.location.origin}/?ref=${event.event_reference}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${title} | PlayaVida`,
          text: description,
          url: eventUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleFollow = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    const nextState = playaVidaStore.toggleFollowOrganizer(currentUser.id, organizerKey);
    setIsFollowing(nextState);
    setFollowerCount((prev) => (nextState ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleRsvp = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setIsRsvped((prev) => !prev);
    setRsvpFeedback(true);
    setTimeout(() => setRsvpFeedback(false), 2800);
  };

  const relatedEvents = playaVidaStore
    .getEvents()
    .filter((e) => e.id !== event.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Top sticky navigation bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-16 z-20 px-4 py-2.5"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-stone-500" />
            <span>{isEs ? 'Volver a Eventos' : 'Back to Events'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? (isEs ? 'Enlace Copiado' : 'Link Copied') : (isEs ? 'Compartir' : 'Share')}</span>
            </button>

            <button
              onClick={onOpenQrModal}
              className="flex items-center gap-1.5 py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors"
              title="Ver código QR único"
            >
              <QrCode className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">QR</span>
            </button>

            <button
              onClick={() => onOpenReportModal('event', event.event_reference, title)}
              className="flex items-center gap-1 py-1.5 px-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs transition-colors"
              title={t.report_issue}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* 3D Hero Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 bg-stone-900 aspect-16/9 sm:aspect-21/9 max-h-[420px]"
        >
          <img
            src={event.image_url}
            alt={title}
            className="w-full h-full object-cover object-center opacity-90 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/40 to-transparent" />

          {/* Floating Reference & Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="bg-stone-900/85 backdrop-blur-md text-white text-[11px] font-mono font-semibold py-1 px-3 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{event.event_reference}</span>
            </span>

            <span
              className={`py-1 px-3 rounded-full text-[11px] font-bold shadow-lg backdrop-blur-md border ${
                event.paid_status === 'free'
                  ? 'bg-emerald-600/90 text-white border-emerald-400/40'
                  : 'bg-amber-600/90 text-white border-amber-400/40'
              }`}
            >
              {event.paid_status === 'free' ? (isEs ? 'Entrada Libre' : 'Free Entry') : (isEs ? 'Evento con Boletos' : 'Ticketed Event')}
            </span>

            <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-medium py-1 px-3 rounded-full border border-white/20 hidden sm:inline-flex">
              {event.category}
            </span>
          </div>

          {/* Floating live QR miniature */}
          <div className="absolute top-4 right-4 hidden md:block">
            <button
              onClick={onOpenQrModal}
              className="group p-2 bg-white/90 hover:bg-white rounded-2xl shadow-xl border border-stone-200 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
            >
              <QRCodeSVG value={eventUrl} size={42} level="M" />
              <div className="text-left pr-1">
                <span className="text-[10px] font-bold text-stone-800 block leading-tight">
                  QR Oficial
                </span>
                <span className="text-[9px] text-teal-700 font-medium">Verificado</span>
              </div>
            </button>
          </div>

          {/* Hero Bottom Information */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-semibold tracking-wide uppercase">
              <Calendar className="w-4 h-4" />
              <span>
                {startDate.toLocaleDateString(isEs ? 'es-MX' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-white drop-shadow-md">
              {title}
            </h1>
          </div>
        </motion.div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Details & Schedule & Organizer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Metrics & Schedule Box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4"
            >
              <h2 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-700" />
                <span>{isEs ? 'Horario y Ubicación Oficial' : 'Official Schedule & Venue'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1">
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                    {isEs ? 'Fecha y Hora' : 'Date & Time'}
                  </span>
                  <p className="text-sm font-semibold text-stone-900">
                    {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                    {endDate && `– ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </p>
                  <span className="text-[11px] text-stone-500 block">
                    {isEs ? 'Zona horaria del Caribe (Sin horario de verano)' : 'Cancun Caribbean Timezone (EST)'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                      {isEs ? 'Recinto / Punto de Encuentro' : 'Venue / Meeting Point'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (event.map_url) {
                          window.open(event.map_url, '_blank', 'noopener,noreferrer');
                        } else {
                          const query = encodeURIComponent(
                            `${event.street_address || event.event_location_label}, ${event.location_code}, Quintana Roo, Mexico`
                          );
                          window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className="text-[11px] font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 hover:underline cursor-pointer bg-white px-2 py-0.5 rounded-md border border-amber-200 shadow-2xs"
                    >
                      <span>{isEs ? 'Ver en Mapa Callejero' : 'Open Street Map'}</span>
                      <ExternalLink className="w-3 h-3 text-teal-700" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{event.event_location_label}</span>
                  </p>
                  {event.street_address && (
                    <p className="text-xs text-stone-600 font-medium">
                      {event.street_address}
                    </p>
                  )}
                  <span className="text-[11px] text-stone-500 block">
                    {event.location_code === 'PDC'
                      ? 'Playa del Carmen, Quintana Roo'
                      : event.location_code === 'TUL'
                      ? 'Tulum, Quintana Roo'
                      : event.location_code === 'CUN'
                      ? 'Cancún, Quintana Roo'
                      : 'Puerto Morelos, Quintana Roo'}
                  </span>
                </div>
              </div>

              {/* Cost & Admission Banner */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    {isEs ? 'Costo de Entrada' : 'Admission Cost'}
                  </span>
                  <span className="text-sm font-extrabold text-stone-900">
                    {event.cost_amount === 0 || event.paid_status === 'free'
                      ? (isEs ? 'Entrada Libre (Gratis)' : 'Free Entry (No Cost)')
                      : `$${event.cost_amount ?? 250} ${event.cost_currency || 'MXN'}`}
                  </span>
                </div>

                {event.paid_status !== 'free' && (
                  <span className="py-1 px-2.5 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold">
                    {event.price_label || `${event.cost_amount} MXN`}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Description Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-4"
            >
              <h2 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
                {isEs ? 'Acerca de este evento' : 'About this event'}
              </h2>
              <div className="prose text-sm sm:text-base text-stone-700 leading-relaxed space-y-3">
                <p className="whitespace-pre-line">{description}</p>
              </div>

              {/* Badges / Highlights */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-2">
                <span className="py-1 px-3 bg-stone-100 text-stone-700 rounded-xl text-xs font-medium">
                  #{event.category.replace(/\s+/g, '')}
                </span>
                <span className="py-1 px-3 bg-stone-100 text-stone-700 rounded-xl text-xs font-medium">
                  #{event.location_code}
                </span>
                <TrustBadge type="organizer_managed" language={language} size="md" />
              </div>
            </motion.div>

            {/* 3D ORGANIZER CARD & FOLLOW MECHANISM (User requirement: VIEW AND follow the organiser) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white via-white to-teal-50/40 rounded-3xl p-6 sm:p-8 border-2 border-teal-200/80 shadow-md space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    {organizerBusiness ? <Building2 className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
                      {isEs ? 'Organizado por' : 'Organized by'}
                    </span>
                    <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
                      {event.organizer_name}
                    </h3>
                  </div>
                </div>

                {/* Follow Button */}
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={handleToggleFollow}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                    isFollowing
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isFollowing ? 'fill-rose-500 text-rose-500' : 'text-white'
                    }`}
                  />
                  <span>
                    {isFollowing
                      ? (isEs ? 'Siguiendo' : 'Following')
                      : (isEs ? 'Seguir Organizador' : 'Follow')}
                  </span>
                </motion.button>
              </div>

              <div className="flex items-center gap-4 text-xs text-stone-600 pt-1">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  <span>
                    <strong>{followerCount}</strong> {isEs ? 'seguidores en Riviera Maya' : 'followers'}
                  </span>
                </div>
                <span>•</span>
                <TrustBadge type="recently_confirmed" language={language} size="sm" />
              </div>

              {/* View Organiser Mini-Site Button */}
              <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <p className="text-xs text-stone-500">
                  {organizerBusiness
                    ? (isEs ? 'Visita el minisitio con menú, ofertas y código QR oficial.' : 'Visit full business mini-site with reviews and contact.')
                    : (isEs ? 'Conoce la comunidad, debates y próximos eventos de este grupo.' : 'Join the community discussion and upcoming events.')}
                </p>

                {organizerBusiness ? (
                  <button
                    onClick={() => onViewBusiness(organizerBusiness)}
                    className="py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0"
                  >
                    <span>{isEs ? 'Ver Minisitio del Negocio' : 'View Business Mini-site'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : organizerGroup && onViewGroup ? (
                  <button
                    onClick={() => onViewGroup(organizerGroup)}
                    className="py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0"
                  >
                    <span>{isEs ? 'Ver Minisitio del Grupo' : 'View Group Mini-site'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-stone-600 bg-stone-100 py-1.5 px-3 rounded-lg self-start">
                    {isEs ? 'Anfitrión Comunitario Independiente' : 'Independent Host'}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Event Sponsors & Co-Hosts Section - Clickable Banners at the bottom of event details */}
            {currentEvent.sponsors && currentEvent.sponsors.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                      <Award className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-['Outfit',sans-serif] text-base sm:text-lg font-bold text-stone-900 leading-tight">
                        {isEs ? 'Patrocinadores & Co-anfitriones' : 'Official Sponsors & Co-Hosts'}
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        {isEs ? 'Alianzas y beneficios especiales para asistentes (haz clic para ver detalles)' : 'Partnerships & special attendee benefits (click banner to explore)'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
                      {currentEvent.sponsors.length} {isEs ? 'patrocinadores' : 'sponsors'}
                    </span>
                    {(isBusinessAdmin || isOrganizer) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEntity(null);
                          setHighlightOffer('');
                          setSponsorSearch('');
                          setIsAddSponsorModalOpen(true);
                        }}
                        className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-amber-900 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-700" />
                        <span>{isEs ? 'Añadir Patrocinador' : 'Add Sponsor'}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {currentEvent.sponsors.map((sp) => {
                    const biz = sp.business_id ? playaVidaStore.getBusinessById(sp.business_id) : null;
                    const grp = sp.group_id ? playaVidaStore.getGroupById(sp.group_id) : null;
                    const loyaltyProg = sp.loyalty_program_id
                      ? playaVidaStore.getLoyaltyPrograms().find((p) => p.id === sp.loyalty_program_id || p.business_id === sp.business_id)
                      : biz?.has_loyalty_program
                      ? playaVidaStore.getLoyaltyPrograms().find((p) => p.business_id === biz.id)
                      : null;

                    const handleBannerClick = () => {
                      if (biz) {
                        onViewBusiness(biz);
                      } else if (grp && onViewGroup) {
                        onViewGroup(grp);
                      }
                    };

                    return (
                      <div
                        key={sp.id}
                        role="button"
                        tabIndex={0}
                        onClick={handleBannerClick}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleBannerClick();
                          }
                        }}
                        className="relative group bg-gradient-to-r from-stone-50 via-white to-amber-50/30 hover:to-amber-100/40 border border-stone-200/90 hover:border-amber-400/90 rounded-2xl p-4 transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5"
                      >
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                          {/* Sponsor Logo / Thumbnail */}
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-stone-200/90 shrink-0 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                            {sp.logo_url ? (
                              <img
                                src={sp.logo_url}
                                alt={sp.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-teal-800 text-white font-black text-sm">
                                {sp.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>

                          {/* Sponsor Details */}
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                sp.tier === 'co_host'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300/60'
                                  : sp.tier === 'featured'
                                  ? 'bg-teal-100 text-teal-900 border border-teal-300/60'
                                  : 'bg-stone-200 text-stone-800'
                              }`}>
                                {sp.tier === 'co_host'
                                  ? (isEs ? '★ Co-anfitrión Oficial' : '★ Official Co-host')
                                  : sp.tier === 'featured'
                                  ? (isEs ? 'Patrocinador Destacado' : 'Featured Sponsor')
                                  : (isEs ? 'Aliado Comercial' : 'Partner')}
                              </span>

                              {loyaltyProg && (
                                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Sparkle className="w-3 h-3 text-teal-600 fill-teal-500" />
                                  <span>{isEs ? 'Club de Lealtad' : 'Loyalty Club'}</span>
                                </span>
                              )}

                              {biz?.category && (
                                <span className="text-[10px] text-stone-500 font-medium">
                                  • {biz.category}
                                </span>
                              )}
                            </div>

                            <h4 className="font-['Outfit',sans-serif] font-bold text-stone-900 text-sm sm:text-base group-hover:text-teal-900 transition-colors flex items-center gap-1.5 truncate">
                              <span>{sp.name}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-teal-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h4>

                            {sp.highlight_offer && (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100/90 text-amber-900 text-xs font-semibold rounded-lg border border-amber-200/90 mt-0.5 shadow-2xs">
                                <Gift className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                <span className="line-clamp-1">{sp.highlight_offer}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Callouts & Admin Controls */}
                        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200/60 shrink-0">
                          {loyaltyProg && onGoToLoyalty && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onGoToLoyalty(loyaltyProg.id);
                              }}
                              className="py-2 px-3 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                              title={isEs ? 'Ver Tarjeta de Sellos' : 'View Stamp Card'}
                            >
                              <Award className="w-3.5 h-3.5 text-amber-300" />
                              <span className="hidden sm:inline">{isEs ? 'Sellos' : 'Stamps'}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBannerClick();
                            }}
                            className="py-2 px-3.5 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors group-hover:border-teal-600 group-hover:text-teal-900 cursor-pointer shadow-2xs"
                          >
                            <span>{biz ? (isEs ? 'Ver Negocio' : 'View Business') : (isEs ? 'Ver Grupo' : 'View Group')}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                          </button>

                          {(isBusinessAdmin || isOrganizer) && (
                            <button
                              type="button"
                              onClick={(e) => handleRemoveSponsor(e, sp.id)}
                              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                              title={isEs ? 'Desvincular Patrocinador' : 'Remove Sponsor'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (isBusinessAdmin || isOrganizer) ? (
              /* Invitation Banner for Admins/Organizers when no sponsors yet */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="bg-amber-50/50 rounded-3xl p-5 sm:p-6 border-2 border-dashed border-amber-200/90 text-center space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold mx-auto">
                  <Award className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900">
                    {isEs ? '¿Quieres sumar Patrocinadores o Co-anfitriones?' : 'Want to add Sponsors or Co-Hosts?'}
                  </h3>
                  <p className="text-xs text-stone-600 max-w-md mx-auto mt-1">
                    {isEs
                      ? 'Como organizador o administrador de negocio, puedes vincular patrocinadores de la comunidad. Sus banners se mostrarán aquí con enlaces a sus perfiles y promociones.'
                      : 'As an organizer or business admin, you can link sponsors from registered businesses and groups. Their banners will be featured here.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEntity(null);
                    setHighlightOffer('');
                    setSponsorSearch('');
                    setIsAddSponsorModalOpen(true);
                  }}
                  className="py-2.5 px-4 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isEs ? 'Añadir Patrocinador al Evento' : 'Add Sponsor to Event'}</span>
                </button>
              </motion.div>
            ) : null}
          </div>

          {/* Right Column: Ticket / RSVP Card & Unique Event QR */}
          <div className="space-y-6">
            {/* Ticket & RSVP Action Box with 3D Depth */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl p-6 border-2 border-stone-200/90 shadow-lg space-y-5 sticky top-24"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {isEs ? 'Admisión' : 'Admission'}
                </span>
                <span className="text-lg font-extrabold text-stone-900">
                  {event.price_label || (event.paid_status === 'free' ? (isEs ? 'Gratis' : 'Free') : '$250 MXN')}
                </span>
              </div>

              {/* Main Ticket Actions */}
              <div className="space-y-3">
                {event.ticket_url ? (
                  <div className="space-y-2">
                    <a
                      href={event.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all hover:shadow-teal-700/20 cursor-pointer"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>{isEs ? 'Boletaje Externo del Organizador' : 'External Organizer Ticketing'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <p className="text-[11px] text-stone-500 text-center leading-snug px-1">
                      {isEs ? RESPONSIBILITY_DISCLOSURES.external_link.es : RESPONSIBILITY_DISCLOSURES.external_link.en}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleRsvp}
                    className={`w-full py-3.5 px-4 font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all ${
                      isRsvped
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-teal-700 hover:bg-teal-800 text-white'
                    }`}
                  >
                    {isRsvped ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isEs ? '¡Asistencia Confirmada!' : 'RSVP Confirmed!'}</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="w-4 h-4" />
                        <span>{isEs ? 'Confirmar Asistencia (RSVP)' : 'RSVP for Event'}</span>
                      </>
                    )}
                  </button>
                )}

                {rsvpFeedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-semibold text-emerald-800"
                  >
                    {isEs
                      ? '✓ Tu pase digital ha sido guardado. Te esperamos en el evento.'
                      : '✓ Digital pass saved. See you there!'}
                  </motion.div>
                )}

                {/* Push Notification & Incentive Opt-In Checkbox */}
                <button
                  type="button"
                  onClick={handleTogglePushOptIn}
                  className={`w-full p-3 rounded-xl text-left text-xs transition-all flex items-start gap-2.5 border cursor-pointer ${
                    isOptedIn
                      ? 'bg-amber-50/90 text-amber-950 border-amber-300 shadow-2xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                  }`}
                >
                  <span
                    className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                      isOptedIn
                        ? 'bg-amber-500 border-amber-600 text-white'
                        : 'border-stone-400 bg-white'
                    }`}
                  >
                    {isOptedIn && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <div className="leading-snug">
                    <span className="font-bold block text-stone-900">
                      {isOptedIn
                        ? (isEs ? 'Recibiendo avisos & beneficios del evento' : 'Receiving event updates & incentives')
                        : (isEs ? 'Recibir avisos & beneficios del evento' : 'Receive event updates & incentives')}
                    </span>
                    <span className="text-[11px] text-stone-500 font-normal block mt-0.5">
                      {isEs
                        ? 'Acepto recibir notificaciones push con recordatorios, cambios de horario o promociones exclusivas.'
                        : 'I agree to receive push notifications for schedule alerts, reminders, and attendee perks.'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Interactive Unique Event QR Code Section */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/90 text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-stone-800">
                  <QrCode className="w-4 h-4 text-teal-700" />
                  <span>{isEs ? 'Pase & Código QR del Evento' : 'Event QR Pass'}</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-stone-200 inline-block shadow-xs">
                  <QRCodeSVG value={eventUrl} size={150} level="M" includeMargin />
                  <span className="text-[10px] font-mono text-teal-800 font-semibold block mt-1">
                    {event.event_reference}
                  </span>
                </div>

                <p className="text-[11px] text-stone-500 leading-tight">
                  {isEs
                    ? 'Muestra este QR en la entrada o compártelo con tus amigos para abrir este minisitio.'
                    : 'Show at check-in or share with friends to open this event mini-site.'}
                </p>

                <button
                  onClick={onOpenQrModal}
                  className="w-full py-2 px-3 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 transition-colors shadow-2xs"
                >
                  {isEs ? 'Ampliar / Descargar QR' : 'Enlarge / Download QR'}
                </button>
              </div>

              {/* Safety notice */}
              <div className="flex items-center gap-2 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>PlayaVida Verified Community Event Protocol</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Other Related Events */}
        {relatedEvents.length > 0 && (
          <div className="pt-10 border-t border-stone-200 space-y-5">
            <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
              {isEs ? 'Más eventos en la Riviera Maya' : 'More events in Riviera Maya'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => {
                    onSelectEvent(ev);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex gap-4 items-center"
                >
                  <img
                    src={ev.image_url}
                    alt={ev.title_es}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                      {new Date(ev.start_at).toLocaleDateString(isEs ? 'es-MX' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm truncate">
                      {isEs ? ev.title_es : ev.title_en}
                    </h4>
                    <p className="text-xs text-stone-500 truncate mt-0.5">
                      {ev.event_location_label}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Add Sponsor Modal for Business Admins and Organizers */}
        <AnimatePresence>
          {isAddSponsorModalOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF9F6]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                      <Award className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-['Outfit',sans-serif] font-bold text-stone-900 text-base">
                        {isEs ? 'Añadir Patrocinador al Evento' : 'Add Event Sponsor'}
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        {isEs
                          ? 'Selecciona un negocio o grupo registrado en la plataforma'
                          : 'Select an existing registered business or group'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddSponsorModalOpen(false);
                      setSelectedEntity(null);
                      setHighlightOffer('');
                      setSponsorSearch('');
                    }}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-4">
                  {/* Feedback toast */}
                  {addFeedback && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{addFeedback}</span>
                    </div>
                  )}

                  {/* Entity Type Tabs */}
                  <div className="flex items-center p-1 bg-stone-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setSponsorTypeTab('business');
                        setSelectedEntity(null);
                      }}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        sponsorTypeTab === 'business'
                          ? 'bg-white text-stone-900 shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 text-teal-700" />
                      <span>{isEs ? 'Negocios Registrados' : 'Registered Businesses'}</span>
                      <span className="text-[10px] bg-stone-200/80 px-1.5 py-0.2 rounded-full font-semibold">
                        {allBusinesses.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSponsorTypeTab('group');
                        setSelectedEntity(null);
                      }}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        sponsorTypeTab === 'group'
                          ? 'bg-white text-stone-900 shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-teal-700" />
                      <span>{isEs ? 'Grupos & Colectivos' : 'Groups & Collectives'}</span>
                      <span className="text-[10px] bg-stone-200/80 px-1.5 py-0.2 rounded-full font-semibold">
                        {allGroups.length}
                      </span>
                    </button>
                  </div>

                  {/* Search filter input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={sponsorSearch}
                      onChange={(e) => setSponsorSearch(e.target.value)}
                      placeholder={
                        sponsorTypeTab === 'business'
                          ? (isEs ? 'Buscar por nombre, categoría o zona...' : 'Search by name, category, or zone...')
                          : (isEs ? 'Buscar colectivo o grupo...' : 'Search group or collective...')
                      }
                      className="w-full pl-9 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                    />
                    {sponsorSearch && (
                      <button
                        type="button"
                        onClick={() => setSponsorSearch('')}
                        className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Candidate Selection List */}
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {sponsorTypeTab === 'business' ? (
                      filteredBusinesses.length > 0 ? (
                        filteredBusinesses.map((biz) => {
                          const isSelected = selectedEntity?.id === biz.id;
                          return (
                            <div
                              key={biz.id}
                              onClick={() => setSelectedEntity(biz)}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                isSelected
                                  ? 'bg-teal-50/80 border-teal-600 ring-2 ring-teal-600/20 shadow-2xs'
                                  : 'bg-stone-50/50 hover:bg-stone-100/70 border-stone-200'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0 shadow-2xs">
                                  {biz.logo_url || biz.cover_image_url ? (
                                    <img
                                      src={biz.logo_url || biz.cover_image_url}
                                      alt={biz.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-teal-800 text-white font-bold text-xs">
                                      {biz.name.slice(0, 2).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="font-bold text-stone-900 text-xs truncate">
                                      {biz.name}
                                    </h4>
                                    {biz.has_loyalty_program && (
                                      <span className="text-[9px] font-bold text-teal-800 bg-teal-100/80 px-1.5 py-0.2 rounded-md">
                                        ★ Lealtad
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-stone-500 truncate">
                                    {biz.category} • {biz.location_label || biz.location_code}
                                  </p>
                                </div>
                              </div>
                              <div className="shrink-0">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                    isSelected
                                      ? 'bg-teal-700 border-teal-700 text-white'
                                      : 'border-stone-300 bg-white'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3" />}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-stone-500 py-3 text-center">
                          {isEs ? 'No se encontraron negocios con ese término.' : 'No businesses found.'}
                        </p>
                      )
                    ) : filteredGroups.length > 0 ? (
                      filteredGroups.map((grp) => {
                        const isSelected = selectedEntity?.id === grp.id;
                        return (
                          <div
                            key={grp.id}
                            onClick={() => setSelectedEntity(grp)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-teal-50/80 border-teal-600 ring-2 ring-teal-600/20 shadow-2xs'
                                : 'bg-stone-50/50 hover:bg-stone-100/70 border-stone-200'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0 shadow-2xs">
                                {grp.cover_url || grp.cover_image_url ? (
                                  <img
                                    src={grp.cover_url || grp.cover_image_url}
                                    alt={grp.name_es}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-teal-800 text-white font-bold text-xs">
                                    {grp.name_es.slice(0, 2).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-stone-900 text-xs truncate">
                                  {isEs ? grp.name_es : grp.name_en}
                                </h4>
                                <p className="text-[11px] text-stone-500 truncate">
                                  {grp.category} • {grp.location_code}
                                </p>
                              </div>
                            </div>
                            <div className="shrink-0">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                  isSelected
                                    ? 'bg-teal-700 border-teal-700 text-white'
                                    : 'border-stone-300 bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-stone-500 py-3 text-center">
                        {isEs ? 'No se encontraron grupos con ese término.' : 'No groups found.'}
                      </p>
                    )}
                  </div>

                  {/* Selected Sponsor Configuration */}
                  {selectedEntity && (
                    <div className="space-y-3 pt-3 border-t border-stone-200">
                      {/* Tier selection */}
                      <div>
                        <label className="text-[11px] font-bold uppercase text-stone-600 block mb-1.5">
                          {isEs ? 'Nivel de Patrocinio / Alianza' : 'Sponsorship / Partnership Tier'}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setSponsorTier('featured')}
                            className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                              sponsorTier === 'featured'
                                ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold shadow-2xs'
                                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 font-medium'
                            }`}
                          >
                            <span className="text-xs block">
                              {isEs ? 'Destacado' : 'Featured'}
                            </span>
                            <span className="text-[10px] text-teal-700 block font-normal">
                              {isEs ? 'Patrocinador' : 'Sponsor'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSponsorTier('co_host')}
                            className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                              sponsorTier === 'co_host'
                                ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold shadow-2xs'
                                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 font-medium'
                            }`}
                          >
                            <span className="text-xs block">
                              {isEs ? 'Co-anfitrión' : 'Co-host'}
                            </span>
                            <span className="text-[10px] text-amber-700 block font-normal">
                              {isEs ? 'Oficial' : 'Official'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSponsorTier('partner')}
                            className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                              sponsorTier === 'partner'
                                ? 'bg-stone-200 border-stone-500 text-stone-900 font-bold shadow-2xs'
                                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 font-medium'
                            }`}
                          >
                            <span className="text-xs block">
                              {isEs ? 'Aliado' : 'Partner'}
                            </span>
                            <span className="text-[10px] text-stone-600 block font-normal">
                              {isEs ? 'Colaborador' : 'Ally'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Highlight offer / perk */}
                      <div>
                        <label className="text-[11px] font-bold uppercase text-stone-600 block mb-1">
                          {isEs ? 'Beneficio / Oferta para asistentes (Opcional)' : 'Attendee Offer / Perk (Optional)'}
                        </label>
                        <input
                          type="text"
                          value={highlightOffer}
                          onChange={(e) => setHighlightOffer(e.target.value)}
                          placeholder={
                            isEs
                              ? 'Ej. 15% de descuento en barra mostrando tu pase de evento'
                              : 'e.g. 15% discount on drinks with event pass'
                          }
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                        />
                      </div>

                      {/* Live Banner Preview */}
                      <div>
                        <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                          {isEs ? 'Vista Previa del Banner Clickeable' : 'Clickable Banner Preview'}
                        </span>
                        <div className="bg-gradient-to-r from-stone-50 via-white to-amber-50/40 border border-amber-300/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                              {(selectedEntity as any).logo_url || (selectedEntity as any).cover_image_url || (selectedEntity as any).cover_url ? (
                                <img
                                  src={(selectedEntity as any).logo_url || (selectedEntity as any).cover_image_url || (selectedEntity as any).cover_url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-teal-800 text-white font-bold text-xs">
                                  SP
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 inline-block">
                                {sponsorTier === 'co_host' ? '★ Co-anfitrión' : sponsorTier === 'featured' ? 'Patrocinador' : 'Aliado'}
                              </span>
                              <h5 className="font-bold text-stone-900 text-xs truncate">
                                {(selectedEntity as any).name || (isEs ? (selectedEntity as any).name_es : (selectedEntity as any).name_en)}
                              </h5>
                              {highlightOffer && (
                                <p className="text-[10px] text-amber-800 font-semibold truncate">
                                  🎁 {highlightOffer}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-teal-800 shrink-0">
                            {isEs ? 'Ver Perfil →' : 'View →'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-stone-100 bg-[#FAF9F6] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddSponsorModalOpen(false);
                      setSelectedEntity(null);
                      setHighlightOffer('');
                      setSponsorSearch('');
                    }}
                    className="py-2 px-4 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    {isEs ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    disabled={!selectedEntity}
                    onClick={handleSaveSponsor}
                    className="py-2 px-5 bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isEs ? 'Vincular Patrocinador' : 'Link Sponsor'}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
