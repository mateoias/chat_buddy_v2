import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from "./components/ProtectedRoute";
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={
          <div className="page-layout">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <main className="landing-page">
                    <h1 className="display-4 fw-bold">Welcome to Language Exchange AI</h1>
                    <p className="lead">Your personal language learning companion powered by AI.</p>
                    <div className="mt-4">
                      <a href="/login" className="btn btn-primary btn-lg me-3">Get Started</a>
                      <a href="/about" className="btn btn-outline-primary btn-lg">Learn More</a>
                    </div>
                  </main>
                </div>
              </div>
            </div>
          </div>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;