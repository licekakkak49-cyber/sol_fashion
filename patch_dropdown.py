import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# 1. Add DropdownSelector
dropdown_component = '''
const DropdownSelector = ({ label, options, selectedValue, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    <select
      value={selectedValue || ''}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        fontSize: '13px',
        background: '#f9fafb',
        color: selectedValue ? '#111' : '#888',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23888%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '16px'
      }}
    >
      <option value="" disabled>Select {label}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);
'''

# Insert it before MultiPillSelector
c = c.replace("const MultiPillSelector =", dropdown_component + "\nconst MultiPillSelector =")

# 2. Remove Brand Selector entirely (need exact match)
brand_line = "<PillSelector label=\"Brand\" options={brandOptions} selectedValue={formData.brandId} onChange={(val) => handleChange('brandId', val)} />"
c = c.replace(brand_line, "")

# 3. Replace all PillSelector with DropdownSelector
c = c.replace("<PillSelector", "<DropdownSelector")

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
