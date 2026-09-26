import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, AlertCircle, LogIn, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('explorer123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="rounded-3xl glass-card border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/25 mx-auto mb-3">
            🧭
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Welcome Back!
          </h1>
          <p className="text-xs sm:text-sm text-amber-300/90 mt-1">
            Sign in to continue your streak and unlock new story cliffhangers.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="explorer@kathayatra.org"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 transition transform active:scale-98 disabled:opacity-50 mt-2"
          >
            <LogIn className="w-4 h-4 text-slate-950" />
            <span>{isLoading ? 'Signing In...' : 'Sign In & Check Streak'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Preset Helper */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            New Explorer? Try Quick Fill:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('arjuna@kathayatra.org');
                setPassword('explorer123');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-amber-300 font-medium"
            >
              Demo: arjuna@kathayatra.org
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('cleopatra@kathayatra.org');
                setPassword('explorer123');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-cyan-300 font-medium"
            >
              Demo: cleopatra@kathayatra.org
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an explorer account yet?{' '}
          <Link to="/auth/register" className="text-amber-400 font-semibold hover:underline">
            Register Here (+50 Welcome XP)
          </Link>
        </p>
      </div>
    </div>
  );
};
