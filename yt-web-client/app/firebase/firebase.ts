// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInWithPopup,  
    GoogleAuthProvider,
    onAuthStateChanged,
    User
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

/**
 * Signs the user in with a Google popup.
 * @returns A primise that resolves with the user's credentials.
 */

export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the user out.
 * @returns A promide that resolves with the user is signed out.
 */

export function signOut() {
    return auth.signOut();
}

/**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubcribe callback.
 */

export function onAuthStateChnageHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}



