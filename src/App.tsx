import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Calendar,
  Users,
  Award,
  Plus,
  Filter,
  Search,
  MapPin,
  Sparkles,
  Building2,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  LayoutGrid,
  Map,
  Heart,
  QrCode,
} from 'lucide-react';
import {
  Language,
  LocationCode,
  User,
  PublicBusinessProjection,
  BusinessCategory,
  CommunityEvent,
  CommunityGroup,
} from './types';
import { playaVidaStore } from './lib/storage';
import { LOCATIONS, DEMO_USERS } from './lib/constants';
import { translations, getCategoryLabel } from './lib/i18n';
import { Header } from './components/Header';
import { BottomNav, MainTab } from './components/BottomNav';
import { BusinessCard } from './components/BusinessCard';
import { BusinessPublicPage } from './components/BusinessPublicPage';
import { EventPublicPage } from './components/EventPublicPage';
import { GroupPublicPage } from './components/GroupPublicPage';
import { ContactModal } from './components/ContactModal';
import { BusinessDashboard } from './components/BusinessDashboard';
import { EventDiscovery } from './components/EventDiscovery';
import { CommunitySection } from './components/CommunitySection';
import { LoyaltyWallet } from './components/LoyaltyWallet';
import { UniversalReportModal } from './components/UniversalReportModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { QrModal } from './components/QrModal';
import { SponsorBanner } from './components/SponsorBanner';
import { SponsorModal } from './components/SponsorModal';
import { SponsorInfoModal } from './components/SponsorInfoModal';
import { CreateBusinessModal } from './components/CreateBusinessModal';
import { CreateGroupModal } from './components/CreateGroupModal';
import { CreateEventModal } from './components/CreateEventModal';
import { RivieraMayaMap } from './components/RivieraMayaMap';
import { QuickLookupModal } from './components/QuickLookupModal';
import { WikiGlobalSearch } from './components/WikiGlobalSearch';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { QRcasasModal } from './components/QRcasasModal';
import {
  PrivacyModal,
  TermsModal,
  InstallAppModal,
  DisclaimerModal,
  LegalModal,
} from './components/ComplianceModals';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('lang');
    return (stored as Language) || DEMO_USERS[0].selected_language || 'es';
  });
  const [currentLocation, setCurrentLocation] = useState<LocationCode | 'ALL'>('PDC');
  const [activeTab, setActiveTab] = useState<MainTab>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [discoverViewMode, setDiscoverViewMode] = useState<'grid' | 'map'>('grid');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showIntro, setShowIntro] = useState(() => {
    const val = localStorage.getItem('skipIntro');
    return val !== 'true' && val !== '1';
  });

  // Active user (starts with demo user Sofía for immediate rich testing)
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USERS[0]);

  // Navigation / View states
  const [selectedBusiness, setSelectedBusiness] = useState<PublicBusinessProjection | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(null);

  // Modals state
  const [contactBusiness, setContactBusiness] = useState<PublicBusinessProjection | null>(null);
  const [qrModalData, setQrModalData] = useState<{ ref: string; title: string } | null>(null);
  const [isQuickLookupOpen, setIsQuickLookupOpen] = useState(false);
  const [isWikiSearchOpen, setIsWikiSearchOpen] = useState(false);
  const [reportModalData, setReportModalData] = useState<{
    type: any;
    ref: string;
    name: string;
  } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isCreateBusinessOpen, setIsCreateBusinessOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [eventViewMode, setEventViewMode] = useState<'list' | 'calendar'>('list');
  const [loyaltyProgramId, setLoyaltyProgramId] = useState<string | null>(null);

  // Compliance & Footer Modals state
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showQRcasasModal, setShowQRcasasModal] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [showSponsorInfoModal, setShowSponsorInfoModal] = useState(false);

  // Cmd+K global shortcut for Wiki search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsWikiSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper to switch main tab and close open minisites
  const handleSwitchTab = (tab: MainTab) => {
    setSelectedBusiness(null);
    setSelectedEvent(null);
    setSelectedGroup(null);
    setActiveTab(tab);
  };

  // Sync user's saved language preference if active
  useEffect(() => {
    if (currentUser?.selected_language && currentUser.selected_language !== language) {
      setLanguage(currentUser.selected_language);
    }
  }, [currentUser]);

  const handleToggleLanguage = () => {
    const nextLang: Language = language === 'es' ? 'en' : 'es';
    setLanguage(nextLang);
    localStorage.setItem('lang', nextLang);
    if (currentUser) {
      playaVidaStore.updateUserLanguage(currentUser.id, nextLang);
    }
  };

  const t = translations[language];

  // Refresh trigger
  const [dataVersion, setDataVersion] = useState(0);
  const handleDataUpdated = () => setDataVersion((v) => v + 1);

  const handleNavigateToRef = (ref: string) => {
    const clean = ref.trim().toUpperCase();
    if (clean.startsWith('BUS-')) {
      const found = playaVidaStore.getBusinessByReference(clean);
      if (found) {
        setSelectedBusiness(found);
        setActiveTab('discover');
      }
    } else if (clean.startsWith('EVT-')) {
      const foundEvt = playaVidaStore.getEventByReference(clean);
      if (foundEvt) {
        setSelectedEvent(foundEvt);
        setActiveTab('events');
      }
    } else if (clean.startsWith('GRP-')) {
      const foundGrp = playaVidaStore.getGroupByReference(clean);
      if (foundGrp) {
        setSelectedGroup(foundGrp);
        setActiveTab('community');
      }
    } else if (clean.startsWith('LOY-')) {
      const foundLoy = playaVidaStore
        .getLoyaltyPrograms()
        .find((p) => p.program_reference.toUpperCase() === clean);
      if (foundLoy) {
        setLoyaltyProgramId(foundLoy.id);
        setActiveTab('loyalty');
      }
    }
  };

  // QR Routing: Read URL query param ?ref=... on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      handleNavigateToRef(ref);
    }
  }, []);

  // Public businesses with blocked entities excluded
  const businesses = useMemo(() => {
    const all = playaVidaStore.getPublicBusinesses(currentLocation);
    if (!currentUser) return all;
    const blockedRefs = playaVidaStore
      .getBlockedEntities(currentUser.id)
      .map((b) => b.target_reference);
    return all.filter((b) => !blockedRefs.includes(b.business_reference));
  }, [currentLocation, currentUser, dataVersion]);

  // Categories list
  const categories: string[] = [
    'ALL',
    'Gastronomía y Restaurantes',
    'Bienestar, Spas y Yoga',
    'Buceo y Deportes Acuáticos',
    'Boutiques y Diseño',
    'Vida Nocturna y Bares',
    'Coworking y Nómadas Digitales',
  ];

  // Filtered businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      // Favorites filter
      if (showFavoritesOnly && !playaVidaStore.isFavorite('business', b.id)) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL' && b.category !== selectedCategory) {
        return false;
      }
      // Search query (matches name, description, reference, services, location)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesRef = b.business_reference.toLowerCase().includes(q);
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesCat = b.category.toLowerCase().includes(q);
        const matchesDesc =
          b.description_es.toLowerCase().includes(q) ||
          b.description_en.toLowerCase().includes(q);
        const matchesServices = b.services.some((s) => s.toLowerCase().includes(q));
        const matchesLoc = b.location_label.toLowerCase().includes(q);

        return matchesRef || matchesName || matchesCat || matchesDesc || matchesServices || matchesLoc;
      }
      return true;
    });
  }, [businesses, selectedCategory, searchQuery, showFavoritesOnly, dataVersion]);

  const activeSponsors = playaVidaStore.getActiveSponsorBanners();

  // Find business managed by current user (if any)
  const userManagedBusiness = useMemo(() => {
    if (!currentUser) return null;
    return businesses.find((b) => b.created_by_user_id === currentUser.id) || null;
  }, [currentUser, businesses]);

  const handleGoHome = () => {
    setSelectedBusiness(null);
    setSelectedGroup(null);
    setSelectedEvent(null);
    setActiveTab('discover');
    setDiscoverViewMode('grid');
    setShowFavoritesOnly(false);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 flex flex-col font-['Inter',sans-serif]">
      {showIntro && (
        <LandingPage
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onEnter={() => {
            localStorage.setItem('skipIntro', 'true');
            setShowIntro(false);
          }}
          onOpenInstall={() => setShowInstallModal(true)}
        />
      )}
      {/* Top Global Header */}
      <Header
        currentLocation={currentLocation}
        onSelectLocation={setCurrentLocation}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onGoHome={handleGoHome}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenDashboard={() => {
          if (userManagedBusiness) {
            setIsDashboardOpen(true);
          } else {
            setIsCreateBusinessOpen(true);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenQuickLookup={() => setIsQuickLookupOpen(true)}
        onOpenMap={() => {
          setActiveTab('discover');
          setDiscoverViewMode('map');
          setShowFavoritesOnly(false);
        }}
        onOpenCalendar={() => {
          handleSwitchTab('events');
          setEventViewMode('calendar');
        }}
        onOpenWikiSearch={() => setIsWikiSearchOpen(true)}
        onOpenCreateBusiness={() => {
          if (currentUser) {
            setIsCreateBusinessOpen(true);
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        onOpenCreateGroup={() => {
          if (currentUser) {
            setIsCreateGroupOpen(true);
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        onOpenCreateEvent={() => {
          if (currentUser) {
            setIsCreateEventOpen(true);
          } else {
            setIsAuthModalOpen(true);
          }
        }}
      />

      {/* Main Body View */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-5 pb-24 md:pb-12">
        {/* If a business mini-website is selected, show it full-screen */}
        {selectedBusiness ? (
          <BusinessPublicPage
            business={selectedBusiness}
            language={language}
            onBack={() => setSelectedBusiness(null)}
            onOpenContactModal={() => setContactBusiness(selectedBusiness)}
            onOpenQrModal={() =>
              setQrModalData({
                ref: selectedBusiness.business_reference,
                title: selectedBusiness.name,
              })
            }
            onOpenReportModal={(type, ref, name) =>
              setReportModalData({ type, ref, name })
            }
            onOpenAuth={() => setIsAuthModalOpen(true)}
            currentUser={currentUser}
            onGoToLoyalty={(progId) => {
              setLoyaltyProgramId(progId);
              setSelectedBusiness(null);
              setActiveTab('loyalty');
            }}
          />
        ) : selectedEvent ? (
          <EventPublicPage
            event={selectedEvent}
            language={language}
            onBack={() => setSelectedEvent(null)}
            onOpenQrModal={() =>
              setQrModalData({
                ref: selectedEvent.event_reference,
                title: language === 'es' ? selectedEvent.title_es : selectedEvent.title_en,
              })
            }
            onOpenReportModal={(type, ref, name) =>
              setReportModalData({ type, ref, name })
            }
            onOpenAuth={() => setIsAuthModalOpen(true)}
            currentUser={currentUser}
            onViewBusiness={(biz) => {
              setSelectedEvent(null);
              setSelectedBusiness(biz);
            }}
            onViewGroup={(grp) => {
              setSelectedEvent(null);
              setSelectedGroup(grp);
            }}
            onSelectEvent={(ev) => setSelectedEvent(ev)}
            onGoToLoyalty={(progId) => {
              setLoyaltyProgramId(progId);
              setSelectedEvent(null);
              setActiveTab('loyalty');
            }}
          />
        ) : selectedGroup ? (
          <GroupPublicPage
            group={selectedGroup}
            language={language}
            onBack={() => setSelectedGroup(null)}
            onOpenQrModal={() =>
              setQrModalData({
                ref: selectedGroup.group_reference,
                title: language === 'es' ? selectedGroup.name_es : selectedGroup.name_en,
              })
            }
            onOpenReportModal={(type, ref, name) =>
              setReportModalData({ type, ref, name })
            }
            onOpenAuth={() => setIsAuthModalOpen(true)}
            currentUser={currentUser}
            onSelectEvent={(ev) => {
              setSelectedGroup(null);
              setSelectedEvent(ev);
            }}
          />
        ) : (
          <>
            {/* Desktop Navigation Tabs */}
            <div className="hidden md:flex items-center justify-between mb-8 border-b border-stone-200/80 pb-3">
              <div className="flex items-center gap-2">
                {[
                  { id: 'discover', label: t.tab_discover, icon: Compass },
                  { id: 'events', label: t.tab_events, icon: Calendar },
                  { id: 'community', label: t.tab_community, icon: Users },
                  { id: 'loyalty', label: t.tab_loyalty, icon: Award },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSel = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleSwitchTab(tab.id as MainTab)}
                      className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isSel
                          ? 'bg-teal-800 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action: Register / Manage business */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!currentUser) {
                      setIsAuthModalOpen(true);
                    } else {
                      setIsCreateBusinessOpen(true);
                    }
                  }}
                  className="py-2 px-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.publish_business_action}</span>
                </button>
              </div>
            </div>

            {/* TAB 1: DISCOVER / DIRECTORY */}
            {activeTab === 'discover' && (
              <div className="space-y-6">
                {/* Hero Coastal Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-900 via-teal-800 to-stone-900 text-white p-6 sm:p-10 shadow-sm">
                  <div className="max-w-2xl space-y-3 relative z-10">
                    <div className="inline-flex items-center gap-1.5 py-1 px-3 bg-teal-700/60 rounded-full border border-teal-500/30 text-teal-200 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{t.community_directory_badge}</span>
                    </div>
                    <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                      {t.hero_headline}
                    </h1>
                    <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
                      {t.hero_subtitle}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => {
                          setDiscoverViewMode('map');
                          setShowFavoritesOnly(false);
                        }}
                        className="py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <Map className="w-4 h-4 text-stone-950" />
                        <span>{t.open_coastal_map_cta}</span>
                      </button>

                      <button
                        onClick={() => setIsWikiSearchOpen(true)}
                        className="py-2.5 px-4 bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Search className="w-4 h-4 text-teal-200" />
                        <span>{t.wiki_global_search_cta}</span>
                        <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 bg-black/30 rounded text-teal-100">⌘K</kbd>
                      </button>
                    </div>
                  </div>
                  <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none hidden sm:block">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-300 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Sponsored banner (Phase 5 explicit labeled placement) */}
                {activeSponsors.length > 0 && (
                  <SponsorBanner banner={activeSponsors[0]} language={language} />
                )}

                {/* Controls Bar: Categories & View Mode (Grid vs Riviera Maya Map vs Favorites) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Categories Scroll / Bar */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
                    {categories.map((cat) => {
                      const isSel = selectedCategory === cat && !showFavoritesOnly;
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setShowFavoritesOnly(false);
                          }}
                          className={`py-1.5 px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                            isSel
                              ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          {getCategoryLabel(cat, language)}
                        </button>
                      );
                    })}
                  </div>

                  {/* View Mode & Favorites Toggle */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 bg-stone-100 p-1 rounded-2xl border border-stone-200/80">
                    <button
                      onClick={() => {
                        setDiscoverViewMode('grid');
                        setShowFavoritesOnly(false);
                      }}
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        discoverViewMode === 'grid' && !showFavoritesOnly
                          ? 'bg-white text-stone-900 shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                      title={t.view_grid}
                    >
                      <LayoutGrid className="w-3.5 h-3.5 text-teal-700" />
                      <span>{t.view_grid}</span>
                    </button>

                    <button
                      onClick={() => {
                        setDiscoverViewMode('map');
                        setShowFavoritesOnly(false);
                      }}
                      className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        discoverViewMode === 'map' && !showFavoritesOnly
                          ? 'bg-amber-400 text-stone-950 shadow-xs'
                          : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/70'
                      }`}
                      title={t.view_coastal_map}
                    >
                      <Map className={`w-3.5 h-3.5 ${discoverViewMode === 'map' ? 'text-stone-950' : 'text-teal-700'}`} />
                      <span>🗺️ {t.view_coastal_map}</span>
                    </button>

                    <button
                      onClick={() => {
                        handleSwitchTab('events');
                        setEventViewMode('calendar');
                      }}
                      className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-stone-700 hover:text-stone-950 hover:bg-stone-200/70"
                      title={language === 'es' ? 'Ver Calendario Costero' : 'View Coastal Calendar'}
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      <span>📅 {language === 'es' ? 'Calendario' : 'Calendar'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowFavoritesOnly(!showFavoritesOnly);
                        setDiscoverViewMode('grid');
                      }}
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        showFavoritesOnly
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                      title={t.view_favorites}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          showFavoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-stone-500'
                        }`}
                      />
                      <span>{t.view_favorites}</span>
                    </button>
                  </div>
                </div>

                {/* Riviera Maya Interactive Map Canvas when Map mode active */}
                {discoverViewMode === 'map' && !showFavoritesOnly && (
                  <RivieraMayaMap
                    currentLocation={currentLocation}
                    onSelectLocation={setCurrentLocation}
                    language={language}
                    onOpenBusiness={setSelectedBusiness}
                    onSelectEvent={(ev) => setSelectedEvent(ev)}
                    onSelectGroup={(grp) => setSelectedGroup(grp)}
                  />
                )}

                {/* Result stats */}
                <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                  <span>
                    {showFavoritesOnly ? (
                      <>
                        {t.showing_businesses} <strong>{filteredBusinesses.length}</strong> {t.showing_favorites_label}
                      </>
                    ) : (
                      <>
                        {t.showing_businesses} <strong>{filteredBusinesses.length}</strong> {t.local_businesses}
                        {currentLocation !== 'ALL' && ` ${t.in_location_label} ${currentLocation}`}
                      </>
                    )}
                  </span>
                  {(searchQuery || showFavoritesOnly || selectedCategory !== 'ALL') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setShowFavoritesOnly(false);
                        setSelectedCategory('ALL');
                      }}
                      className="text-teal-700 font-semibold hover:underline cursor-pointer"
                    >
                      {t.reset_filters}
                    </button>
                  )}
                </div>

                {/* Business Directory Grid */}
                {filteredBusinesses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBusinesses.map((biz) => (
                      <BusinessCard
                        key={biz.id}
                        business={biz}
                        language={language}
                        onOpenPublicPage={setSelectedBusiness}
                        onOpenContactModal={setContactBusiness}
                        onOpenQrModal={(b) =>
                          setQrModalData({
                            ref: b.business_reference,
                            title: b.name,
                          })
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center max-w-md mx-auto space-y-3">
                    <p className="text-sm font-semibold text-stone-700">
                      {t.no_search_results}
                    </p>
                    <p className="text-xs text-stone-500">
                      {t.try_another_term}
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('ALL');
                      }}
                      className="py-2 px-4 bg-teal-700 text-white text-xs font-semibold rounded-xl cursor-pointer hover:bg-teal-800 transition-colors"
                    >
                      {t.view_all_businesses}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: EVENTS (Phase 3) */}
            {activeTab === 'events' && (
              <EventDiscovery
                currentLocation={currentLocation}
                language={language}
                viewMode={eventViewMode}
                onViewModeChange={setEventViewMode}
                onOpenQrModal={(ref, title) => setQrModalData({ ref, title })}
                onSelectEvent={(ev) => setSelectedEvent(ev)}
                onOpenCreateEvent={() => {
                  if (currentUser) {
                    setIsCreateEventOpen(true);
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                onSelectGroup={(grp) => setSelectedGroup(grp)}
              />
            )}

            {/* TAB 3: COMMUNITY (Phase 4) */}
            {activeTab === 'community' && (
              <CommunitySection
                currentLocation={currentLocation}
                language={language}
                currentUser={currentUser}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onOpenGroupMinisite={(grp) => setSelectedGroup(grp)}
                onOpenQrModal={(ref, title) => setQrModalData({ ref, title })}
                onOpenCreateGroup={() => {
                  if (currentUser) {
                    setIsCreateGroupOpen(true);
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
              />
            )}

            {/* TAB 4: LOYALTY WALLET (Phase 6) */}
            {activeTab === 'loyalty' && (
              <LoyaltyWallet
                currentUser={currentUser}
                language={language}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                selectedProgramId={loyaltyProgramId}
                onVisitBusiness={(biz) => setSelectedBusiness(biz)}
                onOpenQrModal={(ref, title) => setQrModalData({ ref, title })}
              />
            )}

            {/* TAB 5: PROFILE / ACCOUNT (for mobile bottom nav) */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-teal-800 text-white flex items-center justify-center text-2xl font-bold">
                      {currentUser ? currentUser.email.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <h2 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
                        {currentUser ? currentUser.email : t.no_active_session}
                      </h2>
                      {currentUser && (
                        <span className="text-xs font-mono text-teal-700 font-semibold">
                          {currentUser.public_reference} • {t.role_label}: {currentUser.role}
                        </span>
                      )}
                    </div>
                  </div>

                  {currentUser ? (
                    <div className="space-y-3 pt-2">
                      <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="w-full py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl text-left flex items-center justify-between cursor-pointer"
                      >
                        <span>{t.account_preferences_button}</span>
                        <ChevronRight className="w-4 h-4 text-stone-400" />
                      </button>

                      {userManagedBusiness ? (
                        <button
                          onClick={() => setIsDashboardOpen(true)}
                          className="w-full py-3 px-4 bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-semibold rounded-xl text-left flex items-center justify-between border border-teal-200 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-teal-700" />
                            <span>{t.business_mgmt_panel}: {userManagedBusiness.name}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-teal-700" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsCreateBusinessOpen(true)}
                          className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl text-left flex items-center justify-between cursor-pointer"
                        >
                          <span>{t.publish_business_banner}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => setCurrentUser(null)}
                        className="w-full py-2.5 px-4 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                      >
                        {t.log_out_action}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      {t.sign_in_register}
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Global Footer */}
      {!selectedBusiness && !selectedEvent && !selectedGroup && (
        <Footer
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onOpenPrivacy={() => setShowPrivacyModal(true)}
          onOpenTerms={() => setShowTermsModal(true)}
          onOpenInstall={() => setShowInstallModal(true)}
          onOpenDisclaimer={() => setShowDisclaimerModal(true)}
          onOpenLegal={() => setShowLegalModal(true)}
          onOpenQRcasas={() => setShowQRcasasModal(true)}
          onSelectLocation={setCurrentLocation}
          currentUser={currentUser}
          onOpenCreateBusiness={() => setIsCreateBusinessOpen(true)}
          onOpenCreateGroup={() => setIsCreateGroupOpen(true)}
          onOpenCreateEvent={() => setIsCreateEventOpen(true)}
          onOpenSponsorInfo={() => setShowSponsorInfoModal(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* Mobile Bottom Navigation */}
      {!selectedBusiness && !selectedEvent && !selectedGroup && (
        <BottomNav
          activeTab={activeTab}
          onSelectTab={handleSwitchTab}
          language={language}
          hasBusinessAccount={!!userManagedBusiness}
        />
      )}

      {/* MODALS */}
      {/* 1. Protected Contact Modal */}
      {contactBusiness && (
        <ContactModal
          business={contactBusiness}
          isOpen={true}
          onClose={() => setContactBusiness(null)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenDashboard={() => {
            setContactBusiness(null);
            setIsDashboardOpen(true);
          }}
          currentUserId={currentUser?.id || null}
          language={language}
        />
      )}

      {/* 2. Business Dashboard Modal */}
      {isDashboardOpen && userManagedBusiness && currentUser && (
        <BusinessDashboard
          business={userManagedBusiness}
          currentUser={currentUser}
          language={language}
          onClose={() => setIsDashboardOpen(false)}
          onBusinessUpdated={handleDataUpdated}
        />
      )}

      {/* 3. Universal Report Modal */}
      {reportModalData && (
        <UniversalReportModal
          isOpen={true}
          onClose={() => setReportModalData(null)}
          targetType={reportModalData.type}
          targetReference={reportModalData.ref}
          targetName={reportModalData.name}
          currentUser={currentUser}
          language={language}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* 4. QR Code Modal */}
      {qrModalData && (
        <QrModal
          isOpen={true}
          onClose={() => setQrModalData(null)}
          reference={qrModalData.ref}
          title={qrModalData.title}
          language={language}
        />
      )}

      <SponsorModal
        isOpen={showSponsorModal}
        onClose={() => setShowSponsorModal(false)}
        language={language}
      />
      <SponsorInfoModal
        isOpen={showSponsorInfoModal}
        onClose={() => setShowSponsorInfoModal(false)}
        language={language}
        isLoggedIn={!!currentUser}
        onOpenAuth={() => {
          setShowSponsorInfoModal(false);
          setIsAuthModalOpen(true);
        }}
        onOpenDashboard={() => {
          setShowSponsorInfoModal(false);
          setIsDashboardOpen(true);
        }}
      />

      {/* Quick QR / Reference Lookup Modal */}
      <QuickLookupModal
        isOpen={isQuickLookupOpen}
        onClose={() => setIsQuickLookupOpen(false)}
        language={language}
        onNavigateToRef={handleNavigateToRef}
      />

      {/* 5. Auth / OTP Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(u) => {
          setCurrentUser(u);
          setIsAuthModalOpen(false);
        }}
        language={language}
      />

      {/* 6. User Profile & Creation Hub Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          setIsProfileModalOpen(false);
        }}
        language={language}
        onOpenCreateBusiness={() => {
          setIsProfileModalOpen(false);
          setIsCreateBusinessOpen(true);
        }}
        onOpenCreateGroup={() => {
          setIsProfileModalOpen(false);
          setIsCreateGroupOpen(true);
        }}
        onOpenCreateEvent={() => {
          setIsProfileModalOpen(false);
          setIsCreateEventOpen(true);
        }}
        onViewBusiness={(biz: PublicBusinessProjection) => {
          setIsProfileModalOpen(false);
          setSelectedBusiness(biz);
          setSelectedEvent(null);
          setSelectedGroup(null);
        }}
        onViewGroup={(grp: CommunityGroup) => {
          setIsProfileModalOpen(false);
          setSelectedGroup(grp);
          setSelectedBusiness(null);
          setSelectedEvent(null);
        }}
        onViewEvent={(ev: CommunityEvent) => {
          setIsProfileModalOpen(false);
          setSelectedEvent(ev);
          setSelectedBusiness(null);
          setSelectedGroup(null);
        }}
      />

      {/* 7. Create Business Modal */}
      <CreateBusinessModal
        isOpen={isCreateBusinessOpen}
        onClose={() => setIsCreateBusinessOpen(false)}
        currentUser={currentUser}
        language={language}
        onBusinessCreated={(bizId) => {
          handleDataUpdated();
          const newlyCreated = playaVidaStore.getPublicBusinessById(bizId);
          if (newlyCreated) {
            setSelectedBusiness(newlyCreated);
          }
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* 7b. Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        currentUser={currentUser}
        language={language}
        onGroupCreated={(createdGroup) => {
          handleDataUpdated();
          setSelectedGroup(createdGroup);
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* 7c. Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        currentUser={currentUser}
        language={language}
        onEventCreated={(createdEvent) => {
          handleDataUpdated();
          setSelectedEvent(createdEvent);
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* 8. Compliance & Legal Modals */}
      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        language={language}
      />
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        language={language}
      />
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        language={language}
      />
      <DisclaimerModal
        isOpen={showDisclaimerModal}
        onClose={() => setShowDisclaimerModal(false)}
        language={language}
      />
      <LegalModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        language={language}
      />
      <QRcasasModal
        isOpen={showQRcasasModal}
        onClose={() => setShowQRcasasModal(false)}
        language={language}
      />

      {/* 9. Wiki-style Global Directory & Knowledge Search */}
      <WikiGlobalSearch
        isOpen={isWikiSearchOpen}
        onClose={() => setIsWikiSearchOpen(false)}
        language={language}
        onSelectBusiness={(b) => {
          setSelectedBusiness(b);
          setActiveTab('discover');
          setIsWikiSearchOpen(false);
        }}
        onSelectEvent={(e) => {
          setSelectedEvent(e);
          setActiveTab('events');
          setIsWikiSearchOpen(false);
        }}
        onSelectGroup={(g) => {
          setSelectedGroup(g);
          setActiveTab('community');
          setIsWikiSearchOpen(false);
        }}
        onSelectLoyalty={(progId) => {
          setLoyaltyProgramId(progId);
          setActiveTab('loyalty');
          setIsWikiSearchOpen(false);
        }}
        onSelectLocation={(loc) => {
          setCurrentLocation(loc);
          setActiveTab('discover');
          setIsWikiSearchOpen(false);
        }}
      />
    </div>
  );
}
