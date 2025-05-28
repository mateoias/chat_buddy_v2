// src/components/Sidebar.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSidebar } from '../contexts/SidebarContext';
import './Sidebar.css';

const sidebarData = {
  levels: [
    { name: 'Beginner (A1-A2)', link: '/faqs#beginner' },
    { name: 'Intermediate (B1-B2)', link: '/faqs#intermediate' },
    { name: 'Advanced (C1-C2)', link: '/faqs#advanced' }
  ],
  popular: [
    { name: 'Travel & Culture', link: '/faqs#travel' },
    { name: 'Food & Cooking', link: '/faqs#food' },
    { name: 'Work & Business', link: '/faqs#work' },
    { name: 'Hobbies & Entertainment', link: '/faqs#hobbies' },
    { name: 'Daily Conversations', link: '/faqs#daily' },
    { name: 'Family & Friends', link: '/faqs#family' }
  ],
  learning: [
    { name: 'Grammar Tips', link: '/faqs#grammar' },
    { name: 'Pronunciation Guide', link: '/faqs#pronunciation' },
    { name: 'Common Mistakes', link: '/faqs#mistakes' },
    { name: 'Study Strategies', link: '/faqs#study' },
    { name: 'Vocabulary Building', link: '/faqs#vocabulary' },
    { name: 'Listening Practice', link: '/faqs#listening' }
  ]
};

function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();

  // Close sidebar on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent body scroll on mobile
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeSidebar]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for mobile/tablet */}
      <div className="sidebar-backdrop" onClick={closeSidebar} />
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h3>Topics</h3>
          <button 
            className="sidebar-close" 
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        <div className="sidebar-content">
          <section className="sidebar-section">
            <h4>By Level</h4>
            <ul>
              {sidebarData.levels.map((item, index) => (
                <li key={index}>
                  <Link to={item.link} onClick={closeSidebar}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="sidebar-section">
            <h4>Popular Topics</h4>
            <ul>
              {sidebarData.popular.map((item, index) => (
                <li key={index}>
                  <Link to={item.link} onClick={closeSidebar}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="sidebar-section">
            <h4>Language Learning</h4>
            <ul>
              {sidebarData.learning.map((item, index) => (
                <li key={index}>
                  <Link to={item.link} onClick={closeSidebar}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;