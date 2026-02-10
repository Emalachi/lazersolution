
import React, { useState } from 'react';
import { auth } from '../services/firebase.ts';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Access Denied: Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-indigo-600 p-4 rounded-3xl text-white mb-6 shadow-xl shadow-indigo-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin CRM Login</h1>
          <p className="text-slate-500 mt-2">Authorized personnel only.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (<div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-100 text-center font-medium">{error}</div>)}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 px-5 py-3.5 rounded-xl border border-slate-200 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Access Key</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 px-5 py-3.5 rounded-xl border border-slate-200 outline-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-8 text-center text-xs text-slate-400">Secure Cloud Authentication Active</div>
        </div>
        <div className="mt-8 text-center"><button onClick={() => window.location.hash = ''} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">← Return to Public Site</button></div>
      </div>
    </div>
  );
};

export default Login;
