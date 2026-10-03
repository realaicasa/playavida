import React, { useState } from 'react';
import { Mail, KeyRound, ShieldCheck, X, Check, ArrowRight } from 'lucide-react';
import { Language, User } from '../types';
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Por favor introduce un correo válido.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ? `${data.code}: ${data.error}` : (data.code === 'RATE_LIMITED' ? 'Demasiados intentos. Intenta más tarde.' : 'Error al enviar el código'));
        setIsLoading(false);
        return;
      }
      setOtpSentNotice(true);
      setStep('otp');
    } catch (e) {
      console.error('OTP request failed:', e);
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError('Ingresa el código de 6 dígitos.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.toLowerCase().trim(), code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ? `${data.code}: ${data.error}` : (data.code === 'RATE_LIMITED' ? 'Demasiados intentos. Intenta más tarde.' : 
                 data.code === 'OTP_EXPIRED' ? 'El código ha expirado. Solicita uno nuevo.' : 'Código inválido'));
        setIsLoading(false);
        return;
      }
      // Fetch user details from the session response
      const user: User = {
        id: data.userId,
        public_reference: '',
        email: email.toLowerCase(),
        selected_language: 'es',
        role: data.roles?.[0] || 'member',
        created_at: new Date().toISOString(),
      };
      onAuthSuccess(user);
      onClose();
    } catch (e) {
      console.error('OTP verification failed:', e);
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
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
                    disabled={isLoading}
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
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Enviando...' : 'Enviar Código de Acceso'}
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
                  disabled={isLoading}
                  className="py-2.5 px-3 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl disabled:opacity-50"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verificando...' : 'Verificar y Entrar'}
                </button>
              </div>
            </form>
          )}

          <div className="pt-3 border-t border-stone-100 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>Autenticación protegida sin contraseñas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;