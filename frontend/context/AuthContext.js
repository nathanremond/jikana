import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [id_user, setId_user] = useState(null);
  const [email, setEmail] = useState(null);
  const [id_role, setId_role] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedId_user = localStorage.getItem("id_user");
    const storedEmail = localStorage.getItem("email");
    const storedId_role = localStorage.getItem("id_role");
    if (storedToken) setToken(storedToken);
    if (storedId_user) setId_user(Number(storedId_user));
    if (storedEmail) setEmail(storedEmail);
    if (storedId_role) setId_role(Number(storedId_role));
    setIsLoading(false);
  }, []);

  const login = (newToken, Id_user, userEmail, Id_role) => {
    setToken(newToken);
    setId_user(Number(Id_user));
    setEmail(userEmail);
    setId_role(Number(Id_role));
    localStorage.setItem("token", newToken);
    localStorage.setItem("id_user", Id_user);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("id_role", Id_role);
  };

  const logout = () => {
    setToken(null);
    setId_user(null);
    setEmail(null);
    setId_role(null);
    localStorage.removeItem("token");
    localStorage.removeItem("id_user");
    localStorage.removeItem("email");
    localStorage.removeItem("id_role");
  };

  return (
    <AuthContext.Provider
      value={{ token, id_user, email, id_role, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;