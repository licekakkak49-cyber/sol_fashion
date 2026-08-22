import re

with open('/Users/aliceer/sol_fashion/src/components/Nav.jsx', 'r') as f:
    c = f.read()

# Desktop links
old_desktop = """            <ul className={styles.navLinks}>
              <li><Link to="/products?main=New In">New In</Link></li>
              <li><Link to="/products?main=Bags">Bags</Link></li>
              <li><Link to="/products?main=Ready to Wear">Ready-to-Wear</Link></li>
              <li><Link to="/products?main=Accessories & Shoes">Accessories & Shoes</Link></li>
              <li><Link to="/explore">Explore</Link></li>
            </ul>"""

new_desktop = """            <ul className={styles.navLinks}>
              <li><Link to="/products?main=New In">New In</Link></li>
              {Object.keys(categories).map(cat => (
                <li key={cat}><Link to={`/products?main=${cat}`}>{cat === 'Ready to Wear' ? 'Ready-to-Wear' : cat}</Link></li>
              ))}
              <li><Link to="/explore">Explore</Link></li>
            </ul>"""

c = c.replace(old_desktop, new_desktop)

# Mobile links
old_mobile = """                <ul className={styles.mobileMenuLinks}>
                  <li><Link to="/products?main=New In" onClick={toggleMenu}>New In</Link></li>
                  <li><Link to="/products?main=Bags" onClick={toggleMenu}>Bags</Link></li>
                  <li><Link to="/products?main=Ready to Wear" onClick={toggleMenu}>Ready-to-Wear</Link></li>
                  <li><Link to="/products?main=Accessories & Shoes" onClick={toggleMenu}>Accessories & Shoes</Link></li>
                  <li><Link to="/explore" onClick={toggleMenu}>Explore</Link></li>
                </ul>"""

new_mobile = """                <ul className={styles.mobileMenuLinks}>
                  <li><Link to="/products?main=New In" onClick={toggleMenu}>New In</Link></li>
                  {Object.keys(categories).map(cat => (
                    <li key={cat}><Link to={`/products?main=${cat}`} onClick={toggleMenu}>{cat === 'Ready to Wear' ? 'Ready-to-Wear' : cat}</Link></li>
                  ))}
                  <li><Link to="/explore" onClick={toggleMenu}>Explore</Link></li>
                </ul>"""

c = c.replace(old_mobile, new_mobile)

with open('/Users/aliceer/sol_fashion/src/components/Nav.jsx', 'w') as f:
    f.write(c)
