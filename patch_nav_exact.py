with open('/Users/aliceer/sol_fashion/src/components/Nav.jsx', 'r') as f:
    c = f.read()

old_nav = """            <ul className={styles.navLinks}>
              <li><Link to="/products">New In</Link></li>
              <li><Link to="/products">Bags</Link></li>
              <li><Link to="/products">Ready-to-Wear</Link></li>
              <li><Link to="/products">Accessories</Link></li>
              <li><Link to="/explore">Explore</Link></li>
            </ul>"""

new_nav = """            <ul className={styles.navLinks}>
              <li className={styles.navItemWithDropdown}>
                <div className={styles.navDropdownWrapper}>
                  <Link to="/products?filter=new-in">New In</Link>
                  <div className={styles.navDropdownContent}>
                    <Link to="/products?filter=new-in">View All</Link>
                    {Object.keys(categories).map(cat => (
                      <Link key={cat} to={`/products?category=${cat}&filter=new-in`}>{cat}</Link>
                    ))}
                  </div>
                </div>
              </li>
              {Object.keys(categories).map(mainCat => (
                <li key={mainCat} className={styles.navItemWithDropdown}>
                  <div className={styles.navDropdownWrapper}>
                    <Link to={`/products?category=${mainCat}`}>{mainCat}</Link>
                    <div className={styles.navDropdownContent}>
                      <Link to={`/products?category=${mainCat}`} style={{ fontWeight: 600 }}>View All</Link>
                      <Link to={`/products?category=${mainCat}&filter=new-in`} style={{ color: '#d97706' }}>New In</Link>
                      {categories[mainCat].map(subCat => (
                        <Link key={subCat} to={`/products?category=${mainCat}&sub=${subCat}`}>{subCat}</Link>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
              <li><Link to="/explore">Explore</Link></li>
            </ul>"""

c = c.replace(old_nav, new_nav)

with open('/Users/aliceer/sol_fashion/src/components/Nav.jsx', 'w') as f:
    f.write(c)
