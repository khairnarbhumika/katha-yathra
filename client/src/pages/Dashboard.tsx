import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { UnlockedStory, StoreItem, AVATARS, CULTURAL_DOMAINS } from '@shared/schema';
import {
  Flame,
  Coins,
  Gamepad2,
  BookOpen,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Trophy,
  CheckCircle2,
  Play,
  Layers,
  Compass
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, stats } = useAuth();
  const [recentStories, setRecentStories] = useState<UnlockedStory[]>([]);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [gameProgress, setGameProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [storiesRes, storeRes, progressRes] = await Promise.all([
          api.getMyStories().catch(() => ({ stories: [] })),
          api.getStoreItems().catch(() => ({ items: [] })),
          api.getGameProgress().catch(() => ({ progress: [] }))
        ]);

        setRecentStories(storiesRes.stories);
        setStoreItems(storeRes.items.slice(0, 3));
        setGameProgress(progressRes.progress);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const activeAvatar = AVATARS.find(a => a.id === user?.avatar_url) || AVATARS[0];
  const userDomain = CULTURAL_DOMAINS.find(d => d.name === user?.preferred_domain) || CULTURAL_DOMAINS[0];

  const totalLevels = stats.totalLevelsCompleted || 0;
  const levelsUntilNextStory = totalLevels % 2 === 0 ? 2 : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Explorer Profile Greeting Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shadow-amber-500/20">
              {activeAvatar.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {activeAvatar.name}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">Age {user?.age_group}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-0.5">
                Greetings, {user?.username}!
              </h1>
              <p className="text-xs sm:text-sm text-amber-300/80 font-medium flex items-center gap-1.5 mt-1">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Primary Heritage Track: {user?.preferred_domain}</span>
              </p>
            </div>
          </div>

          {/* Quick Play CTA */}
          <Link
            to="/games"
            className="w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 transition transform active:scale-95"
          >
            <Gamepad2 className="w-5 h-5 text-slate-950" />
            <span>Play Next Mini-Game Level</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Gamification Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Streak Card */}
        <div className="rounded-2xl glass-card border border-orange-500/30 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Daily Streak</span>
            <Flame className="w-5 h-5 text-orange-500 animate-pulse fill-orange-500/30" />
          </div>
          <div className="text-3xl font-serif font-bold text-white mb-1">
            {user?.current_streak} <span className="text-sm font-normal text-slate-400">Days</span>
          </div>
          <p className="text-[11px] text-orange-300/80 font-medium">
            🔥 +20 XP Daily Streak Bonus Active!
          </p>
        </div>

        {/* Reward XP Points */}
        <div className="rounded-2xl glass-card border border-amber-500/30 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Katha XP Points</span>
            <Coins className="w-5 h-5 text-amber-400 fill-amber-400/20" />
          </div>
          <div className="text-3xl font-serif font-bold text-white mb-1">
            {user?.points.toLocaleString()} <span className="text-sm font-normal text-amber-400">XP</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Spendable in the Space & STEM store
          </p>
        </div>

        {/* Levels Cleared */}
        <div className="rounded-2xl glass-card border border-slate-800 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Levels Cleared</span>
            <Trophy className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-white mb-1">
            {totalLevels} <span className="text-sm font-normal text-slate-400">Total</span>
          </div>
          <p className="text-[11px] text-purple-300/80">
            Across Timeline, Glyph & Builder
          </p>
        </div>

        {/* Core Milestone Story Trigger Status */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/40 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Next Story Twist</span>
            <Sparkles className="w-5 h-5 text-purple-400 animate-spin-slow" />
          </div>
          <div className="text-xl font-bold text-white mb-1">
            {levelsUntilNextStory === 1 ? '1 Level Away!' : '2 Levels Away'}
          </div>
          <p className="text-[11px] text-amber-300 font-medium">
            {levelsUntilNextStory === 1
              ? '⭐ Complete 1 more level to trigger new story chapter!'
              : 'Unlocked every 2 completed levels'}
          </p>
        </div>
      </div>

      {/* Mini-Games Suite Quick Launch */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Interactive Mini-Games
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Each completed level awards +50 XP and advances your story unlock progress.
            </p>
          </div>
          <Link to="/games" className="text-xs sm:text-sm font-semibold text-amber-400 hover:underline">
            View All Games
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Timeline Runner */}
          <div className="rounded-2xl glass-card border border-slate-800 p-6 flex flex-col justify-between hover:border-amber-500/40 transition group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Quiz & Runner</span>
              <h3 className="font-serif font-bold text-lg text-white mt-1 mb-2">Timeline Runner</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Race through historical epochs, answer civilization questions, and collect ancient artifacts!
              </p>
            </div>
            <Link
              to="/games/timeline-runner/play"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-amber-500 hover:bg-amber-400 flex items-center justify-center space-x-1.5 transition"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Play Timeline Runner</span>
            </Link>
          </div>

          {/* Glyph Decoder */}
          <div className="rounded-2xl glass-card border border-slate-800 p-6 flex flex-col justify-between hover:border-purple-500/40 transition group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                𓂀
              </div>
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Linguistic Decryption</span>
              <h3 className="font-serif font-bold text-lg text-white mt-1 mb-2">Glyph Decoder</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Decipher ancient Egyptian hieroglyphs, Vedic symbols, and Islamic astrolabe secrets.
              </p>
            </div>
            <Link
              to="/games/glyph-decoder/play"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-purple-400 hover:bg-purple-300 flex items-center justify-center space-x-1.5 transition"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Decode Ancient Glyphs</span>
            </Link>
          </div>

          {/* Monument Builder */}
          <div className="rounded-2xl glass-card border border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🏛️
              </div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Archaeological Puzzle</span>
              <h3 className="font-serif font-bold text-lg text-white mt-1 mb-2">Monument Builder</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Rebuild the Sun Temple of Konark and the Great Pyramid of Giza layer by layer!
              </p>
            </div>
            <Link
              to="/games/relic-builder/play"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 flex items-center justify-center space-x-1.5 transition"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Rebuild Monuments</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Unlocked Story Chapters Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              My Unlocked Story Chapters
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Suspenseful cliffhanger narratives unlocked every 2 completed game levels.
            </p>
          </div>
          <Link to="/stories" className="text-xs sm:text-sm font-semibold text-amber-400 hover:underline">
            View All ({recentStories.length})
          </Link>
        </div>

        {recentStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentStories.slice(0, 2).map((story) => (
              <div
                key={story.id}
                className="rounded-2xl glass-card border border-purple-500/30 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold uppercase">
                      {story.domain}
                    </span>
                    <span className="text-slate-400 font-medium">Chapter {story.chapter_number}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white mb-2">{story.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
                    {story.content}
                  </p>
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-purple-500/20 text-xs italic text-amber-300 mb-4">
                    ⚡ "{story.twist_ending}"
                  </div>
                </div>
                <Link
                  to={`/stories/${story.id}`}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 flex items-center justify-center space-x-1.5 transition"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Chapter & Listen Aloud</span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 text-center">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-base text-white mb-1">
              No Unlocked Story Chapters Yet
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
              Complete your first 2 mini-game levels to trigger your first Gemini-powered cliffhanger chapter!
            </p>
            <Link
              to="/games"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-amber-500 hover:bg-amber-400 transition"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Start Level 1 Now</span>
            </Link>
          </div>
        )}
      </section>

      {/* STEM / Space Science Marketplace Showcase */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Space & STEM Marketplace
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Redeem your accumulated Katha XP for premium space discovery and applied physics modules.
            </p>
          </div>
          <Link to="/store" className="text-xs sm:text-sm font-semibold text-cyan-400 hover:underline">
            Visit Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {storeItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl glass-card border border-slate-800 overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-36 w-full">
                <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-[10px] font-bold uppercase text-cyan-400">
                  {item.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-white mb-1 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2 mb-3">{item.description}</p>
                </div>
                <Link
                  to="/store"
                  className="w-full py-2 rounded-lg font-bold text-xs text-center bg-slate-800 hover:bg-slate-700 text-amber-300 flex items-center justify-center space-x-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unlock ({item.cost_points} XP)</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
