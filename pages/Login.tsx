
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@lazer.com' && password === 'admin123') {
      onLogin();
    } else {
      setError('Access Denied: Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-indigo-600 p-4 rounded-3xl text-white mb-6 shadow-xl shadow-indigo-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin CRM Login</h1>
          <p className="text-slate-500 mt-2">Authorized personnel only.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-100 text-center font-medium">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lazer.com"
                className="w-full bg-slate-50 px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Access Key</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-lg shadow-indigo-100"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Default Credentials</p>
              <div className="text-sm text-slate-600 space-y-1.5">
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-semibold text-slate-900">admin@lazer.com</span>
                </div>
                <div className="flex justify-between">
                  <span>Pass:</span>
                  <span className="font-semibold text-slate-900">admin123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.hash = ''}
            className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            ← Return to Public Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
