import React, { useState } from 'react';
import { MapPin, Plus, Check, X } from 'lucide-react';
import { Language, LocationCode, LocationInfo } from '../types';
import { playaVidaStore } from '../lib/storage';

interface AlphabeticalAreaSelectProps {
  value: LocationCode | string;
  onChange: (value: LocationCode | string) => void;
  language: Language;
  label?: string;
  allowAll?: boolean;
  allOptionLabel?: string;
  className?: string;
}

export const AlphabeticalAreaSelect: React.FC<AlphabeticalAreaSelectProps> = ({
  value,
  onChange,
  language,
  label,
  allowAll = false,
  allOptionLabel,
  className = '',
}) => {
  const isEs = language === 'es';
  const [locations, setLocations] = useState<LocationInfo[]>(() =>
    playaVidaStore.getAllLocations(isEs)
  );
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const refreshLocations = () => {
    setLocations(playaVidaStore.getAllLocations(isEs));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === '__ADD_ADDITIONAL_OPTION__') {
      setIsAddingNew(true);
      setErrorMsg('');
      return;
    }
    onChange(selected as LocationCode);
  };

  const handleCreateNewLocation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newLocationName.trim();
    if (!clean) {
      setErrorMsg(isEs ? 'Por favor escribe el nombre de la zona.' : 'Please enter the area name.');
      return;
    }

    try {
      const created = playaVidaStore.addCustomLocation(clean);
      refreshLocations();
      onChange(created.code);
      setNewLocationName('');
      setIsAddingNew(false);
      setErrorMsg('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating area');
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-700" />
            <span>{label}</span>
          </span>
          <span className="text-[10px] text-stone-400 font-normal">
            {isEs ? '(Orden alfabético)' : '(Alphabetical)'}
          </span>
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={handleSelectChange}
          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 transition-all cursor-pointer"
        >
          {allowAll && (
            <option value="ALL">
              {allOptionLabel || (isEs ? 'Toda la Riviera Maya' : 'All Riviera Maya')}
            </option>
          )}

          {locations.map((loc) => {
            const displayName = isEs ? loc.name_es : loc.name_en;
            return (
              <option key={loc.code} value={loc.code}>
                {displayName}
              </option>
            );
          })}

          <option
            value="__ADD_ADDITIONAL_OPTION__"
            className="font-bold text-teal-800 bg-teal-50"
          >
            + {isEs ? 'Agregar nueva zona / área...' : 'Add custom zone / area...'}
          </option>
        </select>
      </div>

      {/* Inline quick-add dialog when user selects "+ additional option" */}
      {isAddingNew && (
        <div className="p-3 bg-teal-50/80 border border-teal-200 rounded-2xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
              <Plus className="w-3.5 h-3.5 text-teal-700" />
              <span>{isEs ? 'Nueva Zona Costera' : 'New Coastal Zone'}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setErrorMsg('');
              }}
              className="text-stone-400 hover:text-stone-600 p-0.5 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-teal-800 leading-snug">
            {isEs
              ? 'Se guardará en la memoria permanente del dispositivo y se mostrará siempre en orden alfabético.'
              : 'Will be saved to persistent memory and always sorted alphabetically in this dropdown.'}
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newLocationName}
              onChange={(e) => {
                setNewLocationName(e.target.value);
                setErrorMsg('');
              }}
              placeholder={isEs ? 'Ej. Chemuyil, Paamul, Cobá...' : 'e.g. Chemuyil, Paamul, Cobá...'}
              className="flex-1 p-2 bg-white border border-teal-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreateNewLocation();
                }
              }}
            />
            <button
              type="button"
              onClick={() => handleCreateNewLocation()}
              className="py-2 px-3.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0 shadow-2xs"
            >
              <Check className="w-3 h-3" />
              <span>{isEs ? 'Guardar' : 'Save'}</span>
            </button>
          </div>

          {errorMsg && <p className="text-[10px] text-rose-600 font-semibold">{errorMsg}</p>}
        </div>
      )}
    </div>
  );
};
