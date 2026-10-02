import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  X,
  Ticket,
  ExternalLink,
  Sparkles,
  Users,
  Building2,
  DollarSign,
  Image as ImageIcon,
  Check,
  User as UserIcon,
  Upload,
  FileText,
  AlertCircle,
  Search,
  Award,
} from 'lucide-react';
import { Language, User, LocationCode, CommunityEvent, EventSponsor, PublicBusinessProjection, CommunityGroup } from '../types';
import { playaVidaStore } from '../lib/storage';
import { LOCATIONS } from '../lib/constants';
import { BilingualCreatableSelect, SelectOption } from './BilingualCreatableSelect';
import { AlphabeticalAreaSelect } from './AlphabeticalAreaSelect';
import { AlphabeticalInterestsSelect } from './AlphabeticalInterestsSelect';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  language: Language;
  onEventCreated: (event: CommunityEvent) => void;
  onOpenAuth: () => void;
}

const EVENT_PHOTO_PRESETS = [
  {
    label: 'Rooftop & Social',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Acoustic & Music',
    url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Yoga & Wellness',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Cenote & Adventure',
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Beach & Ecology',
    url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Tech & Coworking',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
  },
];

const EVENT_CATEGORIES_BILINGUAL: SelectOption[] = [
  { value: 'Coworking y Nómadas', label_es: 'Coworking y Nómadas', label_en: 'Coworking & Digital Nomads' },
  { value: 'Música y Comunidad', label_es: 'Música y Comunidad', label_en: 'Live Music & Community' },
  { value: 'Bienestar Holístico', label_es: 'Bienestar Holístico', label_en: 'Holistic Wellness & Yoga' },
  { value: 'Aventura y Deporte', label_es: 'Aventura y Deporte', label_en: 'Adventure & Outdoor Sports' },
  { value: 'Ecología y Voluntariado', label_es: 'Ecología y Voluntariado', label_en: 'Ecology & Beach Cleanup' },
  { value: 'Gastronomía y Catas', label_es: 'Gastronomía y Catas', label_en: 'Food, Drinks & Tastings' },
  { value: 'Arte y Talleres', label_es: 'Arte y Talleres', label_en: 'Art, Crafts & Workshops' },
  { value: 'Networking y Negocios', label_es: 'Networking y Negocios', label_en: 'Business Networking' },
];

const DRESS_CODES_BILINGUAL: SelectOption[] = [
  { value: 'Casual Playero', label_es: 'Casual Playero', label_en: 'Beach Casual' },
  { value: 'Casual Elegante', label_es: 'Casual Elegante', label_en: 'Smart Casual' },
  { value: 'Ropa Deportiva / Yoga', label_es: 'Ropa Deportiva / Yoga', label_en: 'Activewear / Yoga Attire' },
  { value: 'Traje de Baño', label_es: 'Traje de Baño', label_en: 'Swimwear' },
  { value: 'Blanco / Fiesta Temática', label_es: 'Blanco / Fiesta Temática', label_en: 'White / Themed Attire' },
  { value: 'Libre / Sin Código', label_es: 'Libre / Sin Código', label_en: 'Casual / No Dress Code' },
];

