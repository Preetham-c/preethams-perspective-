// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Your Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyD8D010tVKFdISBG9ceXwBDng0JtJksnRYY",
    authDomain: "preetham-perspective.firebaseapp.com",
    projectId: "preetham-perspective",
    storageBucket: "preetham-perspective.firebasestorage.app",
    messagingSenderId: "392987040131",
    appId: "1:392987040131:web:ee46f4ffc14ff72a33eb6e"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Export Firebase services for use everywhere
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
