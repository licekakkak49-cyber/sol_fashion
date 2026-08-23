import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

replacement = """    const lSize = item.layoutSize || item.layout_size;
    if (lSize === '2x2') { w = 2; h = 8; }
    if (lSize === '4x2') { w = 4; h = 8; }
    if (lSize === '4x1') { w = 4; h = 1; }"""

original = """    if (item.layout_size === '2x2') { w = 2; h = 8; }
    if (item.layout_size === '4x2') { w = 4; h = 8; }
    if (item.layout_size === '4x1') { w = 4; h = 1; }"""

code = code.replace(original, replacement)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
