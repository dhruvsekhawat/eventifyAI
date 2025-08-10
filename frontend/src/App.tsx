import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { AuthCard } from './components/AuthCard';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Vendors } from './pages/Vendors';
import { Guests } from './pages/Guests';
import { Payments } from './pages/Payments';
import { Settings } from './pages/Settings';
import { Onboarding } from './pages/Onboarding';
import { LandingPage } from './components/LandingPage';

function AppContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      // Check if this is a new user
      if (session?.user && _event === 'SIGNED_IN') {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        // If no profile exists or no events, they're a new user
        if (!profile || profile.created_at === profile.updated_at) {
          setIsNewUser(true);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    setShowAuth(false);
  };

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  const handleOnboardingComplete = () => {
    setIsNewUser(false);
    // Navigate to dashboard after onboarding is complete
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show auth card if user wants to authenticate
  if (showAuth && !user) {
    return <AuthCard onAuthSuccess={handleAuthSuccess} />;
  }

  // Show onboarding for new users
  if (user && isNewUser) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  // Show dashboard if user is authenticated and not new
  if (user) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/vendors"
          element={
            <Layout>
              <Vendors />
            </Layout>
          }
        />
        <Route
          path="/guests"
          element={
            <Layout>
              <Guests />
            </Layout>
          }
        />
        <Route
          path="/payments"
          element={
            <Layout>
              <Payments />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }

  // Show landing page if not authenticated
  return <LandingPage onGetStarted={handleGetStarted} />;
}

export function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}