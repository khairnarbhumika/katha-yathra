import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CULTURAL_DOMAINS, AVATARS, AGE_GROUPS } from '@shared/schema';
import { Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageGroup, setAgeGroup] = useState<typeof AGE_GROUPS[number]>('10-13');
  const [preferredDomain, setPreferredDomain] = useState<string>(CULTURAL_DOMAINS[0].name);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register({
        username,
        email,
        password,
        ageGroup,
        preferredDomain,
        avatarUrl: selectedAvatar
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="rounded-3xl glass-card border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/25 mx-auto mb-3">
            🧭
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Begin Your Expedition
          </h1>
          <p className="text-xs sm:text-sm text-amber-300/90 mt-1">
            Create your Katha Yatra explorer account and receive +50 Welcome XP!
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              1. Choose Explorer Avatar
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {AVATARS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.id;
                return (
                  <button
                    type="button"
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40 scale-105'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-3xl mb-1">{avatar.icon}</span>
                    <span className="text-[10px] font-semibold text-slate-300 truncate w-full">{avatar.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Explorer Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. AstroArjuna"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

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
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password (at least 6 characters)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              2. Select Age Group
            </label>
            <div className="grid grid-cols-3 gap-3">
              {AGE_GROUPS.map((age) => (
                <button
                  type="button"
                  key={age}
                  onClick={() => setAgeGroup(age)}
                  className={`py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                    ageGroup === age
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {age} Years
                </button>
              ))}
            </div>
          </div>

          {/* Primary Cultural Domain */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              3. Primary Civilizational Interest
            </label>
            <select
              value={preferredDomain}
              onChange={(e) => setPreferredDomain(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500 text-sm"
            >
              {CULTURAL_DOMAINS.map((dom) => (
                <option key={dom.id} value={dom.name}>
                  {dom.name}
                </option>
              ))}
            </select>
          </div>

          {/* Kid Safety Note */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Parental Advisory: Zero ads, non-sectarian objective cultural lore.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 transition transform active:scale-98 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{isLoading ? 'Creating Explorer Account...' : 'Register & Claim +50 XP'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an explorer account?{' '}
          <Link to="/auth/login" className="text-amber-400 font-semibold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
