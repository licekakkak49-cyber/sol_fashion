import re

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'r') as f:
    c = f.read()

# Replace sol_categories_v2 with sol_categories_v3 and initial state
old_cat_state = """  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('sol_categories_v2');
    return saved ? JSON.parse(saved) : {
      'Ready-to-Wear': ['Knit Top', 'Shirt', 'Blouse', 'Short', 'Pants', 'Skirt', 'Maxi Dress', 'Mini Dress'],
      'Bags': ['Bags'],
      'Shoes': ['Shoes'],
      'Accessories': ['Head Piece', 'Others']
    };
  });

  useEffect(() => {
    localStorage.setItem('sol_categories_v2', JSON.stringify(categories));
  }, [categories]);"""

new_cat_state = """  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('sol_categories_v3');
    return saved ? JSON.parse(saved) : {
      'Bags': ['Crossbody Bags', 'Shoulder Bags', 'Handbags', 'Totes', 'Mini Bags'],
      'Ready to Wear': ['Knit Top', 'Shirt', 'Blouse', 'Shorts', 'Pants', 'Skirt', 'Mini Dress', 'Maxi Dress', 'Sets'],
      'Accessories & Shoes': ['Jewelry', 'Hats', 'Belts', 'Sandals', 'Heels', 'Flats']
    };
  });

  useEffect(() => {
    localStorage.setItem('sol_categories_v3', JSON.stringify(categories));
  }, [categories]);"""

c = c.replace(old_cat_state, new_cat_state)

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'w') as f:
    f.write(c)
