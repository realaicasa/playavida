import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  Globe,
  Calendar,
  MapPin,
  Clock,
  Lock,
  LogIn,
  ExternalLink,
  ShieldCheck,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { PublicBusinessProjection, Language, PrivateBusinessContactDetails, BusinessSubscription } from '../types';
import { playaVidaStore } from '../lib/storage';
import { translations } from '../lib/i18n';

interface ContactModalProps {
  business: PublicBusinessProjection;
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onOpenDashboard?: () => void;
  currentUserId: string | null;
  language: Language;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  business,
  isOpen,
  onClose,
  onOpenAuth,
  onOpenDashboard,
  currentUserId,
  language,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Query server-side protected projection
  const contactState = playaVidaStore.getAuthorizedContactDetails(business.id, currentUserId);

  const handleAction = (
    eventType:
      | 'phone_revealed'
      | 'whatsapp_clicked'
      | 'email_clicked'
      | 'website_clicked'
      | 'directions_clicked'
      | 'booking_clicked',
    fieldKey?: string
  ) => {
    playaVidaStore.recordContactAnalyticsEvent(business.id, eventType, fieldKey, language);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <img
              src={business.logo_url}
              alt={business.name}
              className="w-10 h-10 rounded-xl object-cover border border-stone-200"
            />
            <div>
              <h3 className="font-semibold text-stone-900 leading-tight">{business.name}</h3>
              <p className="text-xs text-stone-500 font-mono">{business.business_reference}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on authorization state */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* STATE 1: LOGIN REQUIRED */}
          {contactState.status === 'login_required' && (
            <div className="text-center py-6 px-4 space-y-4">
              <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto border border-teal-100">
                <LogIn className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-semibold text-stone-900">{t.login_required_contact}</h4>
                <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                  {t.login_required_desc}
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="w-full py-3 px-5 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  {t.login_now}
                </button>
              </div>
              <p className="text-xs text-stone-400 pt-1">
                Acceso gratuito e inmediato con código de verificación a tu correo.
              </p>
            </div>
          )}

