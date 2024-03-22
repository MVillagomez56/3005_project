// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     // Attempt to fetch the user from localStorage or validate the current session
//     const user = localStorage.getItem('user');
//     if (user) {
//       setCurrentUser(JSON.parse(user));
//       setIsLoggedIn(true);
//     }
//   }, [setCurrentUser, setIsLoggedIn]);

  const login = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user)); // Store user info in localStorage
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('user'); // Clear user info from localStorage
  };

  const value = {
    isLoggedIn,
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
