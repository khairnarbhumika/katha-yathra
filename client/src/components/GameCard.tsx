import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Trophy, Sparkles, Play, CheckCircle2 } from 'lucide-react';

interface GameCardProps {
  game: {
    id: string;
    title: string;
    category: string;
    description: string;
    icon: string;
    badge: string;
    themeColor: string;
    totalLevels: number;
  };
  levelsCompleted: number;
}

export const GameCard: React.FC<GameCardProps> = ({ game, levelsCompleted }) => {
  const progressPercent = Math.min(100, Math.round((levelsCompleted / game.totalLevels) * 100));

  return (
    <div className="relative rounded-2xl glass-card border border-slate-800 p-6 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 group">
      <div>
        {/* Top Header & Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              {game.icon}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {game.category}
              </span>
              <h3 className="font-serif font-bold text-lg text-white mt-1 group-hover:text-amber-300 transition-colors">
                {game.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-xs font-bold text-amber-400 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>+50 XP</span>
          </div>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
          {game.description}
        </p>

        {/* Level Progression Indicator */}
        <div className="mb-6 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Quest Level:</span>
            <span className="text-amber-300 font-bold">
              Level {levelsCompleted + 1} <span className="text-slate-500 font-normal">/ {game.totalLevels}</span>
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(8, progressPercent)}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
            <span>{levelsCompleted} cleared</span>
            {levelsCompleted % 2 === 1 ? (
              <span className="text-amber-400 font-semibold animate-pulse">⭐ Next level unlocks a Story Chapter!</span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Chapter Unlocked
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Play Button */}
      <Link
        to={`/games/${game.id}/play`}
        className="w-full py-3 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2 transition transform active:scale-98"
      >
        <Play className="w-4 h-4 fill-slate-950" />
        <span>Play Level {levelsCompleted + 1}</span>
      </Link>
    </div>
  );
};