const AGE_POLICIES_BILINGUAL: SelectOption[] = [
  { value: 'Para Todas las Edades (Familiar)', label_es: 'Para Todas las Edades (Familiar)', label_en: 'All Ages (Family Friendly)' },
  { value: 'Solo Adultos (+18)', label_es: 'Solo Adultos (+18)', label_en: 'Adults Only (+18)' },
  { value: 'Estrictamente +21', label_es: 'Estrictamente +21', label_en: 'Strictly 21+' },
  { value: 'Adolescentes y Adultos (+14)', label_es: 'Adolescentes y Adultos (+14)', label_en: 'Teens & Adults (+14)' },
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  language,
  onEventCreated,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  const isEs = language === 'es';

  // If no user is logged in, show clear requirement prompt
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
            <Calendar className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
              {isEs ? 'Perfil Requerido para Publicar' : 'Personal Profile Required'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {isEs
                ? 'Para publicar un evento en el calendario costero, tu perfil personal de miembro queda vinculado como organizador responsable.'
                : 'To publish an event to the coastal calendar, your member profile is linked as the responsible organizer.'}
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="w-full py-2.5 px-4 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              {isEs ? 'Iniciar Sesión / Crear Perfil' : 'Sign In / Create Profile'}
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 px-4 text-stone-500 hover:text-stone-700 text-xs font-medium"
            >
              {isEs ? 'Cancelar' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userProfile = playaVidaStore.getProfile(currentUser.id);
  const userContent = playaVidaStore.getUserCreatedContent(currentUser.id);
  const adminGroups = playaVidaStore.getUserAdminGroups(currentUser.id);

  // Form State
  const [titleEs, setTitleEs] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState<string>('Coworking y Nómadas');
  const [dressCode, setDressCode] = useState<string>('Casual Playero');
  const [agePolicy, setAgePolicy] = useState<string>('Para Todas las Edades (Familiar)');
  const [capacity, setCapacity] = useState<string>('');
  const [locationCode, setLocationCode] = useState<LocationCode>('PDC');
  const [venueName, setVenueName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [startDate, setStartDate] = useState('2026-09-20');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('21:00');
  const [isPaid, setIsPaid] = useState(false);
  const [costAmount, setCostAmount] = useState<number>(150);
  const [priceLabel, setPriceLabel] = useState('$150 MXN');
  const [ticketUrl, setTicketUrl] = useState('');
  const [descriptionEs, setDescriptionEs] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [tags, setTags] = useState<string[]>(['Social', 'Playa']);
  const [imageUrl, setImageUrl] = useState(EVENT_PHOTO_PRESETS[0].url);
  const [selectedSponsors, setSelectedSponsors] = useState<EventSponsor[]>([]);
  const [sponsorSearch, setSponsorSearch] = useState('');
  const [organizerType, setOrganizerType] = useState<'profile' | 'business' | 'group'>('profile');
  const [selectedEntityId, setSelectedEntityId] = useState<string>(
    userContent.businesses[0]?.id || adminGroups[0]?.id || ''
  );

  const allBusinesses = useMemo(() => playaVidaStore.getPublicBusinesses(), []);
  const allGroups = useMemo(() => playaVidaStore.getGroups(), []);

  const filteredBusinesses = useMemo(() => {
    if (!sponsorSearch.trim()) return allBusinesses.slice(0, 6);
    const q = sponsorSearch.toLowerCase();
    return allBusinesses.filter(
      (b: PublicBusinessProjection) =>
        b.name.toLowerCase().includes(q) ||
        (b.category && b.category.toLowerCase().includes(q)) ||
        (b.location_label && b.location_label.toLowerCase().includes(q))
    );
  }, [allBusinesses, sponsorSearch]);

  const filteredGroups = useMemo(() => {
    if (!sponsorSearch.trim()) return allGroups.slice(0, 6);
    const q = sponsorSearch.toLowerCase();
    return allGroups.filter(
      (g: CommunityGroup) =>
        g.name_es.toLowerCase().includes(q) ||
        g.name_en.toLowerCase().includes(q) ||
        (g.category && g.category.toLowerCase().includes(q))
    );
  }, [allGroups, sponsorSearch]);

  const handleToggleBusinessSponsor = (biz: PublicBusinessProjection) => {
    setSelectedSponsors((prev) => {
      const exists = prev.some((s) => s.business_id === biz.id);
      if (exists) {
        return prev.filter((s) => s.business_id !== biz.id);
      }
      const sponsor: EventSponsor = {
        id: `sp_${Date.now()}_${biz.id}`,
        type: 'business',
        name: biz.name,
        business_id: biz.id,
        logo_url: biz.logo_url || biz.cover_image_url,
        tier: 'featured',
        highlight_offer: (biz.offers_count && biz.offers_count > 0) ? (isEs ? 'Oferta activa disponible' : 'Active special offer') : undefined,
        loyalty_program_id: biz.has_loyalty_program ? `loy_${biz.id}` : undefined,
      };
      return [...prev, sponsor];
    });
  };

  const handleToggleGroupSponsor = (grp: CommunityGroup) => {
    setSelectedSponsors((prev) => {
      const exists = prev.some((s) => s.group_id === grp.id);
      if (exists) {
        return prev.filter((s) => s.group_id !== grp.id);
      }
      const sponsor: EventSponsor = {
        id: `sp_${Date.now()}_${grp.id}`,
        type: 'group',
        name: isEs ? grp.name_es : grp.name_en,
        group_id: grp.id,
        logo_url: grp.cover_url || grp.cover_image_url,
        tier: 'co_host',
      };
      return [...prev, sponsor];
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const computedOrganizerName = () => {
    if (organizerType === 'business') {
      const b = userContent.businesses.find((biz) => biz.id === selectedEntityId) || userContent.businesses[0];
      if (b) return b.name;
    }
    if (organizerType === 'group') {
      const g = adminGroups.find((grp) => grp.id === selectedEntityId) || adminGroups[0];
      if (g) return isEs ? g.name_es : g.name_en;
    }
    return userProfile.display_name || 'Miembro PlayaVida';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEs.trim() && !titleEn.trim()) return;

    const locObj = LOCATIONS.find((l) => l.code === locationCode);
    const locName = locObj ? (isEs ? locObj.name_es : locObj.name_en) : 'Playa del Carmen';
    const finalVenue = venueName.trim() || `${locName} Centro`;
    const finalAddress = streetAddress.trim() || `${finalVenue}, ${locName}`;
    const finalTitleEs = titleEs.trim() || titleEn.trim();
    const finalTitleEn = titleEn.trim() || titleEs.trim();

    const startAt = `${startDate}T${startTime}:00-05:00`;
    const endAt = `${startDate}T${endTime}:00-05:00`;

    const mapSearchQuery = encodeURIComponent(`${finalVenue} ${finalAddress} Mexico`);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`;

    const effectiveBusinessId =
      organizerType === 'business'
        ? selectedEntityId || userContent.businesses[0]?.id
        : undefined;
    const effectiveGroupId =
      organizerType === 'group'
        ? selectedEntityId || adminGroups[0]?.id
        : undefined;

    const newEvent = playaVidaStore.createCommunityEvent(currentUser.id, {
      title_es: finalTitleEs,
      title_en: finalTitleEn,
      description_es: descriptionEs.trim() || `${finalTitleEs} en ${finalVenue}.`,
      description_en: descriptionEn.trim() || `${finalTitleEn} at ${finalVenue}.`,
      category,
      location_code: locationCode,
      event_location_label: finalVenue,
      venue_name: finalVenue,
      street_address: finalAddress,
      map_url: mapUrl,
      start_at: startAt,
      end_at: endAt,
      timezone: 'America/Cancun',
      image_url: imageUrl,
      paid_status: isPaid ? 'paid' : 'free',
      cost_amount: isPaid ? costAmount : 0,
      cost_currency: 'MXN',
      price_label: isPaid ? (priceLabel.trim() || `$${costAmount} MXN`) : (isEs ? 'Entrada Libre' : 'Free Entry'),
      ticket_url: isPaid ? ticketUrl.trim() : undefined,
      organizer_name: computedOrganizerName(),
      organizer_business_id: effectiveBusinessId,
      organizer_group_id: effectiveGroupId,
      capacity: capacity ? parseInt(capacity, 10) : undefined,
      dress_code: dressCode,
      age_policy: agePolicy,
      special_instructions: specialInstructions.trim() || undefined,
      tags: tags.length > 0 ? tags : ['Social'],
      sponsors: selectedSponsors.length > 0 ? selectedSponsors : undefined,
      status: 'published',
    });

    onEventCreated(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-sm">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Outfit',sans-serif] font-bold text-stone-900 text-base">
                {isEs ? 'Publicar Evento Comunitario' : 'Publish Community Event'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isEs
                  ? 'Aparecerá en el calendario, explorador de mapa y minisitios con mapa detallado.'
                  : 'Will appear on the calendar, map explorer, and pass mini-site with street map.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Organizer Attribution & Multi-Entity Selector */}
          <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {organizerType === 'business' ? (
                    <Building2 className="w-4 h-4" />
                  ) : organizerType === 'group' ? (
                    <Users className="w-4 h-4" />
                  ) : (
                    <UserIcon className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-teal-800 block">
                    {isEs ? 'Organizador Responsable' : 'Hosting Organizer'}
                  </span>
                  <p className="text-xs font-bold text-stone-900 truncate">
                    {computedOrganizerName()}
                  </p>
                </div>
              </div>

              {/* Entity Type Pills */}
              {(userContent.businesses.length > 0 || adminGroups.length > 0) && (
                <div className="flex items-center gap-1.5 p-1 bg-white/80 rounded-xl border border-teal-200 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setOrganizerType('profile');
                      setSelectedEntityId('');
                    }}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      organizerType === 'profile'
                        ? 'bg-teal-800 text-white shadow-2xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {isEs ? 'Personal' : 'Personal'}
                  </button>

                  {userContent.businesses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setOrganizerType('business');
                        if (!selectedEntityId || !userContent.businesses.some((b) => b.id === selectedEntityId)) {
                          setSelectedEntityId(userContent.businesses[0].id);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                        organizerType === 'business'
                          ? 'bg-teal-800 text-white shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      {isEs ? 'Negocio' : 'Business'}
                    </button>
                  )}

                  {adminGroups.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setOrganizerType('group');
                        if (!selectedEntityId || !adminGroups.some((g) => g.id === selectedEntityId)) {
                          setSelectedEntityId(adminGroups[0].id);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                        organizerType === 'group'
                          ? 'bg-teal-800 text-white shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      {isEs ? 'Colectivo' : 'Group'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sub-selector if user owns multiple businesses */}
            {organizerType === 'business' && userContent.businesses.length > 1 && (
              <div className="pt-2 border-t border-teal-200/60">
                <label className="text-[11px] font-bold text-teal-900 block mb-1">
                  {isEs ? 'Selecciona cuál de tus negocios es el anfitrión:' : 'Select which of your businesses is hosting:'}
                </label>
                <select
                  value={selectedEntityId}
                  onChange={(e) => setSelectedEntityId(e.target.value)}
                  className="w-full p-2 bg-white border border-teal-300 rounded-xl text-xs font-semibold text-stone-900 shadow-2xs"
                >
                  {userContent.businesses.map((biz) => (
                    <option key={biz.id} value={biz.id}>
                      {biz.name} ({biz.location_code} - {biz.category})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* List the groups that the organiser is admin of */}
            {organizerType === 'group' && (
              <div className="pt-2 border-t border-teal-200/60 space-y-2">
                <label className="text-[11px] font-bold text-teal-900 block">
                  {isEs
                    ? 'Colectivos donde eres Administrador Responsable:'
                    : 'Groups where you are Admin Coordinator:'}
                </label>
                {adminGroups.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {adminGroups.map((grp) => {
                      const isSelected = selectedEntityId === grp.id;
                      return (
                        <button
                          type="button"
                          key={grp.id}
                          onClick={() => setSelectedEntityId(grp.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-white border-teal-700 ring-2 ring-teal-700/20 shadow-xs'
                              : 'bg-white/60 border-teal-200 hover:bg-white'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-bold text-stone-900 truncate">
                              {isEs ? grp.name_es : grp.name_en}
                            </p>
                            <p className="text-[10px] text-teal-700 font-medium">
                              {grp.category} • {grp.location_code}
                            </p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-teal-700 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic">
                    {isEs
                      ? 'No eres administrador de ningún grupo actualmente.'
                      : 'You do not administer any groups currently.'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block">
                {isEs ? 'Título del Evento (Español) *' : 'Event Title (Spanish) *'}
              </label>
              <input
                type="text"
                required
                value={titleEs}
                onChange={(e) => setTitleEs(e.target.value)}
                placeholder="Ej. Noche de Salsa & Cócteles en la Playa"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block">
                {isEs ? 'Título en Inglés (Opcional)' : 'Title in English *'}
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Sunset Salsa & Ocean Cocktails"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
              />
            </div>
          </div>

          {/* Category & Hub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <BilingualCreatableSelect
              label={isEs ? 'Categoría de Evento *' : 'Event Category *'}
              value={category}
              onChange={setCategory}
              options={EVENT_CATEGORIES_BILINGUAL}
              language={language}
              placeholder={isEs ? 'Selecciona o escribe...' : 'Select or type...'}
              newItemLabel={isEs ? 'Nueva +' : 'New +'}
              required
            />

            <AlphabeticalAreaSelect
              value={locationCode}
              onChange={(val) => setLocationCode(val as LocationCode)}
              language={language}
              label={isEs ? 'Zona Costera (Orden Alfabético)' : 'Coastal Zone (Alphabetical)'}
            />
          </div>

          {/* Location & Street Map Navigation */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                {isEs ? 'Ubicación & Street Map Direcciones' : 'Location & Street Map Navigation'}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700 block">
                  {isEs ? 'Nombre del Lugar / Venue *' : 'Venue / Place Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="Ej. Terraza Sol 38 o Playa Mamitas"
                  className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700 block">
                  {isEs ? 'Dirección Exacta para Mapa *' : 'Exact Street Address for Map *'}
                </label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Calle 38 Norte entre 1ra y 5ta Avenida, Zazil-Ha"
                  className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                />
              </div>
            </div>

            {venueName && streetAddress && (
              <p className="text-[11px] text-teal-800 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                <span>
                  {isEs
                    ? 'Se generará automáticamente un enlace directo a Google Maps con direcciones paso a paso.'
                    : 'A direct Google Maps link with turn-by-turn directions will be generated.'}
                </span>
              </p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block">
                {isEs ? 'Fecha del Evento' : 'Event Date'}
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block">
                {isEs ? 'Hora de Inicio' : 'Start Time'}
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block">
                {isEs ? 'Hora de Término' : 'End Time'}
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
              />
            </div>
          </div>

          {/* Cost & Admission */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  {isEs ? 'Costo & Admisión' : 'Cost & Admission'}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaid(false)}
                  className={`py-1 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                    !isPaid
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white text-stone-600 border-stone-200'
                  }`}
                >
                  {isEs ? 'Entrada Libre' : 'Free Entry'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaid(true)}
                  className={`py-1 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                    isPaid
                      ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                      : 'bg-white text-stone-600 border-stone-200'
                  }`}
                >
                  {isEs ? 'Con Boletos / Costo' : 'Paid / Ticketed'}
                </button>
              </div>
            </div>

            {isPaid && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700 block">
                    {isEs ? 'Monto en MXN' : 'Amount (MXN)'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={costAmount}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setCostAmount(v);
                      setPriceLabel(`$${v} MXN`);
                    }}
                    className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700 block">
                    {isEs ? 'Etiqueta de Costo' : 'Price Label'}
                  </label>
                  <input
                    type="text"
                    value={priceLabel}
                    onChange={(e) => setPriceLabel(e.target.value)}
                    placeholder="Ej. $250 MXN (Incluye consumición)"
                    className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700 block">
                    {isEs ? 'Enlace de Registro o Boletos' : 'Ticket / RSVP Link'}
                  </label>
                  <input
                    type="url"
                    value={ticketUrl}
                    onChange={(e) => setTicketUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Atmosphere, Access & Capacity (Bilingual Creatable Selects) */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{isEs ? 'Acceso, Ambiente & Cupo' : 'Access, Atmosphere & Capacity'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <BilingualCreatableSelect
                label={isEs ? 'Código de Vestimenta' : 'Dress Code'}
                value={dressCode}
                onChange={setDressCode}
                options={DRESS_CODES_BILINGUAL}
                language={language}
                placeholder={isEs ? 'Seleccionar o escribir...' : 'Select or type...'}
                newItemLabel={isEs ? 'Nuevo +' : 'New +'}
              />

              <BilingualCreatableSelect
                label={isEs ? 'Política de Edad' : 'Age Policy'}
                value={agePolicy}
                onChange={setAgePolicy}
                options={AGE_POLICIES_BILINGUAL}
                language={language}
                placeholder={isEs ? 'Seleccionar o escribir...' : 'Select or type...'}
                newItemLabel={isEs ? 'Nueva +' : 'New +'}
              />

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800 block">
                  {isEs ? 'Cupo / Capacidad (Opcional)' : 'Capacity / Max Guests'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={5000}
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder={isEs ? 'Ej. 50 personas' : 'e.g. 50 guests'}
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                  />
                  <Users className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image Selector & File Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-teal-700" />
                <span>{isEs ? 'Foto de Portada' : 'Cover Image'}</span>
              </label>
              <label className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-3 h-3 text-teal-800" />
                <span>{isEs ? 'Subir Foto' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {EVENT_PHOTO_PRESETS.map((preset) => {
                const isSelected = imageUrl === preset.url;
                return (
                  <button
                    type="button"
                    key={preset.label}
                    onClick={() => setImageUrl(preset.url)}
                    className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected ? 'border-teal-700 ring-2 ring-teal-700/30' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-teal-900/40 flex items-center justify-center text-white">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-stone-950/70 text-[9px] text-white truncate px-1 py-0.5">
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="O pega una URL de imagen personalizada..."
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 mt-1"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-800 block">
              {isEs ? 'Descripción del Evento' : 'Event Description'}
            </label>
            <textarea
              rows={3}
              value={descriptionEs}
              onChange={(e) => setDescriptionEs(e.target.value)}
              placeholder={
                isEs
                  ? 'Explica qué esperar, ambiente, agenda y detalles clave...'
                  : 'Explain what to expect, atmosphere, agenda and highlights...'
              }
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 resize-none"
            />
          </div>

          {/* Special Instructions */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-700" />
              <span>{isEs ? 'Instrucciones Especiales para Asistentes' : 'Special Instructions for Attendees'}</span>
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder={
                isEs
                  ? 'Ej. Traer toalla personal, esterilla de yoga, protector solar biodegradable o llegar 15 minutos antes...'
                  : 'e.g., Bring personal towel, yoga mat, reef-safe sunscreen, or arrive 15 minutes early...'
              }
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 resize-none"
            />
          </div>

          {/* Sponsors & Co-Host Partnerships */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isEs ? 'Patrocinadores & Co-anfitriones' : 'Sponsors & Co-Hosts (Optional)'}</span>
                </label>
                {selectedSponsors.length > 0 && (
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                    {selectedSponsors.length} {isEs ? 'seleccionados' : 'selected'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {isEs
                  ? 'Agrega negocios locales o grupos que patrocinan este evento. Se mostrarán al pie del evento con enlace a su perfil, ofertas o tarjeta de lealtad.'
                  : 'Add registered local businesses or groups sponsoring this event. They will show at the bottom with quick links to their page, offers, or loyalty card.'}
              </p>
            </div>

            {/* Selected Sponsors Badges */}
            {selectedSponsors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-xl border border-stone-200">
                {selectedSponsors.map((sp) => (
                  <span
                    key={sp.id}
                    className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-teal-50 border border-teal-200 text-teal-900 rounded-lg text-xs font-medium"
                  >
                    {sp.logo_url && (
                      <img src={sp.logo_url} alt="" className="w-3.5 h-3.5 rounded object-cover" />
                    )}
                    <span>{sp.name}</span>
                    <span className="text-[9px] text-teal-600 bg-teal-100/80 px-1 py-0.2 rounded font-semibold uppercase">
                      {sp.tier === 'co_host' ? (isEs ? 'Co-host' : 'Co-host') : (isEs ? 'Patrocinio' : 'Sponsor')}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedSponsors((prev) =>
                          prev.filter((item) =>
                            sp.business_id ? item.business_id !== sp.business_id : item.group_id !== sp.group_id
                          )
                        )
                      }
                      className="hover:text-red-600 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={sponsorSearch}
                onChange={(e) => setSponsorSearch(e.target.value)}
                placeholder={isEs ? 'Buscar negocio o grupo por nombre...' : 'Search business or group by name...'}
                className="w-full pl-8 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
              />
            </div>

            {/* Suggestions list */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider block mb-1">
                  {isEs ? 'Negocios Registrados' : 'Registered Businesses'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {filteredBusinesses.map((biz) => {
                    const isSelected = selectedSponsors.some((s) => s.business_id === biz.id);
                    return (
                      <button
                        type="button"
                        key={biz.id}
                        onClick={() => handleToggleBusinessSponsor(biz)}
                        className={`p-2 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                            : 'bg-white hover:bg-stone-100/80 border-stone-200 text-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-md overflow-hidden bg-stone-200 shrink-0">
                            {biz.logo_url || biz.cover_image_url ? (
                              <img
                                src={biz.logo_url || biz.cover_image_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Building2 className="w-3.5 h-3.5 m-1 text-stone-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-semibold block truncate leading-tight">
                              {biz.name}
                            </span>
                            <span className={`text-[10px] block truncate ${isSelected ? 'text-teal-100' : 'text-stone-500'}`}>
                              {biz.location_label}
                              {(biz.offers_count ?? 0) > 0 ? ` • ${isEs ? 'Ofertas' : 'Offers'}` : ''}
                              {biz.has_loyalty_program ? ` • ${isEs ? 'Lealtad' : 'Loyalty'}` : ''}
                            </span>
                          </div>
                        </div>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-amber-300 shrink-0" />
                        ) : (
                          <span className="text-[10px] font-bold text-teal-700 hover:underline shrink-0">
                            + {isEs ? 'Sumar' : 'Add'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {filteredGroups.length > 0 && (
                <div className="pt-1 border-t border-stone-200/60">
                  <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider block mb-1">
                    {isEs ? 'Grupos & Colectivos' : 'Groups & Collectives'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {filteredGroups.map((grp) => {
                      const isSelected = selectedSponsors.some((s) => s.group_id === grp.id);
                      const groupName = isEs ? grp.name_es : grp.name_en;
                      return (
                        <button
                          type="button"
                          key={grp.id}
                          onClick={() => handleToggleGroupSponsor(grp)}
                          className={`p-2 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                              : 'bg-white hover:bg-stone-100/80 border-stone-200 text-stone-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-md overflow-hidden bg-stone-200 shrink-0">
                              {(grp.cover_url || grp.cover_image_url) ? (
                                <img
                                  src={grp.cover_url || grp.cover_image_url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Users className="w-3.5 h-3.5 m-1 text-stone-500" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold block truncate leading-tight">
                                {groupName}
                              </span>
                              <span className={`text-[10px] block truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                                {grp.member_count ?? grp.members_count ?? 0} {isEs ? 'miembros' : 'members'}
                              </span>
                            </div>
                          </div>
                          {isSelected ? (
                            <Check className="w-4 h-4 text-teal-300 shrink-0" />
                          ) : (
                            <span className="text-[10px] font-bold text-stone-700 hover:underline shrink-0">
                              + {isEs ? 'Sumar' : 'Add'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Event Tags & Lifestyle Topics */}
          <AlphabeticalInterestsSelect
            selectedInterests={tags}
            onChange={setTags}
            language={language}
            label={isEs ? 'Etiquetas & Temas del Evento' : 'Event Tags & Lifestyle Categories'}
          />

          {/* Footer Submit */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 text-stone-600 hover:text-stone-900 text-xs font-semibold rounded-xl"
            >
              {isEs ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isEs ? 'Publicar Evento Ahora' : 'Publish Event Now'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
