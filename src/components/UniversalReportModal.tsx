import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, X, Check, Send } from 'lucide-react';
import { Language, User, UniversalReport } from '../types';
import { playaVidaStore } from '../lib/storage';
import { translations } from '../lib/i18n';

interface UniversalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: UniversalReport['target_entity_type'];
  targetReference: string;
  targetName: string;
  currentUser: User | null;
  language: Language;
  onOpenAuth: () => void;
}

export const UniversalReportModal: React.FC<UniversalReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetReference,
  targetName,
  currentUser,
  language,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [reason, setReason] = useState<UniversalReport['reason']>('inaccurate_information');
  const [details, setDetails] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reasons: { id: UniversalReport['reason']; label: string }[] = [
    { id: 'inaccurate_information', label: t.reason_inaccurate_information },
    { id: 'inappropriate_content', label: t.reason_inappropriate_content },
    { id: 'spam', label: t.reason_spam },
    { id: 'scam', label: t.reason_scam },
    { id: 'fake_review', label: t.reason_fake_review },
    { id: 'privacy_issue', label: t.reason_privacy_issue },
    { id: 'other', label: t.reason_other },
  ];

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onClose();
      onOpenAuth();
      return;
    }
    setShowConfirmation(true);
  };

  const handleFinalConfirm = () => {
    if (!currentUser) return;

    playaVidaStore.submitReport({
      reporter_user_id: currentUser.id,
      target_entity_type: targetType,
      target_reference: targetReference,
      reason,
      details: details.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowConfirmation(false);
      setDetails('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF9F6]">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="font-semibold text-stone-900">{t.report_issue}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {!currentUser ? (
            <div className="text-center py-4 space-y-3">
              <p className="text-xs text-stone-600">
                Debes iniciar sesión con tu cuenta para enviar un reporte al equipo de moderación.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs rounded-xl shadow-xs"
              >
                Iniciar Sesión
              </button>
            </div>
          ) : !showConfirmation ? (
            <form onSubmit={handleInitialSubmit} className="space-y-4">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                  Elemento a reportar:
                </span>
                <span className="font-bold text-stone-800">{targetName}</span>
                <span className="font-mono text-stone-500 block text-[11px] mt-0.5">
                  Ref: {targetReference}
                </span>
              </div>

              {/* Reason selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  {t.report_reason_label}
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:bg-white"
                >
                  {reasons.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Details text */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  {language === 'es' ? 'Detalles del reporte' : 'Report Details'}
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={t.report_desc_placeholder}
                  rows={3}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white"
                />
              </div>

              {/* Privacy disclaimer */}
              <div className="flex items-center gap-2 text-[11px] text-stone-500 bg-teal-50/50 p-2.5 rounded-xl border border-teal-100">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Tu identidad nunca es compartida con el negocio o usuario reportado.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2 px-3 text-xs text-stone-600 hover:text-stone-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-xl shadow-xs"
                >
                  Continuar
                </button>
              </div>
            </form>
          ) : (
            /* Confirmation step */
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-semibold text-stone-900 text-sm">
                  {t.report_confirm_summary}
                </h4>
                <p className="text-xs text-stone-500">
                  Revisa los datos antes de enviar a nuestro equipo de moderación local:
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Objetivo:</span>
                  <span className="font-semibold text-stone-800">{targetName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Referencia:</span>
                  <span className="font-mono text-stone-700">{targetReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Motivo:</span>
                  <span className="font-medium text-rose-700">
                    {reasons.find((r) => r.id === reason)?.label}
                  </span>
                </div>
                {details && (
                  <div className="pt-1 border-t border-stone-200">
                    <span className="text-stone-500 block">Detalles:</span>
                    <p className="italic text-stone-700 mt-0.5">{details}</p>
                  </div>
                )}
              </div>

              {submitted ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{t.report_success}</span>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="py-2 px-3 text-xs text-stone-600 hover:text-stone-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={handleFinalConfirm}
                    className="py-2 px-5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirmar y Enviar</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
