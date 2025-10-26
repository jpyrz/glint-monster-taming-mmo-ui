import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { notifications } from "@mantine/notifications";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      notifications.show({
        title: "Welcome back!",
        message: "Successfully logged in to Glint MMO",
        color: "green",
      });
    } catch (error: any) {
      let errorMessage = "Login failed";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later";
      }

      notifications.show({
        title: "Login Error",
        message: errorMessage,
        color: "red",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      notifications.show({
        title: "Welcome to Glint MMO!",
        message: "Your account has been created successfully",
        color: "green",
      });
    } catch (error: any) {
      let errorMessage = "Registration failed";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      }

      notifications.show({
        title: "Registration Error",
        message: errorMessage,
        color: "red",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      notifications.show({
        title: "Goodbye!",
        message: "Successfully logged out",
        color: "blue",
      });
    } catch (error) {
      notifications.show({
        title: "Logout Error",
        message: "Failed to log out",
        color: "red",
      });
      throw error;
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (currentUser) {
      try {
        return await currentUser.getIdToken();
      } catch (error) {
        console.error("Error getting ID token:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    register,
    logout,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
