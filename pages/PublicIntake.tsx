
import React, { useState, useEffect } from 'react';
import { addLead } from '../services/leadService.ts';
import { getFormConfig } from '../services/configService.ts';
import { logVisit } from '../services/analyticsService.ts';
import { PROJECT_TYPES, BUDGET_RANGES, TIMELINES } from '../constants.tsx';
import { ProjectType, BudgetRange, Timeline, FormConfig } from '../types.ts';

interface PublicIntakeProps {
  forceSuccessView?: boolean;
}

const PublicIntake: React.FC<PublicIntakeProps> = ({ forceSuccessView = false }) => {
  const [submitted, setSubmitted] = useState(forceSuccessView);
  const [loading, setLoading] = useState(false);
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
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

  const injectCode = (html: string, isHeader: boolean) => {
    if (!html || html.trim() === '') return;
    
    const trimmed = html.trim();
    if (trimmed === '<!-- Custom Header Scripts -->' || trimmed === '<!-- Custom Footer Scripts -->') return;

    console.log(`[Lazer CRM] Injecting ${isHeader ? 'Header' : 'Footer'} Custom Code...`);

    const target = isHeader ? document.head : document.body;
    
    try {
      // Create a fragment from the HTML string
      const fragment = document.createRange().createContextualFragment(html);
      
      // Scripts require manual re-creation to force execution when injected dynamically
      const scripts = fragment.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        
        // Copy attributes
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        newScript.setAttribute('data-lazer-injected', 'true');
        
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        
        // Replace in fragment so order is preserved when fragment is appended
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });

      // Mark non-script elements too
      fragment.querySelectorAll('*').forEach(el => {
        if (!el.hasAttribute('data-lazer-injected')) {
          el.setAttribute('data-lazer-injected', 'true');
        }
      });

      target.appendChild(fragment);
      console.log(`[Lazer CRM] ${isHeader ? 'Header' : 'Footer'} injection complete.`);
    } catch (err) {
      console.error("[Lazer CRM] Failed to inject custom code:", err);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const config = await getFormConfig();
      setFormConfig(config);
      logVisit(window.location.pathname + window.location.hash);
      
      // Inject user-defined code (Pixels, GTM, etc.)
      if (config.headerCode) injectCode(config.headerCode, true);
      if (config.footerCode) injectCode(config.footerCode, false);
    };
    initialize();
  }, []);

  useEffect(() => {
    setSubmitted(forceSuccessView);
  }, [forceSuccessView]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addLead(formData);
      setLoading(false);
      if (formConfig?.redirectAfterSuccess && formConfig.successUrl) {
        window.location.href = formConfig.successUrl;
      } else {
        window.location.hash = 'success';
      }
    } catch (err) {
      setLoading(false);
      alert('Error submitting form. Please try again.');
    }
  };

  if (!formConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              {formConfig.successTitle.replace('[Name]', formData.fullName ? formData.fullName.split(' ')[0] : 'Partner')}
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-xl mx-auto leading-relaxed font-medium">{formConfig.successSubtitle}</p>
            <button onClick={() => window.location.hash = ''} className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
              {formConfig.successCtaText}
            </button>
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Lazer Solutions</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#services" className="hover:text-indigo-600 transition-colors">What We Build</a>
            <a href="#ecommerce" className="hover:text-indigo-600 transition-colors">E-commerce CRM</a>
            <a href="#imagine" className="hover:text-indigo-600 transition-colors">Our Vision</a>
            <a href="#form" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-md">Get Started</a>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-24 pb-20 px-8 bg-slate-50 relative overflow-hidden border-b border-slate-100">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest">
            Custom Software & Automation
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
            Scaling your business? <br/><span className="text-indigo-600">We build the engine.</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            Custom software that adapts to your workflow, not the other way around. Modernize your operations with smart, automated systems.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#form" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-xl shadow-indigo-100 text-lg">Tell Us About Your Project</a>
            <a href="#problem" className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 font-bold py-4 px-10 rounded-xl hover:bg-slate-50 transition-all text-lg">Learn How We Help</a>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section id="problem" className="py-24 px-8 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight">
            Most businesses don’t fail because <br className="hidden md:block" />
            they lack customers.
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 mb-12 font-medium">
            They struggle because their processes are <span className="text-rose-400">slow, manual, and disconnected.</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
             {[
               { title: "Chaos", desc: "Orders are handled in different places." },
               { title: "Manual", desc: "Inventory is tracked manually." },
               { title: "Risk", desc: "Follow-ups depend on memory." },
               { title: "Waste", desc: "Reports take hours to prepare." }
             ].map((item, i) => (
               <div key={i} className="flex items-start space-x-4 p-5 rounded-2xl bg-white/5 border border-white/10">
                 <div className="text-rose-400 mt-1">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-100 text-sm mb-1">{item.title}</h4>
                   <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4 block">The Lazer Advantage</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
              We don’t just build applications. <br/> We build <span className="text-indigo-600">intelligent systems.</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Lazer Solutions Limited designs and develops custom software and automation solutions that help businesses operate faster, smarter, and more profitably.
            </p>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
             <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200">
                <div className="text-3xl font-black mb-2">Automate</div>
                <p className="text-indigo-100 text-sm">Eliminate repetitive manual entry.</p>
             </div>
             <div className="bg-slate-900 rounded-3xl p-8 text-white mt-8">
                <div className="text-3xl font-black mb-2">Connect</div>
                <p className="text-slate-400 text-sm">Every department on one sync.</p>
             </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <main id="form" className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Ready to modernize?</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Tell us about your project. Describe your business challenges, and our team will design a custom software and automation solution around them.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 relative">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {fields.fullName.isVisible && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{fields.fullName.label} {fields.fullName.isRequired && '*'}</label>
                  <input required={fields.fullName.isRequired} type="text" name="fullName" placeholder={fields.fullName.placeholder} value={formData.fullName} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" />
                </div>
              )}
              {fields.email.isVisible && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{fields.email.label} {fields.email.isRequired && '*'}</label>
                  <input required={fields.email.isRequired} type="email" name="email" placeholder={fields.email.placeholder} value={formData.email} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all" />
                </div>
              )}
            </div>
            <button type="submit" disabled={loading} className={`w-full py-5 rounded-xl text-lg font-bold transition-all ${loading ? 'bg-slate-300 text-slate-500' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'}`}>
              {loading ? 'Submitting...' : "Initiate My Project Engine"}
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-slate-900 py-16 px-8 text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Lazer Solutions Limited.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicIntake;
