import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

old_swap = """        if (indexA !== -1 && indexB !== -1) {
          const tempLayoutSize = newItems[indexA].layoutSize;
          
          // Swap positions
          const tempProduct = newItems[indexA];
          newItems[indexA] = newItems[indexB];
          newItems[indexB] = tempProduct;
          
          // Swap sizes back to maintain slot shape
          newItems[indexA].layoutSize = newItems[indexB].layoutSize;
          newItems[indexB].layoutSize = tempLayoutSize;
          
          updateSet(set.id, { items: newItems });
        }"""

new_swap = """        if (indexA !== -1 && indexB !== -1) {
          const itemA = { ...newItems[indexA] };
          const itemB = { ...newItems[indexB] };
          
          const sizeA = itemA.layoutSize;
          const sizeB = itemB.layoutSize;
          
          itemA.layoutSize = sizeB;
          itemB.layoutSize = sizeA;
          
          // Swap positions in the array
          newItems[indexA] = itemB;
          newItems[indexB] = itemA;
          
          updateSet(set.id, { items: newItems });
        }"""

c = c.replace(old_swap, new_swap)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
