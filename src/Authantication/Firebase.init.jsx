// firebase.init.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration using Vite environment variables
const firebaseConfig = {
 
  //  apiKey: "AIzaSyBUjmqLPrTfTIfh5myH4Nc4loHdhCtCXQI",
  // authDomain: "freelance-task-marketpla-cd9ed.firebaseapp.com",
  // projectId: "freelance-task-marketpla-cd9ed",
  // storageBucket: "freelance-task-marketpla-cd9ed.firebasestorage.app",
  // messagingSenderId: "692215520961",
  // appId: "1:692215520961:web:6b8fb0fea4fe748795fe40"

  apiKey: "AIzaSyBc0_mrJx3Pb290RO4LLO43RjiFJvAw3pY",
  authDomain: "tree-plantation-13b0c.firebaseapp.com",
  projectId: "tree-plantation-13b0c",
  storageBucket: "tree-plantation-13b0c.firebasestorage.app",
  messagingSenderId: "449517229790",
  appId: "1:449517229790:web:91a8905670ec73ed56144f"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);
