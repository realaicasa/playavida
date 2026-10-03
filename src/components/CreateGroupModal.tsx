import React, { useState } from 'react';
import {
  Users,
  X,
  Sparkles,
  MapPin,
  Tag,
  Shield,
  Image as ImageIcon,
  Check,
  User as UserIcon,
  Plus,
  Calendar,
  Upload,
  Phone,
  Instagram,
  Facebook,
  Globe,
  HelpCircle,
  Trash2,
} from 'lucide-react';
import { Language, User, LocationCode, CommunityGroup } from '../types';
import { playaVidaStore } from '../lib/storage';
import { BilingualCreatableSelect, SelectOption } from './BilingualCreatableSelect';
import { AlphabeticalAreaSelect } from './AlphabeticalAreaSelect';
import { AlphabeticalInterestsSelect } from './AlphabeticalInterestsSelect';

const GROUP_CATEGORIES_BILINGUAL: SelectOption[] = [
  { value: 'Digital Nomads & Emprendedores', label_es: 'Digital Nomads & Emprendedores', label_en: 'Digital Nomads & Founders' },
  { value: 'Conservación Marina & Arrecifes', label_es: 'Conservación Marina & Arrecifes', label_en: 'Marine & Coral Conservation' },
  { value: 'Deportes y Vida al Aire Libre', label_es: 'Deportes y Vida al Aire Libre', label_en: 'Sports & Outdoor Adventure' },
  { value: 'Bienestar, Yoga & Respiración', label_es: 'Bienestar, Yoga & Respiración', label_en: 'Wellness, Yoga & Breathwork' },
  { value: 'Arte, Fotografía & Música', label_es: 'Arte, Fotografía & Música', label_en: 'Arts, Photography & Music' },
  { value: 'Intercambio de Idiomas & Cultura', label_es: 'Intercambio de Idiomas & Cultura', label_en: 'Language & Cultural Exchange' },
  { value: 'Gastronomía & Encuentros Sociales', label_es: 'Gastronomía & Encuentros Sociales', label_en: 'Foodies & Social Gatherings' },
  { value: 'Tecnología, Código & Creadores de IA', label_es: 'Tecnología, Código & Creadores de IA', label_en: 'Tech, Coding & AI Builders' },
];

const MEETING_FREQUENCIES_BILINGUAL: SelectOption[] = [
  { value: 'Semanal', label_es: 'Semanal (Encuentros semanales)', label_en: 'Weekly Meetups' },
  { value: 'Quincenal', label_es: 'Quincenal (Cada dos semanas)', label_en: 'Bi-weekly Meetups' },
  { value: 'Mensual', label_es: 'Mensual (Reuniones mensuales)', label_en: 'Monthly Gatherings' },
  { value: 'Pop-up & Espontáneo', label_es: 'Pop-up & Espontáneo (Según actividades)', label_en: 'Pop-up & Spontaneous' },
];

const JOIN_POLICIES_BILINGUAL: SelectOption[] = [
  { value: 'open', label_es: 'Abierto (Cualquiera se une al instante)', label_en: 'Open (Instant Join)' },
  { value: 'approval', label_es: 'Aprobación previa requerida', label_en: 'Approval Required' },
  { value: 'invitation', label_es: 'Solo por invitación privada', label_en: 'Invitation Only' },
];

interface FAQItem {
  question: string;
  answer: string;
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  language: Language;
  onGroupCreated: (group: CommunityGroup) => void;
  onOpenAuth: () => void;
}

