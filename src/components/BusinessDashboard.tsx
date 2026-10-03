import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  MapPin,
  Calendar,
  CreditCard,
  BarChart3,
  Image,
  Clock,
  CheckCircle,
  AlertCircle,
  Check,
  ShieldCheck,
  X,
  Plus,
  MessageSquare,
  Lock,
  QrCode,
  Download,
  Copy,
  TrendingUp,
  Sparkles,
  Activity,
  RefreshCw,
  Calculator,
  Users,
  Radio,
  Send,
  Bell,
  Filter,
  Search,
  Award,
  Trash2,
  Camera,
  Gift,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  PublicBusinessProjection,
  Language,
  PrivateBusinessContactDetails,
  BusinessSubscription,
  User,
  BroadcastCampaign,
  LoyaltyBonusFeature,
} from '../types';
import { playaVidaStore } from '../lib/storage';
import { translations } from '../lib/i18n';
import { MerchantRoiSimulator } from './MerchantRoiSimulator';

interface BusinessDashboardProps {
  business: PublicBusinessProjection;
  currentUser: User;
  language: Language;
  onClose: () => void;
  onBusinessUpdated: () => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  business,
  currentUser,
  language,
  onClose,
  onBusinessUpdated,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<
    'contacts' | 'billing' | 'analytics' | 'roi_simulator' | 'qr' | 'gallery' | 'reviews' | 'members_broadcasts' | 'loyalty_bonus'
  >('contacts');

  // Load existing private contacts
  const existingContacts =
    playaVidaStore.getOwnerPrivateContactDetails(business.id, currentUser.id) || {
      business_id: business.id,
      updated_at: new Date().toISOString(),
    };

  const [formData, setFormData] = useState<Partial<PrivateBusinessContactDetails>>({
    address: existingContacts.address || '',
    city: existingContacts.city || 'Playa del Carmen',
    latitude: existingContacts.latitude || 20.6358,
    longitude: existingContacts.longitude || -87.0622,
    phone: existingContacts.phone || '',
    email: existingContacts.email || '',
    whatsapp: existingContacts.whatsapp || '',
    website: existingContacts.website || '',
    booking_url: existingContacts.booking_url || '',
  });

  const [savedNotice, setSavedNotice] = useState(false);
  const [subscription, setSubscription] = useState<BusinessSubscription>(
    playaVidaStore.getBusinessSubscription(business.id)
  );
  const [showOxxoModal, setShowOxxoModal] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [replyText, setReplyText] = useState<{ [reviewId: string]: string }>({});

