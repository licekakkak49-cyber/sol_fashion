const fs = require('fs');
const path = 'src/pages/admin/components/ProductEditorDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldSave = `      const galleryUrls = [];
      for (const img of formData.galleryImages) {
        galleryUrls.push(await uploadImageToSupabase(img, 'gallery'));
      }

      // Construct final payload
      const payload = {
        ...formData,
        coverImage: coverUrl,
        hoverImage: hoverUrl,
        galleryImages: galleryUrls,
        status: parseInt(formData.stock) > 0 ? 'In Stock' : 'Out of Stock',
        image: coverUrl,
        images: [coverUrl, ...galleryUrls], // For legacy support
        id: initialData?.id
      };`;

const newSave = `      const galleryUrls = [];
      for (const img of formData.galleryImages) {
        galleryUrls.push(await uploadImageToSupabase(img, 'gallery'));
      }

      // Upload variant images
      const uploadedVariants = [];
      for (const variant of (formData.colorVariants || [])) {
        let varUrl = variant.image;
        if (varUrl && varUrl.startsWith('data:image')) {
          varUrl = await uploadImageToSupabase(varUrl, 'variants');
        }
        uploadedVariants.push({ ...variant, image: varUrl });
      }

      // Construct final payload
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
      };`;

code = code.replace(oldSave, newSave);

const oldCropComplete = `if (cropState.target === 'gallery') handleChange('galleryImages', [...formData.galleryImages, croppedBase64]);
            setCropState({ src: null, target: null });`;

const newCropComplete = `if (cropState.target === 'gallery') handleChange('galleryImages', [...formData.galleryImages, croppedBase64]);
            if (cropState.target.startsWith('variant-')) {
              const vIndex = parseInt(cropState.target.split('-')[1], 10);
              const newVariants = [...(formData.colorVariants || [])];
              newVariants[vIndex] = { ...newVariants[vIndex], image: croppedBase64 };
              handleChange('colorVariants', newVariants);
            }
            setCropState({ src: null, target: null });`;

code = code.replace(oldCropComplete, newCropComplete);
fs.writeFileSync(path, code);
