import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# 1. Add Filter Button and Dropdown to Header
old_header_end = '''          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: isMobile ? '10px 16px 10px 42px' : '14px 20px 14px 48px', border: 'none', borderRadius: '100px', fontSize: isMobile ? '14px' : '15px', outline: 'none', background: '#F3F4F6', color: '#111' }}
          />
        </div>
        
        {/* View Mode Toggle */}'''

new_header_end = '''          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: isMobile ? '10px 16px 10px 42px' : '14px 20px 14px 48px', border: 'none', borderRadius: '100px', fontSize: isMobile ? '14px' : '15px', outline: 'none', background: '#F3F4F6', color: '#111' }}
          />
        </div>

        {/* Filter Button (List Mode Only) */}
        {viewMode === 'list' && (
           <div style={{ position: 'relative' }}>
             <button 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: isMobile ? '10px 16px' : '12px 20px', borderRadius: '100px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#111', fontSize: '14px' }}
             >
               <Filter size={16} /> Filter
             </button>
             {isFilterOpen && (
               <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '280px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '16px', zIndex: 50 }}>
                 
                 <div style={{ marginBottom: '16px' }}>
                   <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categories</h4>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                     {Object.keys(categories).map(cat => (
                       <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                         <input type="checkbox" checked={listFilters.categories.includes(cat)} onChange={() => toggleListFilter('categories', cat)} /> {cat}
                       </label>
                     ))}
                   </div>
                 </div>

                 <div style={{ marginBottom: '16px' }}>
                   <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stock Level</h4>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                       <input type="checkbox" checked={listFilters.stockLevels.includes('out_of_stock')} onChange={() => toggleListFilter('stockLevels', 'out_of_stock')} /> Out of Stock
                     </label>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                       <input type="checkbox" checked={listFilters.stockLevels.includes('low_stock')} onChange={() => toggleListFilter('stockLevels', 'low_stock')} /> Low Stock (&lt; 10)
                     </label>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                       <input type="checkbox" checked={listFilters.stockLevels.includes('in_stock')} onChange={() => toggleListFilter('stockLevels', 'in_stock')} /> In Stock
                     </label>
                   </div>
                 </div>
                 
                 <div>
                   <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</h4>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                       <input type="checkbox" checked={listFilters.statuses.includes('active')} onChange={() => toggleListFilter('statuses', 'active')} /> Active
                     </label>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                       <input type="checkbox" checked={listFilters.statuses.includes('draft')} onChange={() => toggleListFilter('statuses', 'draft')} /> Draft
                     </label>
                   </div>
                 </div>

               </div>
             )}
           </div>
        )}
        
        {/* View Mode Toggle */}'''

c = c.replace(old_header_end, new_header_end)

# 2. Hide rows in list mode and show pills
rows_pattern = r'(\{/\* Main Categories Row \*/\}.*?)\{/\* View Container \*/\}'
match = re.search(rows_pattern, c, flags=re.DOTALL)
if match:
    rows_content = match.group(1)
    
    # We will wrap rows_content with {viewMode === 'grid' && ( ... )}
    # and add the Active Pills block below it.
    new_rows_content = f'''      {{viewMode === 'grid' && (
        <>
          {rows_content.strip()}
        </>
      )}}
      
      {{viewMode === 'list' && (
        <div style={{{{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', minHeight: '32px' }}}}>
          {{listFilters.categories.map(val => (
            <span key={{val}} style={{{{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#374151' }}}}>
              Category: {{val}}
              <X size={{14}} style={{{{ cursor: 'pointer', opacity: 0.5 }}}} onClick={{() => removeListFilter('categories', val)}} />
            </span>
          ))}}
          {{listFilters.stockLevels.map(val => (
            <span key={{val}} style={{{{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#374151' }}}}>
              Stock: {{val.replace('_', ' ')}}
              <X size={{14}} style={{{{ cursor: 'pointer', opacity: 0.5 }}}} onClick={{() => removeListFilter('stockLevels', val)}} />
            </span>
          ))}}
          {{listFilters.statuses.map(val => (
            <span key={{val}} style={{{{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#374151' }}}}>
              Status: {{val}}
              <X size={{14}} style={{{{ cursor: 'pointer', opacity: 0.5 }}}} onClick={{() => removeListFilter('statuses', val)}} />
            </span>
          ))}}
          {{(listFilters.categories.length > 0 || listFilters.stockLevels.length > 0 || listFilters.statuses.length > 0) && (
            <button onClick={{() => setListFilters({{ categories: [], stockLevels: [], statuses: [] }})}} style={{{{ border: 'none', background: 'transparent', fontSize: '13px', color: '#6b7280', cursor: 'pointer', padding: '6px 8px' }}}}>
              Clear all
            </button>
          )}}
        </div>
      )}}
      
      {{/* View Container */}}
'''
    c = c.replace(match.group(0), new_rows_content)
else:
    print('Failed to find rows pattern')

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
