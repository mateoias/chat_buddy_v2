import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nativeLang, setNativeLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

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
          // Add this line to set sessionStorage
          sessionStorage.setItem('loggedIn', 'true');
          
          window.dispatchEvent(new Event("loginStatusChanged"));
          const from = location.state?.from?.pathname || '/chat';
          navigate(from, { replace: true });
      } 
        else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Server error during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-layout">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="form-section">
              <div className="text-center mb-4">
                <h2 className="h3 fw-bold text-brand">Welcome Back</h2>
                <p className="text-muted">Sign in to continue your language learning journey</p>
              </div>

              {showLoginMessage && (
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Please log in to continue.
                </div>
              )}

              <form onSubmit={handleLogin}>
                {/* Username and Password Row */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input 
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="form-control"
                      autoComplete="username"
                      required 
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      autoComplete="current-password"
                      required 
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Language Selection Row */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="nativeLang" className="form-label">Native Language</label>
                    <select 
                      id="nativeLang"
                      value={nativeLang} 
                      onChange={(e) => setNativeLang(e.target.value)}
                      className="form-select"
                      disabled={isLoading}
                    >
                      <option value="zh">🇨🇳 Chinese</option>
                      <option value="en">🇺🇸 English</option>
                      <option value="fr">🇫🇷 French</option>
                      <option value="de">🇩🇪 German</option>
                      <option value="it">🇮🇹 Italian</option>
                      <option value="es">🇪🇸 Spanish</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="targetLang" className="form-label">Target Language</label>
                    <select 
                      id="targetLang"
                      value={targetLang} 
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="form-select"
                      disabled={isLoading}
                    >
                      <option value="zh">🇨🇳 Chinese</option>
                      <option value="en">🇺🇸 English</option>
                      <option value="fr">🇫🇷 French</option>
                      <option value="de">🇩🇪 German</option>
                      <option value="it">🇮🇹 Italian</option>
                      <option value="es">🇪🇸 Spanish</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </span>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => navigate('/signup', { state: { from: location.state?.from } })}
                    disabled={isLoading}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;