const GROUP_COVER_PRESETS = [
  {
    label: 'Digital Nomads & Founders',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Reef & Beach Conservation',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Cycling & Jungle Trail',
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Wellness & Breathwork',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Creative Arts & Culture',
    url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
  },
];

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  language,
  onGroupCreated,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  const isEs = language === 'es';

  // Require personal profile
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 bg-teal-50 text-teal-800 rounded-2xl flex items-center justify-center mx-auto border border-teal-200">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
              {isEs ? 'Perfil Requerido para Iniciar Colectivo' : 'Personal Profile Required to Start Group'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {isEs
                ? 'Para fundar y coordinar un grupo comunitario, tu perfil personal queda registrado como creador y administrador responsable.'
                : 'To found and lead a community group, your personal member profile is linked as the responsible coordinator.'}
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

  // Form states
  const [nameEs, setNameEs] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('Digital Nomads & Emprendedores');
  const [meetingFrequency, setMeetingFrequency] = useState('Semanal');
  const [locationCode, setLocationCode] = useState<LocationCode>('PDC');
  const [descriptionEs, setDescriptionEs] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [joinPolicy, setJoinPolicy] = useState<'open' | 'approval'>('open');

  // Images (uploads + URL fallback)
  const [coverUrl, setCoverUrl] = useState(GROUP_COVER_PRESETS[0].url);
  const [profileImageUrl, setProfileImageUrl] = useState(
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80'
  );

  // Social & Contacts
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [website, setWebsite] = useState('');

  // Tags & Interests
  const [tags, setTags] = useState<string[]>(['Networking', 'Coworking']);

  // Up to 5 FAQs
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      question: isEs ? '¿Quiénes pueden unirse al grupo?' : 'Who can join the group?',
      answer: isEs
        ? 'Cualquier residente, nómada digital o visitante respetuoso interesado en nuestras actividades.'
        : 'Any resident, digital nomad, or respectful visitor interested in our activities.',
    },
  ]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddFaq = () => {
    if (faqs.length >= 5) return;
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEs.trim() && !nameEn.trim()) return;

    const finalNameEs = nameEs.trim() || nameEn.trim();
    const finalNameEn = nameEn.trim() || nameEs.trim();
    const validFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim());

    const newGroup = playaVidaStore.createCommunityGroup(currentUser.id, {
      name_es: finalNameEs,
      name_en: finalNameEn,
      category,
      meeting_frequency: meetingFrequency,
      description_es: descriptionEs.trim() || `${finalNameEs}.`,
      description_en: descriptionEn.trim() || `${finalNameEn} community.`,
      location_code: locationCode,
      cover_url: coverUrl,
      profile_image_url: profileImageUrl,
      whatsapp: whatsapp.trim() || undefined,
      instagram: instagram.trim() || undefined,
      facebook: facebook.trim() || undefined,
      website: website.trim() || undefined,
      visibility: 'public',
      join_policy: (joinPolicy as any) || 'open',
      tags: tags.length > 0 ? tags : ['Comunidad'],
      faqs: validFaqs,
    });

    onGroupCreated(newGroup);
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
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Outfit',sans-serif] font-bold text-stone-900 text-base">
                {isEs ? 'Crear Nuevo Colectivo o Grupo' : 'Create Community Group'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isEs
                  ? 'Reúne a personas con intereses afines y organiza eventos costeros compartidos.'
                  : 'Gather people with common passions and coordinate shared coastal meetups.'}
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Creator Attribution */}
          <div className="p-3.5 bg-teal-50/70 border border-teal-200/80 rounded-2xl flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-800 block">
                {isEs ? 'Perfil Coordinador Vinculado' : 'Linked Coordinator Profile'}
              </span>
              <p className="text-xs font-bold text-stone-900">
                {userProfile.display_name} ({currentUser.public_reference})
              </p>
            </div>
          </div>

          {/* Group Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block">
                {isEs ? 'Nombre del Grupo (Español) *' : 'Group Name (Spanish) *'}
              </label>
              <input
                type="text"
                required
                value={nameEs}
                onChange={(e) => setNameEs(e.target.value)}
                placeholder="Ej. Club de Buceo & Arrecifes Playa"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block">
                {isEs ? 'Nombre en Inglés (Opcional)' : 'Name in English'}
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. PDC Scuba & Reef Explorers"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
              />
            </div>
          </div>

          {/* Category & Alphabetical Area Select */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <BilingualCreatableSelect
              label={isEs ? 'Categoría o Enfoque del Grupo *' : 'Group Category or Focus *'}
              value={category}
              onChange={setCategory}
              options={GROUP_CATEGORIES_BILINGUAL}
              language={language}
              placeholder={isEs ? 'Seleccionar o escribir...' : 'Select or type...'}
              newItemLabel={isEs ? 'Nueva +' : 'New +'}
              required
            />

            <AlphabeticalAreaSelect
              value={locationCode}
              onChange={(val) => setLocationCode(val as LocationCode)}
              language={language}
              label={isEs ? 'Zona Base / Hub (Orden Alfabético)' : 'Base Hub (Alphabetical)'}
            />
          </div>

          {/* Group Logo Upload (Not Just URL) */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-teal-800" />
                {isEs ? 'Logo o Insignia del Grupo' : 'Group Logo / Badge'}
              </span>
              <span className="text-[10px] text-stone-400">
                {isEs ? 'Subir archivo o pegar URL' : 'Upload file or paste URL'}
              </span>
            </label>
            <div className="flex items-center gap-3">
              <img
                src={profileImageUrl}
                alt="Group logo preview"
                className="w-12 h-12 rounded-xl object-cover border border-stone-300 shrink-0 bg-white"
              />
              <div className="flex-1 space-y-1.5 min-w-0">
                <label className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg text-xs font-semibold cursor-pointer shadow-2xs">
                  <Upload className="w-3 h-3 text-teal-800" />
                  <span>{isEs ? 'Subir Logo del Grupo' : 'Upload Group Logo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="url"
                  value={profileImageUrl}
                  onChange={(e) => setProfileImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-1.5 bg-white border border-stone-200 rounded-lg text-[11px] text-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Cover Image Upload (Not Just URL) + Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-teal-700" />
                <span>{isEs ? 'Foto de Portada' : 'Cover Image'}</span>
              </label>
              <label className="inline-flex items-center gap-1 py-1 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold cursor-pointer">
                <Upload className="w-3 h-3 text-teal-800" />
                <span>{isEs ? 'Subir Archivo' : 'Upload File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {GROUP_COVER_PRESETS.map((preset) => {
                const isSelected = coverUrl === preset.url;
                return (
                  <button
                    type="button"
                    key={preset.label}
                    onClick={() => setCoverUrl(preset.url)}
                    className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${
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
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="O escribe una URL de imagen..."
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 mt-1"
            />
          </div>

          {/* Social Links & Group Channels */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-teal-800" />
              <span>{isEs ? 'Canales Oficiales & Redes del Grupo' : 'Official Channels & Group Socials'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>WhatsApp del Grupo (URL o número)</span>
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="https://chat.whatsapp.com/... o +52..."
                  className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700 flex items-center gap-1.5">
                  <Instagram className="w-3 h-3 text-pink-600" />
                  <span>Instagram del Grupo</span>
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@colectivoriviera"
                  className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700 flex items-center gap-1.5">
                  <Facebook className="w-3 h-3 text-blue-600" />
                  <span>Facebook del Grupo</span>
                </label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/groups/..."
                  className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-teal-700" />
                  <span>{isEs ? 'Sitio Web del Grupo' : 'Group Website'}</span>
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://colectivo.org"
                  className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Meeting Frequency & Join Policy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <BilingualCreatableSelect
              label={isEs ? 'Frecuencia de Encuentros' : 'Meeting Frequency'}
              value={meetingFrequency}
              onChange={setMeetingFrequency}
              options={MEETING_FREQUENCIES_BILINGUAL}
              language={language}
              placeholder={isEs ? 'Seleccionar o escribir...' : 'Select or type...'}
              newItemLabel={isEs ? 'Nueva +' : 'New +'}
            />

            <BilingualCreatableSelect
              label={isEs ? 'Política de Ingreso' : 'Join Policy'}
              value={joinPolicy}
              onChange={(val) => setJoinPolicy(val as any)}
              options={JOIN_POLICIES_BILINGUAL}
              language={language}
              placeholder={isEs ? 'Seleccionar...' : 'Select...'}
              newItemLabel={isEs ? 'Nueva +' : 'New +'}
            />
          </div>

          {/* Alphabetical Interests & Tags Select */}
          <AlphabeticalInterestsSelect
            selectedInterests={tags}
            onChange={setTags}
            language={language}
            label={isEs ? 'Etiquetas & Temas de Interés del Colectivo' : 'Topics & Lifestyle Interests'}
          />

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-800 block">
              {isEs ? 'Descripción del Colectivo' : 'Group Description'}
            </label>
            <textarea
              rows={3}
              value={descriptionEs}
              onChange={(e) => setDescriptionEs(e.target.value)}
              placeholder={
                isEs
                  ? 'Objetivo del grupo, tipo de miembros, qué actividades hacen juntos...'
                  : 'Goal of the group, who should join, activities you do together...'
              }
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 resize-none"
            />
          </div>

          {/* FAQs Section: Up to 5 FAQs */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5 text-teal-800" />
                <span>
                  {isEs ? 'Preguntas Frecuentes del Grupo (Hasta 5)' : 'Group FAQs (Up to 5)'}
                </span>
              </h4>
              <span className="text-[11px] text-stone-500 font-medium">
                {faqs.length}/5
              </span>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-3 bg-white rounded-xl border border-stone-200 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-teal-800">
                      {isEs ? `Pregunta ${index + 1}` : `Question ${index + 1}`}
                    </span>
                    {faqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(index)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                    placeholder={isEs ? '¿Cuál es la pregunta frecuente?' : 'What is the question?'}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-900"
                  />
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                    placeholder={isEs ? 'Respuesta clara y detallada...' : 'Clear and helpful answer...'}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900"
                  />
                </div>
              ))}

              {faqs.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="w-full py-2 px-3 border border-dashed border-teal-800/40 hover:border-teal-800 text-teal-800 hover:bg-teal-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isEs ? 'Añadir Pregunta Frecuente' : 'Add FAQ Question'}</span>
                </button>
              )}
            </div>
          </div>

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
              <Users className="w-3.5 h-3.5" />
              <span>{isEs ? 'Crear Grupo Ahora' : 'Create Group Now'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
