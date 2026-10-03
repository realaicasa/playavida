import React from 'react';
import { Language } from '../types';

interface LandingPageProps {
  language: Language;
  onToggleLanguage: () => void;
  onEnter: () => void;
  onOpenInstall: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    <iframe
      src="/intro.html"
      className="fixed inset-0 w-full h-full border-0 z-[100]"
      title="Intro"
    />
  );
};
