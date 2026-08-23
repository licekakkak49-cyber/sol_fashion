import re

with open('src/pages/admin/components/InventoryList.jsx', 'r') as f:
    code = f.read()

# 1. Main badge color
old_badge = "<div style={{ width: 8, height: 8, borderRadius: '50%', background: mainV.hex || '#000' }} />"
new_badge = "<div style={{ width: 12, height: 12, borderRadius: '2px', background: mainV.hex || '#000', border: '1px solid #e5e7eb' }} />"
code = code.replace(old_badge, new_badge)

# 2. Expandable row color
old_row = "<div style={{ width: '16px', height: '16px', borderRadius: '50%', background: v.hex || '#000', border: '1px solid #e5e7eb' }} />"
new_row = "<div style={{ width: '16px', height: '16px', borderRadius: '4px', background: v.hex || '#000', border: '1px solid #e5e7eb' }} />"
code = code.replace(old_row, new_row)

with open('src/pages/admin/components/InventoryList.jsx', 'w') as f:
    f.write(code)
