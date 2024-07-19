// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-98195.firebaseapp.com",
  projectId: "reactchat-98195",
  storageBucket: "reactchat-98195.appspot.com",
  messagingSenderId: "750110299757",
  appId: "1:750110299757:web:8a8b74bdcb9b85f7411164"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()