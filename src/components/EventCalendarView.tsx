import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  Clock,
  Ticket,
  ExternalLink,
  Plus,
  Share2,
  Filter,
  CheckCircle2,
  Sparkles,
  Users,
  Building2,
  User,
  Layers,
} from 'lucide-react';
import { CommunityEvent, Language, LocationCode } from '../types';
import { playaVidaStore } from '../lib/storage';
import { AlphabeticalAreaSelect } from './AlphabeticalAreaSelect';

interface EventCalendarViewProps {
  events: CommunityEvent[];
  language: Language;
  currentLocation: LocationCode | 'ALL';
  onSelectEvent: (event: CommunityEvent) => void;
  onOpenShareModal: (event: CommunityEvent) => void;
  onOpenCreateEvent?: () => void;
}

export type CalendarGranularity = 'day' | 'week' | 'month';
export type EventOrganizerType = 'group' | 'business' | 'community';

export function getEventOrganizerType(ev: CommunityEvent): EventOrganizerType {
  if (ev.organizer_group_id || ev.community_group_id) return 'group';
  if (ev.organizer_business_id) return 'business';
  return 'community';
}

export const EventCalendarView: React.FC<EventCalendarViewProps> = ({
  events,
  language,
  currentLocation,
  onSelectEvent,
  onOpenShareModal,
  onOpenCreateEvent,
}) => {
  const isEs = language === 'es';

  // Granularity state: day | week | month
  const [calendarView, setCalendarView] = useState<CalendarGranularity>('month');

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHub, setFilterHub] = useState<LocationCode | 'ALL'>(currentLocation);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterPrice, setFilterPrice] = useState<'all' | 'free' | 'paid'>('all');
  const [filterType, setFilterType] = useState<'ALL' | EventOrganizerType>('ALL');

  // Active anchor date: defaults to September 20, 2026 or current date
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 8, 20));
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-20');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    events.forEach((ev) => {
      if (ev.category) set.add(ev.category);
    });
    return Array.from(set).sort();
  }, [events]);

  // Filter events based on criteria
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Location
      if (filterHub !== 'ALL' && ev.location_code !== filterHub) return false;

      // Category
      if (filterCategory !== 'ALL' && ev.category !== filterCategory) return false;

      // Price
      if (filterPrice === 'free' && ev.paid_status !== 'free') return false;
      if (filterPrice === 'paid' && ev.paid_status !== 'paid') return false;

      // Type filter (group / business / community)
      if (filterType !== 'ALL') {
        const evType = getEventOrganizerType(ev);
        if (evType !== filterType) return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle =
          ev.title_es.toLowerCase().includes(q) || ev.title_en.toLowerCase().includes(q);
        const matchVenue =
          ev.venue_name?.toLowerCase().includes(q) ||
          ev.event_location_label?.toLowerCase().includes(q) ||
          ev.street_address?.toLowerCase().includes(q);
        const matchCat = ev.category?.toLowerCase().includes(q);
        const matchOrg = ev.organizer_name?.toLowerCase().includes(q);
        if (!matchTitle && !matchVenue && !matchCat && !matchOrg) {
          return false;
        }
      }

      return true;
    });
  }, [events, filterHub, filterCategory, filterPrice, filterType, searchQuery]);

  // Group filtered events by date string (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map: Record<string, CommunityEvent[]> = {};
    filteredEvents.forEach((ev) => {
      const dStr = ev.start_at.slice(0, 10);
      if (!map[dStr]) map[dStr] = [];
      map[dStr].push(ev);
    });
    return map;
  }, [filteredEvents]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = isEs
    ? [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
      ]
    : [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ];

  const monthName = monthNames[month];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  const weekDayLabels = isEs
    ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Navigation handlers depending on view
  const handlePrev = () => {
    if (calendarView === 'month') {
      setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    } else if (calendarView === 'week') {
      setCurrentDate((d) => new Date(d.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else {
      // Day view
      const cur = new Date(selectedDate + 'T12:00:00');
      cur.setDate(cur.getDate() - 1);
      const newStr = cur.toISOString().slice(0, 10);
      setSelectedDate(newStr);
      setCurrentDate(cur);
    }
  };

  const handleNext = () => {
    if (calendarView === 'month') {
      setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    } else if (calendarView === 'week') {
      setCurrentDate((d) => new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else {
      // Day view
      const cur = new Date(selectedDate + 'T12:00:00');
      cur.setDate(cur.getDate() + 1);
      const newStr = cur.toISOString().slice(0, 10);
      setSelectedDate(newStr);
      setCurrentDate(cur);
    }
  };

  const goToToday = () => {
    const today = new Date(2026, 8, 20);
    setCurrentDate(today);
    setSelectedDate('2026-09-20');
  };

  // Week days calculation
  const weekDays = useMemo(() => {
    const anchor = new Date(currentDate);
    const dayOfWeek = anchor.getDay(); // 0 is Sunday
    const startOfWeek = new Date(anchor);
    startOfWeek.setDate(anchor.getDate() - dayOfWeek);

    const days: { dateStr: string; dayNum: number; weekLabel: string; isToday: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;
      days.push({
        dateStr,
        dayNum: d.getDate(),
        weekLabel: weekDayLabels[i],
        isToday: dateStr === '2026-09-20',
      });
    }
    return days;
  }, [currentDate, isEs]);

  // Selected date events
  const selectedDateEvents = useMemo(() => {
    return (eventsByDate[selectedDate] || []).sort(
      (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
    );
  }, [eventsByDate, selectedDate]);

  return (
    <div className="space-y-5">
      {/* Top Header Controls: Granularity (Day / Week / Month) & Navigation */}
      <div className="p-4 sm:p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* View Granularity Switcher */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-2xl border border-stone-200/80">
            <button
              type="button"
              onClick={() => setCalendarView('day')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                calendarView === 'day'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isEs ? 'Día' : 'Day'}
            </button>
            <button
              type="button"
              onClick={() => setCalendarView('week')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                calendarView === 'week'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isEs ? 'Semana' : 'Week'}
            </button>
            <button
              type="button"
              onClick={() => setCalendarView('month')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                calendarView === 'month'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isEs ? 'Mes' : 'Month'}
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToToday}
              className="py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {isEs ? 'Hoy' : 'Today'}
            </button>
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              title={isEs ? 'Anterior' : 'Previous'}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="font-['Outfit',sans-serif] text-sm sm:text-base font-bold text-stone-900 min-w-[130px] text-center">
              {calendarView === 'month' && `${monthName} ${year}`}
              {calendarView === 'week' &&
                `${weekDays[0]?.dayNum} ${monthNames[new Date(weekDays[0]?.dateStr + 'T12:00:00').getMonth()].substring(0, 3)} - ${weekDays[6]?.dayNum} ${monthNames[new Date(weekDays[6]?.dateStr + 'T12:00:00').getMonth()].substring(0, 3)} ${year}`}
              {calendarView === 'day' &&
                `${new Date(selectedDate + 'T12:00:00').getDate()} ${monthNames[new Date(selectedDate + 'T12:00:00').getMonth()]} ${year}`}
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              title={isEs ? 'Siguiente' : 'Next'}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legend of Coloured Dots */}
        <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-stone-100 text-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            {isEs ? 'Puntos de color:' : 'Color dots:'}
          </span>
          <div
            onClick={() => setFilterType(filterType === 'group' ? 'ALL' : 'group')}
            className={`flex items-center gap-1.5 cursor-pointer px-2 py-0.5 rounded-lg transition-colors ${
              filterType === 'group' ? 'bg-purple-100 ring-1 ring-purple-400' : 'hover:bg-stone-100'
            }`}
            title={isEs ? 'Filtrar eventos de colectivos' : 'Filter group events'}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0 shadow-xs" />
            <span className="font-semibold text-stone-800 text-[11px]">
              {isEs ? 'Colectivos / Grupos' : 'Group Events'}
            </span>
          </div>

          <div
            onClick={() => setFilterType(filterType === 'business' ? 'ALL' : 'business')}
            className={`flex items-center gap-1.5 cursor-pointer px-2 py-0.5 rounded-lg transition-colors ${
              filterType === 'business' ? 'bg-amber-100 ring-1 ring-amber-400' : 'hover:bg-stone-100'
            }`}
            title={isEs ? 'Filtrar eventos de comercios' : 'Filter business events'}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 shadow-xs" />
            <span className="font-semibold text-stone-800 text-[11px]">
              {isEs ? 'Negocios / Comercios' : 'Business Events'}
            </span>
          </div>

          <div
            onClick={() => setFilterType(filterType === 'community' ? 'ALL' : 'community')}
            className={`flex items-center gap-1.5 cursor-pointer px-2 py-0.5 rounded-lg transition-colors ${
              filterType === 'community' ? 'bg-emerald-100 ring-1 ring-emerald-400' : 'hover:bg-stone-100'
            }`}
            title={isEs ? 'Filtrar eventos personales comunitarios' : 'Filter personal community events'}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-xs" />
            <span className="font-semibold text-stone-800 text-[11px]">
              {isEs ? 'Comunitarios / Personales' : 'Community Events'}
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3 pt-1">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isEs
                  ? 'Buscar por evento, sede, colectivo o anfitrión...'
                  : 'Search by event, venue, collective, or host...'
              }
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 transition-all placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 font-semibold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Standardized Alphabetical Area Select */}
            <AlphabeticalAreaSelect
              value={filterHub}
              onChange={(val) => setFilterHub(val as LocationCode | 'ALL')}
              language={language}
              allowAll
              allOptionLabel={isEs ? 'Toda la Riviera Maya' : 'All Riviera Maya'}
            />

            {/* Category Select */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                {isEs ? 'Categoría' : 'Category'}
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 cursor-pointer"
              >
                <option value="ALL">{isEs ? 'Todas las Categorías' : 'All Categories'}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Entry Price Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                {isEs ? 'Entrada' : 'Entry Price'}
              </label>
              <select
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value as any)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 cursor-pointer"
              >
                <option value="all">{isEs ? 'Todos los Precios' : 'All Prices'}</option>
                <option value="free">{isEs ? 'Gratis / Entrada Libre' : 'Free Entry Only'}</option>
                <option value="paid">{isEs ? 'Con Boleto / Costo' : 'Ticketed / Paid'}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: MONTH VIEW */}
      {calendarView === 'month' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-6 space-y-4">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center border-b border-stone-100 pb-2">
              {weekDayLabels.map((lbl, idx) => (
                <span
                  key={idx}
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    idx === 0 || idx === 6 ? 'text-amber-700' : 'text-stone-400'
                  }`}
                >
                  {lbl}
                </span>
              ))}
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`blank-${i}`} className="min-h-[50px] sm:min-h-[62px] rounded-xl bg-transparent" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const isSelected = selectedDate === dateStr;
                const isToday = dateStr === '2026-09-20';
                const dayEvents = eventsByDate[dateStr] || [];
                const hasEvents = dayEvents.length > 0;

                // Group dots
                const hasGroup = dayEvents.some((ev) => getEventOrganizerType(ev) === 'group');
                const hasBiz = dayEvents.some((ev) => getEventOrganizerType(ev) === 'business');
                const hasCommunity = dayEvents.some((ev) => getEventOrganizerType(ev) === 'community');

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className={`min-h-[50px] sm:min-h-[62px] p-1 sm:p-1.5 rounded-2xl border transition-all text-left flex flex-col justify-between relative group cursor-pointer ${
                      isSelected
                        ? 'bg-teal-800 text-white border-teal-800 shadow-md ring-2 ring-teal-700/30'
                        : isToday
                        ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                        : hasEvents
                        ? 'bg-teal-50/40 text-stone-900 border-teal-200/70 hover:bg-teal-50'
                        : 'bg-stone-50/60 text-stone-700 border-stone-100 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold leading-none ${
                          isSelected
                            ? 'text-white'
                            : isToday
                            ? 'text-amber-800 underline'
                            : 'text-stone-800'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {hasEvents && (
                        <span
                          className={`text-[10px] font-bold rounded-full px-1 leading-tight ${
                            isSelected
                              ? 'bg-white text-teal-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Coloured dots representing group, business, and community events */}
                    <div className="flex items-center gap-1 pt-1">
                      {hasGroup && (
                        <span
                          className="w-2 h-2 rounded-full bg-purple-500 ring-1 ring-white shrink-0"
                          title={isEs ? 'Evento de Colectivo' : 'Group Event'}
                        />
                      )}
                      {hasBiz && (
                        <span
                          className="w-2 h-2 rounded-full bg-amber-500 ring-1 ring-white shrink-0"
                          title={isEs ? 'Evento de Negocio Local' : 'Business Event'}
                        />
                      )}
                      {hasCommunity && (
                        <span
                          className="w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white shrink-0"
                          title={isEs ? 'Evento Comunitario' : 'Community Event'}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details Panel */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h4 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900">
                  {selectedDate === '2026-09-20' && (
                    <span className="mr-1.5 py-0.5 px-2 bg-amber-100 text-amber-900 rounded-md text-[11px] font-bold">
                      {isEs ? 'HOY' : 'TODAY'}
                    </span>
                  )}
                  {selectedDate}
                </h4>
                <p className="text-xs text-stone-500">
                  {selectedDateEvents.length}{' '}
                  {isEs
                    ? selectedDateEvents.length === 1
                      ? 'evento programado'
                      : 'eventos programados'
                    : 'events scheduled'}
                </p>
              </div>

              {onOpenCreateEvent && (
                <button
                  type="button"
                  onClick={onOpenCreateEvent}
                  className="py-1.5 px-3 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isEs ? 'Publicar' : 'Publish'}</span>
                </button>
              )}
            </div>

            {/* List of events on selected date */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((ev) => {
                  const evType = getEventOrganizerType(ev);
                  const title = isEs ? ev.title_es : ev.title_en;
                  const timeStr = ev.start_at.slice(11, 16);

                  return (
                    <div
                      key={ev.id}
                      onClick={() => onSelectEvent(ev)}
                      className="p-3 bg-stone-50 hover:bg-teal-50/50 border border-stone-200 rounded-2xl transition-all cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={ev.image_url}
                          alt={title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            {evType === 'group' && (
                              <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                {isEs ? 'Colectivo' : 'Group'}
                              </span>
                            )}
                            {evType === 'business' && (
                              <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                {isEs ? 'Negocio' : 'Business'}
                              </span>
                            )}
                            {evType === 'community' && (
                              <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {isEs ? 'Comunidad' : 'Community'}
                              </span>
                            )}

                            <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1 ml-auto">
                              <Clock className="w-3 h-3 text-stone-400" />
                              {timeStr}
                            </span>
                          </div>

                          <h5 className="font-['Outfit',sans-serif] text-xs sm:text-sm font-bold text-stone-900 group-hover:text-teal-800 truncate">
                            {title}
                          </h5>

                          <p className="text-[11px] text-stone-500 truncate mt-0.5">
                            {ev.venue_name || ev.event_location_label} ({ev.location_code})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 text-[11px]">
                        <span
                          className={`font-bold ${
                            ev.paid_status === 'free' ? 'text-emerald-700' : 'text-amber-800'
                          }`}
                        >
                          {ev.paid_status === 'free'
                            ? isEs
                              ? 'Entrada Libre'
                              : 'Free Entry'
                            : ev.price_label || '$' + ev.cost_amount}
                        </span>

                        <span className="text-teal-800 font-bold text-[11px] flex items-center gap-1">
                          <span>{isEs ? 'Ver detalles' : 'View details'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-stone-400 space-y-2">
                  <CalendarIcon className="w-8 h-8 mx-auto text-stone-300" />
                  <p className="text-xs">
                    {isEs
                      ? 'No hay eventos en esta fecha con los filtros actuales.'
                      : 'No events scheduled on this date for selected filters.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: WEEK VIEW (7 Days Columns with event dots & first few chars of event label) */}
      {calendarView === 'week' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weekDays.map(({ dateStr, dayNum, weekLabel, isToday }) => {
              const dayEvs = eventsByDate[dateStr] || [];
              const isSelected = selectedDate === dateStr;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`rounded-2xl border p-3 flex flex-col justify-between min-h-[220px] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/60 border-teal-700 ring-2 ring-teal-700/20 shadow-xs'
                      : isToday
                      ? 'bg-amber-50/50 border-amber-300'
                      : 'bg-stone-50/50 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {/* Day Header */}
                  <div className="border-b border-stone-200/70 pb-2 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-stone-500 block">
                        {weekLabel}
                      </span>
                      <span
                        className={`text-base font-extrabold ${
                          isToday ? 'text-amber-800 underline' : 'text-stone-900'
                        }`}
                      >
                        {dayNum}
                      </span>
                    </div>

                    {dayEvs.length > 0 && (
                      <span className="py-0.5 px-2 bg-teal-100 text-teal-800 rounded-full text-[10px] font-bold">
                        {dayEvs.length}
                      </span>
                    )}
                  </div>

                  {/* Day Events: Coloured dot + Time + First few characters of label */}
                  <div className="space-y-1.5 py-2 flex-1 overflow-y-auto max-h-[160px]">
                    {dayEvs.length > 0 ? (
                      dayEvs.map((ev) => {
                        const evType = getEventOrganizerType(ev);
                        const title = isEs ? ev.title_es : ev.title_en;
                        // User requirement: "week view show first few characters of event label"
                        const shortLabel = title.length > 18 ? title.substring(0, 18) + '...' : title;
                        const timeStr = ev.start_at.slice(11, 16);

                        const dotColor =
                          evType === 'group'
                            ? 'bg-purple-500'
                            : evType === 'business'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500';

                        return (
                          <div
                            key={ev.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectEvent(ev);
                            }}
                            className="p-1.5 bg-white hover:bg-teal-50 rounded-xl border border-stone-200 text-left transition-colors shadow-2xs cursor-pointer group"
                            title={title}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
                              <span className="text-[10px] font-bold text-stone-500">{timeStr}</span>
                            </div>
                            <p className="text-[11px] font-bold text-stone-800 group-hover:text-teal-800 truncate mt-0.5">
                              {shortLabel}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-[10px] text-stone-400 italic block pt-2">
                        {isEs ? 'Sin eventos' : 'No events'}
                      </span>
                    )}
                  </div>

                  <div className="pt-1 text-[10px] text-stone-400 text-right">
                    {dateStr.slice(5)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: DAY VIEW (Time + Mini Thumbnail + Headline) */}
      {calendarView === 'day' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-700" />
                <h3 className="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-stone-900">
                  {selectedDate === '2026-09-20' && (
                    <span className="mr-2 py-0.5 px-2 bg-amber-100 text-amber-900 rounded-md text-xs font-bold">
                      {isEs ? 'HOY' : 'TODAY'}
                    </span>
                  )}
                  {selectedDate}
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {selectedDateEvents.length}{' '}
                {isEs
                  ? 'eventos programados con cronograma, miniaturas y accesos'
                  : 'events scheduled with timeline, thumbnails, and access'}
              </p>
            </div>

            {onOpenCreateEvent && (
              <button
                type="button"
                onClick={onOpenCreateEvent}
                className="py-2 px-4 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{isEs ? 'Publicar Evento en esta Fecha' : 'Publish Event for Date'}</span>
              </button>
            )}
          </div>

          {/* Chronological List of Events */}
          <div className="space-y-3">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((ev) => {
                const evType = getEventOrganizerType(ev);
                const title = isEs ? ev.title_es : ev.title_en;
                const timeStr = ev.start_at.slice(11, 16);
                const endTimeStr = ev.end_at ? ev.end_at.slice(11, 16) : null;

                const badgeBg =
                  evType === 'group'
                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                    : evType === 'business'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200';

                const dotColor =
                  evType === 'group'
                    ? 'bg-purple-500'
                    : evType === 'business'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500';

                const typeLabel =
                  evType === 'group'
                    ? isEs ? 'Evento de Colectivo' : 'Group Event'
                    : evType === 'business'
                    ? isEs ? 'Evento de Negocio' : 'Business Event'
                    : isEs ? 'Evento Comunitario' : 'Community Event';

                return (
                  <div
                    key={ev.id}
                    onClick={() => onSelectEvent(ev)}
                    className="p-4 bg-stone-50 hover:bg-teal-50/60 border border-stone-200 hover:border-teal-300 rounded-3xl transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-2xs"
                  >
                    {/* User requirement: "in day view there will be time, mini thumbnails and headline" */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                      {/* Time Block */}
                      <div className="p-2.5 bg-white border border-stone-200 rounded-2xl text-center min-w-[72px] shrink-0 shadow-xs">
                        <Clock className="w-3.5 h-3.5 text-teal-700 mx-auto mb-0.5" />
                        <span className="text-xs font-black text-stone-900 block leading-tight">
                          {timeStr}
                        </span>
                        {endTimeStr && (
                          <span className="text-[10px] text-stone-400 block leading-tight">
                            - {endTimeStr}
                          </span>
                        )}
                      </div>

                      {/* Mini Thumbnail */}
                      <img
                        src={ev.image_url}
                        alt={title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-stone-200 shadow-2xs group-hover:scale-105 transition-transform"
                      />

                      {/* Headline & Details */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[10px] font-bold border ${badgeBg}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                            {typeLabel}
                          </span>

                          <span className="text-[10px] font-semibold text-stone-500">
                            {ev.category}
                          </span>
                        </div>

                        {/* Headline */}
                        <h4 className="font-['Outfit',sans-serif] text-sm sm:text-base font-bold text-stone-900 group-hover:text-teal-800 leading-snug">
                          {title}
                        </h4>

                        <p className="text-xs text-stone-500 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>
                            {ev.venue_name || ev.event_location_label} • {ev.location_code}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Price & Action button */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200">
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                          ev.paid_status === 'free'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {ev.paid_status === 'free'
                          ? isEs
                            ? 'Entrada Libre'
                            : 'Free Entry'
                          : ev.price_label || `$${ev.cost_amount} MXN`}
                      </span>

                      <span className="mt-2 text-xs font-bold text-teal-800 flex items-center gap-1">
                        <span>{isEs ? 'Ver evento' : 'View event'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 text-stone-400 space-y-3 bg-stone-50 rounded-3xl border border-stone-200/70">
                <CalendarIcon className="w-10 h-10 mx-auto text-stone-300" />
                <p className="text-xs sm:text-sm font-medium">
                  {isEs
                    ? 'No hay eventos programados para este día con los filtros aplicados.'
                    : 'No events scheduled for this day under the current filters.'}
                </p>
                {onOpenCreateEvent && (
                  <button
                    type="button"
                    onClick={onOpenCreateEvent}
                    className="py-2 px-4 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isEs ? 'Sé el primero en publicar' : 'Be the first to publish'}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
