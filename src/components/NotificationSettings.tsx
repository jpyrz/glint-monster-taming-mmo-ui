import React from "react";
import { Card, Text, Button, Group, Stack, Badge, Title } from "@mantine/core";
import { IconBell, IconBellOff, IconTestPipe } from "@tabler/icons-react";
import { useFCM } from "../hooks/useFCM";

const NotificationSettings: React.FC = () => {
  const {
    fcmToken,
    isSupported,
    requestPermission,
    sendTestNotification,
    notificationPermission,
  } = useFCM();

  const getPermissionBadge = () => {
    switch (notificationPermission) {
      case "granted":
        return (
          <Badge color="green" variant="light">
            Enabled
          </Badge>
        );
      case "denied":
        return (
          <Badge color="red" variant="light">
            Blocked
          </Badge>
        );
      case "default":
      default:
        return (
          <Badge color="yellow" variant="light">
            Not Set
          </Badge>
        );
    }
  };

  if (!isSupported) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack>
          <Group>
            <IconBellOff size={20} />
            <Title order={4}>Notifications Not Supported</Title>
          </Group>
          <Text size="sm" c="dimmed">
            Your browser doesn't support push notifications or the feature is
            unavailable.
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack>
        <Group justify="space-between">
          <Group>
            <IconBell size={20} />
            <Title order={4}>Game Notifications</Title>
          </Group>
          {getPermissionBadge()}
        </Group>

        <Text size="sm" c="dimmed">
          Enable push notifications to stay updated with game events, battles,
          and important announcements.
        </Text>

        {fcmToken && (
          <Text size="xs" c="dimmed" truncate="end">
            Token: {fcmToken.substring(0, 20)}...
          </Text>
        )}

        <Group>
          {notificationPermission !== "granted" ? (
            <Button
              leftSection={<IconBell size={16} />}
              onClick={requestPermission}
              disabled={notificationPermission === "denied"}
            >
              {notificationPermission === "denied"
                ? "Enable in Browser Settings"
                : "Enable Notifications"}
            </Button>
          ) : (
            <Button
              leftSection={<IconTestPipe size={16} />}
              variant="light"
              onClick={sendTestNotification}
            >
              Send Test Notification
            </Button>
          )}
        </Group>

        {notificationPermission === "denied" && (
          <Text size="xs" c="red">
            Notifications are blocked. Please enable them in your browser
            settings and refresh the page.
          </Text>
        )}
      </Stack>
    </Card>
  );
};

export default NotificationSettings;
