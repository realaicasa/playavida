import React from 'react';
import { Compass, Calendar, Users, Award, User, Building2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/i18n';

export type MainTab = 'discover' | 'events' | 'community' | 'loyalty' | 'profile';

interface BottomNavProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  language: Language;
  hasBusinessAccount?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  language,
}) => {
  const t = translations[language];

  const items: { id: MainTab; label: string; icon: React.ElementType }[] = [
    { id: 'discover', label: t.tab_discover, icon: Compass },
    { id: 'events', label: t.tab_events, icon: Calendar },
    { id: 'community', label: t.tab_community, icon: Users },
    { id: 'loyalty', label: t.tab_loyalty, icon: Award },
    { id: 'profile', label: t.tab_profile, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 py-1.5 px-3 md:hidden shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-teal-800 font-semibold'
                  : 'text-stone-500 hover:text-stone-700 font-normal'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-teal-50 scale-105' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-700' : 'text-stone-500'}`} />
              </div>
              <span className="text-[11px] tracking-tight leading-none mt-1 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
