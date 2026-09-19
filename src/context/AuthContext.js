import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage when app starts
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // LOGIN
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (found) {
      setUser(found);
      localStorage.setItem("user", JSON.stringify(found));
      return true;
    }
    return false;
  };

  // CREATE ACCOUNT
  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((u) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      favorites: [],
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return true;
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // TOGGLE FAVORITE
  const toggleFavorite = (recipe) => {
    if (!user) return;

    const updatedUser = { ...user };
    const exists = updatedUser.favorites.find(
      (f) => f.idMeal === recipe.idMeal
    );

    if (exists) {
      updatedUser.favorites = updatedUser.favorites.filter(
        (f) => f.idMeal !== recipe.idMeal
      );
    } else {
      updatedUser.favorites.push(recipe);
    }

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Also update the users list in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, toggleFavorite, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}