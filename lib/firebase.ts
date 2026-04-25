// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, RecaptchaVerifier, GoogleAuthProvider as FirebaseGoogleAuthProvider,signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, addDoc,doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvUwdrLVaGYaqpkO-RRHhUtg_YONEde4U",
  authDomain: "careerpulse-ai-4911e.firebaseapp.com",
  projectId: "careerpulse-ai-4911e",
  storageBucket: "careerpulse-ai-4911e.firebasestorage.app",
  messagingSenderId: "811985887300",
  appId: "1:811985887300:web:e6ce763355d96b3664dc11",
  measurementId: "G-S0CH6PMK8N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const storage = getStorage();
const db = getFirestore(app);
const auth = getAuth(app);
export { db };
export { auth };
export { storage };

//auth.useDeviceLanguage();
export { RecaptchaVerifier };
export const GoogleProvider = new FirebaseGoogleAuthProvider();
export { signInWithPopup };

export default app;