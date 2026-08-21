import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

c = re.sub(
    r'(\s*<input[^>]+/>\s*</div>)\s*</div>\s*\{/\* Main Categories Row \*/\}',
    r'''\1
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
      </div>
      {/* Main Categories Row */}''',
    c
)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
