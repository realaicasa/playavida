import React, { useState } from 'react';
import { Tag, Plus, Check, X, Search, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { playaVidaStore } from '../lib/storage';
import { CommunityInterestItem } from '../lib/communityInterests';

interface AlphabeticalInterestsSelectProps {
  selectedInterests: string[]; // array of labels or IDs
  onChange: (interests: string[]) => void;
  language: Language;
  maxSelection?: number;
  label?: string;
}

export const AlphabeticalInterestsSelect: React.FC<AlphabeticalInterestsSelectProps> = ({
  selectedInterests,
  onChange,
  language,
  label: customLabel,
}) => {
  const isEs = language === 'es';
  const [allInterests, setAllInterests] = useState<CommunityInterestItem[]>(() =>
    playaVidaStore.getAllInterests(isEs)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customInterestName, setCustomInterestName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const refreshInterests = () => {
    setAllInterests(playaVidaStore.getAllInterests(isEs));
  };

  const handleToggle = (label: string) => {
    if (selectedInterests.includes(label)) {
      onChange(selectedInterests.filter((item) => item !== label));
    } else {
      onChange([...selectedInterests, label]);
    }
  };

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = customInterestName.trim();
    if (!clean) {
      setErrorMsg(isEs ? 'Escribe el nombre del interés.' : 'Please enter the interest name.');
      return;
    }

    try {
      const created = playaVidaStore.addCustomInterest(clean, clean);
      refreshInterests();
      const label = isEs ? created.label_es : created.label_en;
      if (!selectedInterests.includes(label)) {
        onChange([...selectedInterests, label]);
      }
      setCustomInterestName('');
      setIsAddingCustom(false);
      setErrorMsg('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating custom interest');
    }
  };

  // Filtered by search if typed
  const displayedInterests = allInterests.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.label_es.toLowerCase().includes(q) || item.label_en.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div>
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-teal-700" />
            <span>{customLabel || (isEs ? 'Intereses & Pasiones de la Comunidad' : 'Community Passions & Interests')}</span>
            <span className="py-0.5 px-2 bg-teal-100 text-teal-800 rounded-full text-[10px] font-bold">
              {selectedInterests.length} {isEs ? 'seleccionados' : 'selected'}
            </span>
          </label>
          <span className="text-[10px] text-stone-500">
            {isEs
              ? 'Selecciona tantos como desees (ordenados alfabéticamente). Conecta con otros miembros afines.'
              : 'Select as many as you desire (alphabetical order). Match with like-minded members.'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsAddingCustom(true);
            setErrorMsg('');
          }}
          className="self-start sm:self-auto py-1 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Plus className="w-3 h-3 text-amber-700" />
          <span>{isEs ? '+ Agregar otro interés' : '+ Add custom interest'}</span>
        </button>
      </div>

      {/* Quick search input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isEs ? 'Filtrar intereses en la lista...' : 'Search interests in list...'}
          className="w-full pl-8.5 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 placeholder:text-stone-400"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-semibold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Custom Interest Add Form */}
      {isAddingCustom && (
        <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-2xl space-y-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{isEs ? 'Añadir Nuevo Interés Comunitario' : 'Add New Community Interest'}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setIsAddingCustom(false);
                setErrorMsg('');
              }}
              className="text-stone-400 hover:text-stone-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[10px] text-amber-800 leading-snug">
            {isEs
              ? 'Se registrará en la memoria permanente y siempre se mostrará en orden alfabético.'
              : 'Will be stored in persistent memory and always shown in alphabetical order.'}
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customInterestName}
              onChange={(e) => {
                setCustomInterestName(e.target.value);
                setErrorMsg('');
              }}
              placeholder={isEs ? 'Ej. Apicultura, Salsa Cubana, Calistenia...' : 'e.g. Beekeeping, Salsa Cubana, Calisthenics...'}
              className="flex-1 p-2 bg-white border border-amber-300 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustom();
                }
              }}
            />
            <button
              type="button"
              onClick={() => handleAddCustom()}
              className="py-2 px-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0 shadow-2xs"
            >
              <Check className="w-3 h-3" />
              <span>{isEs ? 'Guardar' : 'Save'}</span>
            </button>
          </div>

          {errorMsg && <p className="text-[10px] text-rose-600 font-semibold">{errorMsg}</p>}
        </div>
      )}

      {/* Grid of Interests (Multi-select, Alphabetical) */}
      <div className="max-h-56 overflow-y-auto p-2.5 bg-stone-50/80 rounded-2xl border border-stone-200 flex flex-wrap gap-1.5 scrollbar-thin">
        {displayedInterests.map((item) => {
          const label = isEs ? item.label_es : item.label_en;
          const isSelected = selectedInterests.includes(label);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleToggle(label)}
              className={`py-1.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                isSelected
                  ? 'bg-teal-800 text-white border-teal-800 shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-100'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 text-teal-200" />}
              <span>{label}</span>
            </button>
          );
        })}

        {displayedInterests.length === 0 && (
          <div className="w-full text-center py-4 text-xs text-stone-400">
            {isEs ? 'No se encontraron intereses con ese nombre.' : 'No interests found.'}
          </div>
        )}
      </div>
    </div>
  );
};
