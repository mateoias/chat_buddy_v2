import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isCollapsed, onToggle }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

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
            <h4>Readings</h4>
            <ul className="sidebar-links">
              <li className="expandable-item">
                <Link to="/readings" className="expandable-link">
                  <span className="link-text">
                    {isExpanded ? "And Now For Something Completely Different" : "And Now For..."}
                  </span>
                  <button 
                    className={`expand-toggle ${isExpanded ? 'expanded' : ''}`}
                    onClick={toggleExpanded}
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                  >
                    ▶
                  </button>
                </Link>
              </li>
              <li><Link to="/readings">Hot Topics</Link></li>
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