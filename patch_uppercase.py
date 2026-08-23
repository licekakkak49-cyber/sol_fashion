import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

code = code.replace("<h4>{item.contentType.toUpperCase()} BLOCK ({item.layoutSize})</h4>", "<h4>{(item.contentType || 'UNKNOWN').toUpperCase()} BLOCK ({item.layoutSize})</h4>")

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
