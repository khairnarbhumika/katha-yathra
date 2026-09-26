import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { UnlockedStory } from '@shared/schema';
import { StoryReader } from '../components/StoryReader';
import { BookOpen, Sparkles, ArrowLeft, ArrowRight, Play, Gamepad2, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StoryView: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const { user } = useAuth();
  const [stories, setStories] = useState<UnlockedStory[]>([]);
  const [currentStory, setCurrentStory] = useState<UnlockedStory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        if (storyId) {
          const res = await api.getStoryById(storyId);
          setCurrentStory(res.story);
        } else {
          const res = await api.getMyStories();
          setStories(res.stories);
        }
      } catch (err) {
        console.error('Failed to load story data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [storyId]);

  if (storyId && currentStory) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link
          to="/stories"
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Story Library</span>
        </Link>
        <StoryReader story={currentStory} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/20 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold text-xs uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Unlocked Manuscript Archive</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
            My Unlocked Story Chapters
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Every 2 completed game levels unlocks a brand-new, high-stakes chapter ending in a cliffhanger twist. Read below or use the AI Voice reader to listen aloud!
          </p>

          <Link
            to="/games"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition shadow-lg shadow-orange-500/20"
          >
            <Gamepad2 className="w-4 h-4 text-slate-950" />
            <span>Play Games to Unlock More Chapters</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Story Library Grid */}
      {stories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="rounded-2xl glass-card border border-purple-500/30 p-6 flex flex-col justify-between hover:border-purple-500/60 hover:shadow-xl transition group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold uppercase tracking-wider">
                    {story.domain}
                  </span>
                  <span className="text-slate-400 font-medium">Chapter {story.chapter_number}</span>
                </div>

                <h3 className="font-serif font-bold text-lg text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {story.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {story.content}
                </p>

                {/* Cliffhanger preview */}
                <div className="bg-slate-950/80 p-3 rounded-xl border border-purple-500/20 text-xs italic text-amber-300 mb-6">
                  ⚡ "{story.twist_ending}"
                </div>
              </div>

              <Link
                to={`/stories/${story.id}`}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-center text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 flex items-center justify-center space-x-1.5 transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Manuscript & Listen</span>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/15 text-purple-300 flex items-center justify-center text-3xl mx-auto mb-4">
            📜
          </div>
          <h3 className="font-serif font-bold text-xl text-white mb-2">
            No Story Chapters Unlocked Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6">
            Jump into the mini-games portal! When you complete 2 levels in any mini-game, your first Gemini-powered chapter twist will unlock here.
          </p>
          <Link
            to="/games"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-amber-500 hover:bg-amber-400 transition"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Play Level 1 in Mini-Games</span>
          </Link>
        </div>
      )}
    </div>
  );
};
