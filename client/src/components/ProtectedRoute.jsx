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
      <div className="page-layout">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="content-card text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mb-0">Checking authentication status...</p>
              </div>
            </div>
          </div>
        </div>
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