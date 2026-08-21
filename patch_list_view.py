import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# 1. Import InventoryList
if 'InventoryList' not in c:
    c = c.replace("import SetsManager from './components/SetsManager';", "import SetsManager from './components/SetsManager';\nimport InventoryList from './components/InventoryList';")

# 2. Add viewMode state
if 'const [viewMode, setViewMode]' not in c:
    c = c.replace("const [activeSubCategory, setActiveSubCategory] = useState('Tote Bags');", "const [activeSubCategory, setActiveSubCategory] = useState('Tote Bags');\n  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'")

# 3. Add toggle buttons in header
old_header = '''      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? '16px' : '24px', gap: isMobile ? '12px' : '24px', width: '100%' }}>
        
        {/* Full-width Centered Search */}
        <div style={{ flex: 1, maxWidth: '800px', position: 'relative' }}>'''

new_header = '''      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? '16px' : '24px', gap: isMobile ? '12px' : '24px', width: '100%', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
        
        {/* Full-width Centered Search */}
        <div style={{ flex: 1, maxWidth: '800px', position: 'relative', width: isMobile ? '100%' : 'auto' }}>'''

c = c.replace(old_header, new_header)

old_search_end = '''            style={{ width: '100%', padding: isMobile ? '10px 16px 10px 42px' : '14px 20px 14px 48px', border: 'none', borderRadius: '100px', fontSize: isMobile ? '14px' : '15px', outline: 'none', background: '#F3F4F6', color: '#111' }}
          />
        </div>

      </div>'''

new_search_end = '''            style={{ width: '100%', padding: isMobile ? '10px 16px 10px 42px' : '14px 20px 14px 48px', border: 'none', borderRadius: '100px', fontSize: isMobile ? '14px' : '15px', outline: 'none', background: '#F3F4F6', color: '#111' }}
          />
        </div>
        
        {/* View Mode Toggle */}
        <div style={{ display: 'flex', background: '#F3F4F6', padding: '4px', borderRadius: '100px', gap: '4px' }}>
          <button 
            onClick={() => setViewMode('grid')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: isMobile ? '8px 12px' : '10px 16px', border: 'none', borderRadius: '100px', cursor: 'pointer',
              background: viewMode === 'grid' ? '#fff' : 'transparent',
              color: viewMode === 'grid' ? '#111' : '#6b7280',
              fontWeight: viewMode === 'grid' ? 600 : 500,
              fontSize: '13px',
              boxShadow: viewMode === 'grid' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <PanelTop size={16} /> <span style={{ display: isMobile ? 'none' : 'inline' }}>Layout (Grid)</span>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: isMobile ? '8px 12px' : '10px 16px', border: 'none', borderRadius: '100px', cursor: 'pointer',
              background: viewMode === 'list' ? '#fff' : 'transparent',
              color: viewMode === 'list' ? '#111' : '#6b7280',
              fontWeight: viewMode === 'list' ? 600 : 500,
              fontSize: '13px',
              boxShadow: viewMode === 'list' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Settings size={16} /> <span style={{ display: isMobile ? 'none' : 'inline' }}>Inventory (List)</span>
          </button>
        </div>

      </div>'''

if old_search_end in c:
    c = c.replace(old_search_end, new_search_end)
else:
    print('Failed to replace search end')

# 4. Modify product grid container conditionally
old_grid = '''      {/* WYSIWYG Product Grid */}
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

new_grid = '''      {/* View Container */}
      <div className={styles.productGridContainer} style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        {viewMode === 'list' ? (
          <InventoryList 
            products={filteredProducts} 
            handleEdit={handleEdit} 
            handleDelete={deleteProduct} 
          />
        ) : !activeSubCategory || activeSubCategory === 'All' ? (
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

if old_grid in c:
    c = c.replace(old_grid, new_grid)
else:
    print('Failed to replace product grid')

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
