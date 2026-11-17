import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../lib/i18n';

// --- Reports Tab ---
const ReportsTab: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/reports')
      .then((r) => r.json())
      .then((data) => { setReports(data.reports || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleAction = async (action: string, targetType: string, targetId: string, reporterId?: string, ipHash?: string) => {
    const body: any = { action, target_type: targetType, target_id: targetId };
    if (action === 'purge') {
      const confirm = prompt('Type DELETE to confirm permanent purge:');
      if (confirm !== 'DELETE') return;
      body.confirmation = 'DELETE';
    }
    if (action === 'block_reporter') {
      body.reporter_id = reporterId;
      body.reporter_ip_hash = ipHash;
    }
    await fetch('/api/admin/moderation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    // Refresh
    fetch('/api/admin/reports').then((r) => r.json()).then((data) => setReports(data.reports || []));
  };

  if (loading) return <p className="text-stone-500">Loading reports...</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-stone-800">Reports & Moderation Queue</h3>
      {reports.length === 0 ? (
        <p className="text-sm text-stone-500">No reports.</p>
      ) : (
        <div className="space-y-2">
          {reports.map((r: any) => (
            <div key={r.id} className="p-3 border border-stone-200 rounded-lg text-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{r.target_type}:{r.target_id}</span>
                {r.repeat_reporter && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Repeat Reporter</span>}
                {r.same_ip && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">Same IP</span>}
              </div>
              <p className="text-stone-500 mt-1">Reason: {r.reason} | Reporter: {r.reporter_id} | Strikes: {r.strike_count} | {r.created_at}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleAction('hide', r.target_type, r.target_id)} className="px-2 py-1 text-xs bg-stone-200 rounded hover:bg-stone-300">Hide</button>
                <button onClick={() => handleAction('restore', r.target_type, r.target_id)} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">Restore</button>
                <button onClick={() => handleAction('bulk_dismiss', r.target_type, r.target_id)} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Bulk Dismiss</button>
                <button onClick={() => handleAction('block_reporter', r.target_type, r.target_id, r.reporter_id, r.reporter_ip_hash)} className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200">Block Reporter</button>
                <button onClick={() => handleAction('purge', r.target_type, r.target_id)} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Purge</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Users Tab ---
const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');

  const fetchUsers = (q?: string) => {
    const url = q ? `/api/admin/users?search=${encodeURIComponent(q)}` : '/api/admin/users';
    fetch(url).then((r) => r.json()).then((data) => { setUsers(data.users || []); setLoading(false); });
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAction = async (action: string, userId: string, value?: boolean) => {
    const body: any = { action, user_id: userId };
    if (action === 'toggle_suspend') body.suspend = value;
    if (action === 'toggle_founding') body.founding = value;
    if (action === 'toggle_demo') body.demo = value;
    await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    fetchUsers(search);
  };

  const handleAddFounding = async () => {
    if (!newEmail) return;
    await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'add_founding_email', email: newEmail }) });
    setNewEmail('');
    fetchUsers(search);
  };

  if (loading) return <p className="text-stone-500">Loading users...</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-stone-800">Users & Founding Member Allowlist</h3>
      <div className="flex gap-2">
        <button
          onClick={async () => {
            const res = await fetch('/api/admin/seed-founders', { method: 'POST' });
            const data = await res.json();
            alert(data.ok ? `Seeded ${data.created} new, updated ${data.updated} (total ${data.total})` : data.code);
            fetchUsers(search);
          }}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600"
        >
          Seed Confirmed Founders
        </button>
      </div>
      <div className="flex gap-2">
        <input type="text" placeholder="Add founding email..." value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm" />
        <button onClick={handleAddFounding} className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm">Add</button>
      </div>
      <input type="text" placeholder="Search users..." value={search} onChange={(e) => { setSearch(e.target.value); fetchUsers(e.target.value); }} className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" />
      <div className="space-y-2">
        {users.map((u: any) => (
          <div key={u.id} className="p-3 border border-stone-200 rounded-lg text-sm flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="font-medium">{u.email}</span>
              <span className="text-stone-500 ml-2">({u.public_reference})</span>
              {u.is_founding_member && <span className="ml-2 px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs">Founding</span>}
              {u.is_suspended && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Suspended</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleAction('toggle_suspend', u.id, !u.is_suspended)} className="px-2 py-1 text-xs bg-stone-200 rounded hover:bg-stone-300">{u.is_suspended ? 'Restore' : 'Suspend'}</button>
              <button onClick={() => handleAction('toggle_founding', u.id, !u.is_founding_member)} className="px-2 py-1 text-xs bg-teal-100 text-teal-700 rounded hover:bg-teal-200">{u.is_founding_member ? 'Remove Founding' : 'Make Founding'}</button>
              <button onClick={() => handleAction('toggle_demo', u.id, !u.is_demo)} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">{u.is_demo ? 'Unmark Demo' : 'Mark Demo'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Businesses Tab ---
const BusinessesTab: React.FC = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = (q?: string) => {
    const url = q ? `/api/admin/businesses?search=${encodeURIComponent(q)}` : '/api/admin/businesses';
    fetch(url).then((r) => r.json()).then((data) => { setBusinesses(data.businesses || []); setLoading(false); });
  };

  useEffect(() => { fetchBusinesses(); }, []);

  const handleAction = async (businessId: string, hidden: boolean) => {
    await fetch('/api/admin/businesses', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'toggle_hidden', business_id: businessId, hidden }) });
    fetchBusinesses(search);
  };

  if (loading) return <p className="text-stone-500">Loading businesses...</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-stone-800">Businesses & Pro Status</h3>
      <input type="text" placeholder="Search businesses..." value={search} onChange={(e) => { setSearch(e.target.value); fetchBusinesses(e.target.value); }} className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm" />
      <div className="space-y-2">
        {businesses.map((b: any) => (
          <div key={b.id} className="p-3 border border-stone-200 rounded-lg text-sm flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="font-medium">{b.name}</span>
              <div className="flex gap-1 mt-1">
                {b.is_pro && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Pro</span>}
                {b.is_featured && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">Featured</span>}
                {b.is_sponsor && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">Sponsor</span>}
                {b.is_demo && <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">Demo</span>}
                {b.is_hidden && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Hidden</span>}
              </div>
            </div>
            <button onClick={() => handleAction(b.id, !b.is_hidden)} className="px-2 py-1 text-xs bg-stone-200 rounded hover:bg-stone-300">{b.is_hidden ? 'Restore' : 'Hide'}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Community Tab ---
const CommunityTab: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchItems = (f?: string) => {
    const url = f ? `/api/admin/community?filter=${f}` : '/api/admin/community';
    fetch(url).then((r) => r.json()).then((data) => { setItems(data.items || []); setLoading(false); });
  };

  useEffect(() => { fetchItems(filter); }, [filter]);

  const handleAction = async (type: string, id: string, action: string, value?: any) => {
    const body: any = { action };
    if (action === 'toggle_featured') body.is_featured = value;
    if (action === 'toggle_hidden') body.is_hidden = value;
    if (action === 'edit_date') body.event_date = value;
    await fetch(`/api/admin/community/${type}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    fetchItems(filter);
  };

  if (loading) return <p className="text-stone-500">Loading community items...</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-stone-800">Groups & Events Management</h3>
      <div className="flex gap-2 flex-wrap">
        {['all', 'groups', 'events', 'featured', 'hidden'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-xs rounded-full ${filter === f ? 'bg-teal-500 text-white' : 'bg-stone-200 text-stone-700'}`}>{f}</button>
        ))}
      </div>
      <div className="space-y-2">
        {items.map((item: any) => (
          <div key={item.id} className="p-3 border border-stone-200 rounded-lg text-sm flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="font-medium">{item.title}</span>
              <span className="text-stone-500 ml-2">({item.type})</span>
              {item.is_featured && <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">Featured</span>}
              {item.is_hidden && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Hidden</span>}
              {item.is_demo && <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">Demo</span>}
              {item.event_date && <span className="ml-2 text-xs text-stone-400">{item.event_date}</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleAction(item.type, item.id, 'toggle_featured', !item.is_featured)} className="px-2 py-1 text-xs bg-stone-200 rounded hover:bg-stone-300">{item.is_featured ? 'Unfeature' : 'Feature'}</button>
              <button onClick={() => handleAction(item.type, item.id, 'toggle_hidden', !item.is_hidden)} className="px-2 py-1 text-xs bg-stone-200 rounded hover:bg-stone-300">{item.is_hidden ? 'Restore' : 'Hide'}</button>
              <button onClick={() => { if (confirm('Type DELETE to purge')) handleAction(item.type, item.id, 'purge'); }} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Purge</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Revenue Tab ---
const RevenueTab: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState('');
  const [replayResult, setReplayResult] = useState('');

  useEffect(() => {
    fetch('/api/admin/subscriptions').then((r) => r.json()).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleReplay = async () => {
    if (!sessionId) return;
    const res = await fetch('/api/admin/stripe/replay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: sessionId }) });
    const d = await res.json();
    setReplayResult(d.code || d.message || 'Done');
  };

  if (loading) return <p className="text-stone-500">Loading revenue data...</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-stone-800">Revenue, Subscriptions & Stripe Replay</h3>

      {/* Replay input */}
      <div className="p-4 bg-white rounded-xl border border-stone-200">
        <h4 className="font-medium text-stone-800 mb-2">Replay / Reconcile Stripe Session</h4>
        <div className="flex gap-2">
          <input type="text" placeholder="cs_..." value={sessionId} onChange={(e) => setSessionId(e.target.value)} className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm" />
          <button onClick={handleReplay} className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm">Replay</button>
        </div>
        {replayResult && <p className="text-sm mt-2 text-stone-600">{replayResult}</p>}
      </div>

      {/* KPI Cards */}
      {data?.kpis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-stone-200">
            <p className="text-xs text-stone-500">Total Collected (MXN)</p>
            <p className="text-xl font-bold text-stone-800">{data.kpis.total_collected_mxn}</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200">
            <p className="text-xs text-stone-500">Active Pro</p>
            <p className="text-xl font-bold text-stone-800">{data.kpis.active_pro}</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200">
            <p className="text-xs text-stone-500">Active Sponsors</p>
            <p className="text-xl font-bold text-stone-800">{data.kpis.active_sponsors}</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200">
            <p className="text-xs text-stone-500">Expiring in 7 Days</p>
            <p className="text-xl font-bold text-red-600">{data.kpis.expiring_soon_count}</p>
          </div>
        </div>
      )}

      {/* Expiring soon table */}
      {data?.expiring_soon?.length > 0 && (
        <div>
          <h4 className="font-medium text-stone-800 mb-2">Expiring Soon</h4>
          <div className="space-y-2">
            {data.expiring_soon.map((s: any) => (
              <div key={s.id} className="p-2 border border-stone-200 rounded text-sm">
                {s.business_id} — expires {s.expires_at}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Audit & Loyalty Tab ---
const AuditLoyaltyTab: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loyalty, setLoyalty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/audit-logs').then((r) => r.json()),
      fetch('/api/admin/loyalty').then((r) => r.json()),
    ]).then(([auditData, loyaltyData]) => {
      setLogs(auditData.logs || []);
      setLoyalty(loyaltyData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-stone-500">Loading audit & loyalty data...</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-stone-800">Audit Logs & Loyalty Monitor</h3>

      {/* Loyalty Programs */}
      {loyalty?.programs?.length > 0 && (
        <div>
          <h4 className="font-medium text-stone-800 mb-2">Loyalty Programs</h4>
          <div className="space-y-2">
            {loyalty.programs.map((p: any) => (
              <div key={p.id} className="p-3 border border-stone-200 rounded-lg text-sm flex items-center justify-between">
                <div>
                  <span className="font-medium">{p.name}</span>
                  {p.anomaly && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Anomaly</span>}
                </div>
                <button
                  onClick={async () => {
                    await fetch('/api/admin/loyalty', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ program_id: p.id, is_active: !p.is_active }) });
                    fetch('/api/admin/loyalty').then((r) => r.json()).then(setLoyalty);
                  }}
                  className={`px-2 py-1 text-xs rounded ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {p.is_active ? 'Active' : 'Paused'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Logs */}
      <div>
        <h4 className="font-medium text-stone-800 mb-2">Audit Logs (newest first)</h4>
        {logs.length === 0 ? (
          <p className="text-sm text-stone-500">No audit logs.</p>
        ) : (
          <div className="space-y-2">
            {logs.slice(0, 50).map((log: any) => (
              <div key={log.id} className="p-2 border border-stone-200 rounded text-xs">
                <span className="text-stone-400">{log.created_at}</span>
                <span className="ml-2 font-medium">{log.actor_email}</span>
                <span className="ml-2 px-1.5 py-0.5 bg-stone-100 rounded">{log.action}</span>
                <span className="ml-2 text-stone-500">{log.target_type}:{log.target_id}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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
  maintenance_readonly: boolean;
  banner_enabled: boolean;
  banner_text: string;
  banner_link: string;
  banner_tone: 'info' | 'promo' | 'alert';
}

const TABS = [
  { id: 'platform', label: 'Platform & Launch' },
  { id: 'reports', label: 'Reports Queue' },
  { id: 'users', label: 'Users & Founding' },
  { id: 'businesses', label: 'Businesses & Pro' },
  { id: 'community', label: 'Groups & Events' },
  { id: 'revenue', label: 'Revenue & Stripe' },
  { id: 'audit', label: 'Audit & Loyalty' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language, onClose }) => {
  const [activeTab, setActiveTab] = useState('platform');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [health, setHealth] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  const isEs = language === 'es';

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    fetchHealth();
  }, []);

  const fetchHealth = () => {
    setHealthLoading(true);
    fetch('/api/admin/health')
      .then((r) => r.json())
      .then((data) => { setHealth(data); setHealthLoading(false); })
      .catch(() => setHealthLoading(false));
  };

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
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-stone-900">PlayaVida Admin</h1>
            <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs font-medium">Superadmin</span>
          </div>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors">
            Back to Live Site
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
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
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-stone-500">Loading...</p>
        ) : activeTab === 'platform' ? (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-stone-800">Platform & Launch Controls</h3>

            {/* System Health Bar */}
            <div className="p-4 bg-white rounded-xl border border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-stone-800">System Health</h4>
                <button onClick={fetchHealth} disabled={healthLoading} className="px-3 py-1 text-xs bg-stone-100 rounded hover:bg-stone-200 disabled:opacity-50">
                  {healthLoading ? 'Checking...' : 'Refresh'}
                </button>
              </div>
              {health ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="p-2 bg-stone-50 rounded">
                    <p className="text-xs text-stone-500">Teable</p>
                    <p className={`font-medium ${health.teable?.status === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                      {health.teable?.status} ({health.teable?.latency_ms}ms)
                    </p>
                  </div>
                  <div className="p-2 bg-stone-50 rounded">
                    <p className="text-xs text-stone-500">Resend</p>
                    <p className={`font-medium ${health.resend?.status === 'configured' ? 'text-green-600' : 'text-red-600'}`}>
                      {health.resend?.status}
                    </p>
                  </div>
                  <div className="p-2 bg-stone-50 rounded">
                    <p className="text-xs text-stone-500">Stripe</p>
                    <p className={`font-medium ${health.stripe?.status === 'configured' ? 'text-green-600' : 'text-red-600'}`}>
                      {health.stripe?.status}
                    </p>
                  </div>
                  <div className="p-2 bg-stone-50 rounded">
                    <p className="text-xs text-stone-500">Last Webhook</p>
                    <p className="font-medium text-stone-700 text-xs">{health.last_webhook_at || 'None'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-500">Click Refresh to check system health.</p>
              )}
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200">
              <div>
                <p className="font-medium text-stone-800">Maintenance / Read-Only Mode</p>
                <p className="text-xs text-stone-500">When ON, public write routes return 503.</p>
              </div>
              <button
                onClick={() => updateField('maintenance_readonly', !settings?.maintenance_readonly)}
                className={`w-12 h-6 rounded-full transition-colors ${settings?.maintenance_readonly ? 'bg-red-500' : 'bg-stone-300'}`}
              >
                <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${settings?.maintenance_readonly ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Banner Controls */}
            <div className="space-y-3 p-4 bg-white rounded-xl border border-stone-200">
              <h4 className="font-medium text-stone-800">Announcement Banner</h4>
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-500">Enable banner on public app</p>
                <button
                  onClick={() => updateField('banner_enabled', !settings?.banner_enabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${settings?.banner_enabled ? 'bg-teal-500' : 'bg-stone-300'}`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${settings?.banner_enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Banner Text</label>
                <textarea
                  value={settings?.banner_text || ''}
                  onChange={(e) => updateField('banner_text', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Banner Link (optional)</label>
                <input
                  type="text"
                  value={settings?.banner_link || ''}
                  onChange={(e) => updateField('banner_link', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Banner Tone</label>
                <select
                  value={settings?.banner_tone || 'info'}
                  onChange={(e) => updateField('banner_tone', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                >
                  <option value="info">Info</option>
                  <option value="promo">Promo</option>
                  <option value="alert">Alert</option>
                </select>
              </div>
              {/* Live Preview */}
              {settings?.banner_enabled && settings?.banner_text && (
                <div className={`p-3 rounded-lg text-sm ${
                  settings.banner_tone === 'alert' ? 'bg-red-100 text-red-800' :
                  settings.banner_tone === 'promo' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  <p>{settings.banner_text}</p>
                  {settings.banner_link && <a href={settings.banner_link} className="underline text-xs">{settings.banner_link}</a>}
                </div>
              )}
            </div>

            {/* Launch Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200">
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
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200">
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
          <ReportsTab />
        ) : activeTab === 'users' ? (
          <UsersTab />
        ) : activeTab === 'businesses' ? (
          <BusinessesTab />
        ) : activeTab === 'community' ? (
          <CommunityTab />
        ) : activeTab === 'revenue' ? (
          <RevenueTab />
        ) : (
          <AuditLoyaltyTab />
        )}
      </div>
    </div>
  );
};


