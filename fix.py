import re
with open('/Users/aliceer/sol_fashion/src/components/SearchDrawer.jsx', 'r') as f:
    c = f.read()
c = c.replace('className={}', 'className={`${styles.sortDropdownItem} ${sortBy === \'price-desc\' ? styles.sortDropdownItemActive : \'\'}`}')
with open('/Users/aliceer/sol_fashion/src/components/SearchDrawer.jsx', 'w') as f:
    f.write(c)
