import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  MessageCircle,
  Mail,
  Send,
  Users,
  Sparkles,
  ExternalLink,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { Language } from '../types';

interface ShareInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  entityType: 'event' | 'business' | 'group';
  title: string;
  reference: string;
  description?: string;
  coverUrl?: string;
  locationLabel?: string;
}

export const ShareInviteModal: React.FC<ShareInviteModalProps> = ({
  isOpen,
  onClose,
  language,
  entityType,
  title,
  reference,
  description,
  coverUrl,
  locationLabel,
}) => {
  if (!isOpen) return null;

  const isEs = language === 'es';
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'invite' | 'qr'>('invite');

  // Build direct URL with reference parameter
  const shareUrl = `${window.location.origin}/?ref=${reference}`;

  const typeLabels = {
    event: { es: 'este Evento', en: 'this Event' },
    business: { es: 'este Negocio Local', en: 'this Local Business' },
    group: { es: 'este Colectivo', en: 'this Community Group' },
  };

  const inviteHeading = isEs
    ? `Invitar Amigos a ${typeLabels[entityType].es}`
    : `Invite Friends to ${typeLabels[entityType].en}`;

  const whatsappMessage = isEs
    ? `¡Hola! Te invito a ver "${title}" en PlayaVida (Riviera Maya). Checa todos los detalles, mapa y confirmación aquí: ${shareUrl}`
    : `Hey! Inviting you to check out "${title}" on PlayaVida (Riviera Maya). See details, map and RSVP here: ${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${title} | PlayaVida`,
          text: description || title,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
      `¡Te invito a ver ${title} en PlayaVida!`
    )}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  const handleEmailShare = () => {
    const mailSubject = encodeURIComponent(`${title} en PlayaVida Riviera Maya`);
    const mailBody = encodeURIComponent(
      `${whatsappMessage}\n\nEnviado desde PlayaVida - Descubrimiento local sin spam.`
    );
    window.location.href = `mailto:?subject=${mailSubject}&body=${mailBody}`;
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900 leading-tight">
                {inviteHeading}
              </h3>
              <p className="text-[11px] text-stone-500 font-mono mt-0.5">{reference}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Direct Invite vs QR code */}
        <div className="px-5 pt-3 flex gap-2 border-b border-stone-100">
          <button
            onClick={() => setActiveTab('invite')}
            className={`pb-2 text-xs font-bold transition-all relative ${
              activeTab === 'invite' ? 'text-teal-800' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            {isEs ? 'Compartir & Mensajería' : 'Share & Messaging'}
            {activeTab === 'invite' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-800 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`pb-2 text-xs font-bold transition-all relative flex items-center gap-1 ${
              activeTab === 'qr' ? 'text-teal-800' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{isEs ? 'Código QR para Escanear' : 'Scan QR Code'}</span>
            {activeTab === 'qr' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-800 rounded-full" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Preview Card */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
            {coverUrl && (
              <img
                src={coverUrl}
                alt={title}
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200"
              />
            )}
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                {entityType === 'event'
                  ? isEs ? 'Evento' : 'Event'
                  : entityType === 'business'
                  ? isEs ? 'Negocio' : 'Business'
                  : isEs ? 'Colectivo' : 'Group'}
                {locationLabel && ` • ${locationLabel}`}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">{title}</h4>
              <p className="text-[11px] text-stone-500 truncate mt-0.5">
                {description || (isEs ? 'Descubre en PlayaVida' : 'Discover on PlayaVida')}
              </p>
            </div>
          </div>

          {activeTab === 'invite' ? (
            <>
              {/* Primary Action: WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-200" />
                <span>{isEs ? 'Invitar Amigos por WhatsApp' : 'Invite via WhatsApp'}</span>
              </button>

              {/* Secondary Channels Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5 text-stone-600" />
                    <span>{isEs ? 'Menú Compartir' : 'Share Sheet'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleTelegramShare}
                  className="py-2.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-sky-600" />
                  <span>Telegram</span>
                </button>

                <button
                  type="button"
                  onClick={handleEmailShare}
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-stone-600" />
                  <span>{isEs ? 'Por Correo' : 'By Email'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 border ${
                    copied
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isEs ? '¡Copiado!' : 'Copied!') : isEs ? 'Copiar Enlace' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Direct Link box */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  {isEs ? 'Enlace Directo Oficial' : 'Official Direct Link'}
                </span>
                <div className="flex items-center justify-between gap-2 text-xs font-mono text-stone-700 break-all bg-white p-2 rounded-lg border border-stone-200">
                  <span className="truncate">{shareUrl}</span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="text-teal-800 hover:text-teal-900 shrink-0 font-sans text-[11px] font-bold"
                  >
                    {copied ? (isEs ? 'Copiado' : 'Copied') : isEs ? 'Copiar' : 'Copy'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* QR Tab */
            <div className="text-center space-y-4 py-2">
              <div className="p-4 bg-white rounded-2xl border border-stone-200 inline-block shadow-inner">
                <QRCodeSVG
                  value={shareUrl}
                  size={180}
                  level="H"
                  includeMargin={true}
                  className="mx-auto"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-stone-800">
                  {isEs ? 'Escanear con cámara de smartphone' : 'Scan with smartphone camera'}
                </p>
                <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                  {isEs
                    ? 'Abre directo el minisitio con mapa, horarios y confirmación de asistencia.'
                    : 'Opens mini-site with interactive street map, schedule, and RSVP.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isEs ? 'Enlace copiado' : 'Link copied') : isEs ? 'Copiar enlace al portapapeles' : 'Copy link to clipboard'}</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
