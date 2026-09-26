import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginInput, RegisterInput } from '@shared/schema';
import { api } from '../lib/api';
import { sounds } from '../components/AudioEffects';

interface AuthContextType {
  user: User | null;
  stats: {
    unlockedStoriesCount: number;
    purchasedVideosCount: number;
    totalLevelsCompleted: number;
  };
  isLoading: boolean;
  login: (input: LoginInput) => Promise<{ streakBonusAwarded?: boolean }>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { avatarUrl?: string; preferredDomain?: string; ageGroup?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
  awardPointsLocal: (amount: number) => void;
  floatingPoints: { id: number; amount: number }[];
  soundEnabled: boolean;
  toggleSound: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    unlockedStoriesCount: 0,
    purchasedVideosCount: 0,
    totalLevelsCompleted: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; amount: number }[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
  };

  const refreshUser = async () => {
    try {
      const data = await api.getMe();
      setUser(data.user);
      setStats(data.stats);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const triggerPointsFloat = (amount: number) => {
    const id = Date.now();
    setFloatingPoints(prev => [...prev, { id, amount }]);
    sounds.playCoin();
    setTimeout(() => {
      setFloatingPoints(prev => prev.filter(p => p.id !== id));
    }, 2000);
  };

  const awardPointsLocal = (amount: number) => {
    if (user) {
      setUser(prev => prev ? { ...prev, points: prev.points + amount } : null);
      triggerPointsFloat(amount);
    }
  };

  const login = async (input: LoginInput) => {
    const res = await api.login(input);
    localStorage.setItem('katha_token', res.token);
    setUser(res.user);
    if (res.streakBonusAwarded) {
      sounds.playVictory();
    } else {
      sounds.playCoin();
    }
    await refreshUser();
    return { streakBonusAwarded: res.streakBonusAwarded };
  };

  const register = async (input: RegisterInput) => {
    const res = await api.register(input);
    localStorage.setItem('katha_token', res.token);
    setUser(res.user);
    sounds.playVictory();
    await refreshUser();
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      localStorage.removeItem('katha_token');
      setUser(null);
    }
  };

  const updateProfile = async (data: { avatarUrl?: string; preferredDomain?: string; ageGroup?: string }) => {
    const res = await api.updateProfile(data);
    setUser(res.user);
    sounds.playCorrect();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        stats,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
        awardPointsLocal,
        floatingPoints,
        soundEnabled,
        toggleSound
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
