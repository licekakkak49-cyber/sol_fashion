import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

c = c.replace(
    "export default function SetsManager({ handleEdit }) {",
    "export default function SetsManager({ handleEdit, activeMainCategory, activeSubCategory, products, sets, addSet, updateSet, deleteSet, removeProductFromSet, updateProductInSet, changeProductOrderInSet }) {"
)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)

