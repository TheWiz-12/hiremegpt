import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCxkZKF3c1AHidpg7v2XZe4XRpAkhwolAE",
  authDomain: "hiremegpt.firebaseapp.com",
  projectId: "hiremegpt",
  storageBucket: "hiremegpt.firebasestorage.app",
  messagingSenderId: "964839808993",
  appId: "1:964839808993:web:2bec69a29f8673a8037ca0",
  measurementId: "G-5PN9PT4KY7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore with enhanced offline support
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
   // tabSynchronization: true,
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
});

// Enable offline persistence with error handling
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support offline persistence.');
    }
  });
} catch (error) {
  console.warn('Error enabling persistence:', error);
}

// Initialize Storage with retry mechanism
const storage = getStorage(app);

// Configure Google Auth Provider with additional scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  //client_id: "964839808993-9377jslkoqk7rkh61vre41tjo6gaftqb.apps.googleusercontent.com",
  prompt: 'select_account'
});

// Use emulators in development with proper error handling
/*if (import.meta.env.DEV) {
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
  } catch (error) {
    console.warn('Error connecting to emulators:', error);
  }
}*/

// Export configured instances
export { auth, db, storage, googleProvider };