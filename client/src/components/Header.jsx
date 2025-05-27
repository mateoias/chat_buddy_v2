import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();

    // Listen for login/logout events
    window.addEventListener("loginStatusChanged", checkLoginStatus);

    // Cleanup
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
    <header className="header">
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/faqs">Language Learning FAQs</Link></li>

          {/* Always show Chat link */}
          <li><Link to="/chat">Chat</Link></li>

          {/* Login or Logout button */}
          {!loggedIn ? (
            <li><Link to="/login">Login</Link></li>
          ) : (
            <li>
              <button 
                onClick={handleLogout} 
                className="logout-button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;