import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    // STEP 1: First check sessionStorage (this is what Header.jsx uses)
    // This provides immediate feedback and prevents unnecessary server calls
    const sessionLoggedIn = sessionStorage.getItem("loggedIn") === "true";
    
    // If sessionStorage says not logged in, don't even check with server
    if (!sessionLoggedIn) {
      console.log("No session found in sessionStorage");
      setIsAuthenticated(false);
      setIsChecking(false);
      return;
    }

    // STEP 2: sessionStorage says logged in, but let's verify with server
    // This prevents issues if the server session expired but sessionStorage wasn't cleared
    try {
      const response = await fetch('http://localhost:5000/get_user_info', {
        credentials: 'include' // Important: this sends cookies to maintain session
      });
      
      const data = await response.json();
      
      // STEP 3: Check if server confirms authentication
      if (data.logged_in) {
        // Server says logged in - all good!
        console.log("Server confirmed authentication");
        setIsAuthenticated(true);
      } else {
        // Server says NOT logged in - sessionStorage is out of sync
        console.log("Server denied authentication - clearing sessionStorage");
        
        // Clear the invalid sessionStorage
        sessionStorage.removeItem('loggedIn');
        
        // Notify Header component to update login/logout button
        window.dispatchEvent(new Event("loginStatusChanged"));
        
        setIsAuthenticated(false);
      }
    } catch (error) {
      // STEP 4: If server request fails, assume not authenticated
      console.error('Error checking authentication:', error);
      
      // Clear sessionStorage since we can't verify
      sessionStorage.removeItem('loggedIn');
      window.dispatchEvent(new Event("loginStatusChanged"));
      
      setIsAuthenticated(false);
    } finally {
      // STEP 5: Done checking - stop showing loading state
      setIsChecking(false);
    }
  };

  // While checking authentication, show a loading spinner
  if (isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login page
  // The 'state' prop passes the current location so login can redirect back here
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If authenticated, render the protected content (Chat component in this case)
  return children;
}

export default ProtectedRoute;

/* 
WHY THIS APPROACH?

1. CONSISTENCY: Both Header.jsx and ProtectedRoute.jsx now use sessionStorage
   as the primary source of truth for login state.

2. SECURITY: We still verify with the server to prevent someone from manually
   setting sessionStorage and accessing protected routes.

3. PERFORMANCE: We check sessionStorage first to avoid unnecessary server calls
   when we know the user isn't logged in.

4. SYNC: If server session expires but sessionStorage still says "logged in",
   we clear sessionStorage and update the UI.

HOW IT WORKS:

1. User tries to access /chat
2. ProtectedRoute checks sessionStorage
3. If no session, immediately redirect to /login
4. If session exists, verify with server
5. If server confirms, show Chat
6. If server denies, clear sessionStorage and redirect to /login

This creates a smooth user experience while maintaining security.
*/