// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();

const token = sessionStorage.getItem("token"); //Add this line

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Attempt to fetch the user from localStorage or validate the current session
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsLoggedIn(true);
    }
  }, [setCurrentUser, setIsLoggedIn]);

  const signup = async (email, password, name, date_of_birth, role) => {
    //post data to server
    const response = await fetch("http://localhost:5000/api/register  ", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      body: JSON.stringify({ email, password, name, date_of_birth, role }),
    });

    if (!response.status === 200) {
      return new Error("Signup failed");
    }

    const data = await response.json();
    const user = data.user;

    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(user)); // Store user info in localStorage
      return true;
    } else {
      return false;
    }
  };

  const login = async (email, password) => {
    // post email and password to server
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status !== 200) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    const user = data.user;
    console.log(user);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(user)); // Store user info in localStorage
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("user"); // Clear user info from localStorage
    window.location.href="/login";
  };

  const value = {
    isLoggedIn,
    currentUser,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
