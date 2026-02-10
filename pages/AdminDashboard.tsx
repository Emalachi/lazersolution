
import React, { useState, useMemo, useEffect } from 'react';
import { Lead } from '../types.ts';
import { getLeads } from '../services/leadService.ts';
import LeadTable from '../components/LeadTable.tsx';
import LeadDetails from './LeadDetails.tsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminDashboardProps {
  viewMode?: 'dashboard' | 'leads';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ viewMode = 'dashboard' }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

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
        l.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  if (selectedLead) {
    return (
      <div className="p-8">
        <LeadDetails 
          lead={selectedLead} 
          onBack={() => setSelectedLead(null)} 
          onUpdate={fetchLeads} 
        />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {viewMode === 'dashboard' ? 'Overview' : 'All Project Requests'}
          </h1>
          <p className="text-slate-500">
            {viewMode === 'dashboard' 
              ? "Here's the current state of Lazer Solutions sales pipeline." 
              : "Manage and track every lead submitted through the portal."}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
            Export Report
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            Add New Lead
          </button>
        </div>
      </div>

      {/* Stats Grid - Show in Dashboard mode */}
      {viewMode === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Leads', value: stats.total, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            )},
            { label: 'New Requests', value: stats.new, color: 'text-blue-600', bg: 'bg-blue-50', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )},
            { label: 'Active Discussions', value: stats.contacted, color: 'text-amber-600', bg: 'bg-amber-50', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            )},
            { label: 'Closed Deals', value: stats.won, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )},
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className={`${viewMode === 'dashboard' ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email, project or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white transition-all text-sm shadow-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm font-semibold shadow-sm appearance-none"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="In Discussion">In Discussion</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Closed – Won">Closed – Won</option>
              <option value="Closed – Lost">Closed – Lost</option>
            </select>
          </div>

          <LeadTable 
            leads={viewMode === 'dashboard' ? filteredLeads.slice(0, 5) : filteredLeads} 
            onSelectLead={setSelectedLead} 
          />
          
          {viewMode === 'dashboard' && leads.length > 5 && (
            <div className="text-center">
              <p className="text-sm text-slate-500">Showing 5 most recent leads.</p>
            </div>
          )}
        </div>

        {/* Sidebar Insights - Show in Dashboard mode */}
        {viewMode === 'dashboard' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">Pipeline Health</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="count" radius={[6, 6, 6, 6]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 space-y-3">
                {chartData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                      <span className="text-slate-600 font-bold uppercase tracking-wide">{item.name}</span>
                    </div>
                    <span className="text-slate-900 font-extrabold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-900 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3">Sales Tip</h3>
                <p className="text-indigo-200 text-sm leading-relaxed mb-6">
                  Leads contacted within 5 minutes of submission are 100x more likely to convert. Aim for "Contacted" status today!
                </p>
                <button className="text-xs font-bold bg-white text-indigo-900 px-4 py-2 rounded-xl transition-all hover:bg-indigo-50">
                  Setup Alerts
                </button>
              </div>
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-indigo-500/20 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
