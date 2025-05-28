import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar.jsx';

function LayoutWrapper({ children, showSidebar = false }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <>
      <Header 
        showSidebarToggle={showSidebar} 
        onSidebarToggle={handleSidebarToggle} 
      />
      <div className={`layout-wrapper ${showSidebar ? 'with-sidebar' : ''}`}>
        {showSidebar && (
          <Sidebar 
            isCollapsed={sidebarCollapsed} 
            onToggle={handleSidebarToggle} 
          />
        )}
        <main className={`main-content ${showSidebar && !sidebarCollapsed ? 'sidebar-active' : ''}`}>
          {children}
        </main>
      </div>
    </>
  );
}

export default LayoutWrapper;