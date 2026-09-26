import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GLYPH_LEVELS, GlyphPair } from './gameData';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { sounds } from '../components/AudioEffects';
import { StoryUnlockModal } from '../components/StoryUnlockModal';
import { UnlockedStory } from '@shared/schema';
import { Sparkles, Trophy, CheckCircle2, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GlyphDecoderGameProps {
  initialLevel?: number;
}

export const GlyphDecoderGame: React.FC<GlyphDecoderGameProps> = ({ initialLevel = 1 }) => {
  const { user, refreshUser, awardPointsLocal } = useAuth();
  const navigate = useNavigate();

  const [levelIdx, setLevelIdx] = useState(Math.min(initialLevel - 1, GLYPH_LEVELS.length - 1));
  const [selectedSymbolId, setSelectedSymbolId] = useState<string | null>(null);
  const [selectedMeaningId, setSelectedMeaningId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongMatch, setWrongMatch] = useState<boolean>(false);
  const [activeHintId, setActiveHintId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isLevelFinished, setIsLevelFinished] = useState(false);
  const [unlockedStoryModal, setUnlockedStoryModal] = useState<UnlockedStory | null>(null);

  const level = GLYPH_LEVELS[levelIdx];

  // Scramble cards
  const [shuffledSymbols] = useState<GlyphPair[]>(() => [...level.pairs].sort(() => Math.random() - 0.5));
  const [shuffledMeanings] = useState<GlyphPair[]>(() => [...level.pairs].sort(() => Math.random() - 0.5));

  const handleSymbolClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    sounds.playClick();
    setSelectedSymbolId(id);

    if (selectedMeaningId) {
      checkMatch(id, selectedMeaningId);
    }
  };

  const handleMeaningClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    sounds.playClick();
    setSelectedMeaningId(id);

    if (selectedSymbolId) {
      checkMatch(selectedSymbolId, id);
    }
  };

  const checkMatch = async (symbolId: string, meaningId: string) => {
    if (symbolId === meaningId) {
      // Match success!
      sounds.playCorrect();
      const updated = [...matchedIds, symbolId];
      setMatchedIds(updated);
      setScore(prev => prev + 150);
      setSelectedSymbolId(null);
      setSelectedMeaningId(null);

      // Check if all matched
      if (updated.length === level.pairs.length) {
        await finishLevel();
      }
    } else {
      // Match error
      sounds.playIncorrect();
      setWrongMatch(true);
      setTimeout(() => {
        setWrongMatch(false);
        setSelectedSymbolId(null);
        setSelectedMeaningId(null);
      }, 700);
    }
  };

  const finishLevel = async () => {
    setIsLevelFinished(true);
    sounds.playVictory();

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }

    if (user) {
      try {
        const res = await api.completeLevel({
          gameId: 'glyph-decoder',
          scoreEarned: score + 150,
          timeTakenSeconds: 30
        });

        awardPointsLocal(50);
        await refreshUser();

        if (res.storyUnlocked && res.unlockedStory) {
          setUnlockedStoryModal(res.unlockedStory);
        }
      } catch (err) {
        console.error('Failed to submit game progress:', err);
      }
    }
  };

  const handleRestart = () => {
    setSelectedSymbolId(null);
    setSelectedMeaningId(null);
    setMatchedIds([]);
    setWrongMatch(false);
    setIsLevelFinished(false);
    setScore(0);
    setActiveHintId(null);
  };

  const handleNextLevel = () => {
    if (levelIdx < GLYPH_LEVELS.length - 1) {
      setLevelIdx(prev => prev + 1);
      handleRestart();
    } else {
      navigate('/games');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Story Unlock Celebration Modal */}
      {unlockedStoryModal && (
        <StoryUnlockModal
          story={unlockedStoryModal}
          onClose={() => setUnlockedStoryModal(null)}
          onReadNow={() => {
            setUnlockedStoryModal(null);
            navigate(`/stories/${unlockedStoryModal.id}`);
          }}
        />
      )}

      {/* Header */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 mb-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-xs uppercase tracking-wider">
                Glyph Decoder
              </span>
              <span className="text-xs text-slate-400">
                Level {level.levelNumber} of {GLYPH_LEVELS.length}
              </span>
            </div>
            <h2 className="font-serif font-bold text-xl text-white mt-1">
              {level.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {level.description}
            </p>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{matchedIds.length} / {level.pairs.length} Decoded</span>
          </div>
        </div>
      </div>

      {!isLevelFinished ? (
        <div className="space-y-6">
          <div className="text-center text-xs text-slate-400 bg-slate-950/60 py-2 px-4 rounded-xl border border-slate-800/80">
            💡 Select an ancient symbol on the left, then click its corresponding meaning and historical function on the right!
          </div>

          {/* Dual Matching Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Ancient Glyph Symbols */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
                <span>Ancient Script Glyphs</span>
              </h3>
              {shuffledSymbols.map((item) => {
                const isMatched = matchedIds.includes(item.id);
                const isSelected = selectedSymbolId === item.id;

                let cardStyle = 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50 text-slate-200';
                if (isMatched) {
                  cardStyle = 'bg-emerald-950/30 border-emerald-500/60 text-emerald-300 opacity-80';
                } else if (isSelected) {
                  cardStyle = wrongMatch
                    ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/30'
                    : 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30 text-amber-200';
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSymbolClick(item.id)}
                    disabled={isMatched}
                    className={`w-full p-4 rounded-2xl border flex items-center justify-between text-left transition-all ${cardStyle}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-xl bg-slate-950 flex items-center justify-center text-3xl shadow-inner border border-slate-800">
                        {item.symbol}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-base text-white">{item.name}</h4>
                        <span className="text-[11px] text-amber-400/80 uppercase font-medium">{item.culture}</span>
                      </div>
                    </div>

                    {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-2 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Right: Meanings & Archaeologist Clues */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-2">
                <span>Decrypted Meanings & Lore</span>
              </h3>
              {shuffledMeanings.map((item) => {
                const isMatched = matchedIds.includes(item.id);
                const isSelected = selectedMeaningId === item.id;

                let cardStyle = 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50 text-slate-200';
                if (isMatched) {
                  cardStyle = 'bg-emerald-950/30 border-emerald-500/60 text-emerald-300 opacity-80';
                } else if (isSelected) {
                  cardStyle = wrongMatch
                    ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/30'
                    : 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-400/30 text-cyan-200';
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleMeaningClick(item.id)}
                    disabled={isMatched}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${cardStyle}`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-sm sm:text-base text-white mb-1">{item.meaning}</h4>
                      {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-2 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{item.clue}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-amber-950/40 border-2 border-amber-500/40 p-8 text-center animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 mx-auto mb-4 animate-bounce">
            📜
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1">
            All Ancient Glyphs Decoded!
          </h3>
          <p className="text-amber-400 font-semibold text-sm mb-6">
            +50 Katha XP Awarded for Scribe Mastery!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleNextLevel}
              className="w-full sm:w-auto py-3 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2 transition"
            >
              <span>Next Level</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto py-3 px-5 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 flex items-center justify-center space-x-1.5 transition text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
