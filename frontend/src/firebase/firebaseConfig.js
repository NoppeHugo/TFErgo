import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "ergogo-88fd0.firebaseapp.com",
  projectId: "ergogo-88fd0",
  storageBucket: "ergogo-88fd0.firebasestorage.app",
  messagingSenderId: "1070148585931",
  appId: "1:1070148585931:web:448db2fcc2bad9ec4a4e4e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
