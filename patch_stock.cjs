const fs = require('fs');
const path = 'src/pages/admin/components/ProductEditorDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove the input from UI
code = code.replace(
  "<div><label style={labelStyle}>Stock Quantity</label><input type=\"number\" value={formData.stock} onChange={(e) => handleChange('stock', e.target.value)} style={inputStyle} /></div>",
  ""
);

// 2. Add totalStock calculation right before payload construction
const oldPayload = `      // Construct final payload
      const payload = {
        ...formData,
        coverImage: coverUrl,
        hoverImage: hoverUrl,
        galleryImages: galleryUrls,
        colorVariants: uploadedVariants,
        status: parseInt(formData.stock) > 0 ? 'In Stock' : 'Out of Stock',
        image: coverUrl,
        images: [coverUrl, hoverUrl, ...galleryUrls].filter(Boolean), // For legacy support
        id: initialData?.id
      };`;

const newPayload = `      // Calculate total stock from variants
      let totalStock = 0;
      for (const v of uploadedVariants) {
        if (v.stock) {
          totalStock += Object.values(v.stock).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
        }
      }

      // Construct final payload
      const payload = {
        ...formData,
        stock: totalStock,
        coverImage: coverUrl,
        hoverImage: hoverUrl,
        galleryImages: galleryUrls,
        colorVariants: uploadedVariants,
        status: totalStock > 0 ? 'In Stock' : 'Out of Stock',
        image: coverUrl,
        images: [coverUrl, hoverUrl, ...galleryUrls].filter(Boolean), // For legacy support
        id: initialData?.id
      };`;

code = code.replace(oldPayload, newPayload);

fs.writeFileSync(path, code);
