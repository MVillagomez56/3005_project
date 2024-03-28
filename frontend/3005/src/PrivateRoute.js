<<<<<<< HEAD
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
=======
import { useNavigate } from 'react-router';

// Assuming you have some auth context or service that lets you check user status
  
export const PrivateRoute = ({ children, roleRequired }) => {
  const user = localStorage.getItem('user');
  const navigate = useNavigate();

  console.log("user", user);


  if (!user) {
    // User not authenticated; redirect them to the login page
     navigate('/login');
  }

  if (roleRequired && JSON.parse(user).role !== roleRequired) {
    // User is not authorized; redirect them to the home page
    navigate('/');
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
  }

  return children;
};

