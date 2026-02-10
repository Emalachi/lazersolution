
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AdminDashboard from './pages/AdminDashboard';
import PublicIntake from './pages/PublicIntake';
import Login from './pages/Login';

type AppMode = 'public' | 'admin';
type AdminView = 'dashboard' | 'leads';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [activeAdminView, setActiveAdminView] = useState<AdminView>('dashboard');

  // Simple routing based on URL hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#admin')) {
        setMode('admin');
      } else {
        setMode('public');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (mode === 'public') {
    return <PublicIntake />;
  }

  if (!isAdminAuthenticated) {
    return <Login onLogin={() => setIsAdminAuthenticated(true)} />;
  }

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900">
      <Sidebar 
        activeView={activeAdminView} 
        onNavigate={setActiveAdminView} 
        onLogout={() => setIsAdminAuthenticated(false)} 
      />
      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="text-sm font-semibold text-slate-400">
            Internal CRM / <span className="text-slate-900 capitalize">{activeAdminView}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-xl hover:bg-slate-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-100">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                AD
              </div>
              <span className="text-sm font-bold text-slate-700 hidden sm:block">Admin</span>
            </div>
          </div>
        </header>
        
        <div className="max-w-7xl mx-auto">
          <AdminDashboard viewMode={activeAdminView} />
        </div>
      </main>
      
      {/* Demo Switcher Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => {
            const newMode = mode === 'public' ? 'admin' : 'public';
            window.location.hash = newMode === 'admin' ? 'admin' : '';
          }}
          className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-sm hover:bg-indigo-600 transition-all flex items-center space-x-3 group"
        >
          <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>Switch to {mode === 'public' ? 'Admin Portal' : 'Public Site'}</span>
        </button>
      </div>
    </div>
  );
};

export default App;
