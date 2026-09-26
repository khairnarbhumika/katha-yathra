import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Sun, Shield, Moon, Compass, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface CivilizationCardProps {
  domain: {
    id: string;
    name: string;
    tagline: string;
    description: string;
    icon: string;
    themeColor: string;
    bannerImage: string;
    topics: readonly string[];
  };
}

export const CivilizationCard: React.FC<CivilizationCardProps> = ({ domain }) => {
  const { user, updateProfile } = useAuth();
  const isSelected = user?.preferred_domain === domain.name;

  const renderIcon = () => {
    switch (domain.icon) {
      case 'Flame': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Sun': return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'Shield': return <Shield className="w-5 h-5 text-blue-400" />;
      case 'Moon': return <Moon className="w-5 h-5 text-emerald-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-rose-400" />;
      default: return <BookOpen className="w-5 h-5 text-purple-400" />;
    }
  };

  const handleSelectAsPrimary = async () => {
    if (user && !isSelected) {
      await updateProfile({ preferredDomain: domain.name });
    }
  };

  return (
    <div className={`group relative overflow-hidden rounded-2xl glass-card transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between ${
      isSelected ? 'border-amber-500/60 ring-2 ring-amber-500/20 shadow-amber-500/10' : 'hover:border-slate-700'
    }`}>
      {/* Background Banner with Gradient Overlay */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={domain.bannerImage}
          alt={domain.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

        {/* Selected Badge */}
        {isSelected && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shadow-lg flex items-center space-x-1">
            <span>⭐ My Main Track</span>
          </div>
        )}

        {/* Icon Pill */}
        <div className="absolute bottom-3 left-4 flex items-center space-x-2">
          <div className="w-9 h-9 rounded-lg bg-slate-900/90 border border-slate-700/80 flex items-center justify-center shadow-md">
            {renderIcon()}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
            {domain.id.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif font-bold text-lg text-white mb-1 group-hover:text-amber-300 transition-colors">
            {domain.name}
          </h3>
          <p className="text-xs text-amber-400/90 font-medium mb-3 italic">
            {domain.tagline}
          </p>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
            {domain.description}
          </p>

          {/* Topics Tag Cloud */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {domain.topics.map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          {user && !isSelected ? (
            <button
              onClick={handleSelectAsPrimary}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
            >
              Set as Primary Track
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Stories & Games Ready</span>
          )}

          <Link
            to={`/games?domain=${encodeURIComponent(domain.name)}`}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition group-hover:border-amber-400/60"
          >
            <span>Play Quests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
