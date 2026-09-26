import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Coins, Sparkles, Volume2, VolumeX, User as UserIcon, LogOut, BookOpen, Compass, Gamepad2, ShoppingBag } from 'lucide-react';
import { AVATARS } from '@shared/schema';

export const Navbar: React.FC = () => {
  const { user, logout, soundEnabled, toggleSound, floatingPoints } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeAvatar = AVATARS.find(a => a.id === user?.avatar_url) || AVATARS[0];

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Sparkles },
    { name: 'Civilizations', path: '/explore', icon: Compass },
    { name: 'Mini-Games', path: '/games', icon: Gamepad2 },
    { name: 'Story Library', path: '/stories', icon: BookOpen },
    { name: 'STEM & Space', path: '/store', icon: ShoppingBag }
  ];

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-2xl">🧭</span>
            </div>
            <div>
              <div className="font-serif font-bold text-xl tracking-wider gold-gradient-text flex items-center gap-1.5">
                Katha Yatra
              </div>
              <p className="text-[10px] text-amber-300/70 font-medium tracking-wide -mt-0.5 hidden sm:block">
                Cultural & Space Learning
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-inner'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-slate-700 transition"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {user ? (
              <>
                {/* Daily Streak Flame */}
                <div
                  title={`Current Streak: ${user.current_streak} days active!`}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 text-orange-400 font-semibold text-xs sm:text-sm shadow-sm"
                >
                  <Flame className="w-4 h-4 text-orange-500 animate-pulse fill-orange-500/30" />
                  <span>{user.current_streak} <span className="hidden sm:inline">Days</span></span>
                </div>

                {/* Points Pill with Floating Points animation */}
                <div className="relative">
                  <div
                    title="Your Katha Reward Points"
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-yellow-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm shadow-inner"
                  >
                    <Coins className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                    <span>{user.points.toLocaleString()} <span className="text-amber-400/80 text-[10px]">XP</span></span>
                  </div>

                  {/* Floating +XP effect */}
                  {floatingPoints.map((fp) => (
                    <div
                      key={fp.id}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 text-amber-300 font-extrabold text-sm pointer-events-none animate-bounce"
                    >
                      +{fp.amount} XP!
                    </div>
                  ))}
                </div>

                {/* User Avatar & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-full bg-slate-800/80 border border-slate-700 hover:border-amber-500/50 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-lg">
                      {activeAvatar.icon}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2.5 border-b border-slate-800">
                        <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                        <p className="text-xs text-amber-400/90 truncate">{user.preferred_domain}</p>
                        <p className="text-[11px] text-slate-400">Age: {user.age_group} yrs</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>My Profile & Badges</span>
                      </Link>
                      <Link
                        to="/stories"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/70 hover:text-white"
                      >
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span>Unlocked Stories</span>
                      </Link>
                      <div className="border-t border-slate-800 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-md shadow-orange-500/20 transition transform active:scale-95"
                >
                  Start Journey
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
