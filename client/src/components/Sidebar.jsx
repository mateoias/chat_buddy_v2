import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isCollapsed, onToggle }) {
  return (
    <>
      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <nav className="sidebar-nav">
          <h3 className="sidebar-title">Quick Links</h3>
          
          <div className="sidebar-section">
            <h4>Learning Levels</h4>
            <ul className="sidebar-links">
              <li><Link to="/beginner">Beginner</Link></li>
              <li><Link to="/intermediate">Intermediate</Link></li>
              <li><Link to="/advanced">Advanced</Link></li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h4>Resources</h4>
            <ul className="sidebar-links">
              <li><Link to="/grammar-guide">Grammar Guide</Link></li>
              <li><Link to="/vocabulary">Vocabulary</Link></li>
              <li><Link to="/practice-exercises">Practice Exercises</Link></li>
              <li><Link to="/cultural-notes">Cultural Notes</Link></li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h4>Community</h4>
            <ul className="sidebar-links">
              <li><Link to="/forums">Forums</Link></li>
              <li><Link to="/study-groups">Study Groups</Link></li>
              <li><Link to="/language-partners">Language Partners</Link></li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h4>Support</h4>
            <ul className="sidebar-links">
              <li><Link to="/faqs">FAQs</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/feedback">Give Feedback</Link></li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="sidebar-overlay"
          onClick={onToggle}
        ></div>
      )}
    </>
  );
}

export default Sidebar;