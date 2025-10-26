import {
  AppShell,
  Burger,
  Button,
  Group,
  Title,
  Text,
  Container,
  Card,
  Badge,
  Grid,
  Stack,
  Menu,
  Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconSword,
  IconShield,
  IconHeart,
  IconLogout,
  IconSettings,
  IconBell,
} from "@tabler/icons-react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthContainer from "./components/AuthContainer";
import NotificationSettings from "./components/NotificationSettings";

const MainApp = () => {
  const [opened, { toggle }] = useDisclosure();
  const { currentUser, logout } = useAuth();

  const showNotification = () => {
    notifications.show({
      title: "Welcome to Glint MMO!",
      message: "Your monster taming adventure begins now! 🐾",
      color: "blue",
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title order={3}>Glint Monster Taming MMO</Title>
          </Group>

          <Group>
            <Text size="sm">Welcome, {currentUser?.email}</Text>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Avatar size="sm" style={{ cursor: "pointer" }}>
                  {currentUser?.email?.charAt(0).toUpperCase()}
                </Avatar>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                  Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  color="red"
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack>
          <Title order={4}>Navigation</Title>
          <Button variant="light" leftSection={<IconSword size={16} />}>
            Battle Arena
          </Button>
          <Button variant="light" leftSection={<IconShield size={16} />}>
            Monster Collection
          </Button>
          <Button variant="light" leftSection={<IconHeart size={16} />}>
            Care Center
          </Button>
          <Button variant="light" leftSection={<IconBell size={16} />}>
            Notifications
          </Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="xl">
          <Stack gap="xl">
            <div>
              <Title order={1} mb="md">
                Welcome to Glint Monster Taming MMO
              </Title>
              <Text size="lg" c="dimmed" mb="xl">
                Embark on an epic adventure to discover, tame, and train
                magnificent monsters in this immersive MMO experience.
              </Text>
              <Button size="lg" onClick={showNotification}>
                Start Your Adventure
              </Button>
            </div>

            {/* Notification Settings Card */}
            <NotificationSettings />

            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>Monster Discovery</Text>
                    <Badge color="pink" variant="light">
                      Coming Soon
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Explore vast worlds and discover rare monsters with unique
                    abilities and characteristics.
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>Training System</Text>
                    <Badge color="blue" variant="light">
                      In Development
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Train your monsters to improve their stats, learn new
                    skills, and evolve into powerful forms.
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>Multiplayer Battles</Text>
                    <Badge color="green" variant="light">
                      Planned
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Challenge other tamers in real-time battles and climb the
                    competitive leaderboards.
                  </Text>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

const AuthWrapper = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <AuthContainer />;
  }

  return <MainApp />;
};

export default App;
