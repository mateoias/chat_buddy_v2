// src/components/Header.jsx
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Header() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";
      setLoggedIn(isLoggedIn);
    };

    checkLogin();
    window.addEventListener("loginStatusChanged", checkLogin);

    return () => {
      window.removeEventListener("loginStatusChanged", checkLogin);
    };
  }, []);

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

  return (
    <Navbar 
      expand="lg" 
      className="app-header fixed-top" 
      variant="dark"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          <span className="text-brand">Language</span> Exchange AI
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="fw-medium">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="fw-medium">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/faqs" className="fw-medium">
              FAQs
            </Nav.Link>
            {loggedIn && (
              <Nav.Link as={Link} to="/chat" className="fw-medium">
                Chat
              </Nav.Link>
            )}
          </Nav>
          
          <Nav className="ms-auto">
            {!loggedIn ? (
              <>
                <Nav.Link as={Link} to="/login" className="fw-medium">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Nav.Link>
              </>
            ) : (
              <Button 
                variant="outline-light" 
                size="sm" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;