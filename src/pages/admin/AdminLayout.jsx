import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Package, Tag, Settings, LogOut, Hexagon, PanelTop, Eye, BookOpen } from 'lucide-react';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  return (
    <div className={styles.adminLayoutWrapper}>
      
      {/* Integrated Dock with Border */}
      <aside className={styles.dock}>
        <Link to="/" className={styles.dockLogo} data-tooltip="View Site">
          <Hexagon size={24} strokeWidth={2} />
        </Link>
        
        <nav className={styles.dockNav} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavLink 
            to="/admin/brands" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
            data-tooltip="Brands"
          >
            {({ isActive }) => (
              <Tag size={20} strokeWidth={isActive ? 2 : 1.5} fill={isActive ? "currentColor" : "none"} />
            )}
          </NavLink>
          
          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
            data-tooltip="Products"
          >
            {({ isActive }) => (
              <Package size={20} strokeWidth={isActive ? 2 : 1.5} fill={isActive ? "currentColor" : "none"} />
            )}
          </NavLink>
          
          <NavLink 
            to="/admin/bespoke" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
            data-tooltip="Bespoke"
          >
            {({ isActive }) => (
              <PanelTop size={20} strokeWidth={isActive ? 2 : 1.5} fill={isActive ? "currentColor" : "none"} />
            )}
          </NavLink>

          <NavLink 
            to="/admin/lenses" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
            data-tooltip="Lenses"
          >
            {({ isActive }) => (
              <Eye size={20} strokeWidth={isActive ? 2 : 1.5} fill={isActive ? "currentColor" : "none"} />
            )}
          </NavLink>

          <NavLink 
            to="/admin/explore" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
            data-tooltip="Explore"
          >
            {({ isActive }) => (
              <BookOpen size={20} strokeWidth={isActive ? 2 : 1.5} fill={isActive ? "currentColor" : "none"} />
            )}
          </NavLink>
        </nav>

        <div className={styles.spacer}></div>

        <button className={styles.navLink} data-tooltip="Settings" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
          <Settings size={20} strokeWidth={1.5} />
        </button>
        <button className={styles.navLink} data-tooltip="Log Out" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
          <LogOut size={20} strokeWidth={1.5} />
        </button>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
