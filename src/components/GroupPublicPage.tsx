import React, { useState } from 'react';
import {
  ArrowLeft,
  Users,
  UserPlus,
  Check,
  QrCode,
  Share2,
  AlertTriangle,
  MessageSquare,
  Shield,
  Calendar,
  Send,
  MapPin,
  Sparkles,
  Heart,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { CommunityGroup, Language, User, CommunityEvent, PublicBusinessProjection } from '../types';
import { playaVidaStore } from '../lib/storage';
import { translations } from '../lib/i18n';

interface GroupPublicPageProps {
  group: CommunityGroup;
  language: Language;
  onBack: () => void;
  onOpenQrModal: () => void;
  onOpenReportModal: (entityType: 'group' | 'business' | 'review', ref: string, name: string) => void;
  onOpenAuth: () => void;
  currentUser: User | null;
  onSelectEvent: (event: CommunityEvent) => void;
}

interface GroupPost {
  id: string;
  authorName: string;
  timeAgo: string;
  content: string;
  likes: number;
}

export const GroupPublicPage: React.FC<GroupPublicPageProps> = ({
  group,
  language,
  onBack,
  onOpenQrModal,
  onOpenReportModal,
  onOpenAuth,
  currentUser,
  onSelectEvent,
}) => {
  const t = translations[language];
  const isEs = language === 'es';
  const name = isEs ? group.name_es : group.name_en;
  const description = isEs ? group.description_es : group.description_en;
  const groupUrl = `${window.location.origin}/?ref=${group.group_reference}`;

  const [copied, setCopied] = useState(false);
  const [isJoined, setIsJoined] = useState<boolean>(() => {
    return currentUser ? playaVidaStore.isMemberOfGroup(currentUser.id, group.id) : false;
  });
  const [isOptedIn, setIsOptedIn] = useState<boolean>(() => {
    return currentUser ? playaVidaStore.isOptedInForPush(currentUser.id, group.group_reference) : false;
  });

  const handleTogglePushOptIn = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (isOptedIn) {
      playaVidaStore.removePushOptIn(currentUser.id, group.group_reference);
      setIsOptedIn(false);
    } else {
      playaVidaStore.recordPushOptIn(currentUser.id, {
        target_reference: group.group_reference,
        target_name: isEs ? group.name_es : group.name_en,
        target_type: 'group',
        opted_in_at: new Date().toISOString(),
        receive_incentives: true,
      });
      setIsOptedIn(true);
    }
  };

  const [posts, setPosts] = useState<GroupPost[]>([
    {
      id: 'p1',
      authorName: 'Camila Rivera',
      timeAgo: isEs ? 'hace 2 horas' : '2 hours ago',
      content: isEs
        ? '¡Bienvenidos a los nuevos integrantes! Recuerden que este fin de semana tenemos reunión presencial para coordinar actividades.'
        : 'Welcome to all new members! Reminder: in-person meetup this weekend to coordinate initiatives.',
      likes: 14,
    },
    {
      id: 'p2',
      authorName: 'David K.',
      timeAgo: isEs ? 'ayer' : 'yesterday',
      content: isEs
        ? '¿Alguien tiene recomendación de espacios silenciosos para llamadas de clientes cerca de la Calle 38?'
        : 'Any recommendations for quiet client call spaces near Calle 38?',
      likes: 6,
    },
  ]);

  const [newPostText, setNewPostText] = useState('');

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${name} | PlayaVida`,
          text: description,
          url: groupUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(groupUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleJoin = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    const nextJoined = playaVidaStore.toggleGroupMembership(currentUser.id, group.id);
    setIsJoined(nextJoined);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!newPostText.trim()) return;

    const newPost: GroupPost = {
      id: `post_${Date.now()}`,
      authorName: currentUser.email.split('@')[0],
      timeAgo: isEs ? 'hace un momento' : 'just now',
      content: newPostText.trim(),
      likes: 1,
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  // Check if any events are organized by this group
  const groupEvents = playaVidaStore
    .getEvents()
    .filter(
      (ev) =>
        ev.organizer_group_id === group.id ||
        ev.organizer_name.toLowerCase() === group.name_es.toLowerCase() ||
        ev.organizer_name.toLowerCase() === group.name_en.toLowerCase()
    );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Top sticky navigation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-16 z-20 px-4 py-2.5"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-stone-500" />
            <span>{isEs ? 'Volver a Comunidad' : 'Back to Community'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? (isEs ? 'Enlace Copiado' : 'Link Copied') : (isEs ? 'Compartir' : 'Share')}</span>
            </button>

            <button
              onClick={onOpenQrModal}
              className="flex items-center gap-1.5 py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors"
              title="Código QR del Grupo"
            >
              <QrCode className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">QR</span>
            </button>

            <button
              onClick={() => onOpenReportModal('group', group.group_reference, name)}
              className="flex items-center gap-1 py-1.5 px-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs transition-colors"
              title={t.report_issue}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* 3D Cover Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 bg-stone-900 aspect-16/9 sm:aspect-21/9 max-h-[380px]"
        >
          <img
            src={group.cover_url}
            alt={name}
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/40 to-transparent" />

          {/* Floating Reference & Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="bg-stone-900/85 backdrop-blur-md text-white text-[11px] font-mono font-bold py-1 px-3 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{group.group_reference}</span>
            </span>

            <span className="bg-teal-700/90 text-white text-[11px] font-bold py-1 px-3 rounded-full shadow-lg backdrop-blur-md border border-teal-500/30">
              {group.visibility === 'public' ? (isEs ? 'Comunidad Abierta' : 'Open Community') : (isEs ? 'Comunidad Moderada' : 'Moderated')}
            </span>

            <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-medium py-1 px-3 rounded-full border border-white/20">
              {group.member_count + (isJoined ? 1 : 0)} {t.members}
            </span>
          </div>

          {/* Floating live QR miniature */}
          <div className="absolute top-4 right-4 hidden md:block">
            <button
              onClick={onOpenQrModal}
              className="group p-2 bg-white/90 hover:bg-white rounded-2xl shadow-xl border border-stone-200 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
            >
              <QRCodeSVG value={groupUrl} size={42} level="M" />
              <div className="text-left pr-1">
                <span className="text-[10px] font-bold text-stone-800 block leading-tight">
                  QR Grupo
                </span>
                <span className="text-[9px] text-teal-700 font-medium">Oficial</span>
              </div>
            </button>
          </div>

          {/* Banner bottom heading */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold tracking-wide uppercase">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {group.location_code === 'PDC'
                  ? 'Playa del Carmen, Quintana Roo'
                  : group.location_code === 'TUL'
                  ? 'Tulum, Quintana Roo'
                  : group.location_code === 'CUN'
                  ? 'Cancún, Quintana Roo'
                  : 'Puerto Morelos, Quintana Roo'}
              </span>
            </div>
            <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-md">
              {name}
            </h1>
          </div>
        </motion.div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: About & Discussion Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Group */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-4"
            >
              <h2 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
                {isEs ? 'Acerca de este colectivo' : 'About this collective'}
              </h2>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed whitespace-pre-line">
                {description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {group.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="py-1 px-3 bg-stone-100 text-stone-700 rounded-xl text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Community Guidelines */}
              <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-2 mt-4">
                <h4 className="font-bold text-teal-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  <span>{isEs ? 'Reglas de Convivencia' : 'Community Rules'}</span>
                </h4>
                <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                  <li>{isEs ? 'Respeto recíproco y colaboración constructiva.' : 'Mutual respect and constructive collaboration.'}</li>
                  <li>{isEs ? 'Prohibido el spam comercial o publicidad no solicitada.' : 'No unsolicited spam or marketing.'}</li>
                  <li>{isEs ? 'Iniciativas y encuentros alineados a la Riviera Maya.' : 'Initiatives focused on the local Riviera Maya ecosystem.'}</li>
                </ul>
              </div>
            </motion.div>

            {/* Organized Events by this Group */}
            {groupEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4"
              >
                <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-700" />
                  <span>{isEs ? 'Eventos Organizados por el Grupo' : 'Events Hosted by this Group'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {groupEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => onSelectEvent(ev)}
                      className="group p-3 rounded-2xl border border-stone-200/80 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer flex gap-3 items-center bg-stone-50/40"
                    >
                      <img
                        src={ev.image_url}
                        alt={ev.title_es}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-teal-700 block">
                          {new Date(ev.start_at).toLocaleDateString(isEs ? 'es-MX' : 'en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <h4 className="font-bold text-xs text-stone-900 truncate">
                          {isEs ? ev.title_es : ev.title_en}
                        </h4>
                        <span className="text-[11px] text-stone-500 truncate block">
                          {ev.event_location_label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 shrink-0" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Community Board / Discussion Feed */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-teal-700" />
                  <span>{isEs ? 'Muro Comunitario' : 'Community Discussion'}</span>
                </h3>
                <span className="text-xs text-stone-500 font-medium">
                  {posts.length} {isEs ? 'publicaciones' : 'posts'}
                </span>
              </div>

              {/* Create Post Form */}
              <form onSubmit={handleCreatePost} className="space-y-3">
                <textarea
                  rows={2}
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder={
                    isJoined
                      ? isEs
                        ? 'Comparte una idea, duda o actualización con el grupo...'
                        : 'Share an update or question with the group...'
                      : isEs
                      ? 'Únete al grupo para publicar en el muro comunitario...'
                      : 'Join the group to post in the community board...'
                  }
                  disabled={!isJoined}
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 disabled:opacity-60 resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    {!isJoined
                      ? isEs
                        ? 'Debes ser miembro para escribir'
                        : 'Must be member to post'
                      : isEs
                      ? 'Visible para todos los miembros'
                      : 'Visible to members'}
                  </span>
                  <button
                    type="submit"
                    disabled={!isJoined || !newPostText.trim()}
                    className="py-2 px-4 bg-teal-700 hover:bg-teal-800 disabled:bg-stone-200 text-white disabled:text-stone-400 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isEs ? 'Publicar' : 'Post'}</span>
                  </button>
                </div>
              </form>

              {/* Posts Feed */}
              <div className="space-y-3 pt-3 border-t border-stone-100">
                {posts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                          {p.authorName[0]?.toUpperCase()}
                        </div>
                        <span className="font-bold text-xs text-stone-900">{p.authorName}</span>
                      </div>
                      <span className="text-[11px] text-stone-400">{p.timeAgo}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {p.content}
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500">
                      <button className="flex items-center gap-1 hover:text-rose-600 transition-colors">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{p.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Member status & Unique QR Card */}
          <div className="space-y-6">
            {/* Join & Status Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl p-6 border-2 border-stone-200/90 shadow-lg space-y-5 sticky top-24"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {isEs ? 'Estado de Membresía' : 'Membership Status'}
                </span>
                <span
                  className={`text-xs font-bold py-1 px-2.5 rounded-full ${
                    isJoined
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {isJoined ? (isEs ? 'Miembro Activo' : 'Active Member') : (isEs ? 'No Inscrito' : 'Not Joined')}
                </span>
              </div>

              {/* Join / Leave Action Button */}
              <button
                onClick={handleToggleJoin}
                className={`w-full py-3.5 px-4 font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all ${
                  isJoined
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                    : 'bg-teal-700 hover:bg-teal-800 text-white'
                }`}
              >
                {isJoined ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isEs ? '✓ Eres Miembro (Desunirse)' : '✓ You are a Member (Leave)'}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>{isEs ? 'Unirme a este Grupo' : 'Join this Group'}</span>
                  </>
                )}
              </button>

              {/* Push Notification & Group Incentive Opt-In Checkbox */}
              <button
                type="button"
                onClick={handleTogglePushOptIn}
                className={`w-full p-3 rounded-xl text-left text-xs transition-all flex items-start gap-2.5 border cursor-pointer ${
                  isOptedIn
                    ? 'bg-amber-50/90 text-amber-950 border-amber-300 shadow-2xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                <span
                  className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                    isOptedIn
                      ? 'bg-amber-500 border-amber-600 text-white'
                      : 'border-stone-400 bg-white'
                  }`}
                >
                  {isOptedIn && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
                <div className="leading-snug">
                  <span className="font-bold block text-stone-900">
                    {isOptedIn
                      ? (isEs ? 'Recibiendo avisos & convocatorias del grupo' : 'Receiving group notices & meetups')
                      : (isEs ? 'Recibir avisos & convocatorias del grupo' : 'Receive group notices & meetups')}
                  </span>
                  <span className="text-[11px] text-stone-500 font-normal block mt-0.5">
                    {isEs
                      ? 'Acepto recibir notificaciones push para reuniones, dinámicas e incentivos de este colectivo.'
                      : 'I agree to receive push notifications for meetups, activities, and member incentives.'}
                  </span>
                </div>
              </button>

              {/* Interactive Unique Group QR Code Section */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/90 text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-stone-800">
                  <QrCode className="w-4 h-4 text-teal-700" />
                  <span>{isEs ? 'Código QR Único del Grupo' : 'Group Unique QR'}</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-stone-200 inline-block shadow-xs">
                  <QRCodeSVG value={groupUrl} size={150} level="M" includeMargin />
                  <span className="text-[10px] font-mono text-teal-800 font-semibold block mt-1">
                    {group.group_reference}
                  </span>
                </div>

                <p className="text-[11px] text-stone-500 leading-tight">
                  {isEs
                    ? 'Comparte este QR para que otros miembros se unan directamente a este minisitio.'
                    : 'Share this QR code so new members can open this group mini-site directly.'}
                </p>

                <button
                  onClick={onOpenQrModal}
                  className="w-full py-2 px-3 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 transition-colors shadow-2xs"
                >
                  {isEs ? 'Ampliar / Descargar QR' : 'Enlarge / Download QR'}
                </button>
              </div>

              {/* Safety notice */}
              <div className="flex items-center gap-2 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>PlayaVida Community Trust & Verification</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
