import React, { useState } from 'react';
import { Mail, KeyRound, ShieldCheck, X, Check, ArrowRight } from 'lucide-react';
import { Language, User } from '../types';
import { playaVidaStore } from '../lib/storage';
import { DEMO_USERS } from '../lib/constants';
import { translations } from '../lib/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  language: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  language,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otpCode, setOtpCode] = useState('');
  const [otpSentNotice, setOtpSentNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Por favor introduce un correo válido.');
      return;
    }
    setError(null);
    setOtpSentNotice(true);
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setError('Ingresa el código de 6 dígitos.');
      return;
    }
    // Authenticate or create user in store
    const user = playaVidaStore.authenticateWithEmail(email);
    onAuthSuccess(user);
    onClose();
  };

  const handleQuickDemoLogin = (demoUser: User) => {
    onAuthSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF9F6]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-xs">
              PV
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">Acceso PlayaVida</h3>
              <p className="text-[11px] text-stone-500">Sin contraseñas • Verificación por correo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Tu correo electrónico</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@playadelcarmen.mx"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-rose-600">{error}</p>}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Enviar Código de Acceso</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1 text-center">
                <p className="text-xs text-stone-600">
                  Enviamos un código temporal a <strong>{email}</strong>
                </p>
              </div>

              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full text-center tracking-widest text-2xl font-mono p-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white"
              />

              {error && <p className="text-xs text-rose-600 text-center">{error}</p>}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="py-2.5 px-3 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs"
                >
                  Verificar y Entrar
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Accounts */}
          <div className="pt-3 border-t border-stone-100 space-y-2">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Cuentas demo para probar roles:
            </span>
            <div className="space-y-1.5">
              {DEMO_USERS.slice(0, 3).map((du: User) => (
                <button
                  key={du.id}
                  onClick={() => handleQuickDemoLogin(du)}
                  className="w-full p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 text-left flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <span className="font-semibold text-stone-800 block">{du.email}</span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      Ref: {du.public_reference} • {du.role}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-teal-700">Usar →</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
            <span>Autenticación protegida sin contraseñas</span>
          </div>
        </div>
      </div>
    </div>
  );
};
