import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# 1. Remove the dropdown from the Filter Button
old_filter_btn = r'\{isFilterOpen && \(\s*<div style=\{\{ position: \'absolute\'(.*?)</div>\s*\)\}'
c = re.sub(old_filter_btn, '', c, flags=re.DOTALL)

# 2. Insert the Full-Width Mega Filter Panel BEFORE the Active Pills
# Find the start of the Active Pills block
active_pills_start = r'\{viewMode === \'list\' && \(\s*<div style=\{\{ display: \'flex\', flexWrap: \'wrap\', gap: \'8px\', marginBottom: \'24px\', minHeight: \'32px\' \}\}>'

mega_filter = '''      {/* MEGA FILTER PANEL */}
      {viewMode === 'list' && isFilterOpen && (
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '16px', position: 'relative' }}>
          
          <button 
            onClick={() => setIsFilterOpen(false)}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}
          >
            <X size={20} />
          </button>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px' }}>
            
            {/* Column 1: Category */}
            <div style={{ flex: '1 1 200px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Categories</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {Object.keys(categories).map(cat => (
                  <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#4b5563' }}>
                    <input 
                      type="checkbox" 
                      checked={listFilters.categories.includes(cat)} 
                      onChange={() => toggleListFilter('categories', cat)} 
                      style={{ accentColor: '#111', width: '16px', height: '16px', cursor: 'pointer' }}
                    /> 
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Column 2: Stock Level */}
            <div style={{ flex: '1 1 200px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Stock Level</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#4b5563' }}>
                  <input type="checkbox" checked={listFilters.stockLevels.includes('in_stock')} onChange={() => toggleListFilter('stockLevels', 'in_stock')} style={{ accentColor: '#111', width: '16px', height: '16px', cursor: 'pointer' }} /> In Stock
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#4b5563' }}>
                  <input type="checkbox" checked={listFilters.stockLevels.includes('low_stock')} onChange={() => toggleListFilter('stockLevels', 'low_stock')} style={{ accentColor: '#111', width: '16px', height: '16px', cursor: 'pointer' }} /> Low Stock (&lt; 10)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#4b5563' }}>
                  <input type="checkbox" checked={listFilters.stockLevels.includes('out_of_stock')} onChange={() => toggleListFilter('stockLevels', 'out_of_stock')} style={{ accentColor: '#111', width: '16px', height: '16px', cursor: 'pointer' }} /> Out of Stock
                </label>
              </div>
            </div>

            {/* Column 3: Status */}
            <div style={{ flex: '1 1 200px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Status</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#4b5563' }}>
                  <input type="checkbox" checked={listFilters.statuses.includes('active')} onChange={() => toggleListFilter('statuses', 'active')} style={{ accentColor: '#111', width: '16px', height: '16px', cursor: 'pointer' }} /> Active
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#4b5563' }}>
                  <input type="checkbox" checked={listFilters.statuses.includes('draft')} onChange={() => toggleListFilter('statuses', 'draft')} style={{ accentColor: '#111', width: '16px', height: '16px', cursor: 'pointer' }} /> Draft
                </label>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', minHeight: '32px' }}>'''

c = re.sub(active_pills_start, mega_filter, c)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
