import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import LoginGate from './components/LoginGate';
import LandingPage from './components/LandingPage';
import UploadGate from './components/UploadGate';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import ScenarioMatrix from './components/ScenarioMatrix';
import RecommendedConfig from './components/RecommendedConfig';
import GateAssessment from './components/GateAssessment';
import PhasedRoadmap from './components/PhasedRoadmap';
import RouteDemand from './components/RouteDemand';
import ResourceScaling from './components/ResourceScaling';
import StrategicCards from './components/StrategicCards';
import ScoreSimulator from './components/ScoreSimulator';
import Footer from './components/Footer';

// Five views: 'init' → 'login' → 'landing' → 'upload' → 'loading' → 'dashboard'
export default function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [view, setView] = useState('landing');

  // Restore session on mount and listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setView('landing');
  }

  // Wait for Supabase to restore session before rendering anything
  if (!authReady) return null;

  // Not authenticated — show login gate
  if (!session) {
    return <LoginGate onLogin={() => setView('landing')} />;
  }

  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('upload')} />;
  }

  if (view === 'upload') {
    return <UploadGate onSubmit={() => setView('loading')} />;
  }

  if (view === 'loading') {
    return <LoadingScreen onDone={() => setView('dashboard')} />;
  }

  return (
    <>
      <Header onHome={() => setView('landing')} onLogout={handleLogout} />
      <Hero />
      <StatsBar />
      <main>
        <div className="two-col">
          <ScenarioMatrix />
          <RecommendedConfig />
        </div>
        <GateAssessment />
        <PhasedRoadmap />
        <RouteDemand />
        <ResourceScaling />
        <StrategicCards />
        <ScoreSimulator />
      </main>
      <Footer />
    </>
  );
}
