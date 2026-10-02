import React from 'react';
import { X, Sparkles, CreditCard } from 'lucide-react';
import { Language } from '../types';

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SponsorModal: React.FC<SponsorModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;
  const isEs = language === 'es';

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Sparkles className="text-teal-600" />
            {isEs ? 'Patrocina PlayaVida' : 'Sponsor PlayaVida'}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-stone-600">
          {isEs 
            ? 'Potencia tu marca alcanzando a nuestra comunidad activa en la Riviera Maya.' 
            : 'Boost your brand by reaching our active Riviera Maya community.'}
        </p>
        <div className="bg-stone-100 p-4 rounded-xl text-center space-y-2">
          <p className="text-sm font-bold text-stone-900">
            {isEs ? 'Inversión: 3,600 MXN / trimestre' : 'Investment: 3,600 MXN / quarter'}
          </p>
        </div>
        <a 
          href="https://buy.stripe.com/14A28r3OzbJZ4Mk1Xn7Zu1Z"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          {isEs ? 'Pagar con Stripe' : 'Pay via Stripe'}
        </a>
      </div>
    </div>
  );
};
