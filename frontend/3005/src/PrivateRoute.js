import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const PrivateRoute = ({ children, roleRequired }) => {
  console.log("PrivateRoute");
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  let user = null;

  // Try parsing the user string from localStorage
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    console.error("Error parsing user from localStorage", e);
  }

  useEffect(() => {
    if (!user) {
      // User not authenticated; redirect them to the login page
      navigate('/login');
    } else if (roleRequired && user.role !== roleRequired) {
      // If role doesn't match, navigate away (e.g., to the home page)
      navigate('/');
    }
  }, [navigate, user, roleRequired]); // Dependency array includes navigate, user, and roleRequired to handle changes

  // If the user is null (unauthenticated) or role doesn't match, prevent children from rendering
  if (!user || (roleRequired && user.role !== roleRequired)) {
    console.log("Not equal");
    return null; // Return null, a loading indicator, or a placeholder as appropriate
  }

  // If all checks pass, render the children components
  return children;
};
