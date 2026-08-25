import re

with open('src/pages/ProductsPage.jsx', 'r') as f:
    content = f.read()

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

old_logic = """    const allAssignedProductIds = new Set();
    (sets || []).forEach(s => {
       (s.items || []).forEach(item => {
          if (!item.isPlaceholder && item.productId) {
             allAssignedProductIds.add(item.productId);
          }
       });
    });"""

content = content.replace(new_logic, old_logic)

with open('src/pages/ProductsPage.jsx', 'w') as f:
    f.write(content)

print("Reverted bug fix!")
