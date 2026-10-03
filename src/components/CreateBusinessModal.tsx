import React, { useState } from 'react';
import {
  Building2,
  X,
  Plus,
  Check,
  ShieldCheck,
  MapPin,
  DollarSign,
  Clock,
  Instagram,
  Facebook,
  Linkedin,
  Globe,
  Mail,
  Phone,
  Tag,
  Upload,
  Image as ImageIcon,
  Sparkles,
  HelpCircle,
  Trash2,
  Search,
  Gift,
} from 'lucide-react';
import { Language, User, LocationCode, PriceTier } from '../types';
import { playaVidaStore } from '../lib/storage';
import { LOCATIONS } from '../lib/constants';
import { translations } from '../lib/i18n';
import { BilingualCreatableSelect, SelectOption } from './BilingualCreatableSelect';
import { AlphabeticalAreaSelect } from './AlphabeticalAreaSelect';
import { AlphabeticalInterestsSelect } from './AlphabeticalInterestsSelect';

const BUSINESS_CATEGORIES_BILINGUAL: SelectOption[] = [
  { value: 'Gastronomía y Restaurantes', label_es: 'Gastronomía y Restaurantes', label_en: 'Food, Restaurants & Cafes' },
  { value: 'Bienestar, Spas y Yoga', label_es: 'Bienestar, Spas y Yoga', label_en: 'Wellness, Spas & Yoga' },
  { value: 'Buceo y Deportes Acuáticos', label_es: 'Buceo y Deportes Acuáticos', label_en: 'Diving & Water Sports' },
  { value: 'Boutiques y Diseño', label_es: 'Boutiques y Diseño', label_en: 'Boutiques & Sustainable Design' },
  { value: 'Vida Nocturna y Bares', label_es: 'Vida Nocturna y Bares', label_en: 'Nightlife, Cocktails & Bars' },
  { value: 'Coworking y Nómadas Digitales', label_es: 'Coworking y Nómadas Digitales', label_en: 'Coworking & Nomad Spaces' },
  { value: 'Servicios Profesionales', label_es: 'Servicios Profesionales', label_en: 'Professional Services & Real Estate' },
  { value: 'Arte y Galerías', label_es: 'Arte y Galerías', label_en: 'Art, Studios & Galleries' },
];

const PRICE_TIERS_BILINGUAL: SelectOption[] = [
  { value: '$', label_es: '$ (Económico / Casual)', label_en: '$ (Budget / Casual)' },
  { value: '$$', label_es: '$$ (Moderado / Accesible)', label_en: '$$ (Moderate / Accessible)' },
  { value: '$$$', label_es: '$$$ (Gama Media Alta / Premium)', label_en: '$$$ (Upscale / Premium)' },
  { value: '$$$$', label_es: '$$$$ (Alta Gama / Exclusivo)', label_en: '$$$$ (Fine Dining / Luxury)' },
];

const PAYMENT_METHODS_BILINGUAL: SelectOption[] = [
  { value: 'Efectivo y Tarjetas', label_es: 'Efectivo y Tarjetas (Visa/MC)', label_en: 'Cash & Cards (Visa/MC)' },
  { value: 'Solo Tarjeta / Cashless', label_es: 'Solo Tarjeta / 100% Cashless', label_en: 'Cards Only / 100% Cashless' },
  { value: 'Solo Efectivo', label_es: 'Solo Efectivo (Pesos o USD)', label_en: 'Cash Only (Pesos or USD)' },
  { value: 'Tarjetas, Apple Pay & Cripto', label_es: 'Tarjetas, Apple Pay & Cripto (USDT/BTC)', label_en: 'Cards, Apple Pay & Crypto (USDT/BTC)' },
  { value: 'Transferencia SPEI & Tarjetas', label_es: 'Transferencia SPEI & Tarjetas', label_en: 'SPEI Wire Transfer & Cards' },
];

interface FAQItem {
  question: string;
  answer: string;
}

interface CreateBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  language: Language;
  onBusinessCreated: (businessId: string) => void;
  onOpenAuth: () => void;
}

