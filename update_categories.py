import re

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'r') as f:
    c = f.read()

old_cats = '''const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('sol_categories');
    return saved ? JSON.parse(saved) : {
      'Bags': ['Mini Bags', 'Shoulder Bags', 'Totes', 'Crossbody'],
      'Shoes': ['Heels', 'Flats', 'Sneakers', 'Boots'],
      'Ready-to-Wear': ['Dresses', 'Tops', 'Skirts', 'Outerwear'],
      'Accessories': ['Sunglasses', 'Jewelry', 'Hats', 'Belts']
    };
  });

  useEffect(() => {
    localStorage.setItem('sol_categories', JSON.stringify(categories));
  }, [categories]);'''

new_cats = '''const [categories, setCategories] = useState(() => {
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
  }, [categories]);'''

c = c.replace(old_cats, new_cats)

# Fix mock products to use the new valid subcategories
c = c.replace('"subCategory": "Mini Bags"', '"subCategory": "Bags"')
c = c.replace('"subCategory": "Shoulder Bags"', '"subCategory": "Bags"')
c = c.replace('"subCategory": "Totes"', '"subCategory": "Bags"')
c = c.replace('"subCategory": "Crossbody"', '"subCategory": "Bags"')
c = c.replace('"subCategory": "Heels"', '"subCategory": "Shoes"')
c = c.replace('"subCategory": "Flats"', '"subCategory": "Shoes"')
c = c.replace('"subCategory": "Sneakers"', '"subCategory": "Shoes"')
c = c.replace('"subCategory": "Boots"', '"subCategory": "Shoes"')
c = c.replace('"subCategory": "Dresses"', '"subCategory": "Maxi Dress"')
c = c.replace('"subCategory": "Tops"', '"subCategory": "Shirt"')
c = c.replace('"subCategory": "Skirts"', '"subCategory": "Skirt"')
c = c.replace('"subCategory": "Outerwear"', '"subCategory": "Shirt"')
c = c.replace('"subCategory": "Sunglasses"', '"subCategory": "Others"')
c = c.replace('"subCategory": "Jewelry"', '"subCategory": "Others"')
c = c.replace('"subCategory": "Hats"', '"subCategory": "Head Piece"')
c = c.replace('"subCategory": "Belts"', '"subCategory": "Others"')

# Also update the local storage key for products to force refresh
c = c.replace("localStorage.getItem('sol_products_v5')", "localStorage.getItem('sol_products_v6')")
c = c.replace("localStorage.setItem('sol_products_v5'", "localStorage.setItem('sol_products_v6'")

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'w') as f:
    f.write(c)
