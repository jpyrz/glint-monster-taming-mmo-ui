import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import App from "./App";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

// Register service worker for PWA using vite-plugin-pwa
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    console.log("New content available, please refresh!");
    // Show notification to user about available update
    if (window.confirm("New content available! Reload to update?")) {
      updateSW(true); // Force reload
    }
  },
  onOfflineReady() {
    console.log("App ready to work offline!");
  },
});

// Make updateSW available globally for debugging/manual updates
(window as any).updateSW = updateSW;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
      <Notifications />
      <App />
    </MantineProvider>
  </React.StrictMode>
);