export const CreateBusinessModal: React.FC<CreateBusinessModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  language,
  onBusinessCreated,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const isEs = language === 'es';

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Core info
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Gastronomía y Restaurantes');
  const [locationCode, setLocationCode] = useState<LocationCode>('PDC');
  const [priceTier, setPriceTier] = useState<string>('$$');
  const [paymentMethods, setPaymentMethods] = useState<string>('Efectivo y Tarjetas');
  const [openingHours, setOpeningHours] = useState('Mar - Dom: 09:00 - 22:00');
  const [descriptionEs, setDescriptionEs] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [servicesInput, setServicesInput] = useState('Desayunos, Café de especialidad, WiFi rápido');
  const [tags, setTags] = useState<string[]>(['Gastronomía Local', 'Coworking']);

  // Media (uploads + URL fallback)
  const [logoUrl, setLogoUrl] = useState(
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'
  );
  const [coverUrl, setCoverUrl] = useState(
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
  );

  // Social & Contacts
  const [facebookUrl, setFacebookUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bookingUrl, setBookingUrl] = useState('');

  // Special Offer
  const [specialOffer, setSpecialOffer] = useState('');

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  // Up to 5 FAQs
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      question: isEs ? '¿Aceptan reservaciones o walk-ins?' : 'Do you accept reservations or walk-ins?',
      answer: isEs
        ? 'Aceptamos tanto reservaciones previas como clientes sin cita según disponibilidad.'
        : 'We accept both advance reservations and walk-ins depending on capacity.',
    },
  ]);

  const [publishImmediately, setPublishImmediately] = useState(true);

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 bg-teal-50 text-teal-800 rounded-full flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
              {isEs ? 'Registrar Negocio Local' : 'Register Local Business'}
            </h3>
            <p className="text-xs text-stone-600">
              {isEs
                ? 'Inicia sesión con tu correo para registrar tu negocio, gestionar tu borrador privado y publicar tu mini-web.'
                : 'Sign in to register your business, manage your private draft and publish your showcase.'}
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs"
          >
            {isEs ? 'Iniciar Sesión' : 'Sign In'}
          </button>
        </div>
      </div>
    );
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoUrl(reader.result);
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
    if (!name.trim()) return;

    const services = servicesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const locationObj = LOCATIONS.find((l) => l.code === locationCode);
    const locationLabel = locationObj
      ? `${locationObj.name_es}`
      : 'Playa del Carmen';

    const validFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim());

    const newBiz = playaVidaStore.createBusinessDraft(currentUser.id, {
      name: name.trim(),
      category: category as any,
      price_tier: (priceTier as PriceTier) || '$$',
      payment_methods: [paymentMethods],
      opening_hours_summary: openingHours.trim() || undefined,
      instagram_handle: instagramHandle.trim() || undefined,
      facebook_url: facebookUrl.trim() || undefined,
      linkedin_url: linkedinUrl.trim() || undefined,
      website_url: websiteUrl.trim() || undefined,
      email_address: emailAddress.trim() || undefined,
      whatsapp_number: whatsappNumber.trim() || undefined,
      special_offer: specialOffer.trim() || undefined,
      tags: tags.length > 0 ? tags : services,
      seo_title: seoTitle.trim() || `${name.trim()} | Riviera Maya`,
      seo_description: seoDescription.trim() || descriptionEs || descriptionEn,
      seo_keywords: seoKeywords.trim() || tags.join(', '),
      faqs: validFaqs,
      location_code: locationCode,
      location_label: locationLabel,
      description_es: descriptionEs || `${name.trim()} es un negocio local en ${locationLabel}.`,
      description_en: descriptionEn || `${name.trim()} is a local business in ${locationLabel}.`,
      cover_url: coverUrl,
      logo_url: logoUrl,
      services,
      languages: ['Español', 'English'],
    });

    // Save private contacts
    playaVidaStore.savePrivateContactDetails(newBiz.id, currentUser.id, {
      address: address.trim(),
      city: locationObj?.name_es || 'Playa del Carmen',
      latitude: locationObj?.latitude || 20.6358,
      longitude: locationObj?.longitude || -87.0622,
      phone: phone.trim() || whatsappNumber.trim(),
      email: emailAddress.trim(),
      whatsapp: whatsappNumber.trim(),
      website: websiteUrl.trim(),
      booking_url: bookingUrl.trim(),
    });

    // Publish if requested
    if (publishImmediately) {
      playaVidaStore.publishBusiness(newBiz.id);
    }

    onBusinessCreated(newBiz.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-100 bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-2xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-base">
                {isEs ? 'Registrar Negocio Local' : 'Register Local Business'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isEs
                  ? `Paso ${step} de 3: ${
                      step === 1
                        ? 'Identidad & Ubicación'
                        : step === 2
                        ? 'Redes, Contacto & Oferta'
                        : 'SEO & Preguntas Frecuentes'
                    }`
                  : `Step ${step} of 3: ${
                      step === 1
                        ? 'Identity & Location'
                        : step === 2
                        ? 'Socials, Contacts & Special Offer'
                        : 'SEO & FAQs'
                    }`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50/70 px-4 pt-2 gap-1 text-xs">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`py-2 px-3.5 rounded-t-xl font-semibold transition-all border-b-2 ${
              step === 1
                ? 'border-teal-800 text-teal-900 bg-white shadow-2xs'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            1. {isEs ? 'Identidad & Multimedia' : 'Identity & Media'}
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`py-2 px-3.5 rounded-t-xl font-semibold transition-all border-b-2 ${
              step === 2
                ? 'border-teal-800 text-teal-900 bg-white shadow-2xs'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            2. {isEs ? 'Contacto, Redes & Oferta' : 'Contact & Offer'}
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`py-2 px-3.5 rounded-t-xl font-semibold transition-all border-b-2 ${
              step === 3
                ? 'border-teal-800 text-teal-900 bg-white shadow-2xs'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            3. {isEs ? 'SEO & FAQs (5 máx)' : 'SEO & FAQs (Max 5)'}
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* STEP 1: Identity, Media, Area, Description */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700">
                    {isEs ? 'Nombre del negocio *' : 'Business Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Café del Mar Riviera"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <BilingualCreatableSelect
                    label={isEs ? 'Categoría de Negocio *' : 'Business Category *'}
                    value={category}
                    onChange={setCategory}
                    options={BUSINESS_CATEGORIES_BILINGUAL}
                    language={language}
                    placeholder={isEs ? 'Seleccionar o escribir...' : 'Select or type...'}
                    newItemLabel={isEs ? 'Nueva +' : 'New +'}
                    required
                  />
                </div>

                {/* Alphabetical Area Select with + Additional Option */}
                <div className="space-y-1 sm:col-span-1">
                  <AlphabeticalAreaSelect
                    value={locationCode}
                    onChange={(val) => setLocationCode(val as LocationCode)}
                    language={language}
                    label={isEs ? 'Zona / Área (Orden Alfabético)' : 'Zone / Area (Alphabetical)'}
                  />
                </div>

                {/* LOGO UPLOAD NOT JUST URL */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 sm:col-span-1">
                  <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-teal-800" />
                      {isEs ? 'Logo del Negocio' : 'Business Logo'}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {isEs ? 'Subir archivo o URL' : 'Upload or URL'}
                    </span>
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="w-12 h-12 rounded-xl object-cover border border-stone-300 shrink-0 bg-white"
                    />
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <label className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg text-xs font-semibold cursor-pointer shadow-2xs">
                        <Upload className="w-3 h-3 text-teal-800" />
                        <span>{isEs ? 'Subir Logo' : 'Upload Logo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full p-1.5 bg-white border border-stone-200 rounded-lg text-[11px] text-stone-900"
                      />
                    </div>
                  </div>
                </div>

                {/* COVER IMAGE UPLOAD NOT JUST URL */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 sm:col-span-1">
                  <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-teal-800" />
                      {isEs ? 'Imagen de Portada (Cover)' : 'Cover Image'}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {isEs ? 'Subir archivo o URL' : 'Upload or URL'}
                    </span>
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={coverUrl}
                      alt="Cover preview"
                      className="w-16 h-12 rounded-xl object-cover border border-stone-300 shrink-0 bg-white"
                    />
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <label className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg text-xs font-semibold cursor-pointer shadow-2xs">
                        <Upload className="w-3 h-3 text-teal-800" />
                        <span>{isEs ? 'Subir Portada' : 'Upload Cover'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverUpload}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="url"
                        value={coverUrl}
                        onChange={(e) => setCoverUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full p-1.5 bg-white border border-stone-200 rounded-lg text-[11px] text-stone-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Price Tier & Payment Methods */}
                <div className="space-y-1 sm:col-span-1">
                  <BilingualCreatableSelect
                    label={isEs ? 'Nivel de Precios' : 'Price Tier'}
                    value={priceTier}
                    onChange={setPriceTier}
                    options={PRICE_TIERS_BILINGUAL}
                    language={language}
                    placeholder={isEs ? 'Seleccionar o escribir...' : 'Select or type...'}
                    newItemLabel={isEs ? 'Nuevo +' : 'New +'}
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <BilingualCreatableSelect
                    label={isEs ? 'Métodos de Pago Aceptados' : 'Payment Methods Accepted'}
                    value={paymentMethods}
                    onChange={setPaymentMethods}
                    options={PAYMENT_METHODS_BILINGUAL}
                    language={language}
                    placeholder={isEs ? 'Seleccionar o escribir...' : 'Select or type...'}
                    newItemLabel={isEs ? 'Nuevo +' : 'New +'}
                  />
                </div>

                {/* Opening Hours */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>{isEs ? 'Horario de Atención Resumido' : 'Business Hours Summary'}</span>
                  </label>
                  <input
                    type="text"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    placeholder="Ej. Mar - Dom: 09:00 - 22:00"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700">
                    {isEs ? 'Descripción (Español)' : 'Description (Spanish)'}
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionEs}
                    onChange={(e) => setDescriptionEs(e.target.value)}
                    placeholder="Describe brevemente la propuesta de valor y atmósfera..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700">
                    {isEs ? 'Descripción (Inglés)' : 'Description (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Short description for international visitors and expats..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white"
                  />
                </div>

                {/* Tags & Interests with AlphabeticalInterestsSelect */}
                <div className="sm:col-span-2">
                  <AlphabeticalInterestsSelect
                    selectedInterests={tags}
                    onChange={setTags}
                    language={language}
                    label={isEs ? 'Etiquetas & Categorías de Interés' : 'Tags & Categories of Interest'}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={!name.trim()}
                  onClick={() => setStep(2)}
                  className="py-2.5 px-6 bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  {isEs ? 'Siguiente: Redes, Contacto & Oferta →' : 'Next: Contact & Socials →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Social Links, Contacts, Special Offer */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-xs text-teal-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  {isEs
                    ? 'Configura las redes oficiales, canales de mensajería y la oferta especial que destacará en tu perfil público.'
                    : 'Set up your official socials, direct messaging channels, and the special offer showcased on your profile.'}
                </span>
              </div>

              {/* Special Offer Highlight */}
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2">
                <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-amber-700" />
                  <span>{isEs ? 'Oferta Especial / Promoción para la Comunidad' : 'Special Offer / Community Perk'}</span>
                </label>
                <input
                  type="text"
                  value={specialOffer}
                  onChange={(e) => setSpecialOffer(e.target.value)}
                  placeholder={
                    isEs
                      ? 'Ej. 15% de descuento en tu primer desayuno o tour con código PLAYAVIDA'
                      : 'e.g., 15% off first meal or dive with code PLAYAVIDA'
                  }
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
                <p className="text-[11px] text-amber-700">
                  {isEs
                    ? 'Esta oferta se destacará con un badge dorado en la cabecera de tu perfil.'
                    : 'This offer will be highlighted with a golden badge at the top of your page.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Business / Directo</span>
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+52 984 123 4567"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white"
                  />
                </div>

                {/* Instagram Handle */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span>Instagram Oficial</span>
                  </label>
                  <input
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="@negociolocal"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white"
                  />
                </div>

                {/* Facebook URL */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <Facebook className="w-3.5 h-3.5 text-blue-600" />
                    <span>Facebook URL</span>
                  </label>
                  <input
                    type="url"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/tunegocio"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white"
                  />
                </div>

                {/* LinkedIn URL */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-sky-700" />
                    <span>LinkedIn URL</span>
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/company/tunegocio"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white"
                  />
                </div>

                {/* Website URL */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-700" />
                    <span>{isEs ? 'Sitio Web Oficial' : 'Official Website'}</span>
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://tunegocio.com"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-stone-500" />
                    <span>{isEs ? 'Correo Electrónico' : 'Email Address'}</span>
                  </label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="contacto@tunegocio.com"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white"
                  />
                </div>

                {/* Physical Address */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700">
                    {isEs ? 'Dirección Física (Calle, número y cruzamientos)' : 'Physical Address'}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej. Calle 38 Norte entre 5ta Avenida y Mar Caribe"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white"
                  />
                </div>

                {/* Booking / Reservation URL */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700">
                    {isEs ? 'Enlace de Reserva / Menú Digital' : 'Booking / Digital Menu URL'}
                  </label>
                  <input
                    type="url"
                    value={bookingUrl}
                    onChange={(e) => setBookingUrl(e.target.value)}
                    placeholder="https://opentable.com/... o enlace de menú"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2 px-3 text-xs text-stone-600 hover:text-stone-900"
                >
                  ← {isEs ? 'Volver a Información' : 'Back to Identity'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-2.5 px-6 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  {isEs ? 'Siguiente: SEO & FAQs →' : 'Next: SEO & FAQs →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SEO & FAQs (Up to 5) */}
          {step === 3 && (
            <div className="space-y-5">
              {/* SEO Section */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <Search className="w-3.5 h-3.5 text-teal-800" />
                  <span>{isEs ? 'Configuración SEO & Metaetiquetas' : 'SEO & Meta Fields'}</span>
                </h4>

                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {isEs ? 'Título SEO (Meta Title)' : 'SEO Title'}
                    </label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder={isEs ? 'Ej. Café del Mar | Mejor Café de Especialidad en Playa del Carmen' : 'e.g. Cafe del Mar | Best Specialty Coffee in Playa del Carmen'}
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {isEs ? 'Descripción SEO (Meta Description)' : 'SEO Description'}
                    </label>
                    <textarea
                      rows={2}
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder={isEs ? 'Breve resumen optimizado para motores de búsqueda (máx 160 caracteres)...' : 'Brief summary optimized for search engines (max 160 chars)...'}
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {isEs ? 'Palabras Clave SEO (separadas por comas)' : 'SEO Keywords (comma separated)'}
                    </label>
                    <input
                      type="text"
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      placeholder="cafe de especialidad, playa del carmen, desayunos, wifi nomadas"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* FAQs Section: Up to 5 FAQs */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <HelpCircle className="w-3.5 h-3.5 text-teal-800" />
                    <span>
                      {isEs ? 'Preguntas Frecuentes (Hasta 5)' : 'Frequently Asked Questions (Up to 5)'}
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

              {/* Publish immediately checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <input
                    type="checkbox"
                    checked={publishImmediately}
                    onChange={(e) => setPublishImmediately(e.target.checked)}
                    className="rounded text-teal-800 focus:ring-teal-800"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-stone-800 block">
                      {isEs ? 'Publicar inmediatamente en el directorio' : 'Publish immediately to directory'}
                    </span>
                    <span className="text-stone-500 text-[11px]">
                      {isEs
                        ? 'Si se desmarca, se guardará como borrador privado accesible únicamente por ti.'
                        : 'If unchecked, it will be saved as a private draft accessible only to you.'}
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2 px-3 text-xs text-stone-600 hover:text-stone-900"
                >
                  ← {isEs ? 'Volver a Contacto' : 'Back to Contacts'}
                </button>

                <button
                  type="submit"
                  className="py-2.5 px-6 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  {isEs ? 'Guardar y Publicar Negocio' : 'Save & Publish Business'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
