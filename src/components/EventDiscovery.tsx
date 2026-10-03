import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Ticket,
  Clock,
  ExternalLink,
  QrCode,
  Share2,
  Filter,
  CheckCircle,
  Building2,
  Users,
  ChevronRight,
  Sparkles,
  Heart,
  Plus,
  Compass,
  DollarSign,
  Sun,
  CalendarDays,
} from 'lucide-react';
import { motion } from 'motion/react';
import { CommunityEvent, Language, LocationCode, CommunityGroup } from '../types';
import { playaVidaStore } from '../lib/storage';
import { translations } from '../lib/i18n';
import { EventCalendarView } from './EventCalendarView';
import { ShareInviteModal } from './ShareInviteModal';

interface EventDiscoveryProps {
  currentLocation: LocationCode | 'ALL';
  language: Language;
  onOpenQrModal: (eventRef: string, title: string) => void;
  onSelectEvent: (event: CommunityEvent) => void;
  onOpenCreateEvent?: () => void;
  onSelectGroup?: (group: CommunityGroup) => void;
  viewMode?: 'list' | 'calendar';
  onViewModeChange?: (mode: 'list' | 'calendar') => void;
}

type TimeFilter = 'all' | 'today' | 'this_week';
type PriceFilter = 'all' | 'free' | 'paid';
type EventViewMode = 'list' | 'calendar';

