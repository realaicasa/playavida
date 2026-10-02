import React, { useState } from 'react';
import {
  X,
  Users,
  UserPlus,
  Check,
  Shield,
  Tag,
  Share2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  QrCode,
  Target,
  FileText,
  Radio,
  Send,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CommunityGroup, Language, User, BroadcastCampaign } from '../types';
import { translations } from '../lib/i18n';
import { playaVidaStore } from '../lib/storage';

interface GroupModalProps {
  group: CommunityGroup | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentUser: User | null;
  isJoined: boolean;
  onToggleJoin: (groupId: string) => void;
  onOpenMinisite: (group: CommunityGroup) => void;
  onOpenQrModal: (reference: string, title: string) => void;
}

export const GroupModal: React.FC<GroupModalProps> = ({
  group,
  isOpen,
  onClose,
  language,
  currentUser,
  isJoined,
  onToggleJoin,
  onOpenMinisite,
  onOpenQrModal,
}) => {
  if (!isOpen || !group) return null;

  const t = translations[language];
  const isEs = language === 'es';
  const name = isEs ? group.name_es : group.name_en;
  const description = isEs ? group.description_es : group.description_en;

  const [activeTab, setActiveTab] = useState<'details' | 'members' | 'broadcasts'>('details');

  // Members & Broadcasts states
  const [members, setMembers] = useState(() => playaVidaStore.getMembersForGroup(group.id));
  const [broadcasts, setBroadcasts] = useState<BroadcastCampaign[]>(() =>
    playaVidaStore.getBroadcastCampaigns('group', group.id)
  );
  const [isComposing, setIsComposing] = useState(false);
  const [bcTitle, setBcTitle] = useState('');
  const [bcMessage, setBcMessage] = useState('');
  const [bcSuccess, setBcSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isCoordinator = currentUser?.id === group.owner_user_id || currentUser?.role === 'admin';

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcTitle.trim() || !bcMessage.trim()) return;

    const newCamp = playaVidaStore.createBroadcastCampaign(currentUser?.id || 'usr_001', {
      target_type: 'group',
      target_id: group.id,
      target_name: name,
      title: bcTitle.trim(),
      message: bcMessage.trim(),
      target_segment: 'all_members',
      recipient_count: members.length || group.member_count,
      plan_price_mxn: 0,
      payment_method: 'card',
    });

    setBroadcasts([newCamp, ...broadcasts]);
    setBcTitle('');
    setBcMessage('');
    setIsComposing(false);
    setBcSuccess(true);
    setTimeout(() => setBcSuccess(false), 4000);
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(`${window.location.origin}/?ref=${group.group_reference}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Header */}
        <div className="relative h-40 sm:h-44 w-full bg-stone-900 shrink-0">
          <img src={group.cover_url} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 bg-stone-900/70 hover:bg-stone-900 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Reference pill */}
          <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md py-1 px-3 rounded-full border border-stone-200 text-[11px] font-mono font-bold text-stone-800 shadow-sm">
            {group.group_reference}
          </div>

          <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white">
            <span className="text-xs font-semibold py-1 px-2.5 bg-stone-900/80 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>
                {group.member_count + (isJoined ? 1 : 0)} {t.members}
              </span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyInvite}
                className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-md transition-colors flex items-center gap-1 text-xs"
                title={isEs ? 'Copiar enlace de invitación' : 'Copy invite link'}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-medium hidden sm:inline">
                  {copiedLink ? (isEs ? 'Copiado' : 'Copied') : (isEs ? 'Invitar' : 'Share')}
                </span>
              </button>

              <button
                onClick={() => onOpenQrModal(group.group_reference, name)}
                className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-md transition-colors flex items-center gap-1 text-xs"
                title="Ver QR Único"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span className="text-[10px] font-medium">QR</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center border-b border-stone-200 bg-[#FAF9F6] px-4 shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isEs ? 'Información' : 'Details'}</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'members'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>
              {isEs ? 'Miembros' : 'Members'} ({members.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('broadcasts')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'broadcasts'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>
              {isEs ? 'Avisos & Comunicados' : 'Broadcasts'} ({broadcasts.length})
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-teal-700 font-bold uppercase tracking-wider flex-wrap">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {group.location_code === 'PDC'
                      ? 'Playa del Carmen'
                      : group.location_code === 'TUL'
                      ? 'Tulum'
                      : group.location_code === 'AKU'
                      ? 'Akumal'
                      : group.location_code === 'COZ'
                      ? 'Cozumel'
                      : group.location_code === 'CUN'
                      ? 'Cancún'
                      : group.location_code === 'PM'
                      ? 'Puerto Morelos'
                      : group.location_code === 'PVA'
                      ? 'Puerto Aventuras'
                      : group.location_code}
                  </span>
                  <span>•</span>
                  <span>{group.visibility === 'public' ? (isEs ? 'Público' : 'Public') : (isEs ? 'Moderado' : 'Moderated')}</span>
                  {group.category && (
                    <>
                      <span>•</span>
                      <span className="text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-teal-200/50">
                        {group.category}
                      </span>
                    </>
                  )}
                </div>
                <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
                  {name}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {description}
              </p>

              {/* Group Metadata Badges */}
              {(group.meeting_frequency || group.join_policy) && (
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {group.meeting_frequency && (
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70 text-xs">
                      <span className="text-[10px] text-stone-400 block font-semibold uppercase">
                        {isEs ? 'Encuentros' : 'Frequency'}
                      </span>
                      <span className="font-bold text-stone-800 text-xs flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-teal-700" />
                        {group.meeting_frequency}
                      </span>
                    </div>
                  )}

                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70 text-xs">
                    <span className="text-[10px] text-stone-400 block font-semibold uppercase">
                      {isEs ? 'Ingreso' : 'Join Policy'}
                    </span>
                    <span className="font-bold text-stone-800 text-xs flex items-center gap-1.5 mt-0.5">
                      <Shield className="w-3.5 h-3.5 text-teal-700" />
                      {group.join_policy === 'approval'
                        ? (isEs ? 'Previa Aprobación' : 'Approval Required')
                        : (isEs ? 'Libre e Inmediato' : 'Open / Instant')}
                    </span>
                  </div>
                </div>
              )}

              {/* Objectives Section */}
              {(group.objectives_es || group.objectives_en || group.objectives) && (
                <div className="p-3.5 bg-teal-50/70 rounded-2xl border border-teal-200/60 text-xs text-teal-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-teal-900">
                    <Target className="w-3.5 h-3.5 text-teal-700" />
                    <span>{isEs ? 'Objetivo Central del Colectivo' : 'Group Objectives'}</span>
                  </div>
                  <p className="text-[11px] text-teal-900/80 leading-normal">
                    {isEs
                      ? (group.objectives_es || group.objectives)
                      : (group.objectives_en || group.objectives)}
                  </p>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {group.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="py-1 px-2.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Guidelines hint */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <Shield className="w-3.5 h-3.5 text-teal-700" />
                  <span>{isEs ? 'Reglas y Convivencia' : 'Community Guidelines'}</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-normal">
                  {isEs
                    ? (group.guidelines_es || group.guidelines || 'Espacio libre de spam comercial. Intercambio colaborativo y respetuoso para habitantes y visitantes de la Riviera Maya.')
                    : (group.guidelines_en || group.guidelines || 'Spam-free collaborative space. Respectful community exchange for Riviera Maya locals and visitors.')}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: MEMBERS */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                    {isEs ? 'Directorio de Miembros Activos' : 'Active Members Directory'}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {isEs
                      ? `${members.length} miembros inscritos en este colectivo`
                      : `${members.length} members enrolled in this group`}
                  </p>
                </div>

                <button
                  onClick={handleCopyInvite}
                  className="py-1.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-xl border border-teal-200/60 flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? (isEs ? '¡Copiado!' : 'Copied!') : (isEs ? 'Invitar' : 'Invite')}</span>
                </button>
              </div>

              <div className="bg-stone-50/70 border border-stone-200 rounded-2xl divide-y divide-stone-200/60 overflow-hidden">
                {members.map((m, idx) => (
                  <div key={m.id} className="p-3.5 flex items-center justify-between gap-3 bg-white hover:bg-stone-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                        {m.display_name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                          <span>{m.display_name}</span>
                          {idx === 0 && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded">
                              {isEs ? 'Coordinador' : 'Coordinator'}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-stone-400">
                          {m.public_reference} • {isEs ? 'Miembro activo' : 'Active member'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {m.has_push_opt_in ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Radio className="w-3 h-3" />
                          <span>{isEs ? 'Alertas ON' : 'Alerts ON'}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                          {isEs ? 'Silencioso' : 'Quiet'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BROADCASTS */}
          {activeTab === 'broadcasts' && (
            <div className="space-y-4">
              {/* Controlled Beta Notice */}
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-stone-800 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{isEs ? 'Avisos Comunitarios Oficiales' : 'Official Community Broadcasts'}</span>
                  <span className="ml-auto text-[9px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                    {isEs ? 'Beta Controlada' : 'Controlled Beta'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {isEs
                    ? 'Los comunicados son emitidos por los coordinadores para convocar a encuentros o avisos clave. La entrega en vivo a dispositivos móviles requiere integración con servidor seguro.'
                    : 'Broadcasts are published by coordinators to announce meetups or key alerts. Live push dispatch to mobile devices requires secure server integration.'}
                </p>
              </div>

              {bcSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {isEs
                      ? '¡Aviso emitido y notificado a los miembros del colectivo!'
                      : 'Announcement published and broadcasted to group members!'}
                  </span>
                </div>
              )}

              {/* Compose Action for Coordinator / Joined Members */}
              <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-teal-800 text-white flex items-center justify-center">
                      <Send className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold text-stone-900">
                      {isEs ? 'Emitir Comunicado al Colectivo' : 'Broadcast Announcement to Group'}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsComposing(!isComposing)}
                    className="py-1 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    {isComposing ? (isEs ? 'Cerrar' : 'Close') : (isEs ? '+ Redactar' : '+ Compose')}
                  </button>
                </div>

                {isComposing && (
                  <form onSubmit={handleCreateBroadcast} className="space-y-3 pt-2 border-t border-stone-100">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-800 block">
                        {isEs ? 'Título del Aviso *' : 'Announcement Title *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={bcTitle}
                        onChange={(e) => setBcTitle(e.target.value)}
                        placeholder={isEs ? 'Ej. ¡Punto de encuentro actualizado para el domingo!' : 'e.g. Updated meeting point for Sunday!'}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-800 block">
                        {isEs ? 'Mensaje para los miembros *' : 'Message Body *'}
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={bcMessage}
                        onChange={(e) => setBcMessage(e.target.value)}
                        placeholder={isEs ? 'Detalles del aviso o cambio de locación...' : 'Details of the announcement...'}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700/20"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsComposing(false)}
                        className="py-1.5 px-3 text-xs font-semibold text-stone-500 hover:text-stone-700"
                      >
                        {isEs ? 'Cancelar' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isEs ? 'Publicar Aviso' : 'Publish Announcement'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Broadcasts History list */}
              <div className="space-y-2.5">
                {broadcasts.length === 0 ? (
                  <div className="p-6 bg-stone-50 border border-stone-200 rounded-2xl text-center text-stone-500 text-xs">
                    {isEs ? 'Aún no hay avisos publicados en este colectivo.' : 'No announcements published yet.'}
                  </div>
                ) : (
                  broadcasts.map((bc) => (
                    <div key={bc.id} className="p-4 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">{bc.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded">
                            {bc.campaign_reference}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                          {isEs ? 'Entregado' : 'Delivered'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">{bc.message}</p>
                      <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-100 flex items-center justify-between">
                        <span>{new Date(bc.created_at).toLocaleDateString()}</span>
                        <span>{bc.recipient_count} {isEs ? 'miembros alcanzados' : 'members reached'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-100 flex flex-col sm:flex-row gap-2.5 shrink-0">
          <button
            onClick={() => onToggleJoin(group.id)}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
              isJoined
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-teal-700 hover:bg-teal-800 text-white'
            }`}
          >
            {isJoined ? (
              <>
                <Check className="w-4 h-4" />
                <span>{isEs ? 'Ya eres miembro (Desunirse)' : 'Member (Leave)'}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{isEs ? 'Unirme a este Grupo' : 'Join Group'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenMinisite(group);
            }}
            className="flex-1 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <span>{isEs ? 'Abrir Minisitio Oficial' : 'Open Official Mini-site'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
