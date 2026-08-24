import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

# Replace `left: '-140px'` with `left: '0px'` for the row controls
code = code.replace("left: '-140px',", "left: '12px',")

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
