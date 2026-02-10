
import React, { useState, useEffect } from 'react';
import { addLead } from '../services/leadService.ts';
import { getFormConfig } from '../services/configService.ts';
import { PROJECT_TYPES, BUDGET_RANGES, TIMELINES } from '../constants.tsx';
import { ProjectType, BudgetRange, Timeline, FormConfig } from '../types.ts';

const PublicIntake: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formConfig, setFormConfig] = useState<FormConfig>(getFormConfig());
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    projectType: 'Logistics Management' as ProjectType,
    description: '',
    budget: '₦300k–₦1m' as BudgetRange,
    timeline: 'ASAP' as Timeline,
    source: ''
  });

  useEffect(() => {
    const config = getFormConfig();
    setFormConfig(config);

    // Inject custom header code
    if (config.headerCode) {
      const range = document.createRange();
      const fragment = range.createContextualFragment(config.headerCode);
      document.head.appendChild(fragment);
    }

    // Inject custom footer code
    if (config.footerCode) {
      const range = document.createRange();
      const fragment = range.createContextualFragment(config.footerCode);
      document.body.appendChild(fragment);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      addLead(formData);
      setLoading(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100">
        <header className="bg-white border-b border-slate-100 py-6 px-8">
          <div className="max-w-7xl mx-auto flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Lazer Solutions</span>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center p-8">
          <div className="max-w-3xl w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 p-10 md:p-16 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-10 border border-indigo-100 relative">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
              <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20"></div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Thank You, <span className="text-indigo-600">{formData.fullName.split(' ')[0]}!</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-12 max-w-xl mx-auto leading-relaxed font-medium">
              Your project request has been successfully submitted. Our team will review your requirements and reach out shortly.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setSubmitted(false)}
                className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
              >
                Submit Another Project
              </button>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-10 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
              >
                Return to Home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Lazer Solutions</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#problem" className="hover:text-indigo-600 transition-colors">The Challenge</a>
            <a href="#form" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-md">
              Start Project
            </a>
          </nav>
        </div>
      </header>

      <section id="problem" className="pt-24 pb-20 px-8 bg-slate-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
            Scaling your business? <br/>
            <span className="text-indigo-600">We build the engine.</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            Custom software that adapts to your workflow, not the other way around.
          </p>
          <a href="#form" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-xl shadow-indigo-100 text-lg inline-block">
            Get Started
          </a>
        </div>
      </section>

      <main id="form" className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 uppercase tracking-tight">{formConfig.formTitle}</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">{formConfig.formSubtitle}</p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name *</label>
                <input required type="text" name="fullName" placeholder="Enter your name" value={formData.fullName} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" />
              </div>
              {formConfig.showCompanyName && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Company Name</label>
                  <input type="text" name="companyName" placeholder="Your organization" value={formData.companyName} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address *</label>
                <input required type="email" name="email" placeholder="email@example.com" value={formData.email} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Phone *</label>
                <input required type="tel" name="phone" placeholder="+234..." value={formData.phone} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {formConfig.showProjectType && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Type</label>
                  <select name="projectType" value={formData.projectType} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white">
                    {PROJECT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              )}
              {formConfig.showBudget && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Budget</label>
                  <select name="budget" value={formData.budget} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white">
                    {BUDGET_RANGES.map(range => <option key={range} value={range}>{range}</option>)}
                  </select>
                </div>
              )}
              {formConfig.showTimeline && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Timeline</label>
                  <select name="timeline" value={formData.timeline} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white">
                    {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Project Description *</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="Tell us about your requirements..." className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all resize-none"></textarea>
            </div>
            <button type="submit" disabled={loading} className={`w-full py-5 rounded-xl text-lg font-bold transition-all ${loading ? 'bg-slate-300 text-slate-500' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'}`}>
              {loading ? 'Submitting...' : formConfig.ctaText}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PublicIntake;
