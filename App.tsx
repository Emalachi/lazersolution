
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import PublicIntake from './pages/PublicIntake.tsx';
import Login from './pages/Login.tsx';

type AppMode = 'public' | 'admin' | 'success';
type AdminView = 'dashboard' | 'leads' | 'settings' | 'analytics';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [activeAdminView, setActiveAdminView] = useState<AdminView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#admin')) {
        setMode('admin');
      } else if (hash.startsWith('#success')) {
        setMode('success');
      } else {
        setMode('public');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Handle Success View (The Thank You Page)
  if (mode === 'success') {
    return <PublicIntake forceSuccessView={true} />;
  }

  if (mode === 'public') {
    return <PublicIntake />;
  }

  if (!isAdminAuthenticated) {
    return <Login onLogin={() => setIsAdminAuthenticated(true)} />;
  }

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900 pb-20 lg:pb-0">
      <Sidebar 
        activeView={activeAdminView} 
        onNavigate={setActiveAdminView} 
        onLogout={() => setIsAdminAuthenticated(false)} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 lg:ml-64 min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 tracking-tight lg:hidden">Lazer CRM</span>
            <div className="text-sm font-semibold text-slate-400 hidden lg:block">
              Sales Dashboard / <span className="text-slate-900 capitalize">{activeAdminView}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <div className="flex items-center space-x-3 pr-4 border-r border-slate-100">
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                 AD
               </div>
               <span className="text-xs font-bold text-slate-700 hidden sm:block">Admin Account</span>
             </div>
             <button 
               onClick={() => { window.location.hash = ''; }}
               className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest px-2"
             >
               Exit
             </button>
          </div>
        </header>
        
        <div className="max-w-7xl mx-auto">
          <AdminDashboard viewMode={activeAdminView} />
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-50 px-2 shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)]">
        {[
          { id: 'dashboard', label: 'Home', icon: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
          { id: 'analytics', label: 'Insights', icon: <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
          { id: 'leads', label: 'Leads', icon: <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
          { id: 'settings', label: 'Build', icon: <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /> }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveAdminView(item.id as AdminView)}
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${activeAdminView === item.id ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {item.icon}
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
