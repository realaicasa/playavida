import React, { useState } from 'react';
import {
  User,
  Language,
  PersonalProfile,
  PrivacyPreferences,
  LocationCode,
  PublicBusinessProjection,
  CommunityGroup,
  CommunityEvent,
} from '../types';
import {
  User as UserIcon,
  Shield,
  X,
  Lock,
  Eye,
  LogOut,
  Check,
  Ban,
  Globe,
  QrCode,
  Copy,
  Download,
  CheckCircle2,
  Sparkles,
  MapPin,
  Sliders,
  Bell,
  Trash2,
  Building2,
  Users,
  Calendar,
  Plus,
  Tag,
  Share2,
  Heart,
  ExternalLink,
  Camera,
  Upload,
  Instagram,
  Phone,
  Linkedin,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { playaVidaStore } from '../lib/storage';
import { translations } from '../lib/i18n';
import { LOCATIONS } from '../lib/constants';
import { UserInterestSliders } from './UserInterestSliders';
import { AlphabeticalAreaSelect } from './AlphabeticalAreaSelect';
import { AlphabeticalInterestsSelect } from './AlphabeticalInterestsSelect';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogout: () => void;
  language: Language;
  onLanguageChange?: (newLanguage: Language) => void;
  onOpenCreateBusiness?: () => void;
  onOpenCreateGroup?: () => void;
  onOpenCreateEvent?: () => void;
  onSelectBusiness?: (business: PublicBusinessProjection) => void;
  onSelectGroup?: (group: CommunityGroup) => void;
  onSelectEvent?: (event: CommunityEvent) => void;
  onViewBusiness?: (business: PublicBusinessProjection) => void;
  onViewGroup?: (group: CommunityGroup) => void;
  onViewEvent?: (event: CommunityEvent) => void;
}

const AVATAR_PRESETS = [
  {
    label: 'Chef & Foodie',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
  },
  {
    label: 'Digital Nomad',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  },
  {
    label: 'Yoga & Wellness',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  },
  {
    label: 'Ocean & Dive',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  },
  {
    label: 'Eco Volunteer',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  },
  {
    label: 'Artisan & Creator',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
  },
];

