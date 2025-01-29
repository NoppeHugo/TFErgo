// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbeo9mHjQTCDUR9aDE3hL1xL3dgJ1pWbg",
  authDomain: "ergogo-88fd0.firebaseapp.com",
  projectId: "ergogo-88fd0",
  storageBucket: "ergogo-88fd0.firebasestorage.app",
  messagingSenderId: "1070148585931",
  appId: "1:1070148585931:web:448db2fcc2bad9ec4a4e4e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };