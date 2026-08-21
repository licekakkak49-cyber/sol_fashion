import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

old_search = '''          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: isMobile ? '10px 16px 10px 42px' : '14px 20px 14px 48px', border: 'none', borderRadius: '100px', fontSize: isMobile ? '14px' : '15px', outline: 'none', background: '#F3F4F6', color: '#111' }}
          />
        </div>


      </div>'''

new_search = '''          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: isMobile ? '10px 16px 10px 42px' : '14px 20px 14px 48px', border: 'none', borderRadius: '100px', fontSize: isMobile ? '14px' : '15px', outline: 'none', background: '#F3F4F6', color: '#111' }}
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
            <PanelTop size={16} /> <span style={{ display: isMobile ? 'none' : 'inline' }}>Layout</span>
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
            <Settings size={16} /> <span style={{ display: isMobile ? 'none' : 'inline' }}>List</span>
          </button>
        </div>

      </div>'''

if old_search in c:
    c = c.replace(old_search, new_search)
else:
    print('Search block not found')

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
