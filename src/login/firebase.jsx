// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAuth ,createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
// import { collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1Q-XJ8xXT49O-Hr8v0g5sxDgFmrg33Ms",
  authDomain: "caprestastockportal.firebaseapp.com",
  projectId: "caprestastockportal",
  storageBucket: "caprestastockportal.firebasestorage.app",
  messagingSenderId: "771828322224",
  appId: "1:771828322224:web:16d10d3c0c3bcc310d5075"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 
export {createUserWithEmailAndPassword, signInWithEmailAndPassword}; // Export Firestore functions
