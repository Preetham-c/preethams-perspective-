// Firebase CDN Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Your Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyD8D1OtVKfdI5BGQecXwD8ngDgtJksnRYY",
  authDomain: "preetham-perspective.firebaseapp.com",
  projectId: "preetham-perspective",
  storageBucket: "preetham-perspective.firebasestorage.app",
  messagingSenderId: "392987040131",
  appId: "1:392987040131:web:ee46fa1ffc14ff72a33eb6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
