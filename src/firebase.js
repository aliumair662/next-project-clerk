import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
}

// Connect to your Firebase app
const app = initializeApp(firebaseConfig)
// Connect to your Firestore database
const db = getFirestore(app)
// Connect to Firebase auth
const auth = getAuth(app)

export {
  db,
  auth,
  getDocs,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where
}
