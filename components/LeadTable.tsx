
import React from 'react';
import { Lead } from '../types';
import { STATUS_COLORS } from '../constants';

interface LeadTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, onSelectLead }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-soft">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Client Name</th>
            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Project Type</th>
            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Budget</th>
            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Date Submitted</th>
            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => onSelectLead(lead)}>
              <td className="px-6 py-5">
                <div className="font-bold text-slate-900">{lead.fullName}</div>
                <div className="text-sm text-slate-500">{lead.companyName || 'Individual'}</div>
              </td>
              <td className="px-6 py-5 text-sm text-slate-700">
                {lead.projectType}
              </td>
              <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                {lead.budget}
              </td>
              <td className="px-6 py-5">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-tight ${STATUS_COLORS[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-6 py-5 text-sm text-slate-500">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-5 text-right">
                <button 
                  className="text-indigo-600 hover:text-indigo-900 font-bold text-sm transition-colors"
                  onClick={(e) => { e.stopPropagation(); onSelectLead(lead); }}
                >
                  Manage Lead
                </button>
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">
                No lead records found in the database.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
