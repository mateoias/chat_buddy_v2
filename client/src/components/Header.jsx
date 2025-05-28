import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Header.css';

function Header({ onSidebarToggle, showSidebarToggle = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";
      setLoggedIn(isLoggedIn);
    };

    // Check immediately on mount
    checkLogin();

    // Listen for login/logout events
    window.addEventListener("loginStatusChanged", checkLogin);

    // Cleanup
    return () => {
      window.removeEventListener("loginStatusChanged", checkLogin);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    sessionStorage.clear();
    window.dispatchEvent(new Event("loginStatusChanged"));

    try {
      const response = await fetch('http://localhost:5000/logout', { 
        method: 'POST', 
        credentials: 'include' 
      });
      
      if (response.ok) {
        setLoggedIn(false);
        navigate('/');
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <nav>
        {/* Sidebar Toggle - only show on pages with sidebar */}
        {showSidebarToggle && (
          <button 
            className="sidebar-toggle-header"
            onClick={onSidebarToggle}
            aria-label="Toggle sidebar"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        )}
        
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          ☰
        </button>
        
        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          <li><Link to="/about" className={isActive('/about')}>About</Link></li>
          <li><Link to="/faqs" className={isActive('/faqs')}>FAQs</Link></li>
          <li><Link to="/chat" className={isActive('/chat')}>Chat</Link></li>

          {/* Login or Logout button */}
          {!loggedIn ? (
            <li><Link to="/login" className={isActive('/login')}>Login</Link></li>
          ) : (
            <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;