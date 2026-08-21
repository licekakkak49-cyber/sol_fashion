import re
with open('/Users/aliceer/sol_fashion/src/components/SearchDrawer.jsx', 'r') as f:
    c = f.read()
c = c.replace("'price-desc' ? styles.sortDropdownItemActive : ''}`}
                                 onClick={() => { setSortBy('price-asc')", "'price-asc' ? styles.sortDropdownItemActive : ''}`}
                                 onClick={() => { setSortBy('price-asc')")
with open('/Users/aliceer/sol_fashion/src/components/SearchDrawer.jsx', 'w') as f:
    f.write(c)
