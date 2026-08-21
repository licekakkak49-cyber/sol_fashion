import re
import json
import random

images = [
  'https://cdn.shopify.com/s/files/1/0457/2990/6847/files/8084D_1200x.jpg?v=1784181396',
  'https://alemais.com/cdn/shop/files/8230A-1_6000x.jpg?v=1783657629',
  'https://alemais.com/cdn/shop/files/8115T_49da3fae-0b9d-4d8e-b663-0f16b8c34c71_6000x.jpg?v=1786332736',
  'https://alemais.com/cdn/shop/files/alemais-sustainable-pant-spur-denim-cropped-jean-1253882886_6000x.jpg?v=1786476495',
  'https://alemais.com/cdn/shop/files/Disruptor_-_2_rows_3.jpg?v=1786331368&width=2000',
  'https://alemais.com/cdn/shop/files/alemais-sustainable-jacket-spur-denim-jacket-1253883487_6000x.jpg?v=1786475956',
  'https://alemais.com/cdn/shop/files/8116S_2b259435-913b-40d0-820f-da3729472494_6000x.jpg?v=1786333610',
  'https://alemais.com/cdn/shop/files/8074D_6000x.jpg?v=1783653185',
  'https://alemais.com/cdn/shop/files/alemais-sustainable-short-spur-denim-micro-short-1253883483_6000x.jpg?v=1786475241',
  'https://alemais.com/cdn/shop/files/alemais-sustainable-top-winifred-lace-blouse-1253883444_6000x.jpg?v=1786474157',
  'https://alemais.com/cdn/shop/files/8075D_8cd95c7d-e125-4db9-a3e2-98804190e2d3_6000x.jpg?v=1786073558',
  'https://alemais.com/cdn/shop/files/8076D_c7fc4759-d747-4c18-bf25-389f7b0219b0_6000x.jpg?v=1786332923',
  'https://alemais.com/cdn/shop/files/7988D_6000x.jpg?v=1786473375'
]

categories = {
  'Bags': [
    ('Classic Mini Tote', 'Mini Bags'), ('Canvas Shoulder Bag', 'Shoulder Bags'), 
    ('Leather Tote', 'Totes'), ('Everyday Crossbody', 'Crossbody'),
    ('Woven Beach Tote', 'Totes'), ('Quilted Mini Bag', 'Mini Bags'),
    ('Slouchy Shoulder Bag', 'Shoulder Bags')
  ],
  'Shoes': [
    ('Strappy Heels', 'Heels'), ('Ballet Flats', 'Flats'), 
    ('Chunky Sneakers', 'Sneakers'), ('Ankle Boots', 'Boots'),
    ('Platform Sneakers', 'Sneakers'), ('Suede Knee Boots', 'Boots'),
    ('Pointed Toe Flats', 'Flats')
  ],
  'Ready-to-Wear': [
    ('Floral Midi Dress', 'Dresses'), ('Silk Slip Dress', 'Dresses'), 
    ('Ribbed Knit Top', 'Tops'), ('Linen Button Down', 'Tops'),
    ('Pleated Maxi Skirt', 'Skirts'), ('Denim Mini Skirt', 'Skirts'),
    ('Oversized Blazer', 'Outerwear'), ('Trench Coat', 'Outerwear')
  ],
  'Accessories': [
    ('Cat Eye Sunglasses', 'Sunglasses'), ('Oversized Aviators', 'Sunglasses'), 
    ('Gold Hoop Earrings', 'Jewelry'), ('Layered Necklace', 'Jewelry'),
    ('Straw Sun Hat', 'Hats'), ('Leather Waist Belt', 'Belts'),
    ('Classic Buckle Belt', 'Belts')
  ]
}

mock_products = []
id_counter = 1

for main_cat, items in categories.items():
    for name, sub_cat in items:
        # Create a realistic product
        product = {
            'id': str(id_counter),
            'name': name,
            'price': random.randint(1200, 8900),
            'stock': random.choice([0, random.randint(2, 8), random.randint(15, 40)]),
            'mainCategory': main_cat,
            'subCategory': sub_cat,
            'status': random.choice(['active', 'active', 'active', 'draft']),
            'layoutSize': random.choice(['small', 'small', 'small', 'large']),
            'image': random.choice(images),
            'uploadDate': '2026-08-20T10:00:00.000Z'
        }
        mock_products.append(product)
        id_counter += 1

# Format as a JavaScript array string
js_array = "const MOCK_PRODUCTS = [\n"
for p in mock_products:
    js_array += f"  {json.dumps(p)},\n"
js_array += "];\n"

# Replace in AdminContext.jsx
with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'r') as f:
    content = f.read()

# Replace the array
content = re.sub(r'const MOCK_PRODUCTS = \[.*?\];', js_array, content, flags=re.DOTALL)

# Change local storage key to force reload
content = content.replace("'sol_products_v4'", "'sol_products_v5'")

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'w') as f:
    f.write(content)
