import React from 'react';
import { X, ExternalLink, Building2 } from 'lucide-react';
import { Language } from '../types';

interface QRcasasModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const QRcasasModal: React.FC<QRcasasModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;
  const isEs = language === 'es';

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">{isEs ? 'Directorio de Alojamiento' : 'Accommodation Directory'}</h3>
            <button onClick={onClose}><X className="w-5 h-5 text-stone-500" /></button>
        </div>
        <p className="text-sm text-stone-600">
            {isEs 
             ? 'Esta es nuestra plataforma hermana especializada en directorios de propiedades en la Riviera Maya.'
             : 'This is our sister platform specializing in property directories in the Riviera Maya.'}
        </p>
        <a href="https://qrcasas.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-teal-800 text-white rounded-xl font-bold">
            {isEs ? 'Visitar QRcasas' : 'Visit QRcasas'} <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
