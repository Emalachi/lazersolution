
import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';
import { LEAD_STATUSES, STATUS_COLORS } from '../constants';
import { updateLead, addNote, logActivity } from '../services/leadService';

interface LeadDetailsProps {
  lead: Lead;
  onBack: () => void;
  onUpdate: () => void;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({ lead, onBack, onUpdate }) => {
  const [newNote, setNewNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChange = (newStatus: LeadStatus) => {
    updateLead(lead.id, { status: newStatus });
    logActivity(lead.id, `Lead status updated to ${newStatus}`);
    onUpdate();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNote(lead.id, newNote, 'Admin');
    setNewNote('');
    onUpdate();
  };

  const handleToggleTag = (tag: string) => {
    const newTags = lead.tags.includes(tag) 
      ? lead.tags.filter(t => t !== tag) 
      : [...lead.tags, tag];
    updateLead(lead.id, { tags: newTags });
    onUpdate();
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 p-8 animate-in slide-in-from-right-4 duration-300">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 mb-8 font-bold text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Leads</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-soft border border-slate-200 p-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{lead.fullName}</h1>
                <p className="text-lg text-slate-500 font-medium">{lead.companyName || 'Individual Project'}</p>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setIsUpdatingStatus(!isUpdatingStatus)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-3 transition-all ${STATUS_COLORS[lead.status]}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  <span>{lead.status}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isUpdatingStatus && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 py-2">
                    {LEAD_STATUSES.map(status => (
                      <button
                        key={status}
                        onClick={() => { handleStatusChange(status); setIsUpdatingStatus(false); }}
                        className="w-full text-left px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10 border-y border-slate-50 py-10">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                <div className="text-slate-900 font-bold truncate">{lead.email}</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                <div className="text-slate-900 font-bold">{lead.phone}</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Source</label>
                <div className="text-slate-900 font-bold">{lead.source}</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project Category</label>
                <div className="text-indigo-600 font-bold">{lead.projectType}</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget Estimate</label>
                <div className="text-slate-900 font-bold">{lead.budget}</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timeline</label>
                <div className="text-slate-900 font-bold">{lead.timeline}</div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project Requirements</label>
              <div className="text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 font-medium">
                {lead.description}
              </div>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-3">
              {['Hot Lead', 'Enterprise', 'Follow-up Needed', 'Negotiation'].map(tag => (
                <button
                  key={tag}
                  onClick={() => handleToggleTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    lead.tags.includes(tag) 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-soft border border-slate-200 p-10">
            <h2 className="text-xl font-bold text-slate-900 mb-8">Internal Communication Log</h2>
            <form onSubmit={handleAddNote} className="mb-10">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log a call note or internal follow-up detail..."
                className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-medium text-sm resize-none mb-4"
                rows={3}
              ></textarea>
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Add Note
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {lead.notes.map(note => (
                <div key={note.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-900">{note.author}</span>
                    <span className="text-xs text-slate-400">{new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{note.content}</p>
                </div>
              ))}
              {lead.notes.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-sm font-medium italic">No internal logs available for this lead.</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-soft border border-slate-200 p-10">
            <h2 className="text-lg font-bold text-slate-900 mb-8">Activity Timeline</h2>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-100"></div>
              <div className="space-y-8">
                {lead.activity.map((item, idx) => (
                  <div key={item.id} className="relative pl-10">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10">
                      <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]' : 'bg-slate-300'}`}></div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-tight">{item.description}</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
            <h3 className="font-bold text-lg mb-6 flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Sales Actions</span>
            </h3>
            <div className="space-y-3">
              <button className="w-full px-5 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all text-sm">
                Initiate Call
              </button>
              <button className="w-full px-5 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm">
                WhatsApp Template
              </button>
              <button className="w-full px-5 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm">
                Generate Proposal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
