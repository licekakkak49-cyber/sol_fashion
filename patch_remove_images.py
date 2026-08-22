import re

with open('src/pages/admin/components/ProductEditorDrawer.jsx', 'r') as f:
    code = f.read()

# Also let's fix the auto-migration which didn't match.
# The actual current initialization code:
#      setFormData({
#        ...initialData,
#        name: initialData.name || '',
#        subtitle: initialData.subtitle || '',
#        price: initialData.price || '',
#        stock: initialData.stock || '',
#        mainCategory: initialData.mainCategory || (config?.defaultMainCategory || ''),
#        subCategory: initialData.subCategory || (config?.defaultSubCategory || ''),
#        highlight: Array.isArray(initialData.tags) ? initialData.tags : (Array.isArray(initialData.highlight) ? initialData.highlight : []),
#        coverImage: coverImg,
#        hoverImage: hoverImg,
#        galleryImages: gallImgs,
#        colorVariants: Array.isArray(initialData.colorVariants) ? initialData.colorVariants : []
#      });

old_init = """      setFormData({
        ...initialData,
        name: initialData.name || '',
        subtitle: initialData.subtitle || '',
        price: initialData.price || '',
        stock: initialData.stock || '',
        mainCategory: initialData.mainCategory || (config?.defaultMainCategory || ''),
        subCategory: initialData.subCategory || (config?.defaultSubCategory || ''),
        highlight: Array.isArray(initialData.tags) ? initialData.tags : (Array.isArray(initialData.highlight) ? initialData.highlight : []),
        coverImage: coverImg,
        hoverImage: hoverImg,
        galleryImages: gallImgs,
        colorVariants: Array.isArray(initialData.colorVariants) ? initialData.colorVariants : []
      });"""

new_init = """      // Auto-migrate legacy images into variants
      let variants = Array.isArray(initialData.colorVariants) ? initialData.colorVariants : [];
      if (variants.length === 0 && (coverImg || gallImgs.length > 0)) {
        variants = [{
          id: Date.now(),
          name: 'Original',
          hex: '#000000',
          isMain: true,
          stock: {},
          images: [coverImg, hoverImg, ...gallImgs].filter(Boolean)
        }];
      } else {
        variants = variants.map(v => {
          if (!v.images && v.image) v.images = [v.image];
          if (!v.images) v.images = [];
          return v;
        });
      }

      setFormData({
        ...initialData,
        name: initialData.name || '',
        subtitle: initialData.subtitle || '',
        price: initialData.price || '',
        stock: initialData.stock || '',
        mainCategory: initialData.mainCategory || (config?.defaultMainCategory || ''),
        subCategory: initialData.subCategory || (config?.defaultSubCategory || ''),
        highlight: Array.isArray(initialData.tags) ? initialData.tags : (Array.isArray(initialData.highlight) ? initialData.highlight : []),
        colorVariants: variants
      });"""

code = code.replace(old_init, new_init)

# Now remove the Images Section.
code = re.sub(r'\{\/\* Images Section \*\/\}.*?(?=\{\/\* Categories \*\/\})', '', code, flags=re.DOTALL)

with open('src/pages/admin/components/ProductEditorDrawer.jsx', 'w') as f:
    f.write(code)