  // Members & Broadcasts states
  const [followers, setFollowers] = useState(() => playaVidaStore.getFollowersForBusiness(business.id));
  const [followerSearch, setFollowerSearch] = useState('');
  const [broadcasts, setBroadcasts] = useState<BroadcastCampaign[]>(() =>
    playaVidaStore.getBroadcastCampaigns('business', business.id)
  );
  const [isComposingBroadcast, setIsComposingBroadcast] = useState(false);
  const [bcTitle, setBcTitle] = useState('');
  const [bcMessage, setBcMessage] = useState('');
  const [bcSegment, setBcSegment] = useState<'all_members' | 'active_this_month' | 'new_members'>('all_members');
  const [bcSuccess, setBcSuccess] = useState(false);

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcTitle.trim() || !bcMessage.trim()) return;
    const newCamp = playaVidaStore.createBroadcastCampaign(currentUser.id, {
      target_type: 'business',
      target_id: business.id,
      target_name: business.name,
      title: bcTitle.trim(),
      message: bcMessage.trim(),
      target_segment: bcSegment,
      recipient_count: followers.length || 142,
      plan_price_mxn: 0,
      payment_method: 'card',
    });
    setBroadcasts([newCamp, ...broadcasts]);
    setBcTitle('');
    setBcMessage('');
    setIsComposingBroadcast(false);
    setBcSuccess(true);
    setTimeout(() => setBcSuccess(false), 4000);
  };

  const [analyticsData, setAnalyticsData] = useState(
    playaVidaStore.getBusinessContactAnalytics(business.id)
  );
  const [analyticsEvents, setAnalyticsEvents] = useState(
    playaVidaStore.getBusinessRecentAnalyticsEvents(business.id)
  );
  const [analyticsRange, setAnalyticsRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [copiedLink, setCopiedLink] = useState(false);
  const [simulatedNotice, setSimulatedNotice] = useState<string | null>(null);

  // Loyalty Program and Bonus Features states
  const [loyaltyProgram, setLoyaltyProgram] = useState(() =>
    playaVidaStore.getLoyaltyProgramByBusinessId(business.id)
  );
  const [isAddingBonus, setIsAddingBonus] = useState(false);
  const [bonusTitleEs, setBonusTitleEs] = useState('');
  const [bonusTitleEn, setBonusTitleEn] = useState('');
  const [bonusDescEs, setBonusDescEs] = useState('');
  const [bonusDescEn, setBonusDescEn] = useState('');
  const [bonusExtraStamps, setBonusExtraStamps] = useState(1);
  const [bonusRequiresPhoto, setBonusRequiresPhoto] = useState(false);
  const [bonusPhotoPromptEs, setBonusPhotoPromptEs] = useState('');
  const [bonusPhotoPromptEn, setBonusPhotoPromptEn] = useState('');
  const [bonusNotice, setBonusNotice] = useState<string | null>(null);

  const handleApplyBonusTemplate = (template: 'latte_art' | 'book_signing' | 'reusable_cup') => {
    if (template === 'latte_art') {
      setBonusTitleEs('Comparte foto de tu arte latte o topping especial');
      setBonusTitleEn('Share photo of your latte art or specialty topping');
      setBonusDescEs('Pide tu bebida favorita, toma una foto de la decoración o topping y súbela para recibir un sello adicional.');
      setBonusDescEn('Order your favorite drink, snap a photo of the latte art or topping, and upload to earn an extra stamp.');
      setBonusExtraStamps(1);
      setBonusRequiresPhoto(true);
      setBonusPhotoPromptEs('Sube una foto clara de tu bebida servida en nuestra barra');
      setBonusPhotoPromptEn('Upload a clear photo of your drink served at our bar');
    } else if (template === 'book_signing') {
      setBonusTitleEs('Ven a la firma de libros o tertulia esta semana');
      setBonusTitleEn('Come to the book signing or talk this week');
      setBonusDescEs('Acompáñanos en el evento cultural de esta semana en nuestro patio y obtén un sello de cortesía.');
      setBonusDescEn('Join us at this week’s cultural or book signing session in our patio and get a complimentary stamp.');
      setBonusExtraStamps(1);
      setBonusRequiresPhoto(false);
      setBonusPhotoPromptEs('');
      setBonusPhotoPromptEn('');
    } else if (template === 'reusable_cup') {
      setBonusTitleEs('Reto Eco: Trae tu vaso o termo reutilizable');
      setBonusTitleEn('Eco Quest: Bring your reusable cup or thermos');
      setBonusDescEs('Reduce residuos en Playa del Carmen trayendo tu propio recipiente para llevar.');
      setBonusDescEn('Help reduce single-use cups in Playa by bringing your own reusable tumbler.');
      setBonusExtraStamps(1);
      setBonusRequiresPhoto(true);
      setBonusPhotoPromptEs('Muestra una foto de tu bebida en tu recipiente reutilizable');
      setBonusPhotoPromptEn('Show a photo of your drink in your reusable container');
    }
    setIsAddingBonus(true);
  };

  const handleSaveBonusFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loyaltyProgram) return;
    if (!bonusTitleEs.trim() && !bonusTitleEn.trim()) return;

    const newBonus = playaVidaStore.addBonusFeature(loyaltyProgram.id, {
      title_es: bonusTitleEs.trim() || bonusTitleEn.trim(),
      title_en: bonusTitleEn.trim() || bonusTitleEs.trim(),
      description_es: bonusDescEs.trim() || bonusDescEn.trim(),
      description_en: bonusDescEn.trim() || bonusDescEs.trim(),
      extra_stamps: Number(bonusExtraStamps) || 1,
      requires_photo_upload: bonusRequiresPhoto,
      photo_prompt_es: bonusRequiresPhoto ? (bonusPhotoPromptEs.trim() || undefined) : undefined,
      photo_prompt_en: bonusRequiresPhoto ? (bonusPhotoPromptEn.trim() || undefined) : undefined,
    });

    if (newBonus) {
      setLoyaltyProgram(playaVidaStore.getLoyaltyProgramByBusinessId(business.id));
      setIsAddingBonus(false);
      setBonusTitleEs('');
      setBonusTitleEn('');
      setBonusDescEs('');
      setBonusDescEn('');
      setBonusExtraStamps(1);
      setBonusRequiresPhoto(false);
      setBonusPhotoPromptEs('');
      setBonusPhotoPromptEn('');
      setBonusNotice(language === 'es' ? '¡Reto de bonificación agregado exitosamente!' : 'Bonus quest added successfully!');
      setTimeout(() => setBonusNotice(null), 4000);
      onBusinessUpdated();
    }
  };

  const handleDeleteBonusFeature = (bonusId: string) => {
    if (!loyaltyProgram) return;
    const ok = playaVidaStore.removeBonusFeature(loyaltyProgram.id, bonusId);
    if (ok) {
      setLoyaltyProgram(playaVidaStore.getLoyaltyProgramByBusinessId(business.id));
      setBonusNotice(language === 'es' ? 'Reto eliminado.' : 'Quest removed.');
      setTimeout(() => setBonusNotice(null), 3000);
      onBusinessUpdated();
    }
  };

  const refreshAnalytics = () => {
    setAnalyticsData(playaVidaStore.getBusinessContactAnalytics(business.id));
    setAnalyticsEvents(playaVidaStore.getBusinessRecentAnalyticsEvents(business.id));
  };

  const handleSimulateEvent = (
    type: 'whatsapp_clicked' | 'phone_revealed' | 'directions_clicked' | 'booking_clicked',
    label: string
  ) => {
    playaVidaStore.recordContactAnalyticsEvent(business.id, type, undefined, language);
    refreshAnalytics();
    setSimulatedNotice(label);
    setTimeout(() => setSimulatedNotice(null), 2500);
  };

  const reviews = playaVidaStore.getReviewsForBusiness(business.id);

  const isEntitled =
    subscription.status === 'active' ||
    (subscription.status === 'grace_period' &&
      subscription.grace_period_end &&
      new Date(subscription.grace_period_end) > new Date());

  const handleSaveContacts = (e: React.FormEvent) => {
    e.preventDefault();
    playaVidaStore.savePrivateContactDetails(business.id, currentUser.id, formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
    onBusinessUpdated();
  };

  const handleStripeUpgrade = (planKey: 'starter_contact' | 'pro_community') => {
    playaVidaStore.upgradeWithStripeCard(business.id, planKey);
    setSubscription(playaVidaStore.getBusinessSubscription(business.id));
    onBusinessUpdated();
  };

  const handleCreateOxxo = (planKey: 'starter_contact' | 'pro_community') => {
    const sub = playaVidaStore.createOxxoPaymentVoucher(business.id, planKey);
    setSubscription(sub);
    setShowOxxoModal(true);
  };

  const handleConfirmOxxoPayment = () => {
    playaVidaStore.confirmOxxoPayment(business.id);
    setSubscription(playaVidaStore.getBusinessSubscription(business.id));
    setShowOxxoModal(false);
    onBusinessUpdated();
  };

  const handleCancelSubscription = () => {
    playaVidaStore.cancelSubscription(business.id);
    setSubscription(playaVidaStore.getBusinessSubscription(business.id));
    onBusinessUpdated();
  };

  const handleAddGalleryImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl.trim()) return;
    business.gallery_urls.push(newGalleryUrl.trim());
    setNewGalleryUrl('');
    onBusinessUpdated();
  };

  const handleReplyReview = (reviewId: string) => {
    const text = replyText[reviewId];
    if (!text || !text.trim()) return;
    playaVidaStore.respondToReview(reviewId, business.name, text.trim());
    setReplyText((prev) => ({ ...prev, [reviewId]: '' }));
    onBusinessUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900 leading-tight">
                {t.dashboard_title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                <span>{business.name}</span>
                <span>•</span>
                <span>{business.business_reference}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-stone-200 bg-white overflow-x-auto">
          {[
            { id: 'contacts', label: t.tab_private_contacts, icon: Phone },
            { id: 'billing', label: t.tab_subscription, icon: CreditCard },
            { id: 'analytics', label: t.tab_analytics, icon: BarChart3 },
            { id: 'roi_simulator', label: language === 'es' ? 'Simulador ROI' : 'ROI Simulator', icon: Calculator },
            { id: 'qr', label: language === 'es' ? 'QR y Materiales' : 'QR & Materials', icon: QrCode },
            { id: 'gallery', label: 'Fotos y Galería', icon: Image },
            { id: 'reviews', label: t.tab_reviews_mgmt, icon: MessageSquare },
            { id: 'members_broadcasts', label: language === 'es' ? 'Miembros & Avisos' : 'Members & Broadcasts', icon: Users },
            { id: 'loyalty_bonus', label: language === 'es' ? 'Sellos & Retos' : 'Loyalty & Quests', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSel
                    ? 'border-teal-700 text-teal-800'
                    : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSel ? 'text-teal-700' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: PRIVATE CONTACT FIELDS */}
          {activeTab === 'contacts' && (
            <form onSubmit={handleSaveContacts} className="space-y-6">
              {/* Entitlement Status Banner */}
              <div
                className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                  isEntitled
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
              >
                {isEntitled ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-xs mb-0.5">
                    {isEntitled
                      ? 'Visibilidad de Contacto Activa'
                      : 'Información Privada Guardada (Oculta al público)'}
                  </h4>
                  <p className="leading-relaxed">
                    {isEntitled
                      ? 'Tus datos de contacto están habilitados y disponibles para todos los usuarios registrados que abran tu mini-web.'
                      : 'Puedes ingresar y editar tus datos de contacto libremente sin costo. Para que los usuarios registrados puedan consultarlos, activa uno de los planes de visibilidad.'}
                  </p>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                    <span>{t.contact_address}</span>
                    <span
                      className={`text-[10px] font-medium ${
                        isEntitled ? 'text-emerald-700' : 'text-stone-400'
                      }`}
                    >
                      {isEntitled ? t.field_visibility_active : t.field_visibility_locked}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Ej. Calle 38 Norte entre 5ta Avenida y Mar Caribe"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                    <span>{t.contact_whatsapp}</span>
                    <span
                      className={`text-[10px] font-medium ${
                        isEntitled ? 'text-emerald-700' : 'text-stone-400'
                      }`}
                    >
                      {isEntitled ? t.field_visibility_active : t.field_visibility_locked}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+52 984 000 0000"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                    <span>{t.contact_phone}</span>
                    <span
                      className={`text-[10px] font-medium ${
                        isEntitled ? 'text-emerald-700' : 'text-stone-400'
                      }`}
                    >
                      {isEntitled ? t.field_visibility_active : t.field_visibility_locked}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+52 984 000 0000"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                    <span>{t.contact_email}</span>
                    <span
                      className={`text-[10px] font-medium ${
                        isEntitled ? 'text-emerald-700' : 'text-stone-400'
                      }`}
                    >
                      {isEntitled ? t.field_visibility_active : t.field_visibility_locked}
                    </span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contacto@tunegocio.com"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                    <span>{t.contact_website}</span>
                    <span
                      className={`text-[10px] font-medium ${
                        isEntitled ? 'text-emerald-700' : 'text-stone-400'
                      }`}
                    >
                      {isEntitled ? t.field_visibility_active : t.field_visibility_locked}
                    </span>
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://tunegocio.com"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                    <span>{t.contact_booking}</span>
                    <span
                      className={`text-[10px] font-medium ${
                        isEntitled ? 'text-emerald-700' : 'text-stone-400'
                      }`}
                    >
                      {isEntitled ? t.field_visibility_active : t.field_visibility_locked}
                    </span>
                  </label>
                  <input
                    type="url"
                    value={formData.booking_url}
                    onChange={(e) => setFormData({ ...formData, booking_url: e.target.value })}
                    placeholder="https://tunegocio.com/reservar (Opentable, Calendly, etc.)"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                  />
                </div>
              </div>

              {/* Save footer */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <span className="text-xs text-stone-400">
                  {savedNotice ? '✓ Guardado con éxito' : 'Los cambios son instantáneos.'}
                </span>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  {t.save_changes}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PLANS & BILLING */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              {/* Current Status Card */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                    Estado Actual
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
                      {subscription.plan_name_es}
                    </h3>
                    <span
                      className={`py-0.5 px-2.5 rounded-full text-xs font-bold ${
                        subscription.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : subscription.status === 'grace_period'
                          ? 'bg-amber-100 text-amber-800'
                          : subscription.status === 'pending_oxxo'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {subscription.status === 'active' && 'Activo'}
                      {subscription.status === 'grace_period' && 'En período de gracia'}
                      {subscription.status === 'pending_oxxo' && 'Pendiente de pago OXXO'}
                      {subscription.status === 'expired' && 'Sin suscripción activa'}
                    </span>
                  </div>
                  {subscription.grace_period_end && (
                    <p className="text-xs text-amber-700 mt-1">
                      Período de gracia vigente hasta:{' '}
                      {new Date(subscription.grace_period_end).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {subscription.status === 'active' && (
                  <button
                    onClick={handleCancelSubscription}
                    className="py-2 px-3 border border-stone-300 hover:bg-stone-200/60 text-stone-700 text-xs font-medium rounded-xl transition-colors"
                  >
                    Cancelar Suscripción
                  </button>
                )}
              </div>

              {/* Plan Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Starter Plan */}
                <div className="p-6 rounded-2xl border-2 border-stone-200 hover:border-teal-700/60 bg-white shadow-2xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900">
                      {t.plan_starter}
                    </h4>
                    <div className="text-2xl font-bold text-stone-900">
                      $299 <span className="text-xs font-normal text-stone-500">MXN / mes</span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Habilita la visibilidad pública de tus datos directos de contacto para todos los miembros registrados.
                    </p>
                    <ul className="text-xs text-stone-700 space-y-2 pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span>Modal de contacto estructurado</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span>Dirección física y enlaces a mapas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span>WhatsApp, teléfono y correo verificados</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span>Métricas de intención de contacto</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => handleStripeUpgrade('starter_contact')}
                      className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{t.pay_with_card}</span>
                    </button>
                    <button
                      onClick={() => handleCreateOxxo('starter_contact')}
                      className="w-full py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs rounded-xl transition-colors"
                    >
                      {t.pay_with_oxxo}
                    </button>
                  </div>
                </div>

                {/* Pro Community Plan */}
                <div className="p-6 rounded-2xl border-2 border-teal-700 bg-teal-50/30 shadow-xs space-y-4 flex flex-col justify-between relative">
                  <div className="absolute top-3 right-3 py-0.5 px-2 bg-teal-700 text-white text-[10px] font-bold rounded-full">
                    RECOMENDADO
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900">
                      {t.plan_community}
                    </h4>
                    <div className="text-2xl font-bold text-stone-900">
                      $599 <span className="text-xs font-normal text-stone-500">MXN / mes</span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Todo lo de Contacto Pro, más galería de hasta 10 fotos, respuestas a reseñas, ofertas especiales y programa loyalty nativo.
                    </p>
                    <ul className="text-xs text-stone-700 space-y-2 pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span>Todo lo del Plan Contacto Pro</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span>Galería fotográfica de hasta 10 imágenes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span>Derecho de respuesta a reseñas comunitarias</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span>Publicación de ofertas con códigos QR</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span>Programa nativo de sellos y tarjetas loyalty</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => handleStripeUpgrade('pro_community')}
                      className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{t.pay_with_card}</span>
                    </button>
                    <button
                      onClick={() => handleCreateOxxo('pro_community')}
                      className="w-full py-2 px-4 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-medium text-xs rounded-xl transition-colors"
                    >
                      {t.pay_with_oxxo}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT & INTENT ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Header & Date Range */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <div>
                  <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-stone-900">
                    {language === 'es' ? 'Métricas de Intención y Conversión Directa' : 'Direct Intent & Conversion Analytics'}
                  </h4>
                  <p className="text-xs text-stone-500">
                    {t.analytics_note}
                  </p>
                </div>

                {/* Range pills */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  {(['7d', '30d', 'all'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setAnalyticsRange(range)}
                      className={`py-1 px-2.5 rounded-lg text-[11px] font-semibold transition-colors ${
                        analyticsRange === range
                          ? 'bg-teal-700 text-white'
                          : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {range === '7d' ? (language === 'es' ? '7 días' : '7 days') : range === '30d' ? (language === 'es' ? '30 días' : '30 days') : (language === 'es' ? 'Histórico' : 'All-time')}
                    </button>
                  ))}
                  <button
                    onClick={refreshAnalytics}
                    className="p-1.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-stone-800"
                    title={language === 'es' ? 'Actualizar métricas' : 'Refresh metrics'}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Conversion Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                      {language === 'es' ? 'Tasa de Conversión' : 'Conversion Rate'}
                    </span>
                    <TrendingUp className="w-4 h-4 text-teal-700" />
                  </div>
                  <div className="text-3xl font-bold text-teal-900">
                    {((
                      (analyticsData.whatsapp_clicks +
                        analyticsData.phone_reveals +
                        analyticsData.directions_clicked +
                        analyticsData.website_clicks +
                        analyticsData.booking_clicks) /
                      Math.max(1, analyticsData.modal_opens)
                    ) * 100).toFixed(1)}%
                  </div>
                  <span className="text-[11px] text-teal-700 font-medium">
                    {language === 'es' ? 'De visualización a intención de contacto' : 'From modal open to direct intent'}
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {language === 'es' ? 'Total Intenciones Registradas' : 'Total Direct Actions'}
                  </span>
                  <div className="text-3xl font-bold text-stone-900">
                    {analyticsData.whatsapp_clicks +
                      analyticsData.phone_reveals +
                      analyticsData.directions_clicked +
                      analyticsData.website_clicks +
                      analyticsData.booking_clicks}
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {language === 'es' ? 'WhatsApp, llamada, mapa, reserva' : 'WhatsApp, call, map, booking'}
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {language === 'es' ? 'Aperturas de Ficha Oficial' : 'Official Card Opens'}
                  </span>
                  <div className="text-3xl font-bold text-stone-900">
                    {analyticsData.modal_opens}
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {language === 'es' ? 'Visitas de miembros locales y turistas' : 'Visits from residents & tourists'}
                  </span>
                </div>
              </div>

              {/* Detailed Channels Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                    WhatsApp
                  </span>
                  <div className="text-xl font-bold text-emerald-800">
                    {analyticsData.whatsapp_clicks}
                  </div>
                  <span className="text-[10px] text-stone-400 block">Clicks directos</span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-teal-700 block">
                    {language === 'es' ? 'Teléfono' : 'Phone'}
                  </span>
                  <div className="text-xl font-bold text-teal-800">
                    {analyticsData.phone_reveals}
                  </div>
                  <span className="text-[10px] text-stone-400 block">Revelados</span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-stone-600 block">
                    {language === 'es' ? 'Rutas y Mapa' : 'Map & Directions'}
                  </span>
                  <div className="text-xl font-bold text-stone-900">
                    {analyticsData.directions_clicked}
                  </div>
                  <span className="text-[10px] text-stone-400 block">Cómo llegar</span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-stone-600 block">
                    {language === 'es' ? 'Sitio Web' : 'Website'}
                  </span>
                  <div className="text-xl font-bold text-stone-900">
                    {analyticsData.website_clicks}
                  </div>
                  <span className="text-[10px] text-stone-400 block">Tráfico enviado</span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase text-amber-700 block">
                    {language === 'es' ? 'Reservas' : 'Bookings'}
                  </span>
                  <div className="text-xl font-bold text-amber-900">
                    {analyticsData.booking_clicks}
                  </div>
                  <span className="text-[10px] text-stone-400 block">Mesas/Citas</span>
                </div>
              </div>

              {/* Live Testing / Event Simulator for Merchant */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-700" />
                    <span className="text-xs font-bold text-stone-900">
                      {language === 'es' ? 'Simulador de Prueba en Vivo (Owner Sandbox)' : 'Live Interaction Testing Sandbox'}
                    </span>
                  </div>
                  {simulatedNotice && (
                    <span className="text-xs font-semibold text-emerald-700 animate-pulse">
                      ✓ {simulatedNotice}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600">
                  {language === 'es'
                    ? 'Prueba cómo se registra cada evento en tiempo real. Al pulsar un botón, la métrica se actualizará inmediatamente en tu panel:'
                    : 'Test how user interactions are logged in real-time. Clicking any action immediately reflects on your dashboard:'}
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateEvent('whatsapp_clicked', language === 'es' ? 'Click en WhatsApp simulado' : 'WhatsApp click simulated')}
                    className="py-1.5 px-3 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-stone-800 text-xs font-semibold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+1 WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateEvent('phone_revealed', language === 'es' ? 'Teléfono revelado simulado' : 'Phone reveal simulated')}
                    className="py-1.5 px-3 bg-white hover:bg-teal-50 border border-stone-200 hover:border-teal-300 text-stone-800 text-xs font-semibold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>+1 {language === 'es' ? 'Llamada' : 'Call'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateEvent('directions_clicked', language === 'es' ? 'Ruta de mapa consultada' : 'Map directions simulated')}
                    className="py-1.5 px-3 bg-white hover:bg-sky-50 border border-stone-200 hover:border-sky-300 text-stone-800 text-xs font-semibold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-sky-600" />
                    <span>+1 {language === 'es' ? 'Cómo llegar' : 'Directions'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateEvent('booking_clicked', language === 'es' ? 'Click en reserva simulado' : 'Booking click simulated')}
                    className="py-1.5 px-3 bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-stone-800 text-xs font-semibold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>+1 {language === 'es' ? 'Reserva' : 'Booking'}</span>
                  </button>
                </div>
              </div>

              {/* Activity Log Feed */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  {language === 'es' ? 'Registro Reciente de Interacciones' : 'Recent Interaction Log'}
                </h5>
                <div className="p-3 bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 text-xs">
                  {analyticsEvents.length > 0 ? (
                    analyticsEvents.map((evt) => (
                      <div key={evt.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span className="font-medium text-stone-800">
                            {evt.event_type === 'whatsapp_clicked' && 'Click en WhatsApp verificado'}
                            {evt.event_type === 'phone_revealed' && 'Teléfono directo revelado'}
                            {evt.event_type === 'directions_clicked' && 'Ruta de mapa consultada'}
                            {evt.event_type === 'booking_clicked' && 'Enlace de reserva abierto'}
                            {evt.event_type === 'website_clicked' && 'Sitio web visitado'}
                            {evt.event_type === 'contact_modal_opened' && 'Ficha oficial visualizada'}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-stone-400">
                          {new Date(evt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-3 text-center text-stone-400 text-xs">
                      {language === 'es'
                        ? 'Todas las interacciones se registrarán aquí con sello de tiempo.'
                        : 'All direct interactions will be logged here with timestamps.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MERCHANT ROI & RETENTION SIMULATOR */}
          {activeTab === 'roi_simulator' && (
            <MerchantRoiSimulator
              language={language}
              businessName={business.name}
            />
          )}

          {/* TAB: QR CODE & PHYSICAL MATERIALS */}
          {activeTab === 'qr' && (
            <div className="space-y-6">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600">
                {language === 'es'
                  ? 'Descarga y utiliza el código QR oficial de tu comercio para colocar en mostradores, mesas (table tents), menús y vitrinas. Los clientes que escaneen abrirán directamente tu perfil verificado en PlayaVida.'
                  : 'Download and print official QR materials for table tents, counters, menus, and storefront stickers. Customers who scan open your verified PlayaVida mini-site instantly.'}
              </div>

              {/* Printable Standee Preview */}
              <div className="max-w-md mx-auto p-6 bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-3xl border-4 border-stone-800 shadow-2xl text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-amber-200 font-bold text-xs flex items-center justify-center">
                    PV
                  </div>
                  <span className="font-['Outfit',sans-serif] text-sm font-bold tracking-tight">
                    Playa<span className="text-teal-400">Vida</span>
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-400">
                    • Riviera Maya
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-white">
                    {business.name}
                  </h3>
                  <span className="inline-block py-0.5 px-2 bg-teal-900/80 text-teal-200 border border-teal-700/60 rounded-full text-[10px] font-mono">
                    {business.business_reference}
                  </span>
                </div>

                {/* Scannable QR SVG in standee */}
                <div className="p-4 bg-white rounded-2xl inline-block mx-auto shadow-md">
                  <QRCodeSVG
                    id="business-printable-qr"
                    value={`${window.location.origin}/?ref=${business.business_reference}`}
                    size={170}
                    level="H"
                    includeMargin
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-amber-300">
                    {language === 'es' ? '¡Escanea para conectar y ver ofertas!' : 'Scan to connect & explore perks!'}
                  </p>
                  <p className="text-[11px] text-stone-400 max-w-xs mx-auto">
                    {language === 'es'
                      ? 'Accede a WhatsApp directo, mapa, menú, promociones y sellos de lealtad.'
                      : 'Instant access to direct WhatsApp, directions, menu, deals, and loyalty stamps.'}
                  </p>
                </div>
              </div>

              {/* Actions & Export */}
              <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const svgEl = document.getElementById('business-printable-qr');
                    if (!svgEl) return;
                    const svgData = new XMLSerializer().serializeToString(svgEl);
                    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `PlayaVida_QR_${business.business_reference}.svg`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="flex-1 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'es' ? 'Descargar QR (SVG Vector)' : 'Download QR (SVG Vector)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(`${window.location.origin}/?ref=${business.business_reference}`);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? (language === 'es' ? '¡Enlace copiado!' : 'Link copied!') : (language === 'es' ? 'Copiar Enlace' : 'Copy Link')}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PHOTO GALLERY & MEDIA */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600">
                {isEntitled ? t.gallery_limit_paid : t.gallery_limit_free}
              </div>

              {isEntitled && (
                <form onSubmit={handleAddGalleryImage} className="flex gap-2">
                  <input
                    type="url"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Pega la URL de una foto (ej. https://images.unsplash.com/...)"
                    className="flex-1 p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Foto</span>
                  </button>
                </form>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Logo */}
                <div className="relative h-32 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                  <img
                    src={business.logo_url}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 py-0.5 px-2 bg-stone-900/80 text-white text-[10px] font-bold rounded-md">
                    Logo
                  </span>
                </div>

                {/* Cover */}
                <div className="relative h-32 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                  <img
                    src={business.cover_url}
                    alt="Portada"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 py-0.5 px-2 bg-stone-900/80 text-white text-[10px] font-bold rounded-md">
                    Portada
                  </span>
                </div>

                {/* Additional gallery photos */}
                {business.gallery_urls.map((img, i) => (
                  <div
                    key={i}
                    className="relative h-32 rounded-xl overflow-hidden bg-stone-100 border border-stone-200"
                  >
                    <img src={img} alt="Galería" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 py-0.5 px-2 bg-teal-800/80 text-white text-[10px] font-bold rounded-md">
                      Galería #{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS MANAGEMENT */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600">
                Los negocios con el Plan Comunidad Pro pueden publicar respuestas oficiales a las reseñas comunitarias. Los propietarios no pueden eliminar reseñas negativas por sí mismos.
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800">
                        {rev.author_name} ({rev.rating} estrellas)
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        {rev.review_reference}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 italic">"{rev.content}"</p>

                    {rev.business_response ? (
                      <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs space-y-1">
                        <span className="font-semibold text-teal-800 block">Tu respuesta oficial:</span>
                        <p className="text-stone-700">{rev.business_response.content}</p>
                      </div>
                    ) : isEntitled ? (
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          value={replyText[rev.id] || ''}
                          onChange={(e) =>
                            setReplyText({ ...replyText, [rev.id]: e.target.value })
                          }
                          placeholder="Escribe una respuesta cordial y profesional..."
                          className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                        />
                        <button
                          onClick={() => handleReplyReview(rev.id)}
                          className="py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl"
                        >
                          Responder
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] text-stone-400 italic">
                        Respuestas oficiales reservadas para negocios con Plan Pro activo.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: MEMBERS & BROADCASTS */}
          {activeTab === 'members_broadcasts' && (
            <div className="space-y-6">
              {/* Header metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl">
                  <div className="flex items-center justify-between text-teal-800 mb-1">
                    <span className="text-xs font-semibold">
                      {language === 'es' ? 'Seguidores del Negocio' : 'Business Followers'}
                    </span>
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold font-['Outfit',sans-serif] text-teal-950">
                    {followers.length}
                  </div>
                  <p className="text-[11px] text-teal-700 mt-0.5">
                    {language === 'es' ? 'Clientes suscritos a novedades' : 'Subscribed customer club'}
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
                  <div className="flex items-center justify-between text-emerald-800 mb-1">
                    <span className="text-xs font-semibold">
                      {language === 'es' ? 'Push Opt-in Activo' : 'Active Push Opt-in'}
                    </span>
                    <Radio className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold font-['Outfit',sans-serif] text-emerald-950">
                    {Math.round((followers.filter((f) => f.has_push_opt_in).length / (followers.length || 1)) * 100)}%
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {language === 'es' ? 'Dispositivos con permiso concedido' : 'Devices with push permission'}
                  </p>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
                  <div className="flex items-center justify-between text-amber-800 mb-1">
                    <span className="text-xs font-semibold">
                      {language === 'es' ? 'Campañas Transmitidas' : 'Broadcasts Sent'}
                    </span>
                    <Send className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold font-['Outfit',sans-serif] text-amber-950">
                    {broadcasts.length}
                  </div>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    {language === 'es' ? 'Avisos directos enviados' : 'Direct alerts delivered'}
                  </p>
                </div>
              </div>

              {/* Controlled Beta & Compliance Disclaimer */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-700 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <h4 className="font-bold text-stone-900 text-xs">
                    {language === 'es'
                      ? 'Transmisión Push Masiva: Modo Beta Controlado'
                      : 'Mass Push Dispatch: Controlled Beta Mode'}
                  </h4>
                  <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                    {language === 'es' ? 'Disponible en beta controlada' : 'Available in controlled beta only'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {language === 'es'
                    ? 'Los comunicados redactados aquí se transmiten al feed del colectivo y se registran en la base comunitaria. La emisión push en tiempo real a teléfonos móviles mediante APNs y FCM requiere integración con servidor seguro bajo lineamientos NOM-151 y LFPDPPP.'
                    : 'Broadcasts created here publish directly to your feed and community log. Live mobile push dispatch via APNs/FCM requires secure server integration under NOM-151 and LFPDPPP compliance.'}
                </p>
                <div className="text-[10px] font-mono text-stone-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span>{language === 'es' ? 'Privacidad: Consentimiento registrado de receptores verificado.' : 'Privacy: Explicit user consent verified.'}</span>
                </div>
              </div>

              {/* Success alert */}
              {bcSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {language === 'es'
                      ? '¡Comunicado publicado exitosamente y puesto en cola para los miembros!'
                      : 'Broadcast published successfully and queued for enrolled members!'}
                  </span>
                </div>
              )}

              {/* Compose Broadcast Section */}
              <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-800 text-white flex items-center justify-center">
                      <Send className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                        {language === 'es' ? 'Emitir Nuevo Comunicado Push' : 'Create Push Broadcast'}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {language === 'es' ? 'Envía una notificación oficial a los miembros suscritos' : 'Send an official alert to subscribed members'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsComposingBroadcast(!isComposingBroadcast)}
                    className="py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    {isComposingBroadcast
                      ? (language === 'es' ? 'Cancelar' : 'Cancel')
                      : (language === 'es' ? '+ Redactar' : '+ Compose')}
                  </button>
                </div>

                {isComposingBroadcast && (
                  <form onSubmit={handleCreateBroadcast} className="space-y-4 pt-2 border-t border-stone-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-stone-800 block">
                          {language === 'es' ? 'Título del Comunicado *' : 'Broadcast Title *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={bcTitle}
                          onChange={(e) => setBcTitle(e.target.value)}
                          placeholder={
                            language === 'es'
                              ? 'Ej. ¡Cata especial de mezcal artesanal este sábado!'
                              : 'e.g. Special Mezcal Tasting & Live Jazz this Saturday!'
                          }
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-stone-800 block">
                          {language === 'es' ? 'Cuerpo del Mensaje *' : 'Message Body *'}
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={bcMessage}
                          onChange={(e) => setBcMessage(e.target.value)}
                          placeholder={
                            language === 'es'
                              ? 'Estimados miembros: los invitamos con una cortesía exclusiva de la casa en su reserva previa...'
                              : 'Dear community: enjoy an exclusive complimentary tasting with your prior table reservation...'
                          }
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                        />
                        <span className="text-[10px] text-stone-400 block text-right">
                          {bcMessage.length}/280 caracteres
                        </span>
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-stone-800 block">
                          {language === 'es' ? 'Segmento de Audiencia' : 'Audience Segment'}
                        </label>
                        <select
                          value={bcSegment}
                          onChange={(e) => setBcSegment(e.target.value as any)}
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                        >
                          <option value="all_members">
                            {language === 'es' ? 'Todos los Miembros y Seguidores (100% de la base)' : 'All Members & Followers (100% audience)'}
                          </option>
                          <option value="active_this_month">
                            {language === 'es' ? 'Miembros Activos este Mes' : 'Active Members this Month'}
                          </option>
                          <option value="new_members">
                            {language === 'es' ? 'Nuevos Miembros (Últimos 30 días)' : 'New Members (Last 30 Days)'}
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Notification Preview Card */}
                    <div className="p-3 bg-stone-900 text-white rounded-2xl space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between text-[10px] text-stone-400">
                        <span className="flex items-center gap-1.5 font-semibold text-white">
                          <Bell className="w-3 h-3 text-amber-400" />
                          PlayaVida • {business.name}
                        </span>
                        <span>Ahora</span>
                      </div>
                      <p className="text-xs font-bold text-white">
                        {bcTitle || (language === 'es' ? 'Título del comunicado' : 'Broadcast Title')}
                      </p>
                      <p className="text-[11px] text-stone-300 line-clamp-2">
                        {bcMessage || (language === 'es' ? 'Vista previa del texto que recibirán tus seguidores en la pantalla de su celular...' : 'Preview of the notification alert on subscriber lock screens...')}
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsComposingBroadcast(false)}
                        className="py-2 px-4 text-xs font-semibold text-stone-600 hover:text-stone-800"
                      >
                        {language === 'es' ? 'Cancelar' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="py-2.5 px-5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{language === 'es' ? 'Transmitir Comunicado' : 'Broadcast Announcement'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Past Broadcasts Log */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-2">
                  <Radio className="w-4 h-4 text-teal-700" />
                  <span>{language === 'es' ? 'Historial de Comunicados' : 'Broadcast History'}</span>
                </h4>

                {broadcasts.length === 0 ? (
                  <div className="p-6 bg-stone-50 border border-stone-200 rounded-2xl text-center text-stone-500 text-xs">
                    {language === 'es' ? 'No hay comunicados registrados aún.' : 'No broadcasts sent yet.'}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {broadcasts.map((bc) => (
                      <div
                        key={bc.id}
                        className="p-4 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-900">{bc.title}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md">
                              {bc.campaign_reference}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              bc.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {bc.status === 'delivered' ? 'Entregado' : 'En cola (Beta)'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600">{bc.message}</p>
                        <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-100">
                          <span>
                            {language === 'es' ? 'Audiencia:' : 'Audience:'}{' '}
                            <strong className="text-stone-600">
                              {bc.target_segment === 'all_members'
                                ? 'Todos los miembros'
                                : bc.target_segment === 'active_this_month'
                                ? 'Activos este mes'
                                : 'Nuevos'}
                            </strong>{' '}
                            ({bc.recipient_count} {language === 'es' ? 'destinatarios' : 'recipients'})
                          </span>
                          <span>{new Date(bc.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Directory of Followers */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-700" />
                    <span>{language === 'es' ? 'Directorio de Seguidores Suscritos' : 'Subscribed Members Directory'}</span>
                  </h4>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={followerSearch}
                      onChange={(e) => setFollowerSearch(e.target.value)}
                      placeholder={language === 'es' ? 'Buscar seguidor o ref...' : 'Search follower...'}
                      className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100">
                  {followers
                    .filter((f) =>
                      f.display_name.toLowerCase().includes(followerSearch.toLowerCase()) ||
                      f.public_reference.toLowerCase().includes(followerSearch.toLowerCase())
                    )
                    .map((follower) => (
                      <div
                        key={follower.id}
                        className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-stone-50/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                            {follower.display_name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900">
                              {follower.display_name}
                            </div>
                            <div className="text-[10px] font-mono text-stone-400">
                              {follower.public_reference} • {language === 'es' ? 'Suscrito el ' : 'Joined '}
                              {new Date(follower.followed_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {follower.has_push_opt_in ? (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <Radio className="w-3 h-3" />
                              <span>{language === 'es' ? 'Push Activo' : 'Push Active'}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                              {language === 'es' ? 'Sin Push' : 'No Push'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: LOYALTY PROGRAM & BONUS FEATURES */}
          {activeTab === 'loyalty_bonus' && (
            <div className="space-y-6">
              {/* Program Status Header */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-200 text-xs font-mono font-bold tracking-wider uppercase">
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>{loyaltyProgram ? loyaltyProgram.program_reference : (language === 'es' ? 'Programa No Activo' : 'Not Active')}</span>
                  </div>
                  <h3 className="font-['Outfit',sans-serif] text-xl font-bold">
                    {loyaltyProgram ? (language === 'es' ? loyaltyProgram.name_es : loyaltyProgram.name_en) : (language === 'es' ? 'Tarjeta de Sellos Digital' : 'Digital Loyalty Card')}
                  </h3>
                  <p className="text-xs text-amber-100 max-w-xl">
                    {loyaltyProgram
                      ? (language === 'es' ? loyaltyProgram.description_es : loyaltyProgram.description_en)
                      : (language === 'es' ? 'Fideliza a tus clientes habituales con recompensas directas y retos de sellos extra.' : 'Retain regular customers with stamp rewards and bonus quests.')}
                  </p>
                </div>

                {!loyaltyProgram && (
                  <button
                    type="button"
                    onClick={() => {
                      const newProg = playaVidaStore.createLoyaltyProgramForBusiness(business.id, business.name, business.location_code || 'PDC');
                      setLoyaltyProgram(newProg);
                      onBusinessUpdated();
                    }}
                    className="py-2.5 px-4 bg-white text-amber-900 font-bold text-xs rounded-xl shadow-xs hover:bg-amber-50 transition-colors shrink-0"
                  >
                    {language === 'es' ? 'Activar Programa de Lealtad' : 'Enable Loyalty Program'}
                  </button>
                )}
              </div>

              {bonusNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{bonusNotice}</span>
                </div>
              )}

              {/* Bonus Stamp Features / Quests */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <h4 className="font-['Outfit',sans-serif] text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      <span>{language === 'es' ? 'Misiones & Sellos de Bonificación' : 'Bonus Quests & Extra Stamps'}</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {language === 'es'
                        ? 'Permite a tus clientes ganar sellos extra completando retos como subir foto de su arte latte / topping, o asistir a firmas de libros y eventos.'
                        : 'Reward customers with extra stamps for completing quests like uploading latte art / toppings, or attending book signings and events.'}
                    </p>
                  </div>

                  {!isAddingBonus && loyaltyProgram && (
                    <button
                      type="button"
                      onClick={() => setIsAddingBonus(true)}
                      className="py-2 px-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{language === 'es' ? 'Nuevo Reto de Sellos' : 'New Bonus Quest'}</span>
                    </button>
                  )}
                </div>

                {/* Quick Templates Bar */}
                {isAddingBonus && (
                  <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/70 space-y-2">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                      {language === 'es' ? 'Plantillas Rápidas de Ejemplo:' : 'Quick Example Templates:'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyBonusTemplate('latte_art')}
                        className="py-1.5 px-3 bg-white hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-amber-700" />
                        <span>{language === 'es' ? 'Foto de Arte Latte / Topping (+1 Sello)' : 'Latte Art / Topping Photo'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyBonusTemplate('book_signing')}
                        className="py-1.5 px-3 bg-white hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-700" />
                        <span>{language === 'es' ? 'Firma de Libros / Evento Semanal' : 'Book Signing / Weekly Event'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyBonusTemplate('reusable_cup')}
                        className="py-1.5 px-3 bg-white hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                        <span>{language === 'es' ? 'Reto Eco: Termo Reutilizable' : 'Eco Quest: Reusable Tumbler'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Form to Add Bonus Feature */}
                {isAddingBonus && (
                  <form onSubmit={handleSaveBonusFeature} className="p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                        {language === 'es' ? 'Configurar Nuevo Reto' : 'Configure New Quest'}
                      </h5>
                      <button
                        type="button"
                        onClick={() => setIsAddingBonus(false)}
                        className="text-stone-400 hover:text-stone-600 text-xs"
                      >
                        {language === 'es' ? 'Cancelar' : 'Cancel'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700">
                          {language === 'es' ? 'Título del Reto (Español) *' : 'Quest Title (Spanish) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={bonusTitleEs}
                          onChange={(e) => setBonusTitleEs(e.target.value)}
                          placeholder="Ej. Comparte foto de tu arte latte o topping"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700">
                          {language === 'es' ? 'Título del Reto (Inglés)' : 'Quest Title (English)'}
                        </label>
                        <input
                          type="text"
                          value={bonusTitleEn}
                          onChange={(e) => setBonusTitleEn(e.target.value)}
                          placeholder="E.g. Share photo of your latte art or topping"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-semibold text-stone-700">
                          {language === 'es' ? 'Instrucciones para el cliente (Español)' : 'Customer Instructions (Spanish)'}
                        </label>
                        <textarea
                          rows={2}
                          value={bonusDescEs}
                          onChange={(e) => setBonusDescEs(e.target.value)}
                          placeholder="Ej. Ven a la firma de libros de este jueves o toma foto de tu topping para recibir un sello extra."
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-700">
                          {language === 'es' ? 'Sellos extra que otorga' : 'Extra stamps awarded'}
                        </label>
                        <select
                          value={bonusExtraStamps}
                          onChange={(e) => setBonusExtraStamps(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-1 focus:ring-amber-500"
                        >
                          <option value={1}>+1 Sello de bonificación</option>
                          <option value={2}>+2 Sellos de bonificación</option>
                          <option value={3}>+3 Sellos de bonificación</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 sm:pt-6">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-800">
                          <input
                            type="checkbox"
                            checked={bonusRequiresPhoto}
                            onChange={(e) => setBonusRequiresPhoto(e.target.checked)}
                            className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                          />
                          <span className="font-semibold">
                            {language === 'es'
                              ? '📸 Requiere que el cliente suba una foto'
                              : '📸 Requires customer to upload a photo'}
                          </span>
                        </label>
                      </div>

                      {bonusRequiresPhoto && (
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-semibold text-stone-700">
                            {language === 'es' ? 'Mensaje o sugerencia de foto' : 'Photo prompt for customer'}
                          </label>
                          <input
                            type="text"
                            value={bonusPhotoPromptEs}
                            onChange={(e) => setBonusPhotoPromptEs(e.target.value)}
                            placeholder="Ej. Sube una foto de tu topping artesanal o taza con arte latte"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
                      >
                        {language === 'es' ? 'Guardar Reto de Bonificación' : 'Save Bonus Quest'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingBonus(false)}
                        className="py-2 px-3 text-xs text-stone-600 hover:text-stone-800"
                      >
                        {language === 'es' ? 'Cancelar' : 'Cancel'}
                      </button>
                    </div>
                  </form>
                )}

                {/* List of active bonus features */}
                <div className="space-y-3">
                  {loyaltyProgram?.bonus_features && loyaltyProgram.bonus_features.length > 0 ? (
                    loyaltyProgram.bonus_features.map((bonus) => (
                      <div
                        key={bonus.id}
                        className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white font-mono">
                              +{bonus.extra_stamps} {language === 'es' ? 'sello extra' : 'extra stamp'}
                            </span>
                            {bonus.requires_photo_upload ? (
                              <span className="text-[10px] font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Camera className="w-3 h-3" />
                                <span>{language === 'es' ? 'Requiere foto de cliente' : 'Requires photo upload'}</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-stone-600 bg-stone-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>{language === 'es' ? 'Asistencia / Canje libre' : 'Direct attendance check'}</span>
                              </span>
                            )}
                          </div>
                          <h5 className="font-bold text-stone-900 text-sm">
                            {language === 'es' ? bonus.title_es : bonus.title_en}
                          </h5>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {language === 'es' ? bonus.description_es : bonus.description_en}
                          </p>
                          {bonus.photo_prompt_es && (
                            <p className="text-[11px] text-amber-800 italic">
                              📸 {bonus.photo_prompt_es}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteBonusFeature(bonus.id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0 cursor-pointer"
                          title={language === 'es' ? 'Eliminar reto' : 'Delete quest'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-2">
                      <Award className="w-8 h-8 text-stone-300 mx-auto" />
                      <p className="text-xs text-stone-500 font-medium">
                        {language === 'es'
                          ? 'Aún no has configurado retos de sellos extra para tu programa de lealtad.'
                          : 'No bonus stamp quests configured yet for your loyalty program.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsAddingBonus(true)}
                        className="py-1.5 px-3 bg-amber-600 text-white text-xs font-bold rounded-xl shadow-2xs hover:bg-amber-700 transition-colors cursor-pointer"
                      >
                        {language === 'es' ? 'Crear primer reto bonus' : 'Create first bonus quest'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* OXXO Cash Payment Voucher Modal */}
      {showOxxoModal && subscription.oxxo_reference && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-5 text-center">
            <div className="w-16 h-8 bg-red-600 text-amber-300 font-black text-xl flex items-center justify-center mx-auto rounded-md tracking-wider">
              OXXO
            </div>
            <div>
              <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
                {t.oxxo_voucher_info}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Paga en efectivo en cualquier tienda OXXO de la República Mexicana.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                {t.oxxo_reference_label}
              </span>
              <div className="text-xl font-mono font-bold tracking-widest text-stone-900">
                {subscription.oxxo_reference.replace(/(\d{4})/g, '$1 ').trim()}
              </div>
              <div className="text-[11px] text-stone-500">
                Monto a pagar: ${subscription.monthly_price_mxn} MXN
              </div>
            </div>

            <div className="text-xs text-stone-500">
              Vigencia para realizar el pago: 48 horas. Una vez recibido el cobro, el sistema activa automáticamente tus canales de contacto.
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleConfirmOxxoPayment}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
              >
                Simular Pago en Caja OXXO (Confirmar)
              </button>
              <button
                onClick={() => setShowOxxoModal(false)}
                className="w-full py-2 px-4 text-xs font-medium text-stone-500 hover:text-stone-700"
              >
                Cerrar ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
