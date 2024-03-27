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

  if (roleRequired && user.role !== roleRequired) {
    // User is not authorized; redirect them to the home page
    navigate('/');
  }

  return children;
};

