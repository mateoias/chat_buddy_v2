// src/components/LayoutWrapper.jsx
import { useSidebar } from '../contexts/SidebarContext';
import Sidebar from './Sidebar';

function LayoutWrapper({ children, showSidebar = false }) {
  const { isOpen } = useSidebar();

  return (
    <>
      {showSidebar && <Sidebar />}
      <div className={`main-content-wrapper ${showSidebar && isOpen ? 'sidebar-active' : ''}`}>
        {children}
      </div>
    </>
  );
}

export default LayoutWrapper;