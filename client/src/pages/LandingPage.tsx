import React from 'react';
import { Link } from 'react-router-dom';
import { HeroBanner } from '../components/HeroBanner';
import { CivilizationCard } from '../components/CivilizationCard';
import { CULTURAL_DOMAINS } from '@shared/schema';
import { Sparkles, Gamepad2, BookOpen, Rocket, ShieldCheck, Flame, Trophy, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <HeroBanner />

      {/* Gamification Core Loop Feature Breakdown */}
      <section className="mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs uppercase tracking-wider">
            How Katha Yatra Works
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-3 mb-4">
            The Ultimate 4-Step Adventure Loop
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Shift screen time into productive, thrilling historical discovery combined with modern space exploration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="rounded-2xl glass-card border border-slate-800 p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl mb-4">
                🧭
              </div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Step 1</span>
              <h3 className="font-serif font-bold text-lg text-white mt-1 mb-2">Choose Heritage</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Select your preferred cultural track from Vedic epics, Egyptian mysteries, Greco-Roman lore, or Silk Road history.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-amber-300/80 font-medium">
              6 Diverse World Civilizations
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl glass-card border border-slate-800 p-6 flex flex-col justify-between hover:border-orange-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-2xl mb-4">
                🎮
              </div>
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">Step 2</span>
              <h3 className="font-serif font-bold text-lg text-white mt-1 mb-2">Play Mini-Games</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Conquer Timeline Runner quizzes, decipher ancient scripts, and assemble archaeological monuments to earn +50 XP per level!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-orange-300/80 font-medium">
              +50 Points per Level Cleared
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl glass-card border border-slate-800 p-6 flex flex-col justify-between hover:border-purple-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-2xl mb-4">
                📜
              </div>
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Step 3 (Core Hook)</span>
              <h3 className="font-serif font-bold text-lg text-white mt-1 mb-2">Twist Story Unlock</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every 2 completed levels unlock a suspenseful, AI-generated cliffhanger story chapter that keeps kids eager to learn more.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-purple-300/80 font-medium">
              Powered by Gemini 2.5 Flash
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-2xl glass-card border border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-2xl mb-4">
                🚀
              </div>
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Step 4</span>
              <h3 className="font-serif font-bold text-lg text-white mt-1 mb-2">Redeem for STEM</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Spend reward points to unlock premium videos on Space exploration, Quantum physics, Mars rovers, and modern mega-engineering!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-cyan-300/80 font-medium">
              Synthesis of Culture & Science
            </div>
          </div>
        </div>
      </section>

      {/* Civilizations Library Showcase */}
      <section className="mb-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs uppercase tracking-wider">
              Cultural Lore
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">
              Explore World Civilizations
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Deep dive into sacred texts, architectural feats, and legendary heroes.
            </p>
          </div>

          <Link
            to="/explore"
            className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
          >
            <span>View All Tracks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CULTURAL_DOMAINS.map((domain) => (
            <CivilizationCard key={domain.id} domain={domain} />
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-8 sm:p-12 text-slate-950 shadow-2xl relative overflow-hidden text-center">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-950 mb-4">
            Ready to Begin Your Expedition?
          </h2>
          <p className="text-slate-900 font-medium text-sm sm:text-base leading-relaxed mb-8">
            Create your explorer profile in seconds, choose your favorite civilization, and start unlocking epic stories and space science today!
          </p>

          <Link
            to={user ? "/games" : "/auth/register"}
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-extrabold text-base bg-slate-950 text-amber-300 hover:bg-slate-900 shadow-xl transition transform active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>{user ? "Jump to Games Arena" : "Join Katha Yatra Now"}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
