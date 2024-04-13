// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-estate-f8bef.firebaseapp.com",
  projectId: "mern-estate-f8bef",
  storageBucket: "mern-estate-f8bef.appspot.com",
  messagingSenderId: "1085931451827",
  appId: "1:1085931451827:web:fd0acdb6607442e0d307c6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);