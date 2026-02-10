import React, { useState, useMemo, useEffect } from 'react';
import { Lead, FormConfig } from '../types.ts';
import { getLeads } from '../services/leadService.ts';
import { getFormConfig, saveFormConfig } from '../services/configService.ts';
import LeadTable from '../components/LeadTable.tsx';
import LeadDetails from './LeadDetails.tsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminDashboardProps {
  viewMode?: 'dashboard' | 'leads' | 'settings';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ viewMode = 'dashboard' }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [formConfig, setFormConfig] = useState<FormConfig>(getFormConfig());

  const fetchLeads = () => {
    const data = getLeads();
    setLeads(data);
    if (selectedLead) {
      const updated = data.find(l => l.id === selectedLead.id);
      if (updated) setSelectedLead(updated);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter(l => l.status === 'New').length,
      contacted: leads.filter(l => l.status === 'Contacted' || l.status === 'In Discussion').length,
      won: leads.filter(l => l.status === 'Closed – Won').length,
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchesSearch = 
        l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (l.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.projectType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || l.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, filterStatus]);

  const chartData = useMemo(() => {
    const statusCounts = leads.reduce((acc: any, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(statusCounts).map(status => ({
      name: status,
      count: statusCounts[status]
    }));
  }, [leads]);

  const COLORS = ['#6366f1', '#f59e0b', '#818cf8', '#a855f7', '#22c55e', '#ef4444'];

  const handleUpdateConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveFormConfig(formConfig);
    alert('Site settings updated successfully!');
  };

  if (selectedLead) {
    return (
      <div className="p-4 lg:p-8">
        <LeadDetails 
          lead={selectedLead} 
          onBack={() => setSelectedLead(null)} 
          onUpdate={fetchLeads} 
        />
      </div>
    );
  }

  if (viewMode === 'settings') {
    return (
      <div className="p-4 lg:p-8 space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto lg:mx-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Site Management</h1>
          <p className="text-slate-500 text-sm">Control your public project intake form and injection scripts.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleUpdateConfig} className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6 h-fit">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-2">Fields & Content</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Company', key: 'showCompanyName' },
                  { label: 'Project Type', key: 'showProjectType' },
                  { label: 'Budget', key: 'showBudget' },
                  { label: 'Timeline', key: 'showTimeline' },
                ].map(field => (
                  <label key={field.key} className="flex items-center space-x-2 cursor-pointer p-2 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={(formConfig as any)[field.key]} 
                      onChange={(e) => setFormConfig({...formConfig, [field.key]: e.target.checked})}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-slate-600 font-bold">{field.label}</span>
                  </label>
                ))}
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Title</label>
                  <input type="text" value={formConfig.formTitle} onChange={(e) => setFormConfig({...formConfig, formTitle: e.target.value})} className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Button Text</label>
                  <input type="text" value={formConfig.ctaText} onChange={(e) => setFormConfig({...formConfig, ctaText: e.target.value})} className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-2">Custom Injection Code</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-indigo-600">Header Scripts (Tracking, Pixel, CSS)</label>
                  <textarea value={formConfig.headerCode} onChange={(e) => setFormConfig({...formConfig, headerCode: e.target.value})} rows={4} className="w-full px-4 py-3 text-xs font-mono rounded-lg border border-slate-200 bg-slate-900 text-slate-300 resize-none" placeholder="<script>...</script>" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-indigo-600">Footer Scripts (Analytics, Chat Widgets)</label>
                  <textarea value={formConfig.footerCode} onChange={(e) => setFormConfig({...formConfig, footerCode: e.target.value})} rows={4} className="w-full px-4 py-3 text-xs font-mono rounded-lg border border-slate-200 bg-slate-900 text-slate-300 resize-none" placeholder="<!-- Footer code -->" />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Save All Settings
            </button>
          </form>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-900">Thank You Page Asset</h3>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("Your project request has been successfully submitted. Our team will review your requirements and reach out shortly.");
                    alert('Copied to clipboard!');
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg"
                >
                  Copy Content
                </button>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Success Message Preview</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  "Thank You, [Name]! Your project request has been successfully submitted. Our team will review your requirements and reach out shortly."
                </p>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200 relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-lg font-bold mb-2">Pro Tip: SEO Injection</h3>
                 <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                   Use the Header injection to add meta tags for Google Search Console verification or social media open graph previews.
                 </p>
                 <div className="text-xs font-mono bg-white/10 p-3 rounded-lg text-indigo-300">
                   {`<meta name="description" content="Lazer Solutions intake form">`}
                 </div>
               </div>
               <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {viewMode === 'dashboard' ? 'Overview' : 'Leads Database'}
          </h1>
          <p className="text-slate-500 text-sm">
            {viewMode === 'dashboard' ? "Today's performance snapshots." : "Every request captured at-a-glance."}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex-1 md:flex-none bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            Generate Report
          </button>
        </div>
      </div>

      {viewMode === 'dashboard' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Inbound Leads', value: stats.total, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Unprocessed', value: stats.new, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Nurturing', value: stats.contacted, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Revenue Won', value: stats.won, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${stat.bg} ${stat.color} mb-4 font-bold text-xl`}>
                {stat.value}
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Filter by name, email, project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-700"
          >
            <option value="All">All Statuses</option>
            {['New', 'Contacted', 'In Discussion', 'Proposal Sent', 'Closed – Won', 'Closed – Lost'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Dense Visibility: Custom Mobile Cards and Desktop Table */}
        <div className="block lg:hidden space-y-4">
          {filteredLeads.map(lead => (
            <div 
              key={lead.id} 
              onClick={() => setSelectedLead(lead)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center"
            >
              <div className="space-y-1">
                <div className="font-bold text-slate-900">{lead.fullName}</div>
                <div className="text-xs text-indigo-600 font-bold uppercase tracking-wide">{lead.projectType}</div>
                <div className="text-xs text-slate-400 font-medium">{new Date(lead.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${COLORS[leads.indexOf(lead) % COLORS.length]}`}>
                  {lead.status}
                </span>
                <div className="text-sm font-bold text-slate-900">{lead.budget}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block">
          <LeadTable 
            leads={viewMode === 'dashboard' ? filteredLeads.slice(0, 10) : filteredLeads} 
            onSelectLead={setSelectedLead} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;