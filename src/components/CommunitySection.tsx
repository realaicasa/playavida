import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Check,
  Shield,
  Tag,
  ChevronRight,
  QrCode,
  Sparkles,
  MapPin,
  Plus,
} from 'lucide-react';
import { motion } from 'motion/react';
import { CommunityGroup, Language, LocationCode, User } from '../types';
import { playaVidaStore } from '../lib/storage';
import { translations } from '../lib/i18n';
import { GroupModal } from './GroupModal';

interface CommunitySectionProps {
  currentLocation: LocationCode | 'ALL';
  language: Language;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenGroupMinisite: (group: CommunityGroup) => void;
  onOpenQrModal: (reference: string, title: string) => void;
  onOpenCreateGroup?: () => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  currentLocation,
  language,
  currentUser,
  onOpenAuth,
  onOpenGroupMinisite,
  onOpenQrModal,
  onOpenCreateGroup,
}) => {
  const t = translations[language];
  const isEs = language === 'es';
  const groups = playaVidaStore.getGroups(currentLocation);

  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(null);

  const handleToggleJoin = (groupId: string) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    playaVidaStore.toggleGroupMembership(currentUser.id, groupId);
    // Force re-render
    setSelectedGroup((prev) => (prev && prev.id === groupId ? { ...prev } : prev));
  };

  return (
    <div className="space-y-8">
      {/* Title & Creation Action */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-700" />
            <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-stone-900">
              {t.groups_headline}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {isEs
              ? 'Conoce los colectivos locales, abre su minisitio oficial, o funda un nuevo grupo comunitario.'
              : 'Explore local collectives, open their dedicated mini-site, or start a new community group.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {onOpenCreateGroup && (
            <button
              type="button"
              onClick={onOpenCreateGroup}
              className="py-2.5 px-4 bg-teal-800 hover:bg-teal-900 text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{isEs ? '+ Iniciar Colectivo' : '+ Start Group'}</span>
            </button>
          )}

          <span className="text-xs font-bold text-stone-500 bg-stone-100 py-2 px-3.5 rounded-2xl">
            {groups.length} {isEs ? 'grupos' : 'groups'}
          </span>
        </div>
      </motion.div>

      {/* Groups List / Mini-Info Area with 3D Depth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((grp) => {
          const isJoined = currentUser
            ? playaVidaStore.isMemberOfGroup(currentUser.id, grp.id)
            : false;
          const name = isEs ? grp.name_es : grp.name_en;
          const desc = isEs ? grp.description_es : grp.description_en;

          return (
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              key={grp.id}
              onClick={() => setSelectedGroup(grp)}
              className="group bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Cover Image Banner */}
                <div className="relative h-44 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={grp.cover_url}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />

                  {/* Group Reference Pill */}
                  <div className="absolute top-3.5 left-3.5 bg-stone-900/80 backdrop-blur-md py-1 px-3 rounded-full border border-white/20 text-[11px] font-mono font-bold text-white shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{grp.group_reference}</span>
                  </div>

                  {/* QR shortcut button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQrModal(grp.group_reference, name);
                    }}
                    className="absolute top-3.5 right-3.5 p-2 bg-white/90 hover:bg-white text-stone-800 hover:text-teal-700 rounded-full backdrop-blur-md border border-stone-200 shadow-md transition-all hover:scale-105"
                    title="Código QR del Grupo"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="py-1 px-3 bg-stone-900/85 text-white text-[11px] font-semibold rounded-full backdrop-blur-md border border-white/20">
                      {grp.member_count + (isJoined ? 1 : 0)} {t.members}
                    </span>

                    <span className="text-[11px] font-medium text-teal-300 bg-teal-950/80 backdrop-blur-md py-0.5 px-2.5 rounded-full border border-teal-500/30">
                      {grp.visibility === 'public'
                        ? isEs
                          ? 'Comunidad abierta'
                          : 'Public'
                        : isEs
                        ? 'Moderada'
                        : 'Moderated'}
                    </span>
                  </div>
                </div>

                {/* Mini-info details */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-stone-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-teal-700" />
                    <span>
                      {grp.location_code === 'PDC'
                        ? 'Playa del Carmen'
                        : grp.location_code === 'TUL'
                        ? 'Tulum'
                        : grp.location_code === 'CUN'
                        ? 'Cancún'
                        : 'Puerto Morelos'}
                    </span>
                  </div>

                  <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900 leading-snug group-hover:text-teal-800 transition-colors">
                    {name}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                    {desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {grp.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="py-0.5 px-2.5 bg-stone-100 text-stone-600 rounded-lg text-[11px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Action Bar */}
              <div className="p-4 sm:px-6 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 group-hover:text-teal-800 flex items-center gap-1">
                  <span>{isEs ? 'Ver Detalles y Minisitio' : 'View Details & Minisite'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleJoin(grp.id);
                  }}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                    isJoined
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isEs ? 'Miembro' : 'Joined'}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{t.join_group}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Community Protection Note */}
      <div className="p-4 sm:p-5 bg-white rounded-3xl border border-stone-200/90 text-xs text-stone-600 flex items-start gap-3 shadow-2xs">
        <Shield className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-stone-900">{isEs ? 'Seguridad comunitaria:' : 'Community Trust:'}</strong>{' '}
          {isEs
            ? 'Todos los colectivos en PlayaVida operan bajo normas de convivencia libre de spam. Puedes interactuar en el muro comunitario y unirte a sus encuentros presenciales.'
            : 'All PlayaVida collectives follow strict community guidelines. Interact on the discussion board and join real-life meetups.'}
        </p>
      </div>

      {/* Group Modal */}
      <GroupModal
        group={selectedGroup}
        isOpen={Boolean(selectedGroup)}
        onClose={() => setSelectedGroup(null)}
        language={language}
        currentUser={currentUser}
        isJoined={
          selectedGroup && currentUser
            ? playaVidaStore.isMemberOfGroup(currentUser.id, selectedGroup.id)
            : false
        }
        onToggleJoin={handleToggleJoin}
        onOpenMinisite={(grp) => {
          setSelectedGroup(null);
          onOpenGroupMinisite(grp);
        }}
        onOpenQrModal={onOpenQrModal}
      />
    </div>
  );
};
