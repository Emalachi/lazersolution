
import { FormConfig } from '../types';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CONFIG_DOC_PATH = 'config/main';

const DEFAULT_CONFIG: FormConfig = {
  formTitle: 'Ready to build a system that actually works?',
  formSubtitle: 'Submit your project details today. Tell us what you need, and our team will review it, call you, and guide you from idea to execution.',
  ctaText: 'Initiate My Project Engine',
  successTitle: 'Thank You!',
  successSubtitle: 'Your project request has been successfully submitted. Our team will review your requirements and reach out shortly.',
  successCtaText: 'Submit Another Project',
  redirectAfterSuccess: false,
  successUrl: '',
  headerCode: '<!-- Custom Header Scripts -->',
  footerCode: '<!-- Custom Footer Scripts -->',
  cloudinaryCloudName: '',
  cloudinaryUploadPreset: '',
  portfolio: [],
  fields: {
    fullName: { label: 'Full Name', placeholder: 'Enter your name', isVisible: true, isRequired: true },
    companyName: { label: 'Company Name', placeholder: 'Your organization', isVisible: true, isRequired: false },
    email: { label: 'Email Address', placeholder: 'email@example.com', isVisible: true, isRequired: true },
    phone: { label: 'Phone (WhatsApp Preferred)', placeholder: '+234...', isVisible: true, isRequired: true },
    projectType: { label: 'Project Type', placeholder: '', isVisible: true, isRequired: true },
    budget: { label: 'Budget Range', placeholder: '', isVisible: true, isRequired: true },
    timeline: { label: 'Expected Timeline', placeholder: '', isVisible: true, isRequired: true },
    description: { label: 'Project Description', placeholder: 'Tell us about your requirements...', isVisible: true, isRequired: true },
    source: { label: 'How did you hear about us?', placeholder: 'Referral, Social Media, etc.', isVisible: true, isRequired: false }
  }
};

export const getFormConfig = async (): Promise<FormConfig> => {
  try {
    const docRef = doc(db, CONFIG_DOC_PATH);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...DEFAULT_CONFIG, ...docSnap.data() } as FormConfig;
    }
  } catch (error) {
    console.error("Error fetching config from Firestore:", error);
  }
  return DEFAULT_CONFIG;
};

export const saveFormConfig = async (config: FormConfig) => {
  const docRef = doc(db, CONFIG_DOC_PATH);
  await setDoc(docRef, config);
};
