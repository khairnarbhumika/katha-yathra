import React, { useEffect, useState } from 'react';
import { GameCard } from '../components/GameCard';
import { api } from '../lib/api';
import { Gamepad2, Trophy, Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const GAMES_DATA = [
  {
    id: 'timeline-runner',
    title: 'Timeline Runner & Civilization Quiz',
    category: 'Quiz & Runner',
    description: 'Sprint through sacred epochs, answer civilizational trivia, and rescue ancient relics before time expires!',
    icon: '⚡',
    badge: '+50 XP / Level',
    themeColor: 'from-amber-500 to-orange-600',
    totalLevels: 4
  },
  {
    id: 'glyph-decoder',
    title: 'Heritage Word Match & Glyph Decoder',
    category: 'Linguistic Decryption',
    description: 'Decipher Egyptian hieroglyphs, Vedic Sanskrit concepts, and Islamic astrolabe mechanisms by matching clues.',
    icon: '𓂀',
    badge: '+50 XP / Level',
    themeColor: 'from-purple-500 to-violet-700',
    totalLevels: 3
  },
  {
    id: 'relic-builder',
    title: 'Archaeological Monument Builder',
    category: 'Architectural Puzzle',
    description: 'Reconstruct the Sun Temple of Konark and Great Pyramid of Giza layer by layer from foundation plinth to golden apex!',
    icon: '🏛️',
    badge: '+50 XP / Level',
    themeColor: 'from-emerald-500 to-teal-700',
    totalLevels: 2
  }
];

export const GamesPortal: React.FC = () => {
  const { user, stats } = useAuth();
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await api.getGameProgress();
        const map: Record<string, number> = {};
        res.progress.forEach((p) => {
          map[p.game_id] = p.levels_completed;
        });
        setProgressMap(map);
      } catch {
        // Fallback to local
      }
    }
    loadProgress();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/20 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Interactive Mini-Games Suite</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
            Play Quests, Earn XP & Unlock Stories
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Test your wits against history! Every level you clear awards +50 Katha XP points. Every 2nd completed level automatically unlocks a suspenseful AI-generated cliffhanger chapter!
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-amber-300 flex items-center space-x-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Total Levels Cleared: {stats.totalLevelsCompleted}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-purple-300 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Stories Unlocked: {stats.unlockedStoriesCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini-Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {GAMES_DATA.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            levelsCompleted={progressMap[game.id] || 0}
          />
        ))}
      </div>
    </div>
  );
};
