
import React, { useState } from 'react';
import { addLead } from '../services/leadService.ts';
import { PROJECT_TYPES, BUDGET_RANGES, TIMELINES } from '../constants.tsx';
import { ProjectType, BudgetRange, Timeline } from '../types.ts';

const PublicIntake: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
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
    }, 1500);
  };

  const services = [
    { title: 'Logistics & Delivery', desc: 'Custom haulage management and automated dispatch systems.' },
    { title: 'Inventory & WMS', desc: 'Real-time stock tracking and warehouse management logic.' },
    { title: 'E-commerce CRM', desc: 'Tailored order pipelines and customer lifecycle management.' },
    { title: 'Shipment Tracking', desc: 'Secure portals for client tracking and shipment updates.' },
    { title: 'Trading & Marketplaces', desc: 'B2B and B2C platforms for local and global trade.' },
    { title: 'ERP Systems', desc: 'Integrated dashboards for end-to-end business operations.' },
    { title: 'Order Management', desc: 'Payment-on-delivery (POD) and unified OMS solutions.' },
    { title: 'Custom Dashboards', desc: 'Internal tools and automation to replace spreadsheets.' }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6 border border-green-100">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Project Request Received!</h1>
        <p className="text-slate-600 max-w-md mx-auto mb-10 text-lg">
          Thank you for reaching out to Lazer Solutions. Our sales team will review your requirements and contact you shortly.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          Submit Another Project
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
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
            <a href="#what-we-build" className="hover:text-indigo-600 transition-colors">What We Build</a>
            <a href="#desire" className="hover:text-indigo-600 transition-colors">Imagine</a>
            <a href="#form" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-md">
              Start Project
            </a>
          </nav>
        </div>
      </header>

      {/* Hero / Problem Section */}
      <section id="problem" className="pt-24 pb-20 px-8 bg-slate-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-8">
            Stop the Chaos, Start Scaling
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
            Your business is growing… <br/>
            <span className="text-indigo-600">but your operations are stuck.</span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {['Orders get lost', 'Inventory mismatch', 'Deliveries untracked', 'Forgotten follow-ups'].map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-slate-600 font-medium text-sm flex items-center space-x-3">
                <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            Scaling feels chaotic instead of profitable when you're stuck on spreadsheets and manual tracking. 
            At <strong>Lazer Solutions Limited</strong>, we design and build custom software that turns messy operations into structured, automated systems.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#form" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-xl shadow-indigo-100 text-lg">
              Submit Your Brief
            </a>
            <a href="#what-we-build" className="bg-white border border-slate-200 text-slate-700 font-bold py-4 px-10 rounded-xl transition-all hover:bg-slate-50 text-lg">
              What We Build
            </a>
          </div>
        </div>
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px] -mr-64 -mt-32"></div>
      </section>

      {/* Interest Section */}
      <section id="what-we-build" className="py-24 px-8 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">We Build What Your Business Actually Needs</h2>
            <p className="text-slate-500 max-w-3xl mx-auto">
              We don’t force your business to adapt to software — we build software that adapts to your business. 
              Our solutions are engineered to match how African businesses actually operate.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group">
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600 mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desire Section */}
      <section id="desire" className="py-24 px-8 bg-indigo-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 leading-tight">Imagine Running Your <br/>Business With <span className="text-indigo-200">Total Clarity.</span></h2>
              <div className="space-y-6">
                {[
                  'Real-time visibility into orders, inventory, and deliveries',
                  'A single dashboard showing exactly what’s working',
                  'Automated follow-ups instead of forgotten leads',
                  'Clear accountability across sales and logistics',
                  'Systems that grow with you, not against you'
                ].map((text, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-white/20 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                    </div>
                    <p className="text-lg font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-2xl text-slate-900">
              <blockquote className="text-2xl italic font-semibold mb-6 leading-relaxed text-indigo-600">
                "We don't just get software — we get a custom-built operational engine that saves time, reduces losses, and increases revenue."
              </blockquote>
              <div className="flex items-center space-x-4 border-t border-slate-100 pt-6">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">LSL</div>
                <div>
                  <div className="font-bold">Operational Engine</div>
                  <div className="text-slate-500 text-sm">By Lazer Solutions Limited</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form / Action Section */}
      <main id="form" className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Ready to build a system that <br/>actually works for your business?</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            👉 Submit your project details today. Tell us what you need, and our team will review it, call you, and guide you from idea to execution.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <input
                  required
                  type="text"
                  name="fullName"
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Company (Optional)</label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Your organization name"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Phone (WhatsApp Preferred)</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="+234..."
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Project Type</label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none bg-white transition-all"
                >
                  {PROJECT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Budget Range</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none bg-white transition-all"
                >
                  {BUDGET_RANGES.map(range => <option key={range} value={range}>{range}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Expected Timeline</label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none bg-white transition-all"
                >
                  {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Tell Us About Your Challenges</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us about your current workflow and what you want to achieve..."
                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-xl text-lg font-bold transition-all transform hover:scale-[1.01] active:scale-[0.99] ${
                loading ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'
              }`}
            >
              {loading ? 'Submitting...' : 'Initiate My Project Engine'}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-16 px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <div className="flex items-center space-x-3 text-slate-900 mb-4">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight uppercase">Lazer Solutions</span>
            </div>
            <p className="text-slate-500 text-sm">We don’t force your business to adapt to software — we build software that adapts to your business.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <button 
              onClick={() => window.location.hash = 'admin'}
              className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
            >
              Staff Portal Access
            </button>
            <div className="flex space-x-6 text-sm font-bold text-slate-600">
              <a href="#" className="hover:text-indigo-600 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">WhatsApp</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-50 text-center text-slate-400 text-xs">
          © 2024 Lazer Solutions Limited. All rights reserved. Lagos, Nigeria.
        </div>
      </footer>
    </div>
  );
};

export default PublicIntake;
