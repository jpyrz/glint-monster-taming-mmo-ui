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

interface RegisterProps {
  onToggleMode: () => void;
}

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC<RegisterProps> = ({ onToggleMode }) => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      await register(values.email, values.password);
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
        Join Glint MMO
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

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              required
              {...form.getInputProps("confirmPassword")}
            />

            <Button type="submit" fullWidth mt="xl" disabled={loading}>
              Create account
            </Button>
          </Stack>
        </form>

        <Text ta="center" mt="md">
          Already have an account?{" "}
          <Anchor<"a">
            href="#"
            fw={700}
            onClick={(event) => {
              event.preventDefault();
              onToggleMode();
            }}
          >
            Sign in
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
};

export default Register;
