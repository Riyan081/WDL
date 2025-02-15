import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4hQXq50rno16quH7UcKp1CTspS9gsXBk",
  authDomain: "netflix-5e430.firebaseapp.com",
  projectId: "netflix-5e430",
  storageBucket: "netflix-5e430.firebasestorage.app",
  messagingSenderId: "968353184148",
  appId: "1:968353184148:web:7e292679a8b417b1053781",
  measurementId: "G-DK1353Z5BC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  // ✅ Make sure to pass `app` here!
