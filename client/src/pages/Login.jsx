import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nativeLang, setNativeLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const navigate = useNavigate();
  const location = useLocation();

  const [showLoginMessage, setShowLoginMessage] = useState(false);
  
  useEffect(() => {
    if (location.state?.from) {
      setShowLoginMessage(true);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();

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
        credentials: 'include', // important for Flask session
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        // No more sessionStorage - server manages everything
        // Just trigger login status change event
        window.dispatchEvent(new Event("loginStatusChanged"));
        console.log("Login success! Navigating to chat...");
        const from = location.state?.from?.pathname || '/chat';
        navigate(from, { replace: true });
        console.log("Navigated to", from);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Server error during login.');
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      {showLoginMessage && (
        <div className="login-warning" style={{ color: 'red', marginBottom: '1em' }}>
          Please log in to continue.
        </div>
      )}
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-row">
          <label>
            Username:
            <input 
              type="text"
              name="username"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </label>
          <label>
            Password:
            <input 
              type="password"
              name="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Native Language:
            <select value={nativeLang} onChange={(e) => setNativeLang(e.target.value)}>
              <option value="zh">Chinese</option>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="es">Spanish</option>
            </select>
          </label>

          <label>
            Target Language:
            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
              <option value="zh">Chinese</option>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="es">Spanish</option>
            </select>
          </label>
        </div>

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account?{' '}
        <button
          type="button"
          className="link-button"
          onClick={() => navigate('/signup', { state: { from: location.state?.from } })}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default LoginPage;