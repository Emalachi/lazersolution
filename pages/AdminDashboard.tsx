
import React, { useState, useMemo, useEffect } from 'react';
import { Lead, FormConfig, FieldConfig, ProjectLogo, VisitorLog } from '../types.ts';
import { getLeads } from '../services/leadService.ts';
import { getFormConfig, saveFormConfig } from '../services/configService.ts';
import { getVisitLogs } from '../services/analyticsService.ts';
import LeadTable from '../components/LeadTable.tsx';
import LeadDetails from './LeadDetails.tsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line } from 'recharts';
/* Fix: Added LEAD_STATUSES to the import list from constants */
import { STATUS_COLORS, LEAD_STATUSES } from '../constants.tsx';

interface AdminDashboardProps {
  viewMode?: 'dashboard' | 'leads' | 'settings' | 'analytics';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ viewMode = 'dashboard' }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [formConfig, setFormConfig] = useState<FormConfig>(getFormConfig());
  const [activeSettingsTab, setActiveSettingsTab] = useState<'content' | 'fields' | 'scripts' | 'assets'>('content');
  const [isUploading, setIsUploading] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const fetchLeads = () => {
    setLeads(getLeads());
    setVisitorLogs(getVisitLogs());
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const stats = useMemo(() => {
    return {
      totalLeads: leads.length,
      totalVisits: visitorLogs.length,
      conversionRate: visitorLogs.length > 0 ? ((leads.length / visitorLogs.length) * 100).toFixed(1) : 0,
      newLeads: leads.filter(l => l.status === 'New').length,
    };
  }, [leads, visitorLogs]);

  const deviceData = useMemo(() => {
    const counts: any = {};
    visitorLogs.forEach(log => {
      const dev = log.metadata.deviceType || 'Unknown';
      counts[dev] = (counts[dev] || 0) + 1;
    });
    return Object.keys(counts).map(name => ({ name, value: counts[name] }));
  }, [visitorLogs]);

  const browserData = useMemo(() => {
    const counts: any = {};
    visitorLogs.forEach(log => {
      const b = log.metadata.browser || 'Unknown';
      counts[b] = (counts[b] || 0) + 1;
    });
    return Object.keys(counts).map(name => ({ name, value: counts[name] }));
  }, [visitorLogs]);

  const trafficData = useMemo(() => {
    const days: any = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days[d.toISOString().split('T')[0]] = { visits: 0, leads: 0 };
    }
    
    visitorLogs.forEach(log => {
      const date = log.timestamp.split('T')[0];
      if (days[date]) days[date].visits++;
    });
    leads.forEach(lead => {
      const date = lead.createdAt.split('T')[0];
      if (days[date]) days[date].leads++;
    });

    return Object.keys(days).map(date => ({
      date: date.split('-').slice(1).join('/'),
      visits: days[date].visits,
      leads: days[date].leads
    }));
  }, [visitorLogs, leads]);

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
        setFormConfig({
          ...formConfig,
          portfolio: [...(formConfig.portfolio || []), {
            id: Math.random().toString(36).substr(2, 9),
            name: newProjectName || file.name,
            imageUrl: data.secure_url,
          }],
        });
        setNewProjectName('');
      }
    } catch (err: any) {
      alert('Error uploading to Cloudinary: ' + err.message);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  if (selectedLead) {
    return <div className="p-4 lg:p-8"><LeadDetails lead={selectedLead} onBack={() => setSelectedLead(null)} onUpdate={fetchLeads} /></div>;
  }

  if (viewMode === 'analytics') {
    return (
      <div className="p-4 lg:p-8 space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Advanced Analytics</h1>
          <p className="text-slate-500 text-sm">Real-time visitor patterns and device fingerprinting.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Traffic Over Time (7D)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Line type="monotone" dataKey="visits" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center text-xs font-bold text-slate-500"><span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span> Visits</div>
              <div className="flex items-center text-xs font-bold text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Lead Submissions</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Device Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#6366f1', '#f59e0b', '#10b981', '#ef4444'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {deviceData.map((d, i) => (
                <div key={i} className="flex items-center text-[10px] font-bold text-slate-500">
                  <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#ef4444'][i % 4]}}></span>
                  {d.name}: {d.value}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Browser Profile</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={browserData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent Visitor Events</h3>
            <span className="text-xs font-bold text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full">Live Log</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">IP Address</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Device</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">OS / Browser</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Path</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {visitorLogs.slice(-20).reverse().map(log => (
                  <tr key={log.id} className="text-sm">
                    <td className="px-6 py-4 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">{log.metadata.ip}</td>
                    <td className="px-6 py-4">{log.metadata.deviceType}</td>
                    <td className="px-6 py-4 text-slate-600">{log.metadata.os} / {log.metadata.browser}</td>
                    <td className="px-6 py-4 font-medium text-indigo-600">{log.path}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
          <button onClick={() => handleUpdateConfig()} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Save All Changes</button>
        </div>
        <div className="flex border-b border-slate-200">
          {(['content', 'fields', 'scripts', 'assets'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveSettingsTab(tab)} className={`px-6 py-3 text-sm font-bold capitalize transition-all border-b-2 ${activeSettingsTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{tab}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {activeSettingsTab === 'content' && (
              <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-8">
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-2">Hero Section</h3>
                  <div className="space-y-4">
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Headline</label><input type="text" value={formConfig.formTitle} onChange={(e) => setFormConfig({...formConfig, formTitle: e.target.value})} className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label><textarea value={formConfig.formSubtitle} onChange={(e) => setFormConfig({...formConfig, formSubtitle: e.target.value})} rows={3} className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" /></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submit Button Text</label><input type="text" value={formConfig.ctaText} onChange={(e) => setFormConfig({...formConfig, ctaText: e.target.value})} className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                  </div>
                </section>
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-2">Success (Thank You) Page</h3>
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 mb-6">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="space-y-0.5"><span className="text-sm font-bold text-indigo-900">Use Custom Redirect URL</span></div>
                      <input type="checkbox" checked={formConfig.redirectAfterSuccess} onChange={(e) => setFormConfig({...formConfig, redirectAfterSuccess: e.target.checked})} className="w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500" />
                    </label>
                    {formConfig.redirectAfterSuccess && (
                      <div className="mt-4"><input type="url" value={formConfig.successUrl} onChange={(e) => setFormConfig({...formConfig, successUrl: e.target.value})} placeholder="https://..." className="w-full px-4 py-2 text-sm rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white" /></div>
                    )}
                  </div>
                  {!formConfig.redirectAfterSuccess && (
                    <div className="space-y-4">
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Success Title</label><input type="text" value={formConfig.successTitle} onChange={(e) => setFormConfig({...formConfig, successTitle: e.target.value})} className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 outline-none" /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Success Subtitle</label><textarea value={formConfig.successSubtitle} onChange={(e) => setFormConfig({...formConfig, successSubtitle: e.target.value})} rows={3} className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 outline-none resize-none" /></div>
                    </div>
                  )}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Label Text</label>
                          <input type="text" value={field.label} onChange={(e) => setFormConfig({...formConfig, fields: {...formConfig.fields, [key]: {...field, label: e.target.value}}})} className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Placeholder</label>
                          <input type="text" value={field.placeholder} onChange={(e) => setFormConfig({...formConfig, fields: {...formConfig.fields, [key]: {...field, placeholder: e.target.value}}})} className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeSettingsTab === 'scripts' && (
              <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-2">Custom Injection Code</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Header Code (Runs in &lt;head&gt;)</label>
                    <textarea 
                      value={formConfig.headerCode} 
                      onChange={(e) => setFormConfig({...formConfig, headerCode: e.target.value})} 
                      rows={8} 
                      className="w-full px-4 py-3 text-xs font-mono rounded-lg border border-slate-200 bg-slate-900 text-slate-300 resize-none"
                      placeholder="<!-- Paste Google Analytics, Meta Pixel, or CSS here -->"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Footer Code (Runs at bottom of &lt;body&gt;)</label>
                    <textarea 
                      value={formConfig.footerCode} 
                      onChange={(e) => setFormConfig({...formConfig, footerCode: e.target.value})} 
                      rows={8} 
                      className="w-full px-4 py-3 text-xs font-mono rounded-lg border border-slate-200 bg-slate-900 text-slate-300 resize-none"
                      placeholder="<!-- Paste chat widgets or final tracking scripts here -->"
                    />
                  </div>
                </div>
              </div>
            )}
            {activeSettingsTab === 'assets' && (
              <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-8">
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-2">Cloudinary Integration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cloud Name</label><input type="text" value={formConfig.cloudinaryCloudName} onChange={(e) => setFormConfig({...formConfig, cloudinaryCloudName: e.target.value})} className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 outline-none" placeholder="e.g. lazer-solutions" /></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Preset</label><input type="text" value={formConfig.cloudinaryUploadPreset} onChange={(e) => setFormConfig({...formConfig, cloudinaryUploadPreset: e.target.value})} className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 outline-none" placeholder="e.g. public_intake_preset" /></div>
                  </div>
                </section>
                <section className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-2">Completed Projects Portfolio</h3>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project / Client Name</label>
                      <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 bg-white" placeholder="e.g. TechCorp Nigeria" />
                    </div>
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="portfolio-upload" disabled={isUploading} />
                      <label htmlFor="portfolio-upload" className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-8 cursor-pointer hover:bg-white hover:border-indigo-300 transition-all ${isUploading ? 'opacity-50' : ''}`}>
                        {isUploading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div> : <span>Click to upload project logo</span>}
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
               <h3 className="text-lg font-bold mb-4">Integrations Guide</h3>
               <p className="text-slate-400 text-sm mb-6 leading-relaxed">Use Cloudinary for image hosting and the Script Builder for tracking tags like GTM or Meta Pixel.</p>
               <a href="https://cloudinary.com/console" target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">Set up Cloudinary →</a>
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
          <h1 className="text-2xl font-bold text-slate-900">{viewMode === 'dashboard' ? 'Business Overview' : 'Leads Database'}</h1>
          <p className="text-slate-500 text-sm">{viewMode === 'dashboard' ? "Real-time funnel performance." : "Comprehensive request log."}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Visitors', value: stats.totalVisits, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Total Leads', value: stats.totalLeads, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Conversion Rate', value: `${stats.conversionRate}%`, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Unprocessed', value: stats.newLeads, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-soft border border-slate-200 flex flex-col items-center text-center">
            <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${stat.bg} ${stat.color} mb-4 font-bold text-xl`}>{stat.value}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-200">
          <input type="text" placeholder="Filter by name, email, project..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-grow pl-4 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-700">
            <option value="All">All Statuses</option>
            {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <LeadTable leads={filteredLeads} onSelectLead={setSelectedLead} />
      </div>
    </div>
  );
};

export default AdminDashboard;
