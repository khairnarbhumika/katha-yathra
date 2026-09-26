import React, { useState } from 'react';
import { Play, Lock, Sparkles, Coins, CheckCircle2, Clock, X, ExternalLink } from 'lucide-react';
import { StoreItem } from '@shared/schema';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { sounds } from './AudioEffects';
import confetti from 'canvas-confetti';

interface StoreGridProps {
  items: (StoreItem & { isUnlocked?: boolean })[];
  onItemUnlocked: (updatedItem: StoreItem) => void;
}

export const StoreGrid: React.FC<StoreGridProps> = ({ items, onItemUnlocked }) => {
  const { user, refreshUser } = useAuth();
  const [activeVideo, setActiveVideo] = useState<StoreItem | null>(null);
  const [loadingItemId, setLoadingItemId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUnlock = async (item: StoreItem) => {
    if (!user) return;
    if (user.points < item.cost_points) {
      setErrorMessage(`You need ${item.cost_points} XP to unlock this video. You currently have ${user.points} XP. Complete mini-game levels to earn more points!`);
      sounds.playIncorrect();
      return;
    }

    try {
      setLoadingItemId(item.id);
      setErrorMessage(null);
      const res = await api.unlockStoreItem({ itemId: item.id });

      sounds.playUnlock();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore
      }

      onItemUnlocked(res.item);
      await refreshUser();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to unlock module');
      sounds.playIncorrect();
    } finally {
      setLoadingItemId(null);
    }
  };

  return (
    <div>
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const isUnlocked = item.isUnlocked;
          const canAfford = (user?.points || 0) >= item.cost_points;

          return (
            <div
              key={item.id}
              className={`rounded-2xl glass-card overflow-hidden flex flex-col justify-between border transition-all duration-300 ${
                isUnlocked
                  ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                    {item.category}
                  </div>

                  {/* Duration Pill */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-[11px] font-medium text-slate-300 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.duration_minutes}m</span>
                  </div>

                  {/* Play / Lock overlay button */}
                  {isUnlocked ? (
                    <button
                      onClick={() => setActiveVideo(item)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/10 transition group"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/40 transform group-hover:scale-110 transition">
                        <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                      </div>
                    </button>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="w-12 h-12 rounded-full bg-slate-900/80 border border-slate-700 text-amber-400 flex items-center justify-center">
                        <Lock className="w-5 h-5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-serif font-bold text-base text-white mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Scientific Highlights List */}
                  {item.highlights && item.highlights.length > 0 && (
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1.5">
                        🔬 What You'll Learn:
                      </span>
                      <ul className="space-y-1">
                        {item.highlights.slice(0, 2).map((h, i) => (
                          <li key={i} className="text-[11px] text-slate-300 flex items-start space-x-1.5">
                            <span className="text-cyan-400 mt-0.5">•</span>
                            <span className="line-clamp-1">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-5 pt-0">
                {isUnlocked ? (
                  <button
                    onClick={() => setActiveVideo(item)}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 flex items-center justify-center space-x-2 transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Watch Unlocked Video</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnlock(item)}
                    disabled={loadingItemId === item.id}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition ${
                      canAfford
                        ? 'text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-md shadow-orange-500/20 active:scale-98'
                        : 'text-slate-400 bg-slate-800 border border-slate-700 cursor-not-allowed opacity-80'
                    }`}
                  >
                    <Coins className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                    <span>
                      {loadingItemId === item.id
                        ? 'Unlocking...'
                        : `Unlock for ${item.cost_points} XP`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-xs">
                  {activeVideo.category}
                </span>
                <h3 className="font-serif font-bold text-base text-white truncate max-w-lg">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded Responsive Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`${activeVideo.video_url}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              ></iframe>
            </div>

            {/* Video description & key points */}
            <div className="p-6">
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                {activeVideo.description}
              </p>
              {activeVideo.highlights && activeVideo.highlights.length > 0 && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-semibold text-xs text-amber-300 uppercase tracking-wider mb-2">
                    Key Scientific Insights:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {activeVideo.highlights.map((h, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
