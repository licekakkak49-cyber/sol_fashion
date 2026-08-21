import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

# Replace handleCreateSet addSet call
c = re.sub(
    r'addSet\(\{\s*name:\s*newSetName,\s*status:\s*\'draft\',\s*items:\s*defaultItems\s*\}\);',
    "addSet({ name: newSetName, status: 'draft', items: defaultItems, mainCategory: activeMainCategory, subCategory: activeSubCategory });",
    c
)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
