import re

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'r') as f:
    c = f.read()

old_mapping = """          uploadDate: p.created_at,
          mainCategory: p.main_category,
          subCategory: p.sub_category,
          coverImage: p.cover_image_url,
          hoverImage: p.hover_image_url,"""

new_mapping = """          uploadDate: p.created_at,
          mainCategory: p.main_category,
          subCategory: p.sub_category,
          coverImage: p.cover_image_url,
          image: p.cover_image_url,
          hoverImage: p.hover_image_url,"""

c = c.replace(old_mapping, new_mapping)

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'w') as f:
    f.write(c)
