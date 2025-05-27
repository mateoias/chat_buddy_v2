import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Header() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener("loginStatusChanged", checkLoginStatus);
    return () => {
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
    };
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_user_info', {
        credentials: 'include'
      });
      const data = await response.json();
      setLoggedIn(data.logged_in);
    } catch (error) {
      console.error('Error checking login status:', error);
      setLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', { 
        method: 'POST', 
        credentials: 'include' 
      });
      
      if (response.ok) {
        setLoggedIn(false);
        window.dispatchEvent(new Event("loginStatusChanged"));
        navigate('/');
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error during logout. Please try again.');
    }
  };

  return (
    <header className="app-header fixed-top">
      <nav className="navbar navbar-expand-lg h-100">
        <div className="container-fluid">
          {/* Brand */}
          <Link className="navbar-brand fw-bold text-brand" to="/">
            🗣️ LangAI
          </Link>

          {/* Mobile toggle button */}
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto nav-links">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/chat">Practice</Link>
              </li>
            </ul>

            {/* Auth buttons */}
            <div className="d-flex">
              {!loggedIn ? (
                <Link to="/login" className="btn btn-outline-light">
                  Login
                </Link>
              ) : (
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-light"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;