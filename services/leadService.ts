
import { Lead, LeadStatus, LeadMetadata } from '../types';
import { getVisitorMetadata } from './analyticsService';
import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';

const LEADS_COLLECTION = 'leads';

export const getLeads = async (): Promise<Lead[]> => {
  const q = query(collection(db, LEADS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
    createdAt: (d.data().createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString()
  } as Lead));
};

export const addLead = async (lead: Omit<Lead, 'id' | 'status' | 'createdAt' | 'notes' | 'activity' | 'tags' | 'classification' | 'metadata'>): Promise<string> => {
  const metadata = await getVisitorMetadata();
  const docRef = await addDoc(collection(db, LEADS_COLLECTION), {
    ...lead,
    status: 'New',
    classification: 'None',
    createdAt: serverTimestamp(),
    notes: [],
    activity: [{ id: Math.random().toString(), description: 'Project request submitted', timestamp: new Date().toISOString() }],
    tags: [],
    metadata
  });
  return docRef.id;
};

export const updateLead = async (id: string, updates: Partial<Lead>) => {
  const leadDoc = doc(db, LEADS_COLLECTION, id);
  await updateDoc(leadDoc, updates);
};

export const addNote = async (leadId: string, content: string, author: string, existingNotes: any[], existingActivity: any[]) => {
  const newNote = {
    id: Math.random().toString(),
    content,
    author,
    createdAt: new Date().toISOString()
  };
  const newActivity = {
    id: Math.random().toString(),
    description: `Note added by ${author}`,
    timestamp: new Date().toISOString()
  };
  
  await updateLead(leadId, {
    notes: [newNote, ...existingNotes],
    activity: [newActivity, ...existingActivity]
  });
};

export const logActivity = async (leadId: string, description: string, existingActivity: any[]) => {
  const newActivity = {
    id: Math.random().toString(),
    description,
    timestamp: new Date().toISOString()
  };
  await updateLead(leadId, {
    activity: [newActivity, ...existingActivity]
  });
};
