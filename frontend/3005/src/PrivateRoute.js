import React from 'react';
import { Navigate } from 'react-router-dom';

// Assuming you have some auth context or service that lets you check user status
import { useAuth } from './store/AuthContext';

export const PrivateRoute = ({ children, roleRequired }) => {
  const { isLoggedIn, currentUser } = useAuth();

  if (!isLoggedIn) {
    // User not authenticated; redirect them to the login page
    return <Navigate to="/login" />;
  }

  if (roleRequired && currentUser.role !== roleRequired) {
    return <Navigate to="/" />;
  }

  return children;
};

