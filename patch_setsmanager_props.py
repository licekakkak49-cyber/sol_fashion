with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

import re

# Update component signature
c = c.replace(
    "const SetsManager = ({ handleEdit, activeMainCategory, activeSubCategory }) => {",
    "const SetsManager = ({ handleEdit, activeMainCategory, activeSubCategory, products, sets, addSet, updateSet, deleteSet, removeProductFromSet, updateProductInSet, changeProductOrderInSet }) => {"
)

# Remove the useAdmin hook
old_hook = "const { sets = [], products = [], addSet, updateSet, deleteSet, removeProductFromSet, updateProductInSet, changeProductOrderInSet, addProduct } = useAdmin();"
c = c.replace(old_hook, "")

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)

