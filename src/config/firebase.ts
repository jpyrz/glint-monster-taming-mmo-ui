import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";

// Firebase configuration
// Note: These are client-side safe configuration values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
let messaging: ReturnType<typeof getMessaging> | null = null;

// Initialize messaging synchronously
const initMessaging = () => {
  try {
    console.log("Firebase config - Initializing messaging with app:", !!app);
    messaging = getMessaging(app);
    console.log("Firebase messaging initialized successfully:", !!messaging);

    // Make messaging globally available for debugging
    (window as any).firebaseMessaging = messaging;
  } catch (error) {
    console.error("Failed to initialize Firebase messaging:", error);
    messaging = null;
  }
};

// Check if messaging is supported and initialize
console.log("Firebase config - Starting messaging initialization...");
isSupported()
  .then((supported) => {
    console.log("Firebase config - isSupported result:", supported);
    if (supported) {
      // Register service worker first
      if ("serviceWorker" in navigator) {
        console.log(
          "Firebase config - Service Worker supported, registering..."
        );
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.log(
              "Firebase messaging service worker registered successfully:",
              registration
            );
            initMessaging();
          })
          .catch((error) => {
            console.warn(
              "Service worker registration failed, initializing messaging anyway:",
              error
            );
            initMessaging();
          });
      } else {
        console.log(
          "Firebase config - Service Worker not supported, initializing messaging directly"
        );
        initMessaging();
      }
    } else {
      console.log("Firebase messaging is not supported in this browser");
    }
  })
  .catch((error) => {
    console.error("Firebase config - Error checking messaging support:", error);
  });

export { messaging };

// Only connect to auth emulator if explicitly configured
if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true") {
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    console.log("Connected to Firebase Auth Emulator");
  } catch (error) {
    console.log("Auth emulator connection failed:", error);
  }
}

export default app;
