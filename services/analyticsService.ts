
import { VisitorLog, LeadMetadata } from '../types';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';

const LOGS_COLLECTION = 'visitor_logs';

export const getDeviceType = (): 'Desktop' | 'Mobile' | 'Tablet' => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'Mobile';
  return 'Desktop';
};

export const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (ua.indexOf("Firefox") > -1) browser = "Firefox";
  else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung Browser";
  else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
  else if (ua.indexOf("Trident") > -1) browser = "IE";
  else if (ua.indexOf("Edge") > -1) browser = "Edge";
  else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
  else if (ua.indexOf("Safari") > -1) browser = "Safari";
  
  let os = "Unknown";
  if (ua.indexOf("Win") > -1) os = "Windows";
  else if (ua.indexOf("Mac") > -1) os = "MacOS";
  else if (ua.indexOf("Linux") > -1) os = "Linux";
  else if (ua.indexOf("Android") > -1) os = "Android";
  else if (ua.indexOf("like Mac") > -1) os = "iOS";

  return { browser, os };
};

export const fetchIp = async (): Promise<string> => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip || 'Unknown';
  } catch { return 'Unknown'; }
};

export const getVisitorMetadata = async (): Promise<LeadMetadata> => {
  const { browser, os } = getBrowserInfo();
  const ip = await fetchIp();
  return {
    ip,
    userAgent: navigator.userAgent,
    deviceType: getDeviceType(),
    browser,
    os,
    referrer: document.referrer || 'Direct',
    screenResolution: `${window.screen.width}x${window.screen.height}`
  };
};

export const logVisit = async (path: string) => {
  try {
    const metadata = await getVisitorMetadata();
    await addDoc(collection(db, LOGS_COLLECTION), {
      timestamp: serverTimestamp(),
      path,
      metadata
    });
  } catch (error) {
    console.error("Error logging visit:", error);
  }
};

export const getVisitLogs = async (): Promise<VisitorLog[]> => {
  const q = query(collection(db, LOGS_COLLECTION), orderBy('timestamp', 'desc'), limit(100));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
    timestamp: (d.data().timestamp as any)?.toDate().toISOString() || new Date().toISOString()
  } as VisitorLog));
};
