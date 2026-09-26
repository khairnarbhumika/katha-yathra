import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles, BookOpen, Compass, Gamepad2, ShoppingBag } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md pt-12 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2.5 mb-3">
              <span className="text-2xl">🧭</span>
              <span className="font-serif font-bold text-xl gold-gradient-text">Katha Yatra</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mb-4">
              A world-class gamified learning ecosystem designed to transform ancient epics, civilizational heritage, and world history into an engaging adventure for kids, bridging history with modern space and STEM exploration.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Non-Sectarian • Safe Exploration • Zero Ads</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-xs sm:text-sm uppercase tracking-wider mb-3">
              Adventure Hub
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/explore" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" /> Civilizations Library
                </Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5" /> Interactive Mini-Games
                </Link>
              </li>
              <li>
                <Link to="/stories" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Unlocked Cliffhangers
                </Link>
              </li>
              <li>
                <Link to="/store" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" /> Space & STEM Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Educational Advisory */}
          <div>
            <h4 className="font-semibold text-white text-xs sm:text-sm uppercase tracking-wider mb-3">
              Parental Advisory
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Katha Yatra presents world civilizations through objective historical, literary, and archaeological contexts suitable for young minds aged 6-14+.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Katha Yatra Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Sparkles className="w-3.5 h-3.5 text-amber-400" /> for young explorers & future scientists.
          </p>
        </div>
      </div>
    </footer>
  );
};
