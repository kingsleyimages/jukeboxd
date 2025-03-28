import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check localStorage for token and user on app initialization
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      setIsAdmin(JSON.parse(storedUser).role === "admin");
    }
  }, []);

  const login = (user) => {
    setIsLoggedIn(true);
    setIsAdmin(user.role === "admin");
    setToken(user.token);
    setUser(user);
    localStorage.setItem("token", user.token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};