import React, { useState } from 'react';
import { CULTURAL_DOMAINS } from '@shared/schema';
import { CivilizationCard } from '../components/CivilizationCard';
import { Compass, Search, Filter, Sparkles, BookOpen } from 'lucide-react';

export const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDomains = CULTURAL_DOMAINS.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/20 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>World Heritage Archive</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
            Civilizations & Heritage Library
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Browse through ancient epics, lost cities, and astronomical inventions. Select your primary track to customize your mini-game questions and unlocked AI story narratives!
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ramayana, Pyramids, Astrolabe, Samurai..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs sm:text-sm shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Civilization Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDomains.map((domain) => (
          <CivilizationCard key={domain.id} domain={domain} />
        ))}
      </div>

      {filteredDomains.length === 0 && (
        <div className="text-center py-12 rounded-2xl bg-slate-900/60 border border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No civilization found matching "{searchQuery}".</p>
        </div>
      )}
    </div>
  );
};
