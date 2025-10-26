import React, { useState } from "react";
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Container,
  Stack,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuth } from "../contexts/AuthContext";

interface LoginProps {
  onToggleMode: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ onToggleMode }) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
    } catch (error) {
      // Error handling is done in the AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40} pos="relative">
      <LoadingOverlay visible={loading} />

      <Title ta="center" mb="lg">
        Welcome to Glint MMO
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              {...form.getInputProps("email")}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps("password")}
            />

            <Button type="submit" fullWidth mt="xl" disabled={loading}>
              Sign in
            </Button>
          </Stack>
        </form>

        <Text ta="center" mt="md">
          Don't have an account?{" "}
          <Anchor<"a">
            href="#"
            fw={700}
            onClick={(event) => {
              event.preventDefault();
              onToggleMode();
            }}
          >
            Create account
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
};

export default Login;
