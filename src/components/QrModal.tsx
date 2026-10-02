import React, { useState } from 'react';
import { X, Copy, Check, Download, ExternalLink, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Language } from '../types';
import { translations } from '../lib/i18n';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string;
  title: string;
  language: Language;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  reference,
  title,
  language,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const isEs = language === 'es';
  const [copied, setCopied] = useState(false);
  // Construct a truly unique URL structure that routes based on the reference type
  const targetUrl = `${window.location.origin}/entity/${reference}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    const svgEl = document.getElementById('playavida-qr-svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PlayaVida_QR_${reference}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden text-center p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 pt-2">
          <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900 leading-tight">
            {title}
          </h3>
          <p className="text-xs font-mono font-semibold text-teal-700">{reference}</p>
        </div>

        {/* Live Functional QR Code */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 inline-block shadow-2xs">
          <div className="bg-white p-3 rounded-xl border border-stone-300 flex flex-col items-center justify-center space-y-2">
            <QRCodeSVG
              id="playavida-qr-svg"
              value={targetUrl}
              size={180}
              level="M"
              includeMargin
            />
            <span className="text-[10px] font-mono text-stone-400">
              PlayaVida Verified QR
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-500 max-w-xs mx-auto">
          {isEs
            ? 'Escanea para acceder directamente al perfil oficial verificado en PlayaVida.'
            : 'Scan to open the verified official mini-site on PlayaVida.'}
        </p>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (isEs ? 'Copiado' : 'Copied') : (isEs ? 'Copiar Enlace' : 'Copy Link')}</span>
          </button>

          <button
            onClick={handleDownloadSvg}
            className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            title={t.download_qr}
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">{t.download_qr}</span>
          </button>

          <button
            onClick={onClose}
            className="py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            {isEs ? 'Listo' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
