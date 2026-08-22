import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

old_addSet_call = """    addSet({ name: newSetName, status: 'draft', items: defaultItems });"""

new_addSet_call = """    addSet({ 
      name: newSetName.trim(), 
      status: 'draft', 
      items: defaultItems, 
      mainCategory: activeMainCategory, 
      subCategory: activeSubCategory 
    });"""

c = c.replace(old_addSet_call, new_addSet_call)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
