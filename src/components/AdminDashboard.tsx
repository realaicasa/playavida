import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../lib/i18n';

interface AdminDashboardProps {
  language: Language;
  onClose: () => void;
}

interface SiteSettings {
  launch_mode_enabled: boolean;
  waitlist_url: string;
  show_sample_data: boolean;
  brand_name: string;
  place_name: string;
  currency: string;
  legal_privacy_en: string;
  legal_privacy_es: string;
  legal_terms_en: string;
  legal_terms_es: string;
}

const TABS = [
  { id: 'platform', label: 'Platform & Launch' },
  { id: 'reports', label: 'Reports Queue' },
  { id: 'users', label: 'Users & Founding' },
  { id: 'businesses', label: 'Businesses & Pro' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language, onClose }) => {
  const [activeTab, setActiveTab] = useState('platform');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const isEs = language === 'es';

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage(isEs ? 'Guardado' : 'Saved');
      } else {
        const data = await res.json();
        setMessage(data.code || 'Error');
      }
    } catch {
      setMessage(isEs ? 'Error de red' : 'Network error');
    }
    setSaving(false);
  };

  const updateField = (field: keyof SiteSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="text-xl font-bold text-stone-900">Admin Dashboard</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-900 text-2xl leading-none">&times;</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <p className="text-stone-500">Loading...</p>
          ) : activeTab === 'platform' ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-stone-800">Platform & Launch Controls</h3>

              {/* Launch Mode Toggle */}
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                <div>
                  <p className="font-medium text-stone-800">Launch Mode Enabled</p>
                  <p className="text-xs text-stone-500">When ON, unauthenticated visitors are redirected to the waitlist.</p>
                </div>
                <button
                  onClick={() => updateField('launch_mode_enabled', !settings?.launch_mode_enabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${settings?.launch_mode_enabled ? 'bg-teal-500' : 'bg-stone-300'}`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${settings?.launch_mode_enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Waitlist URL */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Waitlist URL</label>
                <input
                  type="text"
                  value={settings?.waitlist_url || ''}
                  onChange={(e) => updateField('waitlist_url', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              {/* Show Sample Data Toggle */}
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                <div>
                  <p className="font-medium text-stone-800">Show Sample Data</p>
                  <p className="text-xs text-stone-500">Display demo/sample businesses on the platform.</p>
                </div>
                <button
                  onClick={() => updateField('show_sample_data', !settings?.show_sample_data)}
                  className={`w-12 h-6 rounded-full transition-colors ${settings?.show_sample_data ? 'bg-teal-500' : 'bg-stone-300'}`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${settings?.show_sample_data ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Brand Name */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={settings?.brand_name || ''}
                  onChange={(e) => updateField('brand_name', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              {/* Place Name */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Place Name</label>
                <input
                  type="text"
                  value={settings?.place_name || ''}
                  onChange={(e) => updateField('place_name', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Currency</label>
                <input
                  type="text"
                  value={settings?.currency || ''}
                  onChange={(e) => updateField('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              {/* Legal Privacy EN */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Privacy Policy (EN)</label>
                <textarea
                  value={settings?.legal_privacy_en || ''}
                  onChange={(e) => updateField('legal_privacy_en', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              {/* Legal Privacy ES */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Privacy Policy (ES)</label>
                <textarea
                  value={settings?.legal_privacy_es || ''}
                  onChange={(e) => updateField('legal_privacy_es', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              {/* Legal Terms EN */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Terms of Service (EN)</label>
                <textarea
                  value={settings?.legal_terms_en || ''}
                  onChange={(e) => updateField('legal_terms_en', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              {/* Legal Terms ES */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Terms of Service (ES)</label>
                <textarea
                  value={settings?.legal_terms_es || ''}
                  onChange={(e) => updateField('legal_terms_es', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 disabled:opacity-50"
              >
                {saving ? (isEs ? 'Guardando...' : 'Saving...') : (isEs ? 'Guardar' : 'Save')}
              </button>
              {message && <p className="text-sm text-stone-600">{message}</p>}
            </div>
          ) : activeTab === 'reports' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-stone-800">Reports & Moderation Queue</h3>
              <p className="text-sm text-stone-500">Requires TEABLE_TABLE_REPORTS. Coming soon.</p>
            </div>
          ) : activeTab === 'users' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-stone-800">Users & Founding Member Allowlist</h3>
              <p className="text-sm text-stone-500">Requires TEABLE_TABLE_USERS. Coming soon.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-stone-800">Businesses & Pro Status</h3>
              <p className="text-sm text-stone-500">Requires TEABLE_TABLE_BUSINESSES. Coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
