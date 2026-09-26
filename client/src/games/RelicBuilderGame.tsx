import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MONUMENT_LEVELS, MonumentFragment } from './gameData';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { sounds } from '../components/AudioEffects';
import { StoryUnlockModal } from '../components/StoryUnlockModal';
import { UnlockedStory } from '@shared/schema';
import { Sparkles, Trophy, CheckCircle2, RotateCcw, ArrowRight, Layers, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RelicBuilderGameProps {
  initialLevel?: number;
}

export const RelicBuilderGame: React.FC<RelicBuilderGameProps> = ({ initialLevel = 1 }) => {
  const { user, refreshUser, awardPointsLocal } = useAuth();
  const navigate = useNavigate();

  const [levelIdx, setLevelIdx] = useState(Math.min(initialLevel - 1, MONUMENT_LEVELS.length - 1));
  const [assembledLayerCount, setAssembledLayerCount] = useState(0);
  const [selectedFact, setSelectedFact] = useState<string | null>(null);
  const [isLevelFinished, setIsLevelFinished] = useState(false);
  const [unlockedStoryModal, setUnlockedStoryModal] = useState<UnlockedStory | null>(null);

  const level = MONUMENT_LEVELS[levelIdx];

  const handleAssembleFragment = async (fragment: MonumentFragment) => {
    if (fragment.layerIndex !== assembledLayerCount) {
      // Must assemble in bottom-to-top architectural order!
      sounds.playIncorrect();
      setSelectedFact(`🏗️ Architectural Order Required: You must assemble layer ${assembledLayerCount + 1} first before placing higher structures!`);
      return;
    }

    sounds.playCorrect();
    const nextCount = assembledLayerCount + 1;
    setAssembledLayerCount(nextCount);
    setSelectedFact(`🏛️ ${fragment.name}: ${fragment.archaeologicalFact}`);

    if (nextCount === level.fragments.length) {
      await finishLevel();
    }
  };

  const finishLevel = async () => {
    setIsLevelFinished(true);
    sounds.playVictory();

    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }

    if (user) {
      try {
        const res = await api.completeLevel({
          gameId: 'relic-builder',
          scoreEarned: 200,
          timeTakenSeconds: 35
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
    setAssembledLayerCount(0);
    setSelectedFact(null);
    setIsLevelFinished(false);
  };

  const handleNextLevel = () => {
    if (levelIdx < MONUMENT_LEVELS.length - 1) {
      setLevelIdx(prev => prev + 1);
      handleRestart();
    } else {
      navigate('/games');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Story Unlock Modal */}
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
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                Monument Builder
              </span>
              <span className="text-xs text-slate-400">
                Level {level.levelNumber} of {MONUMENT_LEVELS.length}
              </span>
            </div>
            <h2 className="font-serif font-bold text-xl text-white mt-1">
              {level.title}
            </h2>
            <p className="text-xs text-amber-300/90 mt-0.5">
              📍 {level.monumentName} • {level.location}
            </p>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>{assembledLayerCount} / {level.fragments.length} Layers Assembled</span>
          </div>
        </div>
      </div>

      {!isLevelFinished ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Blueprint Construction Zone (Left 2 cols) */}
          <div className="lg:col-span-2 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl flex flex-col justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <span>🏗️ Architectural Blueprint Assembly (Bottom to Top)</span>
            </h3>

            {/* Assembled Stack Visualization */}
            <div className="space-y-3 mb-6">
              {[...level.fragments].reverse().map((fragment) => {
                const isBuilt = fragment.layerIndex < assembledLayerCount;
                const isNext = fragment.layerIndex === assembledLayerCount;

                return (
                  <div
                    key={fragment.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isBuilt
                        ? 'bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500/60 text-emerald-200'
                        : isNext
                        ? 'bg-slate-950 border-amber-500/50 border-dashed animate-pulse'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{isBuilt ? fragment.icon : '⬛'}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-bold uppercase text-slate-400">
                            Layer {fragment.layerIndex + 1}
                          </span>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                            {isBuilt ? fragment.name : 'Unassembled Structural Component'}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {isBuilt ? fragment.description : 'Place preceding layers to unlock this blueprint piece'}
                        </p>
                      </div>
                    </div>

                    {isBuilt && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Archaeological Insight Banner */}
            {selectedFact && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs sm:text-sm text-slate-200 animate-in fade-in flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{selectedFact}</p>
              </div>
            )}
          </div>

          {/* Fragment Pallet (Right 1 col) */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                Select Component to Place:
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Click the correct foundational piece to erect the structure from foundation to apex!
              </p>

              <div className="space-y-3">
                {level.fragments.map((fragment) => {
                  const isBuilt = fragment.layerIndex < assembledLayerCount;
                  const isReady = fragment.layerIndex === assembledLayerCount;

                  return (
                    <button
                      key={fragment.id}
                      onClick={() => handleAssembleFragment(fragment)}
                      disabled={isBuilt}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                        isBuilt
                          ? 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-60 cursor-default'
                          : isReady
                          ? 'bg-amber-500/15 border-amber-500/50 hover:bg-amber-500/25 text-amber-200 ring-1 ring-amber-400/30'
                          : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <span className="text-2xl">{fragment.icon}</span>
                      <div className="flex-1">
                        <div className="font-bold text-xs text-white">{fragment.name}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{fragment.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-amber-950/40 border-2 border-amber-500/40 p-8 text-center animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 mx-auto mb-4 animate-bounce">
            🏛️
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1">
            Monument Fully Restored!
          </h3>
          <p className="text-amber-400 font-semibold text-sm mb-6">
            +50 Katha XP Awarded for Architectural Mastery!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleNextLevel}
              className="w-full sm:w-auto py-3 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2 transition"
            >
              <span>Next Monument Quest</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto py-3 px-5 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 flex items-center justify-center space-x-1.5 transition text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rebuild</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
