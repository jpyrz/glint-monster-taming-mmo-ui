import { useState, useEffect, useCallback } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/apiService";
import { notifications } from "@mantine/notifications";

interface NotificationPayload {
  title?: string;
  body?: string;
  data?: { [key: string]: string };
}

interface UseFCMReturn {
  fcmToken: string | null;
  isSupported: boolean;
  requestPermission: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
  notificationPermission: NotificationPermission;
}

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const useFCM = (): UseFCMReturn => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const { currentUser, getIdToken } = useAuth();

  // Check if FCM is supported (with retry logic)
  useEffect(() => {
    console.log("FCM Hook - Starting initialization check:", {
      vapidKey: !!VAPID_KEY,
      vapidKeyPreview: VAPID_KEY
        ? VAPID_KEY.substring(0, 10) + "..."
        : "Not set",
      messagingAvailable: !!messaging,
      notificationSupport: "Notification" in window,
      serviceWorkerSupport: "serviceWorker" in navigator,
    });

    let hasSucceeded = false;

    const checkSupport = () => {
      console.log("FCM Hook - Checking messaging availability:", !!messaging);
      if (messaging && !hasSucceeded) {
        hasSucceeded = true;
        console.log(
          "FCM Hook - Messaging is available, setting supported to true"
        );
        setIsSupported(true);
        setNotificationPermission(Notification.permission);
        return true;
      }
      return hasSucceeded;
    };

    // Try immediately
    if (!checkSupport()) {
      console.log(
        "FCM Hook - Messaging not available immediately, setting up retries..."
      );
      // If not available, retry a few times with increasing delays
      const retryDelays = [500, 1000, 2000, 3000];
      retryDelays.forEach((delay, index) => {
        setTimeout(() => {
          if (!hasSucceeded) {
            if (checkSupport()) {
              console.log(
                `FCM Hook - Messaging became available after ${delay}ms`
              );
            } else if (index === retryDelays.length - 1) {
              console.log(
                "FCM Hook - Messaging still not available after all retries"
              );
              console.log("FCM Hook - Final check - messaging:", !!messaging);
              console.log(
                "FCM Hook - Final check - window.firebaseMessaging:",
                !!(window as any).firebaseMessaging
              );
            }
          }
        }, delay);
      });
    }
  }, []);

  // Listen for foreground messages
  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload: NotificationPayload) => {
      console.log("Message received in foreground:", payload);

      // Show notification in the app
      notifications.show({
        title: payload.title || "New Notification",
        message: payload.body || "You have a new message",
        color: "blue",
        autoClose: 5000,
      });
    });

    return () => unsubscribe();
  }, [isSupported]);

  // Monitor FCM token state changes
  useEffect(() => {
    console.log("FCM Hook - Token state changed:", {
      fcmToken: !!fcmToken,
      tokenPreview: fcmToken ? fcmToken.substring(0, 20) + "..." : "null",
      currentUser: !!currentUser,
    });
  }, [fcmToken, currentUser]);

  // Auto-generate token if permission is already granted but no token exists
  useEffect(() => {
    const autoGenerateToken = async () => {
      if (
        isSupported &&
        notificationPermission === "granted" &&
        !fcmToken &&
        messaging &&
        VAPID_KEY
      ) {
        console.log(
          "FCM Hook - Auto-generating token (permission already granted)"
        );
        try {
          const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
          });

          if (token) {
            console.log(
              "FCM Hook - Auto-generated token:",
              token.substring(0, 20) + "..."
            );
            setFcmToken(token);
          }
        } catch (error) {
          console.error("FCM Hook - Failed to auto-generate token:", error);
        }
      }
    };

    autoGenerateToken();
  }, [isSupported, notificationPermission, fcmToken, messaging]);

  // Register FCM token with backend when user is authenticated
  useEffect(() => {
    const registerTokenWithBackend = async () => {
      if (fcmToken && currentUser) {
        try {
          const authToken = await getIdToken();
          if (authToken) {
            await apiService.registerFCMToken(fcmToken, authToken, {
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
            });
            console.log("FCM token registered with backend successfully");
          }
        } catch (error) {
          console.error("Failed to register FCM token with backend:", error);
        }
      }
    };

    registerTokenWithBackend();
  }, [fcmToken, currentUser, getIdToken]);

  const requestPermission = useCallback(async () => {
    console.log("FCM Hook - Requesting permission:", {
      messaging: !!messaging,
      vapidKey: !!VAPID_KEY,
    });

    if (!messaging) {
      throw new Error("FCM is not supported in this browser");
    }

    if (!VAPID_KEY) {
      throw new Error("VAPID key is not configured");
    }

    try {
      // Request notification permission
      console.log("FCM Hook - Requesting notification permission...");
      const permission = await Notification.requestPermission();
      console.log("FCM Hook - Permission result:", permission);
      setNotificationPermission(permission);

      if (permission === "granted") {
        console.log("FCM Hook - Getting token with VAPID key...");
        // Get the FCM token
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
        });

        console.log(
          "FCM Hook - Token result:",
          token ? "Token received" : "No token"
        );
        if (token) {
          console.log(
            "FCM Hook - Setting token in state:",
            token.substring(0, 20) + "..."
          );
          setFcmToken(token);
          console.log("FCM Token set in state");

          notifications.show({
            title: "Notifications Enabled",
            message: "You will now receive game notifications!",
            color: "green",
          });
        } else {
          console.log("No registration token available.");
          notifications.show({
            title: "Token Error",
            message: "Failed to get notification token. Please try again.",
            color: "orange",
          });
        }
      } else {
        notifications.show({
          title: "Permission Denied",
          message:
            "You won't receive game notifications. You can enable them in your browser settings.",
          color: "yellow",
        });
      }
    } catch (error) {
      console.error("An error occurred while retrieving token:", error);
      notifications.show({
        title: "Notification Error",
        message: "Failed to enable notifications. Please try again.",
        color: "red",
      });
    }
  }, []);

  const sendTestNotification = useCallback(async () => {
    console.log("FCM Hook - Send test notification called:", {
      currentUser: !!currentUser,
      fcmToken: !!fcmToken,
      fcmTokenPreview: fcmToken ? fcmToken.substring(0, 20) + "..." : "null",
    });

    if (!currentUser) {
      notifications.show({
        title: "Authentication Required",
        message: "Please log in to send test notifications",
        color: "orange",
      });
      return;
    }

    if (!fcmToken) {
      console.log("FCM Hook - No FCM token available");
      notifications.show({
        title: "No FCM Token",
        message: "Please enable notifications first to test them",
        color: "orange",
      });
      return;
    }

    try {
      const authToken = await getIdToken();
      if (authToken) {
        await apiService.sendTestNotificationToToken(
          authToken,
          fcmToken,
          currentUser.uid,
          currentUser.email || "Unknown User",
          "Test Notification",
          "This is a test notification from Glint MMO!",
          { type: "test", timestamp: new Date().toISOString() }
        );

        notifications.show({
          title: "Test Notification Sent",
          message: "Check if you received the push notification!",
          color: "blue",
        });
      }
    } catch (error) {
      console.error("Failed to send test notification:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      notifications.show({
        title: "Send Failed",
        message: `Failed to send test notification: ${errorMessage}`,
        color: "red",
      });
    }
  }, [currentUser, getIdToken, fcmToken]);

  return {
    fcmToken,
    isSupported,
    requestPermission,
    sendTestNotification,
    notificationPermission,
  };
};