          {/* STATE 2: LOCKED (Business has not enabled contact features / free tier) */}
          {contactState.status === 'locked' && (
            <div className="text-center py-6 px-4 space-y-4">
              <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto border border-amber-100">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-stone-900">{t.locked_contact_title}</h4>
                <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                  {t.locked_contact_desc}
                </p>
              </div>

              {business.created_by_user_id === currentUserId ? (
                <div className="pt-2 bg-stone-50 p-4 rounded-xl border border-stone-200 text-left space-y-2">
                  <p className="text-xs font-semibold text-stone-800">
                    ¿Eres el propietario de este negocio?
                  </p>
                  <p className="text-xs text-stone-600">
                    Puedes activar tu plan de visibilidad de contacto o editar tus datos privados desde el panel.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDashboard?.();
                    }}
                    className="w-full mt-2 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Ir al Panel de Gestión
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500">
                  Los canales directos se activarán una vez que el negocio confirme su membresía local.
                </div>
              )}
            </div>
          )}

          {/* STATE 3: AVAILABLE (Authorized projection) */}
          {contactState.status === 'available' && contactState.details && (
            <div className="space-y-4">
              {/* Grace period banner if applicable */}
              {contactState.subscription?.status === 'grace_period' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{t.grace_period_notice}</span>
                </div>
              )}

              {/* Physical Address & Map */}
              {contactState.details.address && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                        {t.contact_address}
                      </h4>
                      <p className="text-sm font-medium text-stone-900 mt-0.5">
                        {contactState.details.address}
                      </p>
                      {contactState.details.city && (
                        <p className="text-xs text-stone-500">{contactState.details.city}</p>
                      )}
                    </div>
                  </div>

                  {contactState.details.latitude && contactState.details.longitude && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${contactState.details.latitude},${contactState.details.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleAction('directions_clicked', 'map_link')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline pt-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {t.open_in_maps}
                    </a>
                  )}
                </div>
              )}

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp */}
                {contactState.details.whatsapp && (
                  <a
                    href={`https://wa.me/${contactState.details.whatsapp.replace(/[^0-9]/g, '')}?text=Hola,%20los%20encontr%C3%A9%20en%20PlayaVida%20y%20me%20gustar%C3%ADa%20hacer%20una%20consulta.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleAction('whatsapp_clicked', 'whatsapp')}
                    className="flex items-center gap-3 p-3.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 rounded-xl font-medium text-sm transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-700 font-semibold">{t.contact_whatsapp}</div>
                      <div className="text-xs text-emerald-900 font-mono mt-0.5">
                        {contactState.details.whatsapp}
                      </div>
                    </div>
                  </a>
                )}

                {/* Phone Reveal */}
                {contactState.details.phone && (
                  <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs text-stone-500 font-semibold">{t.contact_phone}</div>
                        <div className="text-xs font-mono font-medium text-stone-900 truncate mt-0.5">
                          {phoneRevealed
                            ? contactState.details.phone
                            : `${contactState.details.phone.substring(0, 7)}••••`}
                        </div>
                      </div>
                    </div>

                    {!phoneRevealed ? (
                      <button
                        onClick={() => {
                          setPhoneRevealed(true);
                          handleAction('phone_revealed', 'phone');
                        }}
                        className="py-1 px-2.5 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-medium rounded-lg shrink-0 transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Eye className="w-3 h-3" />
                        Ver
                      </button>
                    ) : (
                      <a
                        href={`tel:${contactState.details.phone}`}
                        className="py-1 px-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium rounded-lg shrink-0 transition-colors"
                      >
                        Llamar
                      </a>
                    )}
                  </div>
                )}

                {/* Email */}
                {contactState.details.email && (
                  <a
                    href={`mailto:${contactState.details.email}`}
                    onClick={() => handleAction('email_clicked', 'email')}
                    className="flex items-center gap-3 p-3.5 bg-stone-50 hover:bg-stone-100/80 border border-stone-200 text-stone-800 rounded-xl font-medium text-sm transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-stone-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs text-stone-500 font-semibold">{t.contact_email}</div>
                      <div className="text-xs text-stone-900 font-mono truncate mt-0.5">
                        {contactState.details.email}
                      </div>
                    </div>
                  </a>
                )}

                {/* Website */}
                {contactState.details.website && (
                  <a
                    href={contactState.details.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleAction('website_clicked', 'website')}
                    className="flex items-center gap-3 p-3.5 bg-stone-50 hover:bg-stone-100/80 border border-stone-200 text-stone-800 rounded-xl font-medium text-sm transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs text-stone-500 font-semibold">{t.contact_website}</div>
                      <div className="text-xs text-sky-800 font-mono truncate mt-0.5 flex items-center gap-1">
                        {contactState.details.website.replace('https://', '')}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </a>
                )}
              </div>

              {/* Booking URL if present */}
              {contactState.details.booking_url && (
                <div className="pt-1">
                  <a
                    href={contactState.details.booking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleAction('booking_clicked', 'booking_url')}
                    className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    {t.contact_booking}
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                </div>
              )}

              {/* Opening Hours */}
              {contactState.details.opening_hours && contactState.details.opening_hours.length > 0 && (
                <div className="p-4 bg-[#FAF9F6] rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Clock className="w-4 h-4 text-stone-500" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                      {t.contact_hours}
                    </h4>
                  </div>
                  <div className="space-y-1.5 pt-1 text-xs">
                    {contactState.details.opening_hours.map((oh, idx) => (
                      <div key={idx} className="flex justify-between items-center text-stone-700">
                        <span className="font-medium">
                          {language === 'es' ? oh.days_es : oh.days_en}
                        </span>
                        <span className="font-mono text-stone-600">{oh.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified contact badge note */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>Datos protegidos y entregados a través del servidor seguro de PlayaVida</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
