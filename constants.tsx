
import { LeadStatus, LeadClassification, ProjectType, BudgetRange, Timeline } from './types';

export const PROJECT_TYPES: ProjectType[] = [
  'Logistics Management',
  'Inventory Management',
  'E-commerce CRM',
  'Shipment & Tracking',
  'Trading & Marketplaces',
  'ERP for SMEs',
  'Custom CRM',
  'Warehouse Management (WMS)',
  'Payment-on-Delivery (POD)',
  'Order Management (OMS)',
  'Vendor & Supplier Portals',
  'Subscription & Membership',
  'Automation & Internal Tools',
  'Admin Dashboards',
  'Real Estate Lead Management',
  'Other'
];

export const BUDGET_RANGES: BudgetRange[] = [
  '₦100k–₦300k',
  '₦300k–₦1m',
  '₦1m+'
];

export const TIMELINES: Timeline[] = [
  'ASAP',
  '1–3 months',
  'Flexible'
];

export const LEAD_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'In Discussion',
  'Proposal Sent',
  'Closed – Won',
  'Closed – Lost'
];

export const LEAD_CLASSIFICATIONS: LeadClassification[] = [
  'None',
  'Qualified',
  'Unqualified',
  'Junk',
  'Follow Up',
  'Urgent'
];

export const STATUS_COLORS: Record<LeadStatus, string> = {
  'New': 'bg-blue-100 text-blue-800',
  'Contacted': 'bg-amber-100 text-amber-800',
  'In Discussion': 'bg-indigo-100 text-indigo-800',
  'Proposal Sent': 'bg-purple-100 text-purple-800',
  'Closed – Won': 'bg-green-100 text-green-800',
  'Closed – Lost': 'bg-rose-100 text-rose-800'
};

export const CLASSIFICATION_COLORS: Record<LeadClassification, string> = {
  'None': 'bg-slate-100 text-slate-500',
  'Qualified': 'bg-emerald-100 text-emerald-700',
  'Unqualified': 'bg-slate-200 text-slate-600',
  'Junk': 'bg-rose-100 text-rose-700',
  'Follow Up': 'bg-amber-100 text-amber-700',
  'Urgent': 'bg-orange-100 text-orange-700 font-bold'
};
