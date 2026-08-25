import re

with open('src/pages/ProductsPage.jsx', 'r') as f:
    content = f.read()

old_logic = """    const allAssignedProductIds = new Set();
    (sets || []).forEach(s => {
       (s.items || []).forEach(item => {
          if (!item.isPlaceholder && item.productId) {
             allAssignedProductIds.add(item.productId);
          }
       });
    });"""

new_logic = """    const allAssignedProductIds = new Set();
    (sets || []).forEach(s => {
       const isDraft = (s.status || 'draft').toLowerCase() === 'draft';
       if (!previewSets && isDraft) return; // Do not swallow products if the set is a draft!
       
       (s.items || []).forEach(item => {
          if (!item.isPlaceholder && item.productId) {
             allAssignedProductIds.add(item.productId);
          }
       });
    });"""

content = content.replace(old_logic, new_logic)

with open('src/pages/ProductsPage.jsx', 'w') as f:
    f.write(content)

print("Bug fixed!")
