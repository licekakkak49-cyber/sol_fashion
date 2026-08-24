import re

with open('src/pages/admin/AdminLayout.jsx', 'r') as f:
    content = f.read()

# Replace the nav section
old_nav = """        <nav className={styles.dockNav} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavLink 
            to="/admin/brands" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive} ${styles.hideOnMobile}` : `${styles.navLink} ${styles.hideOnMobile}`}
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
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive} ${styles.hideOnMobile}` : `${styles.navLink} ${styles.hideOnMobile}`}
            data-tooltip="Bespoke"
          >
            {({ isActive }) => (
              <PanelTop size={20} strokeWidth={isActive ? 2 : 1.5} fill={isActive ? "currentColor" : "none"} />
            )}
          </NavLink>

          <NavLink 
            to="/admin/lenses" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive} ${styles.hideOnMobile}` : `${styles.navLink} ${styles.hideOnMobile}`}
            data-tooltip="Lenses"
          >
            {({ isActive }) => (
              <Eye size={20} strokeWidth={isActive ? 2 : 1.5} fill={isActive ? "currentColor" : "none"} />
            )}
          </NavLink>

          <NavLink 
            to="/admin/explore" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive} ${styles.hideOnMobile}` : `${styles.navLink} ${styles.hideOnMobile}`}
            data-tooltip="Explore"
          >
            {({ isActive }) => (
              <BookOpen size={20} strokeWidth={isActive ? 2 : 1.5} fill={isActive ? "currentColor" : "none"} />
            )}
          </NavLink>
          <NavLink to="/admin/homepage" className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <Globe size={18} />
            <span>Homepage</span>
          </NavLink>
        </nav>"""

new_nav = """        <nav className={styles.dockNav} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
            to="/admin/homepage" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
            data-tooltip="Homepage"
          >
            {({ isActive }) => (
              <Globe size={20} strokeWidth={isActive ? 2 : 1.5} fill={isActive ? "currentColor" : "none"} />
            )}
          </NavLink>
        </nav>"""

content = content.replace(old_nav, new_nav)

with open('src/pages/admin/AdminLayout.jsx', 'w') as f:
    f.write(content)

print("Admin nav fixed!")
