import re

with open('/Users/aliceer/sol_fashion/src/components/Nav.jsx', 'r') as f:
    c = f.read()

# 1. Add categories to useAdmin
c = c.replace("const { brands, contentArticles } = useAdmin();", "const { brands, contentArticles, categories = {} } = useAdmin();")

# 2. Replace desktop navLinks
old_desktop_nav = r"""            <ul className=\{styles\.navLinks\}>
              <li><Link to="/products">New In<\/Link><\/li>
              <li><Link to="/products">Bags<\/Link><\/li>
              <li><Link to="/products">Ready-to-Wear<\/Link><\/li>
              <li><Link to="/products">Accessories<\/Link><\/li>
              <li><Link to="/explore">Explore<\/Link><\/li>
            <\/ul>"""

new_desktop_nav = """            <ul className={styles.navLinks}>
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

c = re.sub(old_desktop_nav, new_desktop_nav, c)

# 3. Replace mobile navLinks (assuming they are hardcoded too)
# In mobile, it might be an accordion. Let's see what mobile has.
# The user might just want the desktop nav to look good for now, but I should try to replace the mobile one if possible.
