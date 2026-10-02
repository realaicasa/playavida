import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { playaVidaStore } from '../lib/storage';
import { User } from '../types';

interface FavoriteButtonProps {
  targetType: 'business' | 'event' | 'group';
  targetId: string;
  currentUser: User | null;
  onOpenAuth: () => void;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ targetType, targetId, currentUser, onOpenAuth, className = '' }) => {
  const [isFav, setIsFav] = useState(() => playaVidaStore.isFavorite(targetType, targetId));

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    playaVidaStore.toggleFavorite(targetType, targetId);
    setIsFav(!isFav);
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full transition-colors ${isFav ? 'bg-rose-50' : 'bg-stone-100 hover:bg-stone-200'} ${className}`}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
    </button>
  );
};
