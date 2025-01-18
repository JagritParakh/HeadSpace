import { initializeApp } from 'firebase/app';

// Firebase configuration
import { FIREBASE_CONFIG } from '$lib/config.json'

// Initialize Firebase
export const firebaseApp = initializeApp(FIREBASE_CONFIG);
