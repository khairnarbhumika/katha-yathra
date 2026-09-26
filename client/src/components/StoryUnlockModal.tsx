import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, BookOpen, ArrowRight, X, Trophy } from 'lucide-react';
import { UnlockedStory } from '@shared/schema';
import { sounds } from './AudioEffects';

interface StoryUnlockModalProps {
  story: UnlockedStory;
  onClose: () => void;
  onReadNow: () => void;
}

export const StoryUnlockModal: React.FC<StoryUnlockModalProps> = ({ story, onClose, onReadNow }) => {
  useEffect(() => {
    // Sound chime
    sounds.playUnlock();

    // Fire golden and cosmic confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#f97316', '#a855f7', '#38bdf8', '#fbbf24']
      });
    } catch {
      // Ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/40 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/20 p-6 sm:p-8 overflow-hidden text-center">
        {/* Decorative ambient lights */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy / Book Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 mb-4 animate-bounce">
          📜
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Milestone: 2 Levels Completed!</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1">
          New Story Chapter Unlocked!
        </h2>
        <p className="text-amber-300 font-medium text-sm mb-4">
          Chapter {story.chapter_number}: "{story.title}"
        </p>

        {/* Teaser Box with Cliffhanger preview */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-amber-500/20 text-left mb-6 shadow-inner">
          <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wide block mb-1">
            ⚡ High-Stakes Cliffhanger Teaser:
          </span>
          <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed line-clamp-3">
            "{story.twist_ending}"
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onReadNow}
            className="w-full py-3 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition transform active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Story Chapter Now</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-xl font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm transition"
          >
            Keep Playing
          </button>
        </div>
      </div>
    </div>
  );
};
