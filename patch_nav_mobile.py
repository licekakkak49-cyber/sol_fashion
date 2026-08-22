with open('/Users/aliceer/sol_fashion/src/components/Nav.jsx', 'r') as f:
    c = f.read()

old_mobile_nav = """                <ul className={styles.mobileMenuLinks}>
                  <li><Link to="/products" onClick={toggleMenu}>New In</Link></li>
                  <li><Link to="/products" onClick={toggleMenu}>Bags</Link></li>
                  <li><Link to="/products" onClick={toggleMenu}>Ready-to-Wear</Link></li>
                  <li><Link to="/products" onClick={toggleMenu}>Accessories</Link></li>
                  <li><Link to="/explore" onClick={toggleMenu}>Explore</Link></li>
                </ul>"""

new_mobile_nav = """                <ul className={styles.mobileMenuLinks}>
                  <li><Link to="/products?filter=new-in" onClick={toggleMenu}>New In</Link></li>
                  {Object.keys(categories).map(cat => (
                    <li key={cat}><Link to={`/products?category=${cat}`} onClick={toggleMenu}>{cat}</Link></li>
                  ))}
                  <li><Link to="/explore" onClick={toggleMenu}>Explore</Link></li>
                </ul>"""

c = c.replace(old_mobile_nav, new_mobile_nav)

with open('/Users/aliceer/sol_fashion/src/components/Nav.jsx', 'w') as f:
    f.write(c)
