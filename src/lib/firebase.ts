
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA0s4xzKHFD63YDMAU1qCUrM6Cm377zzKg",
  authDomain: "eighty-e8eaf.firebaseapp.com",
  projectId: "eighty-e8eaf",
  storageBucket: "eighty-e8eaf.firebasestorage.app",
  messagingSenderId: "431025991520",
  appId: "1:431025991520:web:20393a93695dac819f7805"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
