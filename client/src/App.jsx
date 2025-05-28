import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutWrapper from './components/LayoutWrapper';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import FAQs from './pages/FAQs';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page with sidebar */}
        <Route path="/" element={
          <LayoutWrapper showSidebar={true}>
            <div className="home-page">
              <h1>Welcome to Language Exchange AI</h1>
              <p>Your personal language learning companion.</p>
              
              <section className="home-features">
                <h2>Start Your Language Journey</h2>
                <div className="feature-cards">
                  <div className="feature-card">
                    <h3>🎯 Personalized Learning</h3>
                    <p>AI adapts to your level and learning pace</p>
                  </div>
                  <div className="feature-card">
                    <h3>💬 Natural Conversations</h3>
                    <p>Practice with context-aware responses</p>
                  </div>
                  <div className="feature-card">
                    <h3>📈 Progressive Difficulty</h3>
                    <p>From beginner to advanced levels</p>
                  </div>
                </div>
              </section>

              <section className="home-cta">
                <h2>Ready to Start?</h2>
                <p>Choose your level and begin practicing today!</p>
                <div className="cta-buttons">
                  <a href="/login" className="cta-button primary">Get Started</a>
                  <a href="/about" className="cta-button secondary">Learn More</a>
                </div>
              </section>
            </div>
          </LayoutWrapper>
        } />

        {/* About page without sidebar */}
        <Route path="/about" element={
          <LayoutWrapper showSidebar={false}>
            <About />
          </LayoutWrapper>
        } />

        {/* FAQs page with sidebar */}
        <Route path="/faqs" element={
          <LayoutWrapper showSidebar={true}>
            <FAQs />
          </LayoutWrapper>
        } />

        {/* Login page without sidebar */}
        <Route path="/login" element={
          <LayoutWrapper showSidebar={false}>
            <Login />
          </LayoutWrapper>
        } />

        {/* Signup page without sidebar */}
        <Route path="/signup" element={
          <LayoutWrapper showSidebar={false}>
            <Signup />
          </LayoutWrapper>
        } />

        {/* Chat page without sidebar (protected) */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <LayoutWrapper showSidebar={false}>
                <Chat />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;