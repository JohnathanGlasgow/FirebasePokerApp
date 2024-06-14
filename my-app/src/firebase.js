// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import getAuth
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQZSetVpYAeT0WByxdbI5ftJucuuKfUIs",
  authDomain: "veryfunpokergame.firebaseapp.com",
  projectId: "veryfunpokergame",
  storageBucket: "veryfunpokergame.appspot.com",
  messagingSenderId: "318963374288",
  appId: "1:318963374288:web:938185259f54722c2fe6d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

initializeFirestore(app, {localCache: persistentLocalCache(/*settings*/{})});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth
const auth = getAuth();

// Export the database and auth
export { db, auth };