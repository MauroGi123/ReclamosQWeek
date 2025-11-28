import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Initialize Firebase on the server
function initializeFirebase() {
  if (typeof window === 'undefined') {
    // On the server, we can create a new instance every time.
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    return { app, db, auth };
  }
  
  // On the client, we need to use a singleton.
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  }
  return { app, db, auth };
}

export { initializeFirebase };