export const EventDiscovery: React.FC<EventDiscoveryProps> = ({
  currentLocation,
  language,
  onOpenQrModal,
  onSelectEvent,
  onOpenCreateEvent,
  onSelectGroup,
  viewMode: controlledViewMode,
  onViewModeChange,
}) => {
  const t = translations[language];
  const isEs = language === 'es';

  const [internalViewMode, setInternalViewMode] = useState<EventViewMode>('list');
  const viewMode = controlledViewMode ?? internalViewMode;

  const handleSetViewMode = (mode: EventViewMode) => {
    setInternalViewMode(mode);
    onViewModeChange?.(mode);
  };
  const [shareTargetEvent, setShareTargetEvent] = useState<CommunityEvent | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('ALL');
  const [, setFavTick] = useState(0);

  const events = playaVidaStore.getEvents(currentLocation);
  const groups = playaVidaStore.getGroups(currentLocation);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfToday = startOfToday + 24 * 60 * 60 * 1000;
  const endOfWeek = startOfToday + 7 * 24 * 60 * 60 * 1000;

  const filteredEvents = events.filter((ev) => {
    const evDate = new Date(ev.start_at).getTime();

    // Time filter
    if (timeFilter === 'today') {
      // Allow events happening today or within 24 hours of now
      if (evDate < startOfToday || evDate > endOfToday) {
        return false;
      }
    } else if (timeFilter === 'this_week') {
      if (evDate < startOfToday || evDate > endOfWeek) {
        return false;
      }
    }

    // Price filter
    if (priceFilter === 'free' && ev.paid_status !== 'free') return false;
    if (priceFilter === 'paid' && ev.paid_status !== 'paid') return false;

    // Group filter
    if (selectedGroupId !== 'ALL') {
      if (ev.community_group_id !== selectedGroupId && ev.organizer_group_id !== selectedGroupId) {
        return false;
      }
    }

    return true;
  });

  // Open external street map in new tab
  const handleOpenStreetMap = (e: React.MouseEvent, ev: CommunityEvent) => {
    e.stopPropagation();
    if (ev.map_url) {
      window.open(ev.map_url, '_blank', 'noopener,noreferrer');
    } else {
      const query = encodeURIComponent(
        `${ev.street_address || ev.event_location_label}, ${ev.location_code}, Quintana Roo, Mexico`
      );
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Creation CTA */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-teal-700" />
            <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-stone-900">
              {t.events_headline}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {isEs
              ? 'Agenda costera: eventos de hoy, esta semana, costos, ubicaciones en mapas callejeros y encuentros por grupo.'
              : 'Coastal calendar: today’s events, this week, costs, hyper-linked street map locations, and group gatherings.'}
          </p>
        </div>

        {/* Controls: View Mode & Publish */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
          <div className="flex items-center gap-1 p-1 bg-white border border-stone-200 rounded-2xl shadow-2xs">
            <button
              type="button"
              onClick={() => handleSetViewMode('list')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{isEs ? 'Lista' : 'List'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetViewMode('calendar')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'calendar'
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isEs ? 'Calendario' : 'Calendar'}</span>
            </button>
          </div>

          {onOpenCreateEvent && (
            <button
              type="button"
              onClick={onOpenCreateEvent}
              className="py-2.5 px-4 bg-teal-800 hover:bg-teal-900 text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isEs ? '+ Publicar Evento' : '+ Publish Event'}</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* When in Calendar View, render the interactive calendar with search filters */}
      {viewMode === 'calendar' ? (
        <EventCalendarView
          events={events}
          language={language}
          currentLocation={currentLocation}
          onSelectEvent={onSelectEvent}
          onOpenShareModal={(ev) => setShareTargetEvent(ev)}
          onOpenCreateEvent={onOpenCreateEvent}
        />
      ) : (
        <>

      {/* Advanced Filter Bar: Time, Price, Group */}
      <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200/90 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Time Filter Chips */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-stone-200 shadow-2xs">
            <button
              onClick={() => setTimeFilter('all')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                timeFilter === 'all'
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>{isEs ? 'Todos los Eventos' : 'All Events'}</span>
              </span>
            </button>

            <button
              onClick={() => setTimeFilter('today')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                timeFilter === 'today'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span className="flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>{isEs ? 'Hoy' : "Today's Events"}</span>
              </span>
            </button>

            <button
              onClick={() => setTimeFilter('this_week')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                timeFilter === 'this_week'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{isEs ? 'Esta Semana' : 'This Week'}</span>
              </span>
            </button>
          </div>

          {/* Price Filter Chips */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-stone-200 shadow-2xs">
            <button
              onClick={() => setPriceFilter('all')}
              className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                priceFilter === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.filter_all}
            </button>
            <button
              onClick={() => setPriceFilter('free')}
              className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                priceFilter === 'free'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isEs ? 'Gratis' : 'Free'}
            </button>
            <button
              onClick={() => setPriceFilter('paid')}
              className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                priceFilter === 'paid'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isEs ? 'Con Boletos' : 'Ticketed'}
            </button>
          </div>
        </div>

        {/* Filter Per Group Dropdown */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-200/60 text-xs">
          <span className="font-semibold text-stone-600 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-teal-700" />
            <span>{isEs ? 'Eventos por Colectivo / Grupo:' : 'Forthcoming by Group:'}</span>
          </span>

          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="py-1 px-2.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
          >
            <option value="ALL">
              {isEs ? 'Todos los Colectivos & Organizadores' : 'All Groups & Organizers'}
            </option>
            {groups.map((grp) => (
              <option key={grp.id} value={grp.id}>
                {isEs ? grp.name_es : grp.name_en} ({grp.location_code})
              </option>
            ))}
          </select>

          {selectedGroupId !== 'ALL' && (
            <button
              onClick={() => setSelectedGroupId('ALL')}
              className="text-[11px] text-teal-800 hover:underline font-semibold"
            >
              {isEs ? 'Limpiar filtro de grupo' : 'Clear group filter'}
            </button>
          )}

          <span className="ml-auto text-[11px] text-stone-500 font-medium">
            {filteredEvents.length} {isEs ? 'eventos encontrados' : 'events found'}
          </span>
        </div>
      </div>

      {/* Events Grid with detailed street addresses, hyper-links, and costs */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => {
            const title = isEs ? ev.title_es : ev.title_en;
            const desc = isEs ? ev.description_es : ev.description_en;
            const startDate = new Date(ev.start_at);

            // Is event today?
            const isToday =
              startDate.getTime() >= startOfToday && startDate.getTime() <= endOfToday;

            // Resolve associated group if any
            const associatedGroupId = ev.organizer_group_id || ev.community_group_id;
            const associatedGroup = associatedGroupId
              ? playaVidaStore.getGroupById(associatedGroupId)
              : null;

            // Formatted cost
            const costFormatted =
              ev.cost_amount === 0 || ev.paid_status === 'free'
                ? isEs
                  ? 'Entrada Libre (Gratis)'
                  : 'Free Entry'
                : `$${ev.cost_amount ?? 250} ${ev.cost_currency || 'MXN'}`;

            return (
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                key={ev.id}
                onClick={() => onSelectEvent(ev)}
                className="group bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Event Image Banner */}
                  <div className="relative h-48 w-full bg-stone-900 overflow-hidden">
                    <img
                      src={ev.image_url}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />

                    {/* Reference Pill */}
                    <div className="absolute top-3.5 left-3.5 bg-stone-900/80 backdrop-blur-md py-1 px-3 rounded-full border border-white/20 text-[11px] font-mono font-bold text-white shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{ev.event_reference}</span>
                    </div>

                    {/* Top-right actions: Favorite Heart & QR */}
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playaVidaStore.toggleFavorite('event', ev.id);
                          setFavTick((prev) => prev + 1);
                        }}
                        title="Guardar evento"
                        className={`p-2 rounded-full backdrop-blur-md border shadow-md transition-all hover:scale-105 ${
                          playaVidaStore.isFavorite('event', ev.id)
                            ? 'bg-rose-50 border-rose-200 text-rose-600'
                            : 'bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 border-stone-200'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            playaVidaStore.isFavorite('event', ev.id)
                              ? 'fill-rose-500 text-rose-500'
                              : 'text-stone-700'
                          }`}
                        />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShareTargetEvent(ev);
                        }}
                        className="p-2 bg-white/90 hover:bg-white text-stone-800 hover:text-teal-700 rounded-full backdrop-blur-md border border-stone-200 shadow-md transition-all hover:scale-105"
                        title={isEs ? 'Invitar amigos / Compartir' : 'Invite friends / Share'}
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenQrModal(ev.event_reference, title);
                        }}
                        className="p-2 bg-white/90 hover:bg-white text-stone-800 hover:text-teal-700 rounded-full backdrop-blur-md border border-stone-200 shadow-md transition-all hover:scale-105"
                        title={t.event_qr_title}
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Badges: Today, Cost & Category */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isToday && (
                          <span className="py-1 px-2.5 rounded-full text-[11px] font-bold shadow-xs bg-amber-500 text-stone-950 flex items-center gap-1 animate-pulse">
                            <Sun className="w-3 h-3" />
                            <span>{isEs ? '¡Hoy!' : 'Today!'}</span>
                          </span>
                        )}

                        <span
                          className={`py-1 px-2.5 rounded-full text-[11px] font-bold shadow-xs backdrop-blur-md border ${
                            ev.paid_status === 'free'
                              ? 'bg-emerald-600/90 text-white border-emerald-400/30'
                              : 'bg-amber-600/90 text-white border-amber-400/30'
                          }`}
                        >
                          {costFormatted}
                        </span>
                      </div>

                      <span className="text-[11px] font-medium text-white/90 bg-black/40 backdrop-blur-md py-0.5 px-2.5 rounded-full border border-white/10">
                        {ev.category}
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-5 sm:p-6 space-y-3">
                    {/* Exact Date & Time */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-teal-800 font-bold">
                        <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
                        <span>
                          {startDate.toLocaleDateString(isEs ? 'es-MX' : 'en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          •{' '}
                          {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-stone-400">
                        {ev.location_code}
                      </span>
                    </div>

                    <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-teal-800 transition-colors">
                      {title}
                    </h3>

                    {/* Hyper-linkable Street Map Location with direct navigation */}
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-stone-700 font-medium min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span className="truncate">{ev.event_location_label}</span>
                        </div>

                        {/* Hyper-link button to open street map directly */}
                        <button
                          type="button"
                          onClick={(e) => handleOpenStreetMap(e, ev)}
                          className="text-[11px] font-bold text-teal-800 hover:text-teal-950 flex items-center gap-0.5 hover:underline shrink-0 p-1 rounded-md hover:bg-teal-50 transition-colors"
                          title={isEs ? 'Abrir en mapa callejero detallado' : 'Open in detailed street map'}
                        >
                          <span>{isEs ? 'Ver Mapa' : 'Map'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>

                      {ev.street_address && (
                        <p className="text-[11px] text-stone-500 truncate pl-5">
                          {ev.street_address}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{desc}</p>

                    {/* Associated Group / Organizer Badge */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                      {associatedGroup ? (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectGroup?.(associatedGroup);
                          }}
                          className="flex items-center gap-1.5 text-teal-800 hover:underline cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                          <span className="text-stone-400">{isEs ? 'Grupo:' : 'Group:'}</span>
                          <span className="font-bold truncate">
                            {isEs ? associatedGroup.name_es : associatedGroup.name_en}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-stone-500">
                          {ev.organizer_business_id ? (
                            <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          ) : (
                            <Users className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                          )}
                          <span className="text-stone-400">{isEs ? 'Por:' : 'By:'}</span>
                          <span className="font-semibold text-stone-800 truncate">
                            {ev.organizer_name}
                          </span>
                        </div>
                      )}

                      {/* Cost Tag on right */}
                      <span className="font-extrabold text-stone-900 bg-stone-100 py-0.5 px-2 rounded-md">
                        {costFormatted}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event CTA */}
                <div className="p-4 sm:px-6 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    {isEs ? 'Boletos & Minisitio Oficial' : 'Official Pass & RSVP'}
                  </span>

                  <div className="flex items-center gap-1 text-xs font-bold text-teal-800 group-hover:text-teal-950">
                    <span>{isEs ? 'Ver Detalles' : 'View Details'}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 px-6 text-center bg-stone-50 rounded-3xl border border-stone-200 space-y-3">
          <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
          <h4 className="text-base font-bold text-stone-800">
            {isEs ? 'No hay eventos con estos filtros' : 'No events match these filters'}
          </h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {isEs
              ? 'Prueba cambiando los filtros de fecha o precio, o sé el primero en organizar un evento para tu comunidad.'
              : 'Try changing the date or price filters, or be the first to host an event for your community.'}
          </p>
          {onOpenCreateEvent && (
            <button
              onClick={onOpenCreateEvent}
              className="mt-2 py-2 px-4 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-xl"
            >
              {isEs ? '+ Publicar un Nuevo Evento' : '+ Publish a New Event'}
            </button>
          )}
        </div>
      )}
      </>
      )}

      {/* Share & Invite Modal */}
      {shareTargetEvent && (
        <ShareInviteModal
          isOpen={!!shareTargetEvent}
          onClose={() => setShareTargetEvent(null)}
          language={language}
          entityType="event"
          title={isEs ? shareTargetEvent.title_es : shareTargetEvent.title_en}
          reference={shareTargetEvent.event_reference}
          description={isEs ? shareTargetEvent.description_es : shareTargetEvent.description_en}
          coverUrl={shareTargetEvent.image_url}
          locationLabel={shareTargetEvent.event_location_label || shareTargetEvent.location_code}
        />
      )}
    </div>
  );
};
