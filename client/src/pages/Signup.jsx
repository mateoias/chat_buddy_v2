// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import Layout from '../components/Layout';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigate('/login', { 
          state: { 
            message: 'Account created successfully! Please log in.' 
          }
        });
      } else {
        const data = await response.json();
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Server error during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout 
      title="Create Account" 
      subtitle="Join thousands of learners practicing with AI"
    >
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Card className="form-section border-0">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="your.email@example.com"
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        minLength={6}
                        placeholder="At least 6 characters"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        disabled={loading}
                        placeholder="Confirm your password"
                      />
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
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <p className="text-secondary">
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none">
                    Sign in here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Features Preview */}
          <div className="content-card mt-4">
            <h5 className="text-brand mb-3">What you'll get:</h5>
            <div className="row g-3">
              <div className="col-6">
                <div className="text-center">
                  <div className="fs-2 mb-2">🤖</div>
                  <small className="text-muted">AI Conversation Partner</small>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center">
                  <div className="fs-2 mb-2">🎯</div>
                  <small className="text-muted">Personalized Learning</small>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center">
                  <div className="fs-2 mb-2">📚</div>
                  <small className="text-muted">Multiple Languages</small>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center">
                  <div className="fs-2 mb-2">⏰</div>
                  <small className="text-muted">Practice 24/7</small>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Layout>
  );
}

export default Signup;