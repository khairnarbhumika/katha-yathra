import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIMELINE_RUNNER_LEVELS, QuizQuestion } from './gameData';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { sounds } from '../components/AudioEffects';
import { StoryUnlockModal } from '../components/StoryUnlockModal';
import { UnlockedStory } from '@shared/schema';
import {
  Trophy,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap,
  ShieldAlert,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TimelineRunnerGameProps {
  initialLevel?: number;
}

export const TimelineRunnerGame: React.FC<TimelineRunnerGameProps> = ({ initialLevel = 1 }) => {
  const { user, refreshUser, awardPointsLocal } = useAuth();
  const navigate = useNavigate();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(
    Math.min(initialLevel - 1, TIMELINE_RUNNER_LEVELS.length - 1)
  );
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streakCombo, setStreakCombo] = useState(0);
  const [relicsCollected, setRelicsCollected] = useState<string[]>([]);
  const [isLevelFinished, setIsLevelFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unlockedStoryModal, setUnlockedStoryModal] = useState<UnlockedStory | null>(null);

  const currentLevel = TIMELINE_RUNNER_LEVELS[currentLevelIdx];
  const question: QuizQuestion = currentLevel.questions[currentQuestionIdx];

  // Timer countdown
  useEffect(() => {
    if (isLevelFinished || isAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIdx, isAnswered, isLevelFinished]);

  const handleTimeExpired = () => {
    setIsAnswered(true);
    sounds.playIncorrect();
    setStreakCombo(0);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === question.correctIndex;
    if (isCorrect) {
      sounds.playCorrect();
      const points = 100 + streakCombo * 20 + timeLeft * 2;
      setScore(prev => prev + points);
      setStreakCombo(prev => prev + 1);
      setRelicsCollected(prev => [...prev, question.relicName]);
    } else {
      sounds.playIncorrect();
      setStreakCombo(0);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIdx < currentLevel.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(25);
    } else {
      // Level Completed!
      await finishLevel();
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
        setIsSubmitting(true);
        const res = await api.completeLevel({
          gameId: 'timeline-runner',
          scoreEarned: score + 100,
          timeTakenSeconds: 30
        });

        awardPointsLocal(50);
        await refreshUser();

        if (res.storyUnlocked && res.unlockedStory) {
          setUnlockedStoryModal(res.unlockedStory);
        }
      } catch (err) {
        console.error('Failed to submit game progress:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRestartLevel = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreakCombo(0);
    setRelicsCollected([]);
    setIsLevelFinished(false);
    setTimeLeft(25);
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < TIMELINE_RUNNER_LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      handleRestartLevel();
    } else {
      navigate('/games');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Story Unlock Celebration Modal if triggered */}
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

      {/* Game Level Header Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-6 mb-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider">
                Timeline Runner
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Level {currentLevel.levelNumber} of {TIMELINE_RUNNER_LEVELS.length}
              </span>
            </div>
            <h2 className="font-serif font-bold text-lg sm:text-xl text-white mt-1">
              {currentLevel.title}
            </h2>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center space-x-3 text-xs font-bold">
            {streakCombo > 1 && (
              <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-orange-400" />
                <span>{streakCombo}x Combo!</span>
              </div>
            )}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{score} Score</span>
            </div>
          </div>
        </div>

        {/* Level Timeline Track */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span>Epoch Stage {currentQuestionIdx + 1} / {currentLevel.questions.length}</span>
            <span>Relics: {relicsCollected.length}</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
              style={{ width: `${((currentQuestionIdx + 1) / currentLevel.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {!isLevelFinished ? (
        /* Question Arena */
        <div className="rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl p-6 sm:p-8">
          {/* Question Epoch & Timer */}
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-semibold border border-purple-500/30">
              <span>{question.epoch}</span>
              <span className="text-slate-400">• {question.yearHint}</span>
            </div>

            <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              timeLeft <= 5
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-ping'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Question Text */}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">
            {question.question}
          </h3>

          {/* Options Grid */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, idx) => {
              let optionStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-amber-500/40';

              if (isAnswered) {
                if (idx === question.correctIndex) {
                  optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
                } else if (selectedOption === idx) {
                  optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                } else {
                  optionStyle = 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border text-left font-medium text-sm sm:text-base flex items-center justify-between transition-all ${optionStyle}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-900/80 border border-slate-700/80 flex items-center justify-center font-bold text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {isAnswered && idx === question.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {isAnswered && selectedOption === idx && idx !== question.correctIndex && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation Box */}
          {isAnswered && (
            <div className="animate-in fade-in zoom-in-95">
              <div className={`p-4 rounded-2xl border mb-6 ${
                selectedOption === question.correctIndex
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}>
                <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
                  {selectedOption === question.correctIndex ? (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Marvelous! Correct Answer! Relic Discovered: 🏛️ {question.relicName}</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>Historical Insight:</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                  {question.explanation}
                </p>
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2 transition transform active:scale-98"
              >
                <span>{currentQuestionIdx < currentLevel.questions.length - 1 ? 'Next Timeline Epoch' : 'Complete Level & Claim +50 XP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Victory Screen */
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/40 border-2 border-amber-500/40 shadow-2xl p-8 text-center animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 mx-auto mb-4 animate-bounce">
            🏆
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1">
            Level {currentLevel.levelNumber} Completed!
          </h3>
          <p className="text-amber-400 font-semibold text-sm mb-6">
            +50 Katha XP Added to your Explorer Points balance!
          </p>

          {/* Relics Showcase */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 mb-6 max-w-md mx-auto">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Archaeological Relics Collected:
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {relicsCollected.map((relic, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium"
                >
                  ✨ {relic}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleNextLevel}
              className="w-full sm:w-auto py-3 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2 transition"
            >
              <span>Next Level & Quest</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleRestartLevel}
              className="w-full sm:w-auto py-3 px-5 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 flex items-center justify-center space-x-1.5 transition text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay Level</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
