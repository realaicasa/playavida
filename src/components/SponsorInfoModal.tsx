import React from 'react';
import { X, Sparkles, LogIn, LayoutDashboard } from 'lucide-react';
import { Language } from '../types';

interface SponsorInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
}

export const SponsorInfoModal: React.FC<SponsorInfoModalProps> = ({ 
  isOpen, onClose, language, isLoggedIn, onOpenAuth, onOpenDashboard 
}) => {
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
            ? 'Las ubicaciones de patrocinador se pueden crear y administrar desde tu panel de usuario registrado. Crea un perfil de patrocinador, revisa tus datos y elige una opción de ubicación cuando estés listo.'
            : 'Sponsor placements can be created and managed from your registered user dashboard. Create a Sponsor profile, review your details, and choose a placement option when you are ready.'}
        </p>
        
        <button 
          onClick={isLoggedIn ? onOpenDashboard : onOpenAuth}
          className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors"
        >
          {isLoggedIn ? <LayoutDashboard className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
          {isEs ? (isLoggedIn ? 'Ir al panel' : 'Inicia sesión para crear un patrocinador') : (isLoggedIn ? 'Go to dashboard' : 'Sign in to create a sponsor')}
        </button>
      </div>
    </div>
  );
};
