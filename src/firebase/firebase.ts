import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCL-Fc-7vGyK18p9sKScFOMinPPBemD4YY",
  authDomain: "bioscan-3a35d.firebaseapp.com",
  projectId: "bioscan-3a35d",
  storageBucket: "bioscan-3a35d.firebasestorage.app",
  messagingSenderId: "313864447217",
  appId: "1:313864447217:web:c19179104b57a62fa03550",
  measurementId: "G-QLSDL8MPXD"
};

// Inicializa o app Firebase apenas se não houver outro app inicializado
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporta as instâncias de autenticação e Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);