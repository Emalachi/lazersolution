
import { FormConfig } from '../types';

const CONFIG_KEY = 'lazer_solutions_form_config';

const DEFAULT_CONFIG: FormConfig = {
  showCompanyName: true,
  showBudget: true,
  showTimeline: true,
  showProjectType: true,
  formTitle: 'Ready to build a system that actually works?',
  formSubtitle: 'Submit your project details today. Tell us what you need, and our team will review it, call you, and guide you from idea to execution.',
  ctaText: 'Initiate My Project Engine'
};

export const getFormConfig = (): FormConfig => {
  const data = localStorage.getItem(CONFIG_KEY);
  return data ? JSON.parse(data) : DEFAULT_CONFIG;
};

export const saveFormConfig = (config: FormConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};
