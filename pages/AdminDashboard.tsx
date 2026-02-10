
import React, { useState, useMemo, useEffect } from 'react';
import { Lead, FormConfig, FieldConfig, ProjectLogo } from '../types.ts';
import { getLeads } from '../services/leadService.ts';
import { getFormConfig, saveFormConfig } from '../services/configService.ts';
import LeadTable from '../components/LeadTable.tsx';
import LeadDetails from './LeadDetails.tsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { STATUS_COLORS } from '../constants.tsx';

interface AdminDashboardProps {
  viewMode?: 'dashboard' | 'leads' | 'settings';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ viewMode = 'dashboard' }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [formConfig, setFormConfig] = useState<FormConfig>(getFormConfig());
  const [activeSettingsTab, setActiveSettingsTab] = useState<'content' | 'fields' | 'scripts' | 'assets'>('content');
  const [isUploading, setIsUploading] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

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

  const handleUpdateConfig = (e?: React.FormEvent) => {
    e?.preventDefault();
    saveFormConfig(formConfig);
    alert('Site settings updated successfully!');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!formConfig.cloudinaryCloudName || !formConfig.cloudinaryUploadPreset) {
      alert('Please configure Cloudinary settings first!');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', formConfig.cloudinaryUploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${formConfig.cloudinaryCloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        const newProject: ProjectLogo = {
          id: Math.random().toString(36).substr(2, 9),
          name: newProjectName || file.name,
          imageUrl: data.secure_url,
        };
        setFormConfig({
          ...formConfig,
          portfolio: [...(formConfig.portfolio || []), newProject],
        });
        setNewProjectName('');
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err: any) {
      alert('Error uploading to Cloudinary: ' + err.message);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const removeProject = (id: string) => {
    setFormConfig({
      ...formConfig,
      portfolio: formConfig.portfolio.filter((p) => p.id !== id),
    });
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
      <div className="p-4 lg:p-8 space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto lg:mx-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Application Builder</h1>
            <p className="text-slate-500 text-sm">Fine-tune every aspect of your public intake process.</p>
          </div>
          <button 
            onClick={() => handleUpdateConfig()}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Save All Changes
          </button>
        </div>

        <div className="flex border-b border-slate-200">
          {(['content', 'fields', 'scripts', 'assets'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSettingsTab(tab)}
              className={`px-6 py-3 text-sm font-bold capitalize transition-all border-b-2 ${
                activeSettingsTab === tab 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {activeSettingsTab === 'content' && (
              <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-8">
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-2">Hero Section</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Headline</label>
                      <input type="text" value={formConfig.formTitle} onChange={(e) => setFormConfig({...formConfig, formTitle: e.target.value})} className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                      <textarea value={formConfig.formSubtitle} onChange={(e) => setFormConfig({...formConfig, formSubtitle: e.target.value})} rows={3} className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submit Button Text</label>
                      <input type="text" value={formConfig.ctaText} onChange={(e) => setFormConfig({...formConfig, ctaText: e.target.value})} className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-2">Success (Thank You) Page</h3>
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 mb-6">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-indigo-900">Use Custom Redirect URL</span>
                        <p className="text-xs text-indigo-600">If enabled, users will be sent to the URL below instead of seeing the built-in success page.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={formConfig.redirectAfterSuccess} 
                        onChange={(e) => setFormConfig({...formConfig, redirectAfterSuccess: e.target.checked})}
                        className="w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </label>
                    {formConfig.redirectAfterSuccess && (
                      <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                        <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">Redirect Destination (e.g., https://example.com/thanks)</label>
                        <input 
                          type="url" 
                          value={formConfig.successUrl} 
                          onChange={(e) => setFormConfig({...formConfig, successUrl: e.target.value})}
                          placeholder="https://..."
                          className="w-full px-4 py-2 text-sm rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white" 
                        />
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

            {activeSettingsTab === 'assets' && (
              <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-8">
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-2">Cloudinary Integration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cloud Name</label>
                      <input 
                        type="text" 
                        value={formConfig.cloudinaryCloudName} 
                        onChange={(e) => setFormConfig({...formConfig, cloudinaryCloudName: e.target.value})} 
                        className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                        placeholder="e.g. lazer-solutions"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Preset (Unsigned)</label>
                      <input 
                        type="text" 
                        value={formConfig.cloudinaryUploadPreset} 
                        onChange={(e) => setFormConfig({...formConfig, cloudinaryUploadPreset: e.target.value})} 
                        className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                        placeholder="e.g. public_intake_preset"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">Required for client-side logo uploads to the portfolio section.</p>
                </section>

                <section className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-2">Completed Projects Portfolio</h3>
                  
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project / Client Name</label>
                      <input 
                        type="text" 
                        value={newProjectName} 
                        onChange={(e) => setNewProjectName(e.target.value)}
                        className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 bg-white" 
                        placeholder="e.g. TechCorp Nigeria"
                      />
                    </div>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        className="hidden" 
                        id="portfolio-upload"
                        disabled={isUploading}
                      />
                      <label 
                        htmlFor="portfolio-upload"
                        className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-8 cursor-pointer hover:bg-white hover:border-indigo-300 transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <span className="text-xs font-bold text-indigo-600">Uploading to Cloudinary...</span>
                          </div>
                        ) : (
                          <>
                            <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                            <span className="text-sm font-bold text-slate-600">Click to upload project logo</span>
                            <span className="text-[10px] text-slate-400 mt-1">PNG, JPG or SVG</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formConfig.portfolio?.map((project) => (
                      <div key={project.id} className="relative group bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                        <button 
                          onClick={() => removeProject(project.id)}
                          className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                        </button>
                        <div className="w-16 h-16 bg-white rounded-xl mb-3 flex items-center justify-center overflow-hidden border border-slate-200">
                          <img src={project.imageUrl} alt={project.name} className="w-full h-full object-contain p-2" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-900 truncate w-full text-center">{project.name}</span>
                      </div>
                    ))}
                    {(!formConfig.portfolio || formConfig.portfolio.length === 0) && (
                      <div className="col-span-full py-12 text-center text-slate-400 text-sm italic">
                        No projects added yet. Upload logos to display them on the home page.
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

            {activeSettingsTab === 'fields' && (
              <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-2">Field Customization</h3>
                <div className="space-y-8">
                  {(Object.entries(formConfig.fields) as [keyof FormConfig['fields'], FieldConfig][]).map(([key, field]) => (
                    <div key={key} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-slate-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" checked={field.isVisible} onChange={(e) => setFormConfig({...formConfig, fields: {...formConfig.fields, [key]: {...field, isVisible: e.target.checked}}})} className="w-4 h-4 rounded text-indigo-600" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Visible</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" checked={field.isRequired} onChange={(e) => setFormConfig({...formConfig, fields: {...formConfig.fields, [key]: {...field, isRequired: e.target.checked}}})} className="w-4 h-4 rounded text-indigo-600" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Required</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
               <h3 className="text-lg font-bold mb-4">Integrations Guide</h3>
               <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                 Use Cloudinary to host your project portfolio images. It's free, fast, and ensures your home page stays lightweight.
               </p>
               <a 
                href="https://cloudinary.com/console/settings/upload" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-bold text-indigo-400 flex items-center space-x-2 hover:text-indigo-300 transition-colors"
               >
                 <span>Set up Upload Preset →</span>
               </a>
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
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${STATUS_COLORS[lead.status]}`}>
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
