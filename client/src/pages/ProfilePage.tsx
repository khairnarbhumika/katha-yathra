import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AVATARS, CULTURAL_DOMAINS, AGE_GROUPS } from '@shared/schema';
import {
  User as UserIcon,
  Flame,
  Coins,
  Trophy,
  BookOpen,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  Compass,
  ShieldCheck
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, stats, updateProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!user) return null;

  const activeAvatar = AVATARS.find(a => a.id === user.avatar_url) || AVATARS[0];

  const handleAvatarChange = async (avatarId: string) => {
    setIsUpdating(true);
    try {
      await updateProfile({ avatarUrl: avatarId });
      setSuccessMsg('Avatar updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDomainChange = async (domainName: string) => {
    setIsUpdating(true);
    try {
      await updateProfile({ preferredDomain: domainName });
      setSuccessMsg('Primary civilization track updated!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const badges = [
    {
      id: 'welcome',
      title: 'Explorer Initiate',
      desc: 'Created an account & joined Katha Yatra',
      icon: '🧭',
      unlocked: true
    },
    {
      id: 'streak',
      title: 'Keeper of the Flame',
      desc: 'Maintained a daily streak',
      icon: '🔥',
      unlocked: user.current_streak >= 1
    },
    {
      id: 'first-game',
      title: 'Relic Seeker',
      desc: 'Completed at least 1 mini-game level',
      icon: '🏛️',
      unlocked: stats.totalLevelsCompleted >= 1
    },
    {
      id: 'twist-master',
      title: 'Scribe of Twists',
      desc: 'Unlocked an AI Cliffhanger Story Chapter',
      icon: '📜',
      unlocked: stats.unlockedStoriesCount >= 1
    },
    {
      id: 'science-voyager',
      title: 'Cosmic Pioneer',
      desc: 'Unlocked a Space or STEM Science video module',
      icon: '🚀',
      unlocked: stats.purchasedVideosCount >= 1
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Profile Header */}
      <div className="rounded-3xl glass-card border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-6xl shadow-2xl shadow-orange-500/30">
            {activeAvatar.icon}
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {user.username}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-xs border border-amber-500/30">
                Age {user.age_group}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mb-4">{user.email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold">
              <div className="px-3.5 py-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>{user.current_streak} Day Streak</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center space-x-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{user.points.toLocaleString()} XP Points</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>{stats.unlockedStoriesCount} Stories Unlocked</span>
              </div>
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="mt-6 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Explorer Badges & Honors */}
      <section>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mb-4">
          Explorer Badges & Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-2xl p-5 border text-center flex flex-col items-center justify-between transition ${
                badge.unlocked
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-950/40 border-slate-800 text-slate-600 opacity-60'
              }`}
            >
              <div className="text-4xl mb-3">{badge.icon}</div>
              <h3 className={`font-serif font-bold text-sm mb-1 ${badge.unlocked ? 'text-white' : 'text-slate-500'}`}>
                {badge.title}
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                {badge.desc}
              </p>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                badge.unlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
              }`}>
                {badge.unlocked ? 'Earned' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Profile Settings: Change Avatar & Preferred Track */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Avatar */}
        <div className="rounded-3xl glass-card border border-slate-800 p-6">
          <h3 className="font-serif font-bold text-base text-white mb-3">
            Change Explorer Avatar
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => handleAvatarChange(avatar.id)}
                disabled={isUpdating}
                className={`p-3 rounded-2xl border text-center transition ${
                  user.avatar_url === avatar.id
                    ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl">{avatar.icon}</span>
                <span className="text-[9px] block text-slate-300 truncate mt-1">{avatar.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Change Domain Track */}
        <div className="rounded-3xl glass-card border border-slate-800 p-6">
          <h3 className="font-serif font-bold text-base text-white mb-3">
            Switch Primary Civilization Track
          </h3>
          <select
            value={user.preferred_domain}
            onChange={(e) => handleDomainChange(e.target.value)}
            disabled={isUpdating}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
          >
            {CULTURAL_DOMAINS.map((domain) => (
              <option key={domain.id} value={domain.name}>
                {domain.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400 mt-3">
            Selecting a new primary domain tailors your unlocked story chapters and recommended historical quizzes.
          </p>
        </div>
      </div>
    </div>
  );
};
