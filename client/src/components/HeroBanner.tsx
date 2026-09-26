import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gamepad2, Compass, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HeroBanner: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/40 border border-amber-500/20 shadow-2xl p-6 sm:p-10 lg:p-12 mb-10">
      {/* Decorative background glow spheres */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl">
        {/* Child Safety Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Kid-Safe • Non-Sectarian • Educational Lore</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
          Unlock the World's Epics, <br />
          <span className="gold-gradient-text">Play Games & Master Science!</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
          Embark on an interactive adventure through ancient civilizations, solve civilizational puzzles, unlock suspenseful cliffhanger story chapters every 2 game levels, and redeem your reward XP for premium Space & STEM science modules!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to={user ? "/games" : "/auth/register"}
            className="px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-amber-500/25 flex items-center space-x-2 transform active:scale-95 transition"
          >
            <Gamepad2 className="w-5 h-5 text-slate-950" />
            <span>Play Mini-Games & Earn XP</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            to="/explore"
            className="px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-amber-500/40 flex items-center space-x-2 transition"
          >
            <Compass className="w-5 h-5 text-amber-400" />
            <span>Explore Civilizations</span>
          </Link>
        </div>

        {/* Milestone Hook Callout */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="text-amber-300 font-medium">Core Milestone:</span>
            <span>Every 2 completed levels unlock an AI twist-ending story chapter!</span>
          </div>
          {user && (
            <div className="flex items-center space-x-1.5 text-orange-400 font-semibold ml-auto">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Daily Streak Bonus Active (+20 XP/day)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
