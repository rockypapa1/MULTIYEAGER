import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCheMXco__Ja_uLjEiEySVbj7QXggUii6g",
  authDomain: "all-aaps-rocky.firebaseapp.com",
  databaseURL: "https://all-aaps-rocky-default-rtdb.firebaseio.com",
  projectId: "all-aaps-rocky",
  storageBucket: "all-aaps-rocky.firebasestorage.app",
  messagingSenderId: "616797305454",
  appId: "1:616797305454:web:a19f5682bbf724d29c847f",
  measurementId: "G-0BJWFS9DWD"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };
