import React from 'react';
import Header from './Header';

interface ILayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  headerActions?: React.ReactNode;
}

// Single Responsibility Principle - Only handles page layout structure
const Layout: React.FC<ILayoutProps> = ({ children, showNavigation = false, headerActions }) => {
  return (
    <div className="min-h-screen" style={{ background: 'var(--primary-bg)' }}>
      {showNavigation && (
        <Header 
          user={{
            username: "مدير الموارد البشرية",
            role: "HRManager",
            email: "hr@company.com"
          }}
        />
      )}
      
      <main className="min-h-screen p-4 lg:p-6 xl:p-8">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;