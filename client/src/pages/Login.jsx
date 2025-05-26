// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import Layout from '../components/Layout';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nativeLang, setNativeLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [loading, setLoading] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.from) {
      setShowLoginMessage(true);
    }
  }, [location.state]);

  const languageOptions = [
    { value: 'zh', label: 'Chinese' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'es', label: 'Spanish' }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      username,
      password,
      nativeLang,
      targetLang
    };

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('nativeLang', nativeLang);
        sessionStorage.setItem('targetLang', targetLang);
        window.dispatchEvent(new Event("loginStatusChanged"));
        
        const from = location.state?.from?.pathname || '/chat';
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Server error during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Login" subtitle="Sign in to start practicing">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {showLoginMessage && (
            <Alert variant="info" className="mb-4">
              Please log in to continue to the chat.
            </Alert>
          )}
          
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Card className="form-section border-0">
            <Card.Body>
              <Form onSubmit={handleLogin}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="username"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="current-password"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Native Language</Form.Label>
                      <Form.Select 
                        value={nativeLang} 
                        onChange={(e) => setNativeLang(e.target.value)}
                        disabled={loading}
                      >
                        {languageOptions.map(lang => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Target Language</Form.Label>
                      <Form.Select 
                        value={targetLang} 
                        onChange={(e) => setTargetLang(e.target.value)}
                        disabled={loading}
                      >
                        {languageOptions.map(lang => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <p className="text-secondary">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    state={{ from: location.state?.from }}
                    className="text-decoration-none"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}

export default Login;