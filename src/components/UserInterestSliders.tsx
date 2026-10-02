import React, { useState } from 'react';
import {
  Activity,
  Mic,
  Sparkles,
  Waves,
  Trophy,
  Target,
  Camera,
  Bike,
  Utensils,
  HeartHandshake,
  Compass,
  Cpu,
  Music,
  HandHeart,
  Users,
  Smile,
  Laptop,
  Briefcase,
  Palette,
  Trees,
  Check,
  Save,
  Sliders,
  Flame,
  Info,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Language, User } from '../types';
import { USER_INTEREST_CATEGORIES, getInterestLabel } from '../lib/interests';
import { playaVidaStore } from '../lib/storage';

interface UserInterestSlidersProps {
  currentUser: User;
  language: Language;
  onSaveNotice?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Activity,
  Mic,
  Sparkles,
  Waves,
  Trophy,
  Target,
  Camera,
  Bike,
  Utensils,
  HeartHandshake,
  Compass,
  Cpu,
  Music,
  HandHeart,
  Users,
  Smile,
  Laptop,
  Briefcase,
  Palette,
  Trees,
};

export const UserInterestSliders: React.FC<UserInterestSlidersProps> = ({
  currentUser,
  language,
  onSaveNotice,
}) => {
  const isEs = language === 'es';

  // Initialize from user data or defaults
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const saved = playaVidaStore.getUserInterests(currentUser.id);
    const initial: Record<string, number> = {};
    USER_INTEREST_CATEGORIES.forEach((cat) => {
      initial[cat.id] = saved[cat.id] !== undefined ? saved[cat.id] : cat.defaultScore;
    });
    return initial;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSliderChange = (catId: string, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [catId]: value,
    }));
  };

  const handleApplyPreset = (presetName: 'wellness' | 'nomad' | 'beach' | 'social') => {
    const updated = { ...ratings };
    if (presetName === 'wellness') {
      updated['yoga_health_gym'] = 10;
      updated['sound_healing_meditation'] = 10;
      updated['public_speaking_dev'] = 8;
      updated['adventures_cenotes'] = 8;
      updated['dancing_nightlife'] = 3;
    } else if (presetName === 'nomad') {
      updated['crypto_tech'] = 10;
      updated['group_meetups'] = 10;
      updated['dining_out'] = 8;
      updated['public_speaking_dev'] = 8;
      updated['indoor_sports'] = 6;
    } else if (presetName === 'beach') {
      updated['beachsports_water'] = 10;
      updated['adventures_cenotes'] = 10;
      updated['paddle_tennis'] = 9;
      updated['dining_out'] = 8;
    } else if (presetName === 'social') {
      updated['dancing_nightlife'] = 10;
      updated['dining_out'] = 10;
      updated['group_meetups'] = 9;
      updated['hobbies_creative'] = 8;
    }
    setRatings(updated);
  };

  const handleSave = () => {
    playaVidaStore.updateUserInterests(currentUser.id, ratings);
    setSavedSuccess(true);
    if (onSaveNotice) onSaveNotice();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Identify top passions
  const topPassions = Object.entries(ratings)
    .filter(([_, score]) => score >= 8)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => USER_INTEREST_CATEGORIES.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-teal-700" />
          <span>{isEs ? 'Matriz de Preferencias & Estilo de Vida' : 'Lifestyle & Interest Matrix'}</span>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          {isEs
            ? 'Ajusta cada barra del 1 al 10 para personalizar tu feed de eventos, recomendaciones de negocios locales y alertas comunitarias dirigidas.'
            : 'Adjust each slider (1 to 10) to customize your event discovery, local business perks, and targeted community notifications.'}
        </p>

        {/* Quick Presets (Wrapped cleanly, no horizontal scrolling) */}
        <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase mr-1 shrink-0">
            {isEs ? 'Atajos:' : 'Presets:'}
          </span>
          <button
            type="button"
            onClick={() => handleApplyPreset('wellness')}
            className="py-1 px-2.5 bg-white hover:bg-teal-100/70 text-teal-800 font-semibold rounded-lg border border-teal-200 text-xs transition-colors cursor-pointer shadow-2xs"
          >
            🧘 {isEs ? 'Bienestar & Yoga' : 'Wellness & Yoga'}
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('beach')}
            className="py-1 px-2.5 bg-white hover:bg-teal-100/70 text-teal-800 font-semibold rounded-lg border border-teal-200 text-xs transition-colors cursor-pointer shadow-2xs"
          >
            🌊 {isEs ? 'Playa & Cenotes' : 'Beach & Cenotes'}
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('nomad')}
            className="py-1 px-2.5 bg-white hover:bg-teal-100/70 text-teal-800 font-semibold rounded-lg border border-teal-200 text-xs transition-colors cursor-pointer shadow-2xs"
          >
            💻 {isEs ? 'Nómada & Tech' : 'Nomad & Tech'}
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('social')}
            className="py-1 px-2.5 bg-white hover:bg-teal-100/70 text-teal-800 font-semibold rounded-lg border border-teal-200 text-xs transition-colors cursor-pointer shadow-2xs"
          >
            🎉 {isEs ? 'Social & Salsa' : 'Social & Salsa'}
          </button>
        </div>
      </div>

      {/* List of 14 Interest Sliders */}
      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
        {USER_INTEREST_CATEGORIES.map((cat) => {
          const score = ratings[cat.id] ?? cat.defaultScore;
          const status = getInterestLabel(score, language);
          const IconComponent = ICON_MAP[cat.icon] || Activity;

          return (
            <div
              key={cat.id}
              className="p-3.5 bg-stone-50/80 hover:bg-stone-50 border border-stone-200 hover:border-teal-300 rounded-2xl transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                      {isEs ? cat.name_es : cat.name_en}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {isEs ? cat.description_es : cat.description_en}
                    </p>
                  </div>
                </div>

                {/* Score badge */}
                <div className="text-right shrink-0">
                  <span
                    className={`font-mono font-bold text-xs py-0.5 px-2 rounded-lg border ${status.color}`}
                  >
                    {score}/10
                  </span>
                </div>
              </div>

              {/* Slider Bar & Action Buttons */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={score}
                  onChange={(e) => handleSliderChange(cat.id, Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
                />
                <div className="flex justify-between items-center text-[10px] text-stone-500 font-medium">
                  <span>{isEs ? '0: Sin interés' : '0: Not interested'}</span>
                  <span className="font-semibold text-teal-800">{isEs ? '5: Moderado' : '5: Somewhat'}</span>
                  <span>{isEs ? '10: Máxima prioridad' : '10: Highest priority'}</span>
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => handleSliderChange(cat.id, cat.defaultScore)}
                    className="py-0.5 px-2 bg-white hover:bg-stone-100 text-stone-600 rounded border border-stone-200 font-medium transition-colors"
                  >
                    {isEs ? 'Restablecer' : 'Default'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSliderChange(cat.id, 0)}
                    className="py-0.5 px-2 bg-white hover:bg-rose-50 text-stone-500 hover:text-rose-700 rounded border border-stone-200 font-medium transition-colors"
                  >
                    {isEs ? 'No considerar' : 'Do not use'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Passions Summary & Save Button */}
      <div className="pt-2 border-t border-stone-200 space-y-3">
        {topPassions.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="font-bold text-stone-500 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{isEs ? 'Tus Intereses Principales:' : 'Your Top Passions:'}</span>
            </span>
            {topPassions.map((p) => (
              <span
                key={p?.id}
                className="py-0.5 px-2 bg-teal-50 text-teal-800 border border-teal-200 rounded-full font-medium text-[11px]"
              >
                {isEs ? p?.name_es : p?.name_en}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{isEs ? '¡Preferencias Guardadas con Éxito!' : 'Preferences Saved Successfully!'}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEs ? 'Guardar mi Matriz de Intereses' : 'Save Lifestyle Preferences'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