const SUGGESTED_PROFILE_TAGS = [
  'N├│mada Digital',
  'Gastronom├¡a',
  'Buceo y Cenotes',
  'Yoga',
  'Sostenibilidad',
  'Voluntariado',
  'Emprendedor',
  'Fotograf├¡a',
  'Salsa',
  'M├║sica en Vivo',
  'Caf├® de Especialidad',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  language,
  onLanguageChange,
  onOpenCreateBusiness,
  onOpenCreateGroup,
  onOpenCreateEvent,
  onSelectBusiness,
  onSelectGroup,
  onSelectEvent,
  onViewBusiness,
  onViewGroup,
  onViewEvent,
}) => {
  const handleSelectBusiness = onSelectBusiness || onViewBusiness;
  const handleSelectGroup = onSelectGroup || onViewGroup;
  const handleSelectEvent = onSelectEvent || onViewEvent;
  if (!isOpen || !currentUser) return null;

  const t = translations[language];
  const isEs = language === 'es';

  // Load existing profile & privacy preferences
  const existingProfile = playaVidaStore.getProfile(currentUser.id);
  const existingPrivacy = playaVidaStore.getPrivacyPreferences(currentUser.id);

  // Editable Form State
  const [displayName, setDisplayName] = useState(
    existingProfile.display_name || currentUser.email.split('@')[0]
  );
  const [username, setUsername] = useState(existingProfile.public_username || '');
  const [bio, setBio] = useState(existingProfile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(
    existingProfile.avatar_url || AVATAR_PRESETS[1].url
  );
  const [tags, setTags] = useState<string[]>(
    existingProfile.tags && existingProfile.tags.length > 0
      ? existingProfile.tags
      : ['Residente', 'Riviera Maya']
  );
  const [tagInput, setTagInput] = useState('');
  const [instagram, setInstagram] = useState(existingProfile.social_links?.instagram || '');
  const [whatsapp, setWhatsapp] = useState(existingProfile.social_links?.whatsapp || '');
  const [website, setWebsite] = useState(existingProfile.social_links?.website || '');
  const [linkedin, setLinkedin] = useState(existingProfile.social_links?.linkedin || '');

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    currentUser.selected_language || language
  );
  const [preferredZone, setPreferredZone] = useState<LocationCode>(
    existingProfile.preferred_location || 'PDC'
  );

  // Privacy toggles
  const [allowPublicDirectory, setAllowPublicDirectory] = useState(
    existingPrivacy.public_profile_visible ?? true
  );
  const [allowDms, setAllowDms] = useState(
    existingPrivacy.allow_direct_messages ?? currentUser.privacy_preferences?.allow_direct_messages ?? true
  );
  const [anonymousReviews, setAnonymousReviews] = useState(
    !existingPrivacy.reviews_visible
  );
  const [showFullName, setShowFullName] = useState(
    existingPrivacy.show_full_name ?? true
  );
  const [showUsername, setShowUsername] = useState(
    existingPrivacy.show_username ?? true
  );
  const [showBio, setShowBio] = useState(
    existingPrivacy.show_bio ?? true
  );
  const [showInterests, setShowInterests] = useState(
    existingPrivacy.show_interests ?? true
  );
  const [showSocialLinks, setShowSocialLinks] = useState(
    existingPrivacy.show_social_links ?? true
  );
  const [socialIncentives, setSocialIncentives] = useState(
    existingPrivacy.social_incentives ?? false
  );
  const [marketingEmail, setMarketingEmail] = useState(
    existingPrivacy.marketing_email ?? false
  );
  const [marketingWhatsapp, setMarketingWhatsapp] = useState(
    existingPrivacy.marketing_whatsapp ?? false
  );
  const [contactPermissions, setContactPermissions] = useState<'everyone' | 'members_only' | 'nobody'>(
    existingPrivacy.contact_permissions || 'everyone'
  );

  const [savedNotice, setSavedNotice] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [modalTab, setModalTab] = useState<'profile' | 'creations' | 'interests' | 'optins' | 'favorites'>('profile');
  const [optIns, setOptIns] = useState(() => playaVidaStore.getPushOptIns(currentUser.id));

  const userCreatedContent = playaVidaStore.getUserCreatedContent(currentUser.id);

  const handleAddTag = (newTag: string) => {
    const clean = newTag.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveOptIn = (targetRef: string) => {
    playaVidaStore.removePushOptIn(currentUser.id, targetRef);
    setOptIns(playaVidaStore.getPushOptIns(currentUser.id));
  };

  const blockedList = playaVidaStore.getBlockedEntities(currentUser.id);

  const handleLanguageSelect = (newLang: Language) => {
    setSelectedLanguage(newLang);
    playaVidaStore.updateUserLanguage(currentUser.id, newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // 1. Save personal profile
    const updatedProfile: PersonalProfile = {
      ...existingProfile,
      user_id: currentUser.id,
      display_name: displayName.trim() || currentUser.email.split('@')[0],
      public_username: username.trim().replace(/^@/, '') || undefined,
      bio: bio.trim(),
      avatar_url: avatarUrl.trim(),
      profile_visibility: allowPublicDirectory ? 'public' : 'hidden',
      preferred_location: preferredZone,
      tags: tags,
      social_links: {
        instagram: instagram.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        website: website.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
      },
    };
    playaVidaStore.saveProfile(updatedProfile);

    // 2. Save privacy preferences
    const updatedPrivacy: PrivacyPreferences = {
      ...existingPrivacy,
      public_profile_visible: allowPublicDirectory,
      reviews_visible: !anonymousReviews,
      contact_permissions: contactPermissions,
      show_full_name: showFullName,
      show_username: showUsername,
      show_bio: showBio,
      show_interests: showInterests,
      show_social_links: showSocialLinks,
      allow_direct_messages: allowDms,
      social_incentives: socialIncentives,
      marketing_email: marketingEmail,
      marketing_whatsapp: marketingWhatsapp,
      updated_at: new Date().toISOString(),
    };
    playaVidaStore.savePrivacyPreferences(currentUser.id, updatedPrivacy);

    // 3. Save basic user preferences & language
    playaVidaStore.updateUserPreferences(currentUser.id, {
      show_in_public_directory: allowPublicDirectory,
      allow_direct_messages: allowDms,
    });
    playaVidaStore.updateUserLanguage(currentUser.id, selectedLanguage);

    if (onLanguageChange && selectedLanguage !== language) {
      onLanguageChange(selectedLanguage);
    }

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(currentUser.public_reference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleDownloadQr = () => {
    const svgEl = document.getElementById('member-qr-svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PlayaVida_Member_${currentUser.public_reference}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUnblock = (targetRef: string) => {
    playaVidaStore.unblockEntity(currentUser.id, targetRef);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-10 h-10 rounded-2xl object-cover border-2 border-teal-700/30 shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Outfit',sans-serif] font-bold text-stone-900 text-base">
                  {displayName}
                </h3>
                <span className="py-0.5 px-2 bg-teal-100 text-teal-800 font-mono text-[10px] font-bold rounded-md">
                  {currentUser.public_reference}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                {isEs
                  ? 'Perfil de miembro personal, credenciales e iniciativas comunitarias.'
                  : 'Personal member profile, credentials and community initiatives.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 pb-1 border-b border-stone-100 bg-stone-50/50 flex items-center gap-1.5 overflow-x-auto flex-nowrap w-full text-xs font-semibold scrollbar-hide shrink-0 overflow-hidden">
          <button
            onClick={() => setModalTab('profile')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              modalTab === 'profile'
                ? 'bg-teal-800 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>{isEs ? 'Perfil & Datos' : 'Profile & Info'}</span>
          </button>

          <button
            onClick={() => setModalTab('creations')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              modalTab === 'creations'
                ? 'bg-teal-800 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEs ? 'Crear & Gestionar' : 'Create & Manage'}</span>
            <span
              className={`py-0.5 px-1.5 rounded-full text-[10px] font-bold ${
                modalTab === 'creations' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-800'
              }`}
            >
              {userCreatedContent.businesses.length + userCreatedContent.groups.length + userCreatedContent.events.length}
            </span>
          </button>

          <button
            onClick={() => setModalTab('interests')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              modalTab === 'interests'
                ? 'bg-teal-800 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isEs ? 'Intereses (1-10)' : 'Interests (1-10)'}</span>
          </button>

          <button
            onClick={() => setModalTab('optins')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              modalTab === 'optins'
                ? 'bg-teal-800 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{isEs ? 'Avisos & Opt-ins' : 'Alerts'}</span>
            {optIns.length > 0 && (
              <span
                className={`py-0.5 px-1.5 rounded-full text-[10px] font-bold ${
                  modalTab === 'optins' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-800'
                }`}
              >
                {optIns.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setModalTab('favorites')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              modalTab === 'favorites'
                ? 'bg-teal-800 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{isEs ? 'Favoritos' : 'Favorites'}</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: CREATIONS & CREATION HUB */}
          {modalTab === 'creations' && (
            <div className="space-y-6">
              {/* Informative Hub Banner */}
              <div className="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-200/80 space-y-2">
                <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  <span>{isEs ? 'Centro de Creaci├│n Comunitario' : 'Community Creation Hub'}</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {isEs
                    ? 'Tu perfil personal de miembro act├║a como respaldo oficial. Desde aqu├¡ puedes registrar tu negocio local, fundar un grupo comunitario o publicar un evento en el calendario.'
                    : 'Your personal member profile acts as your official foundation. From here you can register your local business, start a community group, or publish an event to the coastal calendar.'}
                </p>
              </div>

              {/* 3 Direct Creation Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Business */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-['Outfit',sans-serif] font-bold text-sm text-stone-900">
                        {isEs ? 'Negocio Local' : 'Local Business'}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                        {isEs
                          ? 'Cafeter├¡a, restaurante, estudio de buceo o servicio.'
                          : 'Caf├®, restaurant, dive center, or local service.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCreateBusiness?.();
                    }}
                    className="mt-4 w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isEs ? 'Registrar Negocio' : 'Register Business'}</span>
                  </button>
                </div>

                {/* Group */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-200">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-['Outfit',sans-serif] font-bold text-sm text-stone-900">
                        {isEs ? 'Grupo o Colectivo' : 'Community Group'}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                        {isEs
                          ? 'N├│madas, buceadores, amantes de la ecolog├¡a o salsa.'
                          : 'Nomads, scuba divers, reef ecology, or salsa lovers.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCreateGroup?.();
                    }}
                    className="mt-4 w-full py-2 px-3 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isEs ? 'Iniciar Grupo' : 'Start Group'}</span>
                  </button>
                </div>

                {/* Event */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-['Outfit',sans-serif] font-bold text-sm text-stone-900">
                        {isEs ? 'Evento Costero' : 'Coastal Event'}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                        {isEs
                          ? 'Encuentros, talleres, limpiezas de playa o m├║sica en vivo.'
                          : 'Meetups, workshops, beach cleanups, live music.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCreateEvent?.();
                    }}
                    className="mt-4 w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isEs ? 'Publicar Evento' : 'Publish Event'}</span>
                  </button>
                </div>
              </div>

              {/* User's Created Businesses */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isEs ? 'Mis Negocios Registrados' : 'My Registered Businesses'}</span>
                    <span className="py-0.5 px-1.5 bg-stone-100 rounded text-stone-600 text-[10px]">
                      {userCreatedContent.businesses.length}
                    </span>
                  </h4>
                </div>

                {userCreatedContent.businesses.length > 0 ? (
                  <div className="space-y-2">
                    {userCreatedContent.businesses.map((biz) => (
                      <div
                        key={biz.id}
                        onClick={() => {
                          handleSelectBusiness?.(biz);
                          onClose();
                        }}
                        className="p-3 bg-stone-50 hover:bg-teal-50/40 border border-stone-200 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={biz.cover_url || biz.logo_url}
                            alt={biz.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-stone-900 truncate">{biz.name}</h5>
                            <p className="text-[11px] text-stone-500 truncate">
                              {biz.location_code} ÔÇó {biz.category}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-teal-800 flex items-center gap-1 shrink-0">
                          <span>{isEs ? 'Ver Minisitio' : 'View Pass'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic p-3 bg-stone-50 rounded-xl border border-stone-200">
                    {isEs
                      ? 'No has registrado negocios a├║n. Haz clic en "Registrar Negocio" para comenzar.'
                      : 'No businesses registered yet. Click "Register Business" to start.'}
                  </p>
                )}
              </div>

              {/* User's Created Groups */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-teal-800" />
                    <span>{isEs ? 'Mis Colectivos y Grupos' : 'My Coordinated Groups'}</span>
                    <span className="py-0.5 px-1.5 bg-stone-100 rounded text-stone-600 text-[10px]">
                      {userCreatedContent.groups.length}
                    </span>
                  </h4>
                </div>

                {userCreatedContent.groups.length > 0 ? (
                  <div className="space-y-2">
                    {userCreatedContent.groups.map((grp) => (
                      <div
                        key={grp.id}
                        onClick={() => {
                          handleSelectGroup?.(grp);
                          onClose();
                        }}
                        className="p-3 bg-stone-50 hover:bg-teal-50/40 border border-stone-200 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={grp.cover_url}
                            alt={grp.name_es}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-stone-900 truncate">
                              {isEs ? grp.name_es : grp.name_en}
                            </h5>
                            <p className="text-[11px] text-stone-500 truncate">
                              {grp.location_code} ÔÇó {grp.member_count} {isEs ? 'miembros' : 'members'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-teal-800 flex items-center gap-1 shrink-0">
                          <span>{isEs ? 'Abrir Grupo' : 'Open Group'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic p-3 bg-stone-50 rounded-xl border border-stone-200">
                    {isEs
                      ? 'No has creado grupos a├║n. Haz clic en "Iniciar Grupo" para reunir a tu comunidad.'
                      : 'No groups created yet. Click "Start Group" to gather members.'}
                  </p>
                )}
              </div>

              {/* User's Created Events */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isEs ? 'Eventos Organizados por M├¡' : 'Events Hosted by Me'}</span>
                    <span className="py-0.5 px-1.5 bg-stone-100 rounded text-stone-600 text-[10px]">
                      {userCreatedContent.events.length}
                    </span>
                  </h4>
                </div>

                {userCreatedContent.events.length > 0 ? (
                  <div className="space-y-2">
                    {userCreatedContent.events.map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => {
                          handleSelectEvent?.(evt);
                          onClose();
                        }}
                        className="p-3 bg-stone-50 hover:bg-teal-50/40 border border-stone-200 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={evt.image_url}
                            alt={evt.title_es}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-stone-900 truncate">
                              {isEs ? evt.title_es : evt.title_en}
                            </h5>
                            <p className="text-[11px] text-stone-500 truncate">
                              {new Date(evt.start_at).toLocaleDateString()} ÔÇó {evt.event_location_label}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-teal-800 flex items-center gap-1 shrink-0">
                          <span>{isEs ? 'Ver en Calendario' : 'View Event'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic p-3 bg-stone-50 rounded-xl border border-stone-200">
                    {isEs
                      ? 'No has publicado eventos a├║n. Haz clic en "Publicar Evento" para programar uno.'
                      : 'No events published yet. Click "Publish Event" to schedule one.'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Lifestyle Interests (1-10) */}
          {modalTab === 'interests' && (
            <UserInterestSliders
              currentUser={currentUser}
              language={language}
              onSaveNotice={() => {
                setSavedNotice(true);
                setTimeout(() => setSavedNotice(false), 2500);
              }}
            />
          )}

          {/* TAB 3: Push Notifications & Opt-ins List */}
          {modalTab === 'optins' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                  <Bell className="w-4 h-4 text-amber-700" />
                  <span>{isEs ? 'Suscripciones y Alertas Consentidas' : 'Consented Subscriptions & Alerts'}</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {isEs
                    ? 'Aqu├¡ administras los negocios, eventos y grupos donde has dado tu consentimiento para recibir alertas directas, invitaciones e incentivos.'
                    : 'Manage the businesses, events, and clubs you opted-in to receive perks and updates from.'}
                </p>
              </div>

              {optIns.length > 0 ? (
                <div className="space-y-2">
                  {optIns.map((item) => (
                    <div
                      key={item.target_reference}
                      className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-stone-900">{item.target_name}</span>
                          <span className="font-mono text-[10px] py-0.5 px-1.5 bg-stone-200 rounded-md text-stone-700">
                            {item.target_reference}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {isEs ? 'Incentivos activos ÔÇó ' : 'Active perks ÔÇó '}
                          {new Date(item.opted_in_at).toLocaleDateString()}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveOptIn(item.target_reference)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title={isEs ? 'Cancelar suscripci├│n' : 'Unsubscribe'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-stone-400 space-y-1">
                  <Bell className="w-8 h-8 mx-auto text-stone-300" />
                  <p className="text-xs">
                    {isEs
                      ? 'No te has suscrito a├║n a ning├║n negocio o evento.'
                      : 'You have not subscribed to any business or event yet.'}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    {isEs
                      ? 'Activa la casilla de avisos e incentivos al visitar la p├ígina de un negocio o evento.'
                      : 'Check the opt-in box on any business or event page to receive direct perks.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Favorites */}
          {modalTab === 'favorites' && (
            (() => {
              const favs = playaVidaStore.getFavorites();
              const favBusinesses = playaVidaStore.getPublicBusinesses().filter(b => favs.businesses.includes(b.id));
              const favEvents = playaVidaStore.getEvents().filter(e => favs.events.includes(e.id));
              const favGroups = playaVidaStore.getGroups().filter(g => favs.groups.includes(g.id));

              if (favBusinesses.length === 0 && favEvents.length === 0 && favGroups.length === 0) {
                return (
                  <div className="py-8 text-center text-stone-400 space-y-1">
                    <Heart className="w-8 h-8 mx-auto text-stone-300" />
                    <p className="text-xs font-semibold text-stone-600">
                      {isEs ? 'Favoritos' : 'Favorites'}
                    </p>
                    <p className="text-[11px]">
                      {isEs ? 'A├║n no tienes favoritos.' : 'You have not favorited any items yet.'}
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {favBusinesses.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">{isEs ? 'Negocios Favoritos' : 'Favorite Businesses'}</h4>
                      {favBusinesses.sort((a,b) => a.name.localeCompare(b.name)).map(biz => (
                        <div key={biz.id} onClick={() => { handleSelectBusiness?.(biz); onClose(); }} className="p-3 bg-stone-50 hover:bg-teal-50/40 border border-stone-200 rounded-2xl cursor-pointer transition-colors flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900">{biz.name}</span>
                          <span className="text-[10px] text-teal-700 font-bold">{isEs ? 'Ver' : 'View'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {favEvents.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">{isEs ? 'Eventos Favoritos' : 'Favorite Events'}</h4>
                      {favEvents.sort((a,b) => (isEs ? a.title_es.localeCompare(b.title_es) : a.title_en.localeCompare(b.title_en))).map(evt => (
                        <div key={evt.id} onClick={() => { handleSelectEvent?.(evt); onClose(); }} className="p-3 bg-stone-50 hover:bg-teal-50/40 border border-stone-200 rounded-2xl cursor-pointer transition-colors flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900">{isEs ? evt.title_es : evt.title_en}</span>
                          <span className="text-[10px] text-teal-700 font-bold">{isEs ? 'Ver' : 'View'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {favGroups.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">{isEs ? 'Grupos Favoritos' : 'Favorite Groups'}</h4>
                      {favGroups.sort((a,b) => (isEs ? a.name_es.localeCompare(b.name_es) : a.name_en.localeCompare(b.name_en))).map(grp => (
                        <div key={grp.id} onClick={() => { handleSelectGroup?.(grp); onClose(); }} className="p-3 bg-stone-50 hover:bg-teal-50/40 border border-stone-200 rounded-2xl cursor-pointer transition-colors flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900">{isEs ? grp.name_es : grp.name_en}</span>
                          <span className="text-[10px] text-teal-700 font-bold">{isEs ? 'Ver' : 'View'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()
          )}

          {/* TAB 4: Main Profile & Privacy Settings */}
          {modalTab === 'profile' && (
            <>
              {/* Section 1: Default Language Switcher */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-teal-700" />
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      {t.default_language_label}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500">
                    {selectedLanguage === 'es' ? 'Espa├▒ol seleccionado' : 'English active'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleLanguageSelect('es')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                      selectedLanguage === 'es'
                        ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>­ƒç▓­ƒç¢ Espa├▒ol (MX)</span>
                    {selectedLanguage === 'es' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLanguageSelect('en')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                      selectedLanguage === 'en'
                        ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>­ƒç║­ƒç© English (US)</span>
                    {selectedLanguage === 'en' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Section 2: User Identity & Member QR Code */}
              <div className="p-4 bg-gradient-to-br from-stone-50 to-teal-50/40 rounded-2xl border border-teal-200/60 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="p-2.5 bg-white rounded-xl border border-stone-200 shadow-xs shrink-0">
                    <QRCodeSVG
                      id="member-qr-svg"
                      value={currentUser.public_reference}
                      size={110}
                      level="M"
                      includeMargin
                    />
                  </div>

                  <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="py-0.5 px-2 bg-teal-100 text-teal-800 font-mono text-[11px] font-bold rounded-md">
                        {currentUser.public_reference}
                      </span>
                      <button
                        onClick={handleCopyRef}
                        className="text-stone-400 hover:text-stone-700 p-1"
                        title={t.copy_link}
                      >
                        {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-stone-900 truncate">
                      {currentUser.email}
                    </h4>

                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      {t.my_qr_code_desc}
                    </p>

                    <div className="pt-1">
                      <button
                        onClick={handleDownloadQr}
                        className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        <Download className="w-3 h-3 text-stone-500" />
                        <span>{t.download_qr}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Profile Form with Avatar, Tags, Socials */}
              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Avatar Picker with File Upload & Presets */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-teal-700" />
                      <span>{isEs ? 'Foto de Perfil / Avatar' : 'Profile Picture / Avatar'}</span>
                    </label>
                    <span className="text-[10px] text-stone-400">
                      {isEs ? 'Sube una foto o elige un avatar' : 'Upload photo or choose avatar'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-700 shadow-xs shrink-0 bg-stone-100"
                    />

                    <div className="flex-1 w-full space-y-2.5 min-w-0">
                      {/* File Upload Button */}
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isEs ? 'Subir Foto desde Dispositivo' : 'Upload Photo from Device'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5">
                        {AVATAR_PRESETS.map((p) => {
                          const isSelected = avatarUrl === p.url;
                          return (
                            <button
                              type="button"
                              key={p.label}
                              onClick={() => setAvatarUrl(p.url)}
                              className={`py-1 px-2 rounded-lg text-[11px] font-medium transition-all ${
                                isSelected
                                  ? 'bg-teal-800 text-white font-bold shadow-2xs'
                                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              {p.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* URL input fallback */}
                      <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Display Name & Username */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-stone-700 block">
                      {t.display_name_label}
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Tu nombre o alias"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-stone-700 block">
                      {t.username_label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="usuario"
                        className="w-full pl-7 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Zone (Alphabetical with + Additional Option in persistent memory) */}
                <AlphabeticalAreaSelect
                  value={preferredZone}
                  onChange={(val) => setPreferredZone(val as LocationCode)}
                  language={language}
                  label={t.preferred_zone_label}
                />

                {/* 30+ Alphabetical Curated Interests Multi-Select with + Additional Option in persistent memory */}
                <AlphabeticalInterestsSelect
                  selectedInterests={tags}
                  onChange={setTags}
                  language={language}
                  label={
                    isEs
                      ? 'Intereses & Pasiones Comunitarias (Selecciona los que desees)'
                      : 'Community Interests & Lifestyle Passions (Select as many as you desire)'
                  }
                />

                {/* Social Links */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-teal-700" />
                    <span>{isEs ? 'Enlaces Sociales & Contacto' : 'Social Links & Contact'}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-stone-700 flex items-center gap-1">
                        <Instagram className="w-3 h-3 text-pink-600" />
                        <span>Instagram</span>
                      </label>
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="@tu_perfil"
                        className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-stone-700 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp</span>
                      </label>
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+52 984 123 4567"
                        className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-stone-700 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-teal-600" />
                        <span>{isEs ? 'Sitio Web / Portafolio' : 'Website / Portfolio'}</span>
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://..."
                        className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-stone-700 flex items-center gap-1">
                        <Linkedin className="w-3 h-3 text-blue-600" />
                        <span>LinkedIn</span>
                      </label>
                      <input
                        type="text"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="linkedin.com/in/..."
                        className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700 block">
                    {t.bio_label}
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    placeholder={
                      isEs
                        ? 'Cu├®ntale a la comunidad sobre ti (residente, viajero, n├│mada, buceador)...'
                        : 'Tell the community about yourself (resident, traveler, nomad, diver)...'
                    }
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 resize-none"
                  />
                </div>

                {/* Privacy Controls */}
                <div className="space-y-3 pt-2 border-t border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-teal-700" />
                    <span>{t.privacy_title}</span>
                  </h4>

                  <label className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-100/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={allowPublicDirectory}
                      onChange={(e) => setAllowPublicDirectory(e.target.checked)}
                      className="mt-0.5 rounded text-teal-700 focus:ring-teal-700"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-stone-800 block">
                        {t.allow_directory}
                      </span>
                      <span className="text-stone-500 text-[11px]">
                        {isEs
                          ? 'Permite que otros residentes y comercios te encuentren en la lista comunitaria.'
                          : 'Allows other residents and members to find your public badge in community lists.'}
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-100/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={allowDms}
                      onChange={(e) => setAllowDms(e.target.checked)}
                      className="mt-0.5 rounded text-teal-700 focus:ring-teal-700"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-stone-800 block">
                        {t.allow_messages}
                      </span>
                      <span className="text-stone-500 text-[11px]">
                        {isEs
                          ? 'Permitir consultas seguras sin exponer jam├ís tu correo electr├│nico real.'
                          : 'Allow safe direct queries without ever revealing your real email address.'}
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-100/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={anonymousReviews}
                      onChange={(e) => setAnonymousReviews(e.target.checked)}
                      className="mt-0.5 rounded text-teal-700 focus:ring-teal-700"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-stone-800 block">
                        {t.anonymous_reviews}
                      </span>
                      <span className="text-stone-500 text-[11px]">
                        {isEs
                          ? 'Oculta tu nombre de usuario en las opiniones de comercios locales.'
                          : 'Hides your display name on local business community reviews.'}
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-100/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={marketingEmail}
                      onChange={(e) => setMarketingEmail(e.target.checked)}
                      className="mt-0.5 rounded text-teal-700 focus:ring-teal-700"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-stone-800 block">
                        {t.marketing_emails}
                      </span>
                      <span className="text-stone-500 text-[11px]">
                        {isEs
                          ? 'Bolet├¡n semanal con eventos destacados, nuevos comercios y ofertas.'
                          : 'Weekly digest with top events, new merchants, and seasonal perks.'}
                      </span>
                    </div>
                  </label>

                  {/* Granular Visibility Preferences */}
                  <div className="p-3 bg-stone-50/70 rounded-xl border border-stone-200/80 space-y-2.5">
                    <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                      {isEs ? 'Campos Visibles en tu Perfil P├║blico:' : 'Visible Fields on Public Profile:'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                        <input
                          type="checkbox"
                          checked={showFullName}
                          onChange={(e) => setShowFullName(e.target.checked)}
                          className="rounded text-teal-700 focus:ring-teal-700"
                        />
                        <span>{isEs ? 'Mostrar Nombre Completo' : 'Show Full Name'}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                        <input
                          type="checkbox"
                          checked={showUsername}
                          onChange={(e) => setShowUsername(e.target.checked)}
                          className="rounded text-teal-700 focus:ring-teal-700"
                        />
                        <span>{isEs ? 'Mostrar @Usuario' : 'Show @Username'}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                        <input
                          type="checkbox"
                          checked={showBio}
                          onChange={(e) => setShowBio(e.target.checked)}
                          className="rounded text-teal-700 focus:ring-teal-700"
                        />
                        <span>{isEs ? 'Mostrar Biograf├¡a' : 'Show Bio'}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                        <input
                          type="checkbox"
                          checked={showInterests}
                          onChange={(e) => setShowInterests(e.target.checked)}
                          className="rounded text-teal-700 focus:ring-teal-700"
                        />
                        <span>{isEs ? 'Mostrar Pasiones / Sliders' : 'Show Passion Sliders'}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                        <input
                          type="checkbox"
                          checked={showSocialLinks}
                          onChange={(e) => setShowSocialLinks(e.target.checked)}
                          className="rounded text-teal-700 focus:ring-teal-700"
                        />
                        <span>{isEs ? 'Mostrar Redes Sociales' : 'Show Social Links'}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                        <input
                          type="checkbox"
                          checked={socialIncentives}
                          onChange={(e) => setSocialIncentives(e.target.checked)}
                          className="rounded text-teal-700 focus:ring-teal-700"
                        />
                        <span>{isEs ? 'Recompensas Comunitarias' : 'Community Incentives'}</span>
                      </label>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-100/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={marketingWhatsapp}
                      onChange={(e) => setMarketingWhatsapp(e.target.checked)}
                      className="mt-0.5 rounded text-teal-700 focus:ring-teal-700"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-stone-800 block">
                        {isEs ? 'Avisos Urgentes Comunitarios por WhatsApp' : 'Urgent Community Alerts via WhatsApp'}
                      </span>
                      <span className="text-stone-500 text-[11px]">
                        {isEs
                          ? 'Recibe avisos de clima severo, avistamiento de fauna o cambios de eventos comunitarios.'
                          : 'Receive urgent notifications for severe weather alerts, marine wildlife sightings or event shifts.'}
                      </span>
                    </div>
                  </label>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    {savedNotice && (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.profile_saved_toast}</span>
                      </>
                    )}
                  </span>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    {t.save_profile_button}
                  </button>
                </div>
              </form>

              {/* Section 4: User-Owned Block List */}
              <div className="space-y-3 pt-3 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Ban className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t.user_blocks_title}</span>
                </h4>

                {blockedList.length > 0 ? (
                  <div className="space-y-2">
                    {blockedList.map((b) => (
                      <div
                        key={b.id}
                        className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-mono text-stone-700 block">{b.target_reference}</span>
                          <span className="text-[10px] text-stone-400">
                            {isEs ? 'Tipo:' : 'Type:'} {b.target_type}
                          </span>
                        </div>
                        <button
                          onClick={() => handleUnblock(b.target_reference)}
                          className="text-xs text-rose-700 hover:underline font-semibold"
                        >
                          {t.unblock_button}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic">
                    {t.no_blocks}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Section 5: Logout */}
          <div className="pt-2 border-t border-stone-100">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
