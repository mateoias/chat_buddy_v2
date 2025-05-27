import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = checking, true/false = result

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_user_info', {
        credentials: 'include'
      });
      const data = await response.json();
      setIsLoggedIn(data.logged_in);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  // Show loading while checking
  if (isLoggedIn === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        Checking login status...
      </div>
    );
  }

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Render protected content
  return children;
}

export default ProtectedRoute;