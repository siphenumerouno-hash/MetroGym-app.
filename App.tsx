
import React, { useState, useEffect } from 'react';
import { ICONS, COLORS } from './constants';
import Dashboard from './pages/Dashboard';
import SessionFlow from './pages/SessionFlow';
import BuildSession from './pages/BuildSession';
import Community from './pages/Community';
import Profile from './pages/Profile';
import { GymSession } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [activeSession, setActiveSession] = useState<GymSession | null>(null);

  // Background mock persistence (Simulation)
  const [sessions, setSessions] = useState<GymSession[]>([]);

  const handleFinishSession = (session: GymSession) => {
    setSessions(prev => [session, ...prev]);
    setActiveSession(null);
    setActiveTab('home');
  };

  const renderContent = () => {
    if (activeSession) {
      return <SessionFlow session={activeSession} onFinish={handleFinishSession} onCancel={() => setActiveSession(null)} />;
    }

    switch (activeTab) {
      case 'home': return <Dashboard sessions={sessions} />;
      case 'session': return <SessionFlow onStart={(s) => setActiveSession(s)} />;
      case 'build': return <BuildSession />;
      case 'community': return <Community sessions={sessions} />;
      case 'profile': return <Profile sessions={sessions} />;
      default: return <Dashboard sessions={sessions} />;
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
      <div className="w-full max-w-md bg-[#050505] flex flex-col relative overflow-hidden border-x border-neutral-900">
        
        {/* Branding Header - Only visible when not in active session */}
        {!activeSession && (
          <header className="px-6 pt-10 pb-4 text-center">
            <h1 className="text-4xl font-athletic font-black text-yellow-400 tracking-tighter uppercase leading-none">
              METROGYM
            </h1>
            <p className="text-sm font-semibold text-white/60 tracking-[0.3em] uppercase mt-1">
              GYM Journal
            </p>
            <p className="text-[10px] font-medium text-yellow-400/50 uppercase italic mt-1">
              Flexible Your Discipline
            </p>
          </header>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto px-4 pb-32 ${activeSession ? 'pt-0' : 'pt-4'}`}>
          {renderContent()}
        </main>

        {/* Bottom Navigation */}
        {!activeSession && (
          <nav className="fixed bottom-0 w-full max-w-md bg-black/80 backdrop-blur-xl border-t border-neutral-800 flex justify-around items-center py-4 px-2 z-50">
            <NavButton 
              active={activeTab === 'home'} 
              onClick={() => setActiveTab('home')} 
              icon={<ICONS.Home className="w-6 h-6" />} 
              label="Home" 
            />
            <NavButton 
              active={activeTab === 'session'} 
              onClick={() => setActiveTab('session')} 
              icon={<ICONS.Play className="w-6 h-6" />} 
              label="Start" 
            />
            <NavButton 
              active={activeTab === 'build'} 
              onClick={() => setActiveTab('build')} 
              icon={<ICONS.Plus className="w-6 h-6" />} 
              label="Build" 
            />
            <NavButton 
              active={activeTab === 'community'} 
              onClick={() => setActiveTab('community')} 
              icon={<ICONS.Users className="w-6 h-6" />} 
              label="Social" 
            />
            <NavButton 
              active={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')} 
              icon={<ICONS.User className="w-6 h-6" />} 
              label="Profile" 
            />
          </nav>
        )}
      </div>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${
      active ? 'text-yellow-400 scale-110' : 'text-neutral-500 hover:text-white'
    }`}
  >
    <div className={active ? 'yellow-glow-text' : ''}>
      {icon}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
