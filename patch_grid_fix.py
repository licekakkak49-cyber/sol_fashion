import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# 1. Remove the "New Product" button
c = re.sub(r'<button onClick=\{\(\) => \{\s*if \(isAdding\).*?\}</button>', '', c, flags=re.DOTALL)

# 2. Replace the WYSIWYG Product Grid block completely
old_grid_regex = r'\{\/\* WYSIWYG Product Grid \*\/\}.*?<\/ResponsiveGridLayout>\s*\)\}\s*<\/div>'
new_grid = '''{/* WYSIWYG Product Grid */}
      <div className={styles.productGridContainer} style={{ minHeight: '400px' }}>
        {!activeSubCategory || activeSubCategory === 'All' ? (
          <div style={{ padding: '64px', textAlign: 'center', color: '#888' }}>
            <Package size={48} strokeWidth={1} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#111', fontWeight: 500 }}>Select a Subcategory</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Please select a subcategory (e.g., Tote Bags) to view or create Look Sets.</p>
          </div>
        ) : (
          <SetsManager 
            handleEdit={handleEdit} 
            activeMainCategory={activeMainCategory}
            activeSubCategory={activeSubCategory}
          />
        )}
      </div>'''

if re.search(old_grid_regex, c, re.DOTALL):
    c = re.sub(old_grid_regex, new_grid, c, flags=re.DOTALL)
else:
    print('Failed to match WYSIWYG Product Grid')

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
