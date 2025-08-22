
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

console.log('Firebase config loading...');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSCIqLVAdTUFGN3WDkbvlcFtkqoESIYFs",
  authDomain: "mentalhealthapp-b4cd9.firebaseapp.com",
  projectId: "mentalhealthapp-b4cd9",
  storageBucket: "mentalhealthapp-b4cd9.firebasestorage.app",
  messagingSenderId: "138024538505",
  appId: "1:138024538505:web:cc3f9b3802f49a31f55158",
  measurementId: "G-FYZND7D87Z"
};

console.log('Firebase config:', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app);

const analytics = getAnalytics(app);
console.log('Analytics initialized:', analytics);

const auth = getAuth(app);
console.log('Auth initialized:', auth);

export { auth };