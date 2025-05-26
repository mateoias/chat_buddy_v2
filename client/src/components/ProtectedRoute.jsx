import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const location = useLocation();

  // Always read loggedIn directly from sessionStorage on every render
  const loggedIn = sessionStorage.getItem("loggedIn") === "true";

  if (!loggedIn) {
    // Redirect to login, save current location so we can return after login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
