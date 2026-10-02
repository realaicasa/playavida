import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Building2,
  Calendar,
  Users,
  Award,
  MapPin,
  Sparkles,
  ArrowRight,
  X,
  Compass,
  Tag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playaVidaStore } from '../lib/storage';
import {
  PublicBusinessProjection,
  CommunityEvent,
  CommunityGroup,
  NativeLoyaltyProgram,
  Language,
} from '../types';
import { LOCATIONS } from '../lib/constants';

interface WikiGlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectBusiness: (b: PublicBusinessProjection) => void;
  onSelectEvent: (e: CommunityEvent) => void;
  onSelectGroup: (g: CommunityGroup) => void;
  onSelectLoyalty: (progId: string) => void;
  onSelectLocation: (locCode: any) => void;
}

type SearchFilterTab = 'all' | 'businesses' | 'events' | 'groups' | 'loyalty' | 'locations';

export const WikiGlobalSearch: React.FC<WikiGlobalSearchProps> = ({
  isOpen,
  onClose,
  language,
  onSelectBusiness,
  onSelectEvent,
  onSelectGroup,
  onSelectLoyalty,
  onSelectLocation,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilterTab>('all');
  const isEs = language === 'es';

  // Global keyboard shortcut to close or open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Load all data sets
  const businesses = useMemo(() => playaVidaStore.getPublicBusinesses('ALL'), []);
  const events = useMemo(() => playaVidaStore.getEvents('ALL'), []);
  const groups = useMemo(() => playaVidaStore.getGroups('ALL'), []);
  const loyaltyPrograms = useMemo(() => playaVidaStore.getLoyaltyPrograms(), []);

  // Filtered results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    // 1. Businesses
    const matchedBusinesses = businesses.filter((b) => {
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        b.business_reference.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.description_es.toLowerCase().includes(q) ||
        b.description_en.toLowerCase().includes(q) ||
        b.services.some((s) => s.toLowerCase().includes(q)) ||
        b.location_label.toLowerCase().includes(q)
      );
    });

    // 2. Events
    const matchedEvents = events.filter((e) => {
      if (!q) return true;
      const venue = e.event_location_label || e.venue_name || '';
      return (
        e.title_es.toLowerCase().includes(q) ||
        e.title_en.toLowerCase().includes(q) ||
        e.event_reference.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.organizer_name.toLowerCase().includes(q) ||
        venue.toLowerCase().includes(q)
      );
    });

    // 3. Groups
    const matchedGroups = groups.filter((g: CommunityGroup) => {
      if (!q) return true;
      const tagsStr = (g.tags || []).join(' ');
      return (
        (g.name_es && g.name_es.toLowerCase().includes(q)) ||
        (g.name_en && g.name_en.toLowerCase().includes(q)) ||
        ((g.name as string) && (g.name as string).toLowerCase().includes(q)) ||
        g.group_reference.toLowerCase().includes(q) ||
        tagsStr.toLowerCase().includes(q) ||
        ((g.category as string) && (g.category as string).toLowerCase().includes(q)) ||
        (g.description_es && g.description_es.toLowerCase().includes(q)) ||
        (g.description_en && g.description_en.toLowerCase().includes(q))
      );
    });

    // 4. Loyalty Programs
    const matchedLoyalty = loyaltyPrograms.filter((p: NativeLoyaltyProgram) => {
      if (!q) return true;
      const tierRewards = (p.reward_tiers || []).map((t) => `${t.reward_es} ${t.reward_en}`).join(' ');
      return (
        p.business_name.toLowerCase().includes(q) ||
        p.program_reference.toLowerCase().includes(q) ||
        (p.name_es && p.name_es.toLowerCase().includes(q)) ||
        (p.name_en && p.name_en.toLowerCase().includes(q)) ||
        (p.reward_name_es && p.reward_name_es.toLowerCase().includes(q)) ||
        (p.reward_name_en && p.reward_name_en.toLowerCase().includes(q)) ||
        tierRewards.toLowerCase().includes(q)
      );
    });

    // 5. Locations
    const matchedLocations = LOCATIONS.filter((l) => {
      if (!q) return true;
      return (
        l.name_es.toLowerCase().includes(q) ||
        l.name_en.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        l.region.toLowerCase().includes(q)
      );
    });

    return {
      businesses: matchedBusinesses,
      events: matchedEvents,
      groups: matchedGroups,
      loyalty: matchedLoyalty,
      locations: matchedLocations,
      totalCount:
        matchedBusinesses.length +
        matchedEvents.length +
        matchedGroups.length +
        matchedLoyalty.length +
        matchedLocations.length,
    };
  }, [query, businesses, events, groups, loyaltyPrograms]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 overflow-y-auto bg-stone-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-8 sm:my-12 max-h-[88vh]"
        >
          {/* Search Header Input */}
          <div className="p-4 sm:p-6 border-b border-stone-100 bg-stone-50/50">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-teal-700 absolute left-4 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isEs
                    ? 'Búsqueda Wiki: busca negocios, eventos, grupos, tarjetas o zonas...'
                    : 'Wiki Search: find businesses, events, clubs, loyalty cards, or towns...'
                }
                className="w-full pl-12 pr-10 py-3.5 bg-white border border-stone-200 rounded-2xl text-sm sm:text-base font-medium text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 shadow-2xs"
              />
              {query ? (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="absolute right-3.5 p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto mt-3 pt-1 pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`py-1 px-3 rounded-full font-semibold transition-all ${
                  activeFilter === 'all'
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {isEs ? 'Todo' : 'All'} ({results.totalCount})
              </button>
              <button
                onClick={() => setActiveFilter('businesses')}
                className={`py-1 px-3 rounded-full font-semibold transition-all flex items-center gap-1 ${
                  activeFilter === 'businesses'
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>{isEs ? 'Negocios' : 'Businesses'} ({results.businesses.length})</span>
              </button>
              <button
                onClick={() => setActiveFilter('events')}
                className={`py-1 px-3 rounded-full font-semibold transition-all flex items-center gap-1 ${
                  activeFilter === 'events'
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>{isEs ? 'Eventos' : 'Events'} ({results.events.length})</span>
              </button>
              <button
                onClick={() => setActiveFilter('groups')}
                className={`py-1 px-3 rounded-full font-semibold transition-all flex items-center gap-1 ${
                  activeFilter === 'groups'
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>{isEs ? 'Grupos' : 'Clubs'} ({results.groups.length})</span>
              </button>
              <button
                onClick={() => setActiveFilter('loyalty')}
                className={`py-1 px-3 rounded-full font-semibold transition-all flex items-center gap-1 ${
                  activeFilter === 'loyalty'
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Award className="w-3 h-3" />
                <span>{isEs ? 'Lealtad' : 'Loyalty'} ({results.loyalty.length})</span>
              </button>
              <button
                onClick={() => setActiveFilter('locations')}
                className={`py-1 px-3 rounded-full font-semibold transition-all flex items-center gap-1 ${
                  activeFilter === 'locations'
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>{isEs ? 'Zonas' : 'Towns'} ({results.locations.length})</span>
              </button>
            </div>
          </div>

          {/* Results Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {results.totalCount === 0 ? (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <Compass className="w-10 h-10 mx-auto text-stone-300" />
                <p className="text-sm font-medium">
                  {isEs ? 'No se encontraron resultados para tu búsqueda.' : 'No entries found matching your search.'}
                </p>
                <p className="text-xs text-stone-500">
                  {isEs
                    ? 'Intenta buscar por nombre, categoría (ej. Yoga, Coworking, Cenotes) o código (BUS-PDC-101).'
                    : 'Try searching by name, category (e.g. Yoga, Coworking, Cenotes) or reference code.'}
                </p>
              </div>
            ) : null}

            {/* Businesses Section */}
            {(activeFilter === 'all' || activeFilter === 'businesses') && results.businesses.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider px-1">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-700" />
                    {isEs ? 'Negocios Verificados' : 'Verified Businesses'}
                  </span>
                  <span>{results.businesses.length}</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {results.businesses.slice(0, activeFilter === 'all' ? 4 : 20).map((biz) => (
                    <div
                      key={biz.id}
                      onClick={() => {
                        onSelectBusiness(biz);
                        onClose();
                      }}
                      className="p-3 bg-stone-50/80 hover:bg-teal-50/50 border border-stone-200 hover:border-teal-300 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={biz.cover_url}
                          alt={biz.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-sm group-hover:text-teal-800">
                              {biz.name}
                            </span>
                            <span className="font-mono text-[10px] font-bold py-0.5 px-1.5 bg-stone-200 text-stone-700 rounded-md">
                              {biz.business_reference}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 line-clamp-1">
                            {isEs ? biz.description_es : biz.description_en}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400">
                            <span className="text-teal-700 font-medium">{biz.category}</span>
                            <span>•</span>
                            <span>{biz.location_label}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events Section */}
            {(activeFilter === 'all' || activeFilter === 'events') && results.events.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider px-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-700" />
                    {isEs ? 'Eventos & Encuentros' : 'Events & Gatherings'}
                  </span>
                  <span>{results.events.length}</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {results.events.slice(0, activeFilter === 'all' ? 4 : 20).map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => {
                        onSelectEvent(ev);
                        onClose();
                      }}
                      className="p-3 bg-stone-50/80 hover:bg-teal-50/50 border border-stone-200 hover:border-teal-300 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={ev.image_url}
                          alt={ev.title_es}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-sm group-hover:text-teal-800">
                              {isEs ? ev.title_es : ev.title_en}
                            </span>
                            <span className="font-mono text-[10px] font-bold py-0.5 px-1.5 bg-stone-200 text-stone-700 rounded-md">
                              {ev.event_reference}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                            <span className="text-teal-700 font-semibold">{ev.category}</span>
                            <span>•</span>
                            <span>{ev.event_location_label || ev.venue_name || 'Riviera Maya'}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-medium">
                              {ev.paid_status === 'free' ? 'Gratis' : 'Con Costo'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Groups Section */}
            {(activeFilter === 'all' || activeFilter === 'groups') && results.groups.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider px-1">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-teal-700" />
                    {isEs ? 'Comunidades & Grupos' : 'Clubs & Communities'}
                  </span>
                  <span>{results.groups.length}</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {results.groups.slice(0, activeFilter === 'all' ? 3 : 20).map((grp: CommunityGroup) => {
                    const grpName = (isEs ? grp.name_es : grp.name_en) || grp.name || grp.name_es || '';
                    const grpDesc = (isEs ? grp.description_es : grp.description_en) || '';
                    const grpCover = grp.cover_url || grp.image_url;
                    const grpTag = grp.tags?.[0] || grp.category || (isEs ? 'Comunidad' : 'Community');
                    return (
                      <div
                        key={grp.id}
                        onClick={() => {
                          onSelectGroup(grp);
                          onClose();
                        }}
                        className="p-3 bg-stone-50/80 hover:bg-teal-50/50 border border-stone-200 hover:border-teal-300 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={grpCover}
                            alt={grpName}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 text-sm group-hover:text-teal-800">
                                {grpName}
                              </span>
                              <span className="font-mono text-[10px] font-bold py-0.5 px-1.5 bg-stone-200 text-stone-700 rounded-md">
                                {grp.group_reference}
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 line-clamp-1">
                              {grpDesc}
                            </p>
                            <span className="text-[11px] text-teal-700 font-medium">
                              {grp.member_count} {isEs ? 'miembros' : 'members'} • {grpTag}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Loyalty Programs Section */}
            {(activeFilter === 'all' || activeFilter === 'loyalty') && results.loyalty.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider px-1">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    {isEs ? 'Tarjetas de Lealtad Nativas' : 'Loyalty Stamp Programs'}
                  </span>
                  <span>{results.loyalty.length}</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {results.loyalty.slice(0, activeFilter === 'all' ? 3 : 20).map((prog: NativeLoyaltyProgram) => {
                    const rewardLabel = isEs
                      ? (prog.reward_tiers?.[0]?.reward_es || prog.reward_name_es || prog.name_es)
                      : (prog.reward_tiers?.[0]?.reward_en || prog.reward_name_en || prog.name_en);
                    const stampsNeeded = prog.reward_tiers?.[0]?.threshold || prog.stamps_required_base || prog.stamps_required || 10;
                    return (
                      <div
                        key={prog.id}
                        onClick={() => {
                          onSelectLoyalty(prog.id);
                          onClose();
                        }}
                        className="p-3 bg-stone-50/80 hover:bg-amber-50/50 border border-stone-200 hover:border-amber-300 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm border border-amber-200">
                            <Award className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 text-sm group-hover:text-amber-800">
                                {prog.business_name}
                              </span>
                              <span className="font-mono text-[10px] font-bold py-0.5 px-1.5 bg-stone-200 text-stone-700 rounded-md">
                                {prog.program_reference}
                              </span>
                            </div>
                            <p className="text-xs text-amber-900 font-medium">
                              {isEs ? 'Premio:' : 'Reward:'} {rewardLabel} ({stampsNeeded} {isEs ? 'sellos' : 'stamps'})
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Locations Section */}
            {(activeFilter === 'all' || activeFilter === 'locations') && results.locations.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider px-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-700" />
                    {isEs ? 'Zonas de la Riviera Maya' : 'Riviera Maya Locations'}
                  </span>
                  <span>{results.locations.length}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {results.locations.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => {
                        onSelectLocation(loc.code);
                        onClose();
                      }}
                      className="p-3 bg-stone-50 hover:bg-teal-50 border border-stone-200 hover:border-teal-400 rounded-2xl text-left transition-all group"
                    >
                      <div className="font-bold text-stone-900 text-xs sm:text-sm group-hover:text-teal-800">
                        {isEs ? loc.name_es : loc.name_en}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                        {loc.code} • {loc.region}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Helper */}
          <div className="p-3 px-6 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isEs ? 'Búsqueda instantánea en tiempo real' : 'Real-time universal database search'}</span>
            </span>
            <span className="text-[11px] font-mono text-stone-400 hidden sm:inline">
              ESC para cerrar
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
