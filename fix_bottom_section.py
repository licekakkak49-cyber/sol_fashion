import re

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'r') as f:
    c = f.read()

# Fix bottom section syntax
c = c.replace("""{!previewSets && (
      {/* Bottom Section */}
      <div className={styles.bottomSection}>""", """{!previewSets && (
      <div className={styles.bottomSection}>""")

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'w') as f:
    f.write(c)
