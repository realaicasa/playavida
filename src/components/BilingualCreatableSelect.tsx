import React, { useState, useMemo } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { Language } from '../types';

export interface SelectOption {
  value: string;
  label_es: string;
  label_en: string;
}

interface BilingualCreatableSelectProps {
  id?: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  language: Language;
  placeholder?: string;
  hint?: string;
  className?: string;
  newItemLabel?: string;
}

export const BilingualCreatableSelect: React.FC<BilingualCreatableSelectProps> = ({
  id,
  label,
  required = false,
  value,
  onChange,
  options: initialOptions,
  language,
  placeholder,
  hint,
  className = '',
  newItemLabel,
}) => {
  const isEs = language === 'es';

  // Normalize all options to { value, label_es, label_en }
  const [customOptions, setCustomOptions] = useState<SelectOption[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newOptionInput, setNewOptionInput] = useState('');

  // Combine initial and custom options
  const allNormalizedOptions = useMemo(() => {
    const map = new Map<string, SelectOption>();

    // Initial options
    initialOptions.forEach((opt) => {
      if (typeof opt === 'string') {
        map.set(opt, { value: opt, label_es: opt, label_en: opt });
      } else {
        map.set(opt.value, opt);
      }
    });

    // Custom options added by user
    customOptions.forEach((opt) => {
      map.set(opt.value, opt);
    });

    // If current value is not in map (e.g. from outside edit), add it
    if (value && !map.has(value)) {
      map.set(value, { value, label_es: value, label_en: value });
    }

    const list = Array.from(map.values());

    // Sort alphabetically based on current language
    list.sort((a, b) => {
      const labelA = isEs ? a.label_es : a.label_en;
      const labelB = isEs ? b.label_es : b.label_en;
      return labelA.localeCompare(labelB, isEs ? 'es' : 'en', { sensitivity: 'base' });
    });

    return list;
  }, [initialOptions, customOptions, isEs, value]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVal = e.target.value;
    if (selectedVal === '__NEW_OPTION__') {
      setIsAddingNew(true);
      return;
    }
    onChange(selectedVal);
  };

  const handleAddNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newOptionInput.trim();
    if (!trimmed) {
      setIsAddingNew(false);
      return;
    }

    const newOpt: SelectOption = {
      value: trimmed,
      label_es: trimmed,
      label_en: trimmed,
    };

    setCustomOptions((prev) => [...prev, newOpt]);
    onChange(trimmed);
    setNewOptionInput('');
    setIsAddingNew(false);
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-bold text-stone-800 block">
          {label} {required && <span className="text-amber-600">*</span>}
        </label>
        {!isAddingNew && (
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="text-[11px] font-semibold text-teal-800 hover:text-teal-900 flex items-center gap-0.5 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>{isEs ? 'Nuevo +' : 'New +'}</span>
          </button>
        )}
      </div>

      {isAddingNew ? (
        <div className="p-2.5 bg-teal-50/80 border border-teal-200 rounded-xl space-y-2 animate-in fade-in duration-150">
          <div className="text-[11px] font-semibold text-teal-900">
            {isEs ? 'Escribe la nueva opción no listada:' : 'Enter custom option not listed:'}
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              autoFocus
              value={newOptionInput}
              onChange={(e) => setNewOptionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddNewSubmit(e);
                } else if (e.key === 'Escape') {
                  setIsAddingNew(false);
                }
              }}
              placeholder={isEs ? 'Ej. Brunch & Mimosa, Terraza Pet Friendly...' : 'e.g. Organic Brunch, Dog Friendly...'}
              className="flex-1 p-2 text-xs bg-white border border-teal-300 rounded-lg text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-teal-700/30"
            />
            <button
              type="button"
              onClick={handleAddNewSubmit}
              disabled={!newOptionInput.trim()}
              className="py-2 px-3 bg-teal-800 hover:bg-teal-900 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isEs ? 'Agregar' : 'Add'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setNewOptionInput('');
                setIsAddingNew(false);
              }}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <select
          id={id}
          value={value}
          onChange={handleSelectChange}
          required={required}
          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 transition-all font-medium"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {allNormalizedOptions.map((opt) => {
            const displayLabel = isEs
              ? opt.label_es === opt.label_en
                ? opt.label_es
                : `${opt.label_es} (${opt.label_en})`
              : opt.label_en === opt.label_es
              ? opt.label_en
              : `${opt.label_en} (${opt.label_es})`;
            return (
              <option key={opt.value} value={opt.value}>
                {displayLabel}
              </option>
            );
          })}
          <option value="__NEW_OPTION__" className="text-teal-800 font-bold">
            {isEs ? '➕ Agregar otra opción (Nuevo +)...' : '➕ Add custom option (New +)...'}
          </option>
        </select>
      )}

      {hint && <p className="text-[10px] text-stone-400 leading-tight">{hint}</p>}
    </div>
  );
};
