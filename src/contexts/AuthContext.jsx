import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  checkUsername as apiCheckUsername,
  checkEmail,
  registerUser,
  loginUser,
  getUserById,
} from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  async function fetchCurrentUser() {
    const savedId = localStorage.getItem("userId");

    if (!savedId) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await getUserById(savedId);

      const { password, ...safeUser } = currentUser;
      setUser(safeUser);
    } catch {
      localStorage.removeItem("userId");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(credentials) {
    const currentUser = await loginUser(credentials);

    localStorage.setItem("userId", String(currentUser.id));

    const { password, ...safeUser } = currentUser;
    setUser(safeUser);

    return safeUser;
  }

  async function register(userData) {
    const usernameExists = await apiCheckUsername(
      userData.username
    );

    if (usernameExists) {
      throw new Error("Username already exists");
    }

    const emailExists = await checkEmail(userData.email);

    if (emailExists) {
      throw new Error("Email already registered");
    }

    const newUser = await registerUser({
      ...userData,
      username: userData.username.trim(),
      email: userData.email.trim().toLowerCase(),
      avatar: "",
      createdAt: new Date().toISOString(),
    });

    return newUser;
  }

  function logout() {
    localStorage.removeItem("userId");
    setUser(null);
  }

  function isAuthenticated() {
    return user !== null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated,
        fetchCurrentUser,
        checkUsername: apiCheckUsername,
        checkEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}