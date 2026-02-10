
export type LeadStatus = 'New' | 'Contacted' | 'In Discussion' | 'Proposal Sent' | 'Closed – Won' | 'Closed – Lost';

export type LeadClassification = 'None' | 'Qualified' | 'Unqualified' | 'Junk' | 'Follow Up' | 'Urgent';

export type ProjectType = 
  | 'Logistics Management'
  | 'Inventory Management'
  | 'E-commerce CRM'
  | 'Shipment & Tracking'
  | 'Trading & Marketplaces'
  | 'ERP for SMEs'
  | 'Custom CRM'
  | 'Warehouse Management (WMS)'
  | 'Payment-on-Delivery (POD)'
  | 'Order Management (OMS)'
  | 'Vendor & Supplier Portals'
  | 'Subscription & Membership'
  | 'Automation & Internal Tools'
  | 'Admin Dashboards'
  | 'Real Estate Lead Management'
  | 'Other';

export type BudgetRange = '₦100k–₦300k' | '₦300k–₦1m' | '₦1m+';

export type Timeline = 'ASAP' | '1–3 months' | 'Flexible';

export type UserRole = 'Super Admin' | 'Sales Staff';

export interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  description: string;
  timestamp: string;
}

export interface LeadMetadata {
  ip: string;
  userAgent: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  referrer: string;
  screenResolution: string;
}

export interface Lead {
  id: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  projectType: ProjectType;
  description: string;
  budget: BudgetRange;
  timeline: Timeline;
  source: string;
  status: LeadStatus;
  classification: LeadClassification;
  assignedTo?: string;
  createdAt: string;
  notes: Note[];
  activity: Activity[];
  tags: string[];
  metadata?: LeadMetadata;
}

export interface VisitorLog {
  id: string;
  timestamp: string;
  path: string;
  metadata: LeadMetadata;
  duration?: number; // seconds spent
}

export interface FieldConfig {
  label: string;
  placeholder: string;
  isVisible: boolean;
  isRequired: boolean;
}

export interface ProjectLogo {
  id: string;
  name: string;
  imageUrl: string;
}

export interface FormConfig {
  formTitle: string;
  formSubtitle: string;
  ctaText: string;
  successTitle: string;
  successSubtitle: string;
  successCtaText: string;
  redirectAfterSuccess: boolean;
  successUrl: string;
  headerCode: string;
  footerCode: string;
  cloudinaryCloudName: string;
  cloudinaryUploadPreset: string;
  portfolio: ProjectLogo[];
  fields: {
    fullName: FieldConfig;
    companyName: FieldConfig;
    email: FieldConfig;
    phone: FieldConfig;
    projectType: FieldConfig;
    budget: FieldConfig;
    timeline: FieldConfig;
    description: FieldConfig;
    source: FieldConfig;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
