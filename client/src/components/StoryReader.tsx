import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Volume2, VolumeX, Sparkles, ArrowRight, Gamepad2, Share2, Compass } from 'lucide-react';
import { UnlockedStory } from '@shared/schema';

interface StoryReaderProps {
  story: UnlockedStory;
}

export const StoryReader: React.FC<StoryReaderProps> = ({ story }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Stop speech synthesis if component unmounts
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [story]);

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const fullText = `${story.title}. Chapter ${story.chapter_number}. ${story.content} The Twist: ${story.twist_ending} Question: ${story.cliffhanger_question || ''}`;
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = 0.95; // Slightly slower, clear storytelling pacing
      utterance.pitch = 1.05;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Top Banner Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs uppercase tracking-wider">
            {story.domain}
          </span>
          <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold text-xs">
            Chapter {story.chapter_number}
          </span>
        </div>

        {/* Audio Narrator Button */}
        <button
          onClick={toggleSpeech}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition shadow-md ${
            isSpeaking
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4 text-rose-400" />
              <span>Stop Story Narration</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Listen Aloud (AI Voice)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Manuscript Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/30 shadow-2xl p-6 sm:p-10 lg:p-12 overflow-hidden">
        {/* Decorative corner illumination */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Chapter Header */}
        <div className="text-center mb-8 border-b border-slate-800 pb-6">
          <div className="font-serif text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
            Ancient Manuscript Scroll
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
            {story.title}
          </h1>
          <p className="text-xs text-slate-400">
            Unlocked on {new Date(story.unlocked_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </p>
        </div>

        {/* Main Narrative Body */}
        <div className="prose prose-invert max-w-none text-slate-200 text-base sm:text-lg leading-relaxed mb-8">
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:leading-none">
            {story.content}
          </p>
        </div>

        {/* High-Stakes Twist Ending Box */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-amber-950/40 border-2 border-purple-500/40 p-6 sm:p-8 mb-8 shadow-xl shadow-purple-500/10">
          <div className="flex items-center space-x-2 text-purple-300 font-bold text-sm uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
            <span>The Cliffhanger Twist:</span>
          </div>

          <p className="text-slate-100 text-base sm:text-lg font-medium italic leading-relaxed mb-4">
            "{story.twist_ending}"
          </p>

          {story.cliffhanger_question && (
            <div className="pt-4 border-t border-purple-500/20 text-xs sm:text-sm text-amber-300/90 font-medium">
              ❓ <span className="font-bold">Next Mystery:</span> {story.cliffhanger_question}
            </div>
          )}
        </div>

        {/* Next Action Trigger */}
        <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-white text-sm sm:text-base">
              Eager to find out what happens next?
            </h4>
            <p className="text-xs text-slate-400">
              Complete 2 more mini-game levels to unlock Chapter {story.chapter_number + 1}!
            </p>
          </div>

          <Link
            to="/games"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2 transition transform active:scale-95"
          >
            <Gamepad2 className="w-4 h-4 text-slate-950" />
            <span>Play Next Game Level</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
