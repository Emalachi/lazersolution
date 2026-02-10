
import { Lead, LeadStatus, Note, Activity } from '../types';

const STORAGE_KEY = 'lazer_solutions_leads';

const INITIAL_DATA: Lead[] = [
  {
    id: '1',
    fullName: 'John Doe',
    companyName: 'TechCorp',
    email: 'john@techcorp.com',
    phone: '+234 800 123 4567',
    // Fix: Changed 'Mobile App' to 'Logistics Management' to match ProjectType union
    projectType: 'Logistics Management',
    description: 'Looking for a grocery delivery app for Lagos market.',
    budget: '₦1m+',
    timeline: '1–3 months',
    source: 'Google Ads',
    status: 'New',
    assignedTo: 'Admin',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: [],
    activity: [{ id: 'a1', description: 'Lead submitted via website', timestamp: new Date().toISOString() }],
    tags: ['Hot Lead']
  },
  {
    id: '2',
    fullName: 'Sara Smith',
    email: 'sara@example.com',
    phone: '+234 811 000 1111',
    // Fix: Changed 'Website' to 'Other' to match ProjectType union
    projectType: 'Other',
    description: 'Need a professional portfolio website.',
    budget: '₦100k–₦300k',
    timeline: 'Flexible',
    source: 'Referral',
    status: 'Contacted',
    assignedTo: 'Sales Team',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    notes: [{ id: 'n1', content: 'Sent initial WhatsApp message.', author: 'Admin', createdAt: new Date().toISOString() }],
    activity: [{ id: 'a2', description: 'Contacted client via WhatsApp', timestamp: new Date().toISOString() }],
    tags: ['Warm Lead']
  }
];

export const getLeads = (): Lead[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(data);
};

export const saveLeads = (leads: Lead[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
};

export const addLead = (lead: Omit<Lead, 'id' | 'status' | 'createdAt' | 'notes' | 'activity' | 'tags'>): Lead => {
  const leads = getLeads();
  const newLead: Lead = {
    ...lead,
    id: Math.random().toString(36).substr(2, 9),
    status: 'New',
    createdAt: new Date().toISOString(),
    notes: [],
    activity: [{ id: Math.random().toString(), description: 'Project request submitted', timestamp: new Date().toISOString() }],
    tags: []
  };
  leads.unshift(newLead);
  saveLeads(leads);
  return newLead;
};

export const updateLead = (id: string, updates: Partial<Lead>) => {
  const leads = getLeads();
  const index = leads.findIndex(l => l.id === id);
  if (index !== -1) {
    leads[index] = { ...leads[index], ...updates };
    saveLeads(leads);
  }
};

export const addNote = (leadId: string, content: string, author: string) => {
  const leads = getLeads();
  const lead = leads.find(l => l.id === leadId);
  if (lead) {
    const newNote: Note = {
      id: Math.random().toString(),
      content,
      author,
      createdAt: new Date().toISOString()
    };
    lead.notes.unshift(newNote);
    lead.activity.unshift({
      id: Math.random().toString(),
      description: `Note added by ${author}`,
      timestamp: new Date().toISOString()
    });
    saveLeads(leads);
  }
};

export const logActivity = (leadId: string, description: string) => {
  const leads = getLeads();
  const lead = leads.find(l => l.id === leadId);
  if (lead) {
    lead.activity.unshift({
      id: Math.random().toString(),
      description,
      timestamp: new Date().toISOString()
    });
    saveLeads(leads);
  }
};
