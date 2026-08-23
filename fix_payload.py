import re
with open('src/pages/admin/components/ProductEditorDrawer.jsx', 'r') as f:
    code = f.read()

# First replace the old variants upload logic
old_variants = """      const uploadedVariants = [];
      for (const variant of (formData.colorVariants || [])) {
        let varUrl = variant.image;
        if (varUrl && varUrl.startsWith('data:image')) {
          varUrl = await uploadImageToSupabase(varUrl, 'variants');
        }
        uploadedVariants.push({ ...variant, image: varUrl });
      }"""

new_variants = """      const uploadedVariants = [];
      for (const variant of (formData.colorVariants || [])) {
        const uploadedImages = [];
        for (const img of (variant.images || [])) {
          if (img.startsWith('data:image')) {
            uploadedImages.push(await uploadImageToSupabase(img, 'variants'));
          } else {
            uploadedImages.push(img);
          }
        }
        uploadedVariants.push({ ...variant, images: uploadedImages });
      }"""
code = code.replace(old_variants, new_variants)

# Then replace the payload construction
old_payload = """      // Construct final payload
      const payload = {
        ...formData,
        coverImage: coverUrl,
        hoverImage: hoverUrl,
        galleryImages: galleryUrls,
        colorVariants: uploadedVariants,
        status: parseInt(formData.stock) > 0 ? 'In Stock' : 'Out of Stock',
        image: coverUrl,
        images: [coverUrl, ...galleryUrls], // For legacy support
        id: initialData?.id
      };"""

new_payload = """      // Extract main images for legacy compatibility
      let finalCoverUrl = '';
      let finalHoverUrl = '';
      let finalGalleryUrls = [];
      const mainVariant = uploadedVariants.find(v => v.isMain) || uploadedVariants[0];
      if (mainVariant && mainVariant.images && mainVariant.images.length > 0) {
        finalCoverUrl = mainVariant.images[0] || '';
        finalHoverUrl = mainVariant.images[1] || '';
        finalGalleryUrls = mainVariant.images.slice(2);
      }

      // Calculate total stock from variants
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
        coverImage: finalCoverUrl,
        hoverImage: finalHoverUrl,
        galleryImages: finalGalleryUrls,
        colorVariants: uploadedVariants,
        status: totalStock > 0 ? 'In Stock' : 'Out of Stock',
        image: finalCoverUrl,
        images: [finalCoverUrl, finalHoverUrl, ...finalGalleryUrls].filter(Boolean), // For legacy support
        id: initialData?.id
      };"""
code = code.replace(old_payload, new_payload)

with open('src/pages/admin/components/ProductEditorDrawer.jsx', 'w') as f:
    f.write(code)
