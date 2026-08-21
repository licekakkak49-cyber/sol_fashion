import re

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'r') as f:
    c = f.read()

old_remove = '''  const removeProductFromSet = (setId, productId) => {
    setSets(sets.map(s => {
      if (s.id === setId) {
        return { ...s, items: s.items.filter(i => i.productId !== productId) };
      }
      return s;
    }));
  };'''

new_remove = '''  const removeProductFromSet = (setId, productId) => {
    setSets(sets.map(s => {
      if (s.id === setId) {
        return { 
          ...s, 
          items: s.items.map(i => {
            if (i.productId === productId) {
               // Revert to placeholder instead of deleting to maintain grid structure
               return { productId: `ph-${Date.now()}-${Math.random()}`, layoutSize: i.layoutSize };
            }
            return i;
          }) 
        };
      }
      return s;
    }));
  };'''

c = c.replace(old_remove, new_remove)

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'w') as f:
    f.write(c)
