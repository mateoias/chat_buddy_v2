// src/components/Layout.jsx
import { Container } from 'react-bootstrap';

function Layout({ children, title, subtitle, maxWidth = "lg", className = "" }) {
  return (
    <div className={`page-layout ${className}`}>
      <Container size={maxWidth} className="page-content">
        {title && (
          <div className="text-center mb-4">
            <h1 className="display-4 fw-bold text-brand mb-2">{title}</h1>
            {subtitle && (
              <p className="lead text-secondary">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </Container>
    </div>
  );
}

export default Layout;