import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/InventoryList.jsx', 'r') as f:
    c = f.read()

# Fix the broken thead
thead_start = c.find('<thead')
thead_end = c.find('</thead>') + len('</thead>')

new_thead = '''        <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          <tr>
            <th style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</th>
            <th onClick={() => requestSort('mainCategory')} style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: sortConfig.key === 'mainCategory' ? '#111' : '#4b5563', background: sortConfig.key === 'mainCategory' ? '#f3f4f6' : 'transparent', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Category {getSortIcon('mainCategory')}</div>
            </th>
            <th onClick={() => requestSort('price')} style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: sortConfig.key === 'price' ? '#111' : '#4b5563', background: sortConfig.key === 'price' ? '#f3f4f6' : 'transparent', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Price {getSortIcon('price')}</div>
            </th>
            <th onClick={() => requestSort('stock')} style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: sortConfig.key === 'stock' ? '#111' : '#4b5563', background: sortConfig.key === 'stock' ? '#f3f4f6' : 'transparent', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Stock {getSortIcon('stock')}</div>
            </th>
            <th onClick={() => requestSort('status')} style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: sortConfig.key === 'status' ? '#111' : '#4b5563', background: sortConfig.key === 'status' ? '#f3f4f6' : 'transparent', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Status {getSortIcon('status')}</div>
            </th>
            <th style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>'''

c = c[:thead_start] + new_thead + c[thead_end:]

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/InventoryList.jsx', 'w') as f:
    f.write(c)
