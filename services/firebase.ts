
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLpSGNzX6hiIkirjIw5RZAlRJJnGzcj3Y",
  authDomain: "orggridapp.firebaseapp.com",
  projectId: "orggridapp",
  storageBucket: "orggridapp.firebasestorage.app",
  messagingSenderId: "876794879988",
  appId: "1:876794879988:web:9743384039ed128572e3a1",
  measurementId: "G-X9QHZT4JG6"
};

// Guard against re-initialization
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async () => {
  const result = await auth.signInWithPopup(googleProvider);
  return result.user;
};

export const signOutUser = () => {
  return auth.signOut();
};

export const onAuthStateChanged = (callback: (user: firebase.User | null) => void) => {
  return auth.onAuthStateChanged(callback);
};

export { db };
export type User = firebase.User;
