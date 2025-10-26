// Firebase messaging service worker
// Import the functions you need from the SDKs you need
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

// Firebase configuration (same as in your main app)
const firebaseConfig = {
  apiKey: "AIzaSyCeXnv9MlZD2bD1S2dmiWujyG59Hb4_Ir4",
  authDomain: "glint-monster-tamer.firebaseapp.com",
  projectId: "glint-monster-tamer",
  storageBucket: "glint-monster-tamer.firebasestorage.app",
  messagingSenderId: "605558195039",
  appId: "1:605558195039:web:3e01dbca79c18d546aecea",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Customize notification here
  const notificationTitle = payload.notification?.title || "Glint MMO";
  const notificationOptions = {
    body: payload.notification?.body || "New notification",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: payload.data,
    actions: [
      {
        action: "open",
        title: "Open App",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click events
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click received.");

  event.notification.close();

  if (event.action === "open" || !event.action) {
    // Open the app
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          // Check if there is already a window/tab open with the target URL
          for (const client of clientList) {
            if (
              client.url === self.location.origin + "/" &&
              "focus" in client
            ) {
              return client.focus();
            }
          }

          // If not, then open the target URL in a new window/tab
          if (clients.openWindow) {
            return clients.openWindow("/");
          }
        })
    );
  } else if (event.action === "dismiss") {
    // Just close the notification (already done above)
    console.log("[firebase-messaging-sw.js] Notification dismissed.");
  }
});

// Handle push events (for additional processing if needed)
self.addEventListener("push", (event) => {
  console.log("[firebase-messaging-sw.js] Push event received.");

  if (event.data) {
    const data = event.data.json();
    console.log("[firebase-messaging-sw.js] Push data:", data);
  }
});
