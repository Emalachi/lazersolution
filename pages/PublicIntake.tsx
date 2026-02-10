
import React, { useState, useEffect } from 'react';
import { addLead } from '../services/leadService.ts';
import { getFormConfig } from '../services/configService.ts';
import { logVisit } from '../services/analyticsService.ts';
import { PROJECT_TYPES, BUDGET_RANGES, TIMELINES } from '../constants.tsx';
import { ProjectType, BudgetRange, Timeline, FormConfig } from '../types.ts';

const PublicIntake: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
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
    if (!html || html.trim() === '' || html.startsWith('<!--')) return;
    const target = isHeader ? document.head : document.body;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    Array.from(tempDiv.childNodes).forEach((node) => {
      if (node.nodeName === 'SCRIPT') {
        const scriptNode = node as HTMLScriptElement;
        const newScript = document.createElement('script');
        Array.from(scriptNode.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(scriptNode.innerHTML));
        target.appendChild(newScript);
      } else {
        target.appendChild(node.cloneNode(true));
      }
    });
  };

  useEffect(() => {
    const initialize = async () => {
      const config = await getFormConfig();
      setFormConfig(config);
      logVisit(window.location.pathname + window.location.hash);
      injectCode(config.headerCode, true);
      injectCode(config.footerCode, false);
    };
    initialize();
  }, []);

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
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
              {formConfig.successTitle.replace('[Name]', formData.fullName.split(' ')[0])}
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-xl mx-auto leading-relaxed font-medium">{formConfig.successSubtitle}</p>
            <button onClick={() => setSubmitted(false)} className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
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

      {/* PROBLEM SECTION (PAS Framework) */}
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

          <div className="mt-16 pt-16 border-t border-white/10">
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto italic">
              "Growth becomes chaotic, stressful, and expensive. If your business feels busy but inefficient, the problem isn’t effort — it’s the lack of smart systems and automation."
            </p>
          </div>
        </div>
      </section>

      {/* SOLUTION / INTEREST SECTION */}
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
            <p className="text-lg text-slate-600 leading-relaxed">
              Our systems automate repetitive tasks, connect departments, and give you real-time visibility across your entire operations from one central hub.
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
             <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 -mt-8">
                <div className="text-3xl font-black text-slate-900 mb-2">Scale</div>
                <p className="text-slate-500 text-sm">Built to grow with your volume.</p>
             </div>
             <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
                <div className="text-3xl font-black text-indigo-600 mb-2">Visibility</div>
                <p className="text-indigo-500 text-sm">Real-time data insights.</p>
             </div>
          </div>
        </div>
      </section>

      {/* WHAT WE BUILD SECTION */}
      <section id="services" className="py-24 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">What We Build</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Every solution is tailored to your workflow and built to scale as your business grows.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Logistics", desc: "Delivery management software for fleet operations.", icon: "🚚" },
              { title: "Inventory", desc: "Warehouse management (WMS) systems.", icon: "📦" },
              { title: "Custom CRM", desc: "E-commerce and client relationship management.", icon: "💎" },
              { title: "Tracking", desc: "Real-time shipment tracking websites.", icon: "📍" },
              { title: "Marketplaces", desc: "Trading platforms and online marketplaces.", icon: "🌐" },
              { title: "ERP", desc: "Enterprise Resource Planning for SMEs.", icon: "⚙️" },
              { title: "OMS", desc: "Order management and payment-on-delivery platforms.", icon: "💳" },
              { title: "Automation", desc: "Custom tools and internal workflow engines.", icon: "⚡" },
              { title: "BI Systems", desc: "Internal dashboards and business intelligence.", icon: "📊" }
            ].map((service, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft hover:shadow-xl hover:border-indigo-100 transition-all group">
                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">{service.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESIRE SECTION - THE TRANSFORMATION */}
      <section id="imagine" className="py-24 px-8 bg-indigo-600 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight">
              Imagine a business where...
            </h2>
            <div className="space-y-6">
              {[
                "Orders automatically move through workflows",
                "Inventory updates itself across all channels",
                "Leads are followed up automatically",
                "Sales and operations teams work from one dashboard",
                "Reports are generated instantly",
                "Manual errors are drastically reduced"
              ].map((text, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center border border-indigo-400">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-lg md:text-xl font-medium text-indigo-50">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-16 border border-white/20">
             <p className="text-xl md:text-2xl font-bold mb-8 leading-relaxed">
               "Our clients don’t just get software — they get connected systems that think, respond, and scale with their business."
             </p>
             <div className="flex items-center space-x-4">
                <div className="h-0.5 w-12 bg-indigo-300"></div>
                <span className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Lazer Solutions Limited</span>
             </div>
          </div>
        </div>
      </section>

      {/* TRUSTED / INDUSTRIES SECTION */}
      <section className="py-24 px-8 bg-white border-b border-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 block">Trusted by Growing Businesses</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Industries We’ve Powered</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
             {[
               "Logistics & Dispatch", "E-commerce Brands", "Health & Diagnostic", "Trading & Distribution", "Digital Agencies"
             ].map((industry, i) => (
               <div key={i} className="px-8 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 font-bold hover:bg-white hover:border-indigo-600 hover:text-indigo-600 transition-all cursor-default">
                 {industry}
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24">
            {[
              { quote: "The automation Lazer Solutions built for us eliminated manual follow-ups and improved our delivery turnaround time.", author: "Operations Manager, Logistics Company" },
              { quote: "Our CRM now handles tasks automatically. Sales no longer chase data — the system does the work.", author: "Founder, E-commerce Brand" },
              { quote: "Their custom automation tools helped us scale without increasing staff.", author: "CEO, Service-Based Company" },
              { quote: "This feels like enterprise-level software built specifically for our business.", author: "Head of Operations, Trading Company" }
            ].map((testimonial, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 relative group">
                <div className="text-4xl text-indigo-200 absolute top-8 left-8 opacity-50">“</div>
                <p className="text-lg text-slate-700 font-medium mb-8 leading-relaxed relative z-10 italic">
                  {testimonial.quote}
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-8 bg-indigo-600"></div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{testimonial.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM SECTION (THE ACTION) */}
      <main id="form" className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl shadow-indigo-200">
               👉
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Ready to modernize?</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {formConfig.formSubtitle}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full shadow-lg">
            Project Intake Form
          </div>
          
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
              {loading ? 'Submitting...' : "Initiate My Project Engine"}
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-slate-900 py-16 px-8 text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="text-xl font-bold tracking-tight">Lazer Solutions</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">Custom software. Smart automation. Built around your business.</p>
          </div>
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
             <div className="text-slate-400 text-sm mb-2 font-bold uppercase tracking-widest">Connect With Us</div>
             <a href="mailto:contact@lazersolutions.com" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">contact@lazersolutions.com</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Lazer Solutions Limited. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicIntake;
