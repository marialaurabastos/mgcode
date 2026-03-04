import { ReactNode } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import './layout.css';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;