
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDWRePSiVTGEAsjwpXoOtkPojGSMQkNwMY",
  authDomain: "lazersolution-84826.firebaseapp.com",
  projectId: "lazersolution-84826",
  storageBucket: "lazersolution-84826.firebasestorage.app",
  messagingSenderId: "419002380939",
  appId: "1:419002380939:web:a0bd1ce7a9607788fd9a8e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
