
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
    if (config.headerCode && config.headerCode !== '<!-- Custom Header Scripts -->') {
      const range = document.createRange();
      const fragment = range.createContextualFragment(config.headerCode);
      document.head.appendChild(fragment);
    }

    // Inject custom footer code
    if (config.footerCode && config.footerCode !== '<!-- Custom Footer Scripts -->') {
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
      
      if (formConfig.redirectAfterSuccess && formConfig.successUrl) {
        window.location.href = formConfig.successUrl;
      } else {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
              {formConfig.successTitle.replace('[Name]', formData.fullName.split(' ')[0])}
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-xl mx-auto leading-relaxed font-medium">
              {formConfig.successSubtitle}
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setSubmitted(false)}
                className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
              >
                {formConfig.successCtaText}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const { fields } = formConfig;

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
            <a href="#portfolio" className="hover:text-indigo-600 transition-colors">Portfolio</a>
            <a href="#form" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-md">
              Start Project
            </a>
          </nav>
        </div>
      </header>

      <section className="pt-24 pb-20 px-8 bg-slate-50 relative overflow-hidden">
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

      {/* PORTFOLIO SECTION */}
      {formConfig.portfolio && formConfig.portfolio.length > 0 && (
        <section id="portfolio" className="py-20 bg-white border-y border-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4 block">Our Track Record</span>
              <h2 className="text-3xl font-extrabold text-slate-900">Projects We've Successfully Powered</h2>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
              {formConfig.portfolio.map((project) => (
                <div key={project.id} className="flex flex-col items-center group">
                  <div className="h-16 w-32 flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                    <img src={project.imageUrl} alt={project.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">{project.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <main id="form" className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 uppercase tracking-tight">{formConfig.formTitle}</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">{formConfig.formSubtitle}</p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {fields.fullName.isVisible && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{fields.fullName.label} {fields.fullName.isRequired && '*'}</label>
                  <input required={fields.fullName.isRequired} type="text" name="fullName" placeholder={fields.fullName.placeholder} value={formData.fullName} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" />
                </div>
              )}
              {fields.companyName.isVisible && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{fields.companyName.label} {fields.companyName.isRequired && '*'}</label>
                  <input required={fields.companyName.isRequired} type="text" name="companyName" placeholder={fields.companyName.placeholder} value={formData.companyName} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" />
                </div>
              )}
              {fields.email.isVisible && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{fields.email.label} {fields.email.isRequired && '*'}</label>
                  <input required={fields.email.isRequired} type="email" name="email" placeholder={fields.email.placeholder} value={formData.email} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" />
                </div>
              )}
              {fields.phone.isVisible && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{fields.phone.label} {fields.phone.isRequired && '*'}</label>
                  <input required={fields.phone.isRequired} type="tel" name="phone" placeholder={fields.phone.placeholder} value={formData.phone} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fields.projectType.isVisible && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{fields.projectType.label} {fields.projectType.isRequired && '*'}</label>
                  <select required={fields.projectType.isRequired} name="projectType" value={formData.projectType} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white">
                    {PROJECT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              )}
              {fields.budget.isVisible && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{fields.budget.label} {fields.budget.isRequired && '*'}</label>
                  <select required={fields.budget.isRequired} name="budget" value={formData.budget} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white">
                    {BUDGET_RANGES.map(range => <option key={range} value={range}>{range}</option>)}
                  </select>
                </div>
              )}
              {fields.timeline.isVisible && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{fields.timeline.label} {fields.timeline.isRequired && '*'}</label>
                  <select required={fields.timeline.isRequired} name="timeline" value={formData.timeline} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white">
                    {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              )}
            </div>

            {fields.source.isVisible && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{fields.source.label} {fields.source.isRequired && '*'}</label>
                <input required={fields.source.isRequired} type="text" name="source" placeholder={fields.source.placeholder} value={formData.source} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" />
              </div>
            )}

            {fields.description.isVisible && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{fields.description.label} {fields.description.isRequired && '*'}</label>
                <textarea required={fields.description.isRequired} name="description" value={formData.description} onChange={handleChange} rows={5} placeholder={fields.description.placeholder} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all resize-none"></textarea>
              </div>
            )}

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
