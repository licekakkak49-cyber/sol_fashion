import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

code = code.replace("left: '12px',", "left: '0px',")

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
