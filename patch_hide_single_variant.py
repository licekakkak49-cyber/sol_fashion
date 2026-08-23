import re

with open('src/pages/admin/components/InventoryList.jsx', 'r') as f:
    code = f.read()

old_show = "{product.colorVariants && product.colorVariants.length > 0 && ("
new_show = "{product.colorVariants && product.colorVariants.length > 1 && ("

code = code.replace(old_show, new_show)

with open('src/pages/admin/components/InventoryList.jsx', 'w') as f:
    f.write(code)
