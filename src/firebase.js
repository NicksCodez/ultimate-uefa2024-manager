// firebase imports

import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAgqjIq2ZkrDqupfmxzABuRME8Qn2-4JCY',
  authDomain: 'uefa2024-manager.firebaseapp.com',
  projectId: 'uefa2024-manager',
  storageBucket: 'uefa2024-manager.appspot.com',
  messagingSenderId: '969980434602',
  appId: '1:969980434602:web:0a27b11a9a5e3ec23b18d3',
};

const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// eslint-disable-next-line no-restricted-globals
if (location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099', {
    disableWarnings: true,
  });
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}

export default app;
