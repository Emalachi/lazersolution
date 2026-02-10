
import React, { useState } from 'react';
import { Lead, LeadStatus, LeadClassification } from '../types.ts';
import { LEAD_STATUSES, STATUS_COLORS, LEAD_CLASSIFICATIONS, CLASSIFICATION_COLORS } from '../constants.tsx';
import { updateLead, addNote, logActivity } from '../services/leadService.ts';

interface LeadDetailsProps {
  lead: Lead;
  onBack: () => void;
  onUpdate: () => void;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({ lead, onBack, onUpdate }) => {
  const [newNote, setNewNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingClassification, setIsUpdatingClassification] = useState(false);

  const handleStatusChange = (newStatus: LeadStatus) => {
    updateLead(lead.id, { status: newStatus });
    logActivity(lead.id, `Lead status updated to ${newStatus}`);
    onUpdate();
  };

  const handleClassificationChange = (newClassification: LeadClassification) => {
    updateLead(lead.id, { classification: newClassification });
    logActivity(lead.id, `Lead marked as ${newClassification}`);
    onUpdate();
    setIsUpdatingClassification(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNote(lead.id, newNote, 'Admin');
    setNewNote('');
    onUpdate();
  };

  const formattedPhone = lead.phone.replace(/\s+/g, '');
  const whatsappUrl = `https://wa.me/${formattedPhone.startsWith('+') ? formattedPhone.slice(1) : formattedPhone}`;

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in slide-in-from-bottom-4 duration-300">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 mb-6 font-bold text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Leads</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-soft border border-slate-200 p-6 lg:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">{lead.fullName}</h1>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${CLASSIFICATION_COLORS[lead.classification || 'None']}`}>
                    {lead.classification || 'None'}
                  </span>
                </div>
                <p className="text-lg text-slate-500 font-medium">{lead.companyName || 'Individual Project'}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                {/* Status Dropdown */}
                <div className="relative w-full md:w-auto">
                  <button 
                    onClick={() => { setIsUpdatingStatus(!isUpdatingStatus); setIsUpdatingClassification(false); }}
                    className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-3 transition-all ${STATUS_COLORS[lead.status]}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>{lead.status}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isUpdatingStatus && (
                    <div className="absolute right-0 mt-3 w-full md:w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 py-2">
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

                {/* Classification Dropdown */}
                <div className="relative w-full md:w-auto">
                  <button 
                    onClick={() => { setIsUpdatingClassification(!isUpdatingClassification); setIsUpdatingStatus(false); }}
                    className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-3 transition-all border border-slate-200 hover:border-indigo-600 hover:text-indigo-600`}
                  >
                    <span>Classification</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isUpdatingClassification && (
                    <div className="absolute right-0 mt-3 w-full md:w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 py-2">
                      {LEAD_CLASSIFICATIONS.map(cls => (
                        <button
                          key={cls}
                          onClick={() => handleClassificationChange(cls)}
                          className="w-full text-left px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center justify-between"
                        >
                          <span>{cls}</span>
                          {lead.classification === cls && <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS FOR MOBILE/TABLET */}
            <div className="grid grid-cols-2 gap-4 mb-8 lg:hidden">
              <a href={`tel:${lead.phone}`} className="flex items-center justify-center space-x-2 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.47 5.47l.773-1.548a1 1 0 011.06-.539l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                <span>Call Now</span>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.656zm6.29-4.171c1.589.945 3.554 1.443 5.548 1.444 5.405 0 9.803-4.398 9.806-9.805.002-2.625-1.022-5.09-2.871-6.941-1.85-1.849-4.312-2.87-6.937-2.872-5.407 0-9.805 4.398-9.808 9.806-.001 2.088.521 4.124 1.512 5.885l-.965 3.525 3.609-.947zm11.045-6.502c-.313-.156-1.853-.914-2.144-1.018-.291-.104-.503-.156-.714.156-.212.313-.819 1.018-1.004 1.227-.185.209-.37.234-.683.078-.313-.156-1.321-.487-2.516-1.553-.929-.829-1.556-1.853-1.738-2.166-.182-.313-.02-.482.137-.638.141-.141.313-.365.469-.547.156-.182.209-.313.313-.521.104-.209.052-.391-.026-.547-.078-.156-.714-1.72-1.004-2.424-.291-.704-.567-.638-.714-.646-.141-.008-.344-.01-.547-.01s-.547.078-.832.391c-.286.313-1.093 1.068-1.093 2.604 0 1.536 1.117 3.021 1.272 3.23.156.209 2.193 3.35 5.312 4.697.742.32 1.32.511 1.77.653.745.236 1.423.203 1.959.123.597-.089 1.853-.758 2.118-1.458.265-.704.265-1.302.185-1.432-.079-.129-.291-.208-.603-.364z"/></svg>
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10 border-y border-slate-50 py-10">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                <div className="text-slate-900 font-bold truncate">{lead.email}</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                <div className="text-slate-900 font-bold flex items-center space-x-2">
                  <span>{lead.phone}</span>
                </div>
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
              <div className="text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 font-medium whitespace-pre-wrap">
                {lead.description}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-soft border border-slate-200 p-6 lg:p-10">
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
                  className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Add Note
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {lead.notes.map(note => (
                <div key={note.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
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
          <div className="hidden lg:block bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
            <h3 className="font-bold text-lg mb-6 flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Sales Actions</span>
            </h3>
            <div className="space-y-3">
              <a href={`tel:${lead.phone}`} className="flex items-center justify-center w-full px-5 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all text-sm">
                Initiate Call
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full px-5 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm">
                WhatsApp Template
              </a>
              <button className="w-full px-5 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm">
                Generate Proposal
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-soft border border-slate-200 p-6 lg:p-10">
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
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
