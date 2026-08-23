import re
with open('src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    code = f.read()

code = code.replace(
    "layoutSize: p.layout_size,",
    "layoutSize: p.layout_size,\n        colorVariants: p.color_variants,"
)

with open('src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(code)
