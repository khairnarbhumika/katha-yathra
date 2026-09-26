import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { Explore } from './pages/Explore';
import { GamesPortal } from './pages/GamesPortal';
import { GamePlayPage } from './pages/GamePlayPage';
import { StoryView } from './pages/StoryView';
import { ScienceStore } from './pages/ScienceStore';
import { ProfilePage } from './pages/ProfilePage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-amber-300 font-medium tracking-wide">Loading Katha Expedition...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/explore" element={<Explore />} />

          {/* Authenticated Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <GamesPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/:gameId/play"
            element={
              <ProtectedRoute>
                <GamePlayPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stories"
            element={
              <ProtectedRoute>
                <StoryView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stories/:storyId"
            element={
              <ProtectedRoute>
                <StoryView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <ScienceStore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
