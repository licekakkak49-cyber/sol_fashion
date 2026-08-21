import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# 1. Remove All and Sets buttons
old_buttons = '''        <div style={{ display: 'flex', background: '#F3F4F6', padding: '4px', borderRadius: '100px', gap: '4px', whiteSpace: 'nowrap' }}>
          <button
            onClick={() => { setActiveMainCategory('All'); setActiveSubCategory('All'); }}
            style={{
              padding: isMobile ? '6px 14px' : '8px 20px',
              border: 'none',
              borderRadius: '100px',
              background: activeMainCategory === 'All' ? '#fff' : 'transparent',
              color: activeMainCategory === 'All' ? '#111' : '#666',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: activeMainCategory === 'All' ? 600 : 500,
              boxShadow: activeMainCategory === 'All' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            All Categories
          </button>
          <button
            onClick={() => { setActiveMainCategory('Sets'); setActiveSubCategory('All'); }}
            style={{
              padding: isMobile ? '6px 14px' : '8px 20px',
              border: 'none',
              borderRadius: '100px',
              background: activeMainCategory === 'Sets' ? '#fff' : 'transparent',
              color: activeMainCategory === 'Sets' ? '#111' : '#666',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: activeMainCategory === 'Sets' ? 600 : 500,
              boxShadow: activeMainCategory === 'Sets' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            Sets (Looks)
          </button>
          {Object.keys(categories).map(cat => ('''

new_buttons = '''        <div style={{ display: 'flex', background: '#F3F4F6', padding: '4px', borderRadius: '100px', gap: '4px', whiteSpace: 'nowrap' }}>
          {Object.keys(categories).map(cat => ('''

if old_buttons in c:
    c = c.replace(old_buttons, new_buttons)
else:
    print('Failed to replace buttons')

# 2. Remove "All" subcategory button
old_sub_all = '''        <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: isMobile ? '4px' : '0' }}>
          <button
            onClick={() => setActiveSubCategory('All')}
            style={{
              padding: isMobile ? '0 0 8px 0' : '0 0 12px 0',
              border: 'none',
              background: 'transparent',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: activeSubCategory === 'All' ? 600 : 500,
              color: activeSubCategory === 'All' ? '#111' : '#888',
              borderBottom: activeSubCategory === 'All' ? '2px solid #111' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            All
            <span style={{ 
              background: activeSubCategory === 'All' ? '#f3f4f6' : 'transparent',
              padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 600
            }}>
              {activeMainCategory === 'All' 
                ? validProducts.length 
                : validProducts.filter(p => p.mainCategory === activeMainCategory).length}
            </span>
          </button>
          
          {activeMainCategory !== 'All' && categories[activeMainCategory] && categories[activeMainCategory].map(sub => ('''

new_sub_all = '''        <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: isMobile ? '4px' : '0' }}>
          {activeMainCategory && categories[activeMainCategory] && categories[activeMainCategory].map(sub => ('''

if old_sub_all in c:
    c = c.replace(old_sub_all, new_sub_all)
else:
    print('Failed to replace sub All')

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
