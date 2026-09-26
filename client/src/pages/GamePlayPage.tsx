import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { TimelineRunnerGame } from '../games/TimelineRunnerGame';
import { GlyphDecoderGame } from '../games/GlyphDecoderGame';
import { RelicBuilderGame } from '../games/RelicBuilderGame';
import { ArrowLeft, Gamepad2 } from 'lucide-react';

export const GamePlayPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();

  const renderGame = () => {
    switch (gameId) {
      case 'timeline-runner':
        return <TimelineRunnerGame />;
      case 'glyph-decoder':
        return <GlyphDecoderGame />;
      case 'relic-builder':
        return <RelicBuilderGame />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">Game not found.</p>
            <Link to="/games" className="text-amber-400 font-semibold hover:underline">
              Return to Mini-Games Portal
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/games"
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Mini-Games Hub</span>
        </Link>
      </div>

      {renderGame()}
    </div>
  );
};
