import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

old_btn = '''        {activeSubCategory && activeSubCategory !== 'All' && (
          <button className={styles.btnPrimary} onClick={() => setIsAddingSet(true)} style={{ flexShrink: 0 }}>
            <Plus size={14} style={{ marginRight: isMobile ? '0' : '6px' }} />
            {!isMobile && `New Look Set in ${activeSubCategory}`}
          </button>
        )}'''

if old_btn in c:
    c = c.replace(old_btn, '')
else:
    print('Not found')

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
