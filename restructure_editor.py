import re
import sys

with open('src/pages/admin/components/ProductEditorDrawer.jsx', 'r') as f:
    code = f.read()

# 1. Update Initialization to map images
old_init = """      setFormData({
        ...initialData,
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
        colorVariants: variants
      });"""
code = code.replace(old_init, new_init)

# 2. Update Add Color button
old_add = """{ id: Date.now(), name: '', hex: '#000000', image: '', isMain: (formData.colorVariants || []).length === 0, stock: {} }"""
new_add = """{ id: Date.now(), name: '', hex: '#000000', images: [], isMain: (formData.colorVariants || []).length === 0, stock: {} }"""
code = code.replace(old_add, new_add)

# 3. Remove Top Level Media Section completely
# It starts at {/* Media */} and ends at {/* Categories */}
# I will use a regex to match from {/* Media */} to just before {/* Categories */} or {/* Color Variants Section */}
code = re.sub(r'\{\/\* Media \*\/\}.*?(?=\{\/\* Color Variants Section \*\/\})', '', code, flags=re.DOTALL)

# 4. Update the Variant Image UI
old_variant_img = """                      <div>
                        <label style={labelStyle}>Variant Cover Image (3:4)</label>
                        <input type="file" accept="image/*" id={`variant-${idx}-upload`} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, `variant-${idx}`)} />
                        {variant.image ? (
                          <div style={{ position: 'relative', width: '80px', height: '106px', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src={variant.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Variant Cover" />
                            <button onClick={() => {
                              const newV = [...formData.colorVariants];
                              newV[idx].image = '';
                              handleChange('colorVariants', newV);
                            }} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}><X size={12} /></button>
                          </div>
                        ) : (
                          <label htmlFor={`variant-${idx}-upload`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80px', height: '106px', background: '#f9fafb', border: '1px dashed #ccc', borderRadius: '8px', cursor: 'pointer' }}>
                            <UploadCloud size={20} color="#888" />
                          </label>
                        )}
                      </div>"""

new_variant_img = """                      <div style={{ width: '200px' }}>
                        <label style={labelStyle}>Variant Images</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {(variant.images || []).map((img, imgIdx) => (
                            <div key={imgIdx} style={{ position: 'relative', width: '60px', height: '80px', borderRadius: '4px', overflow: 'hidden' }}>
                              <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Variant img" />
                              <button onClick={() => {
                                const newV = [...formData.colorVariants];
                                newV[idx].images = newV[idx].images.filter((_, i) => i !== imgIdx);
                                handleChange('colorVariants', newV);
                              }} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', padding: '2px', cursor: 'pointer' }}><X size={10} /></button>
                              {imgIdx === 0 && <span style={{position:'absolute', bottom: 0, left:0, width:'100%', background:'rgba(0,0,0,0.6)', color:'#fff', fontSize:'9px', textAlign:'center'}}>Cover</span>}
                              {imgIdx === 1 && <span style={{position:'absolute', bottom: 0, left:0, width:'100%', background:'rgba(0,0,0,0.6)', color:'#fff', fontSize:'9px', textAlign:'center'}}>Hover</span>}
                            </div>
                          ))}
                          <label htmlFor={`variant-${idx}-upload`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '60px', height: '80px', background: '#f9fafb', border: '1px dashed #ccc', borderRadius: '4px', cursor: 'pointer' }}>
                            <UploadCloud size={16} color="#888" />
                          </label>
                          <input type="file" accept="image/*" id={`variant-${idx}-upload`} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, `variant-${idx}`)} />
                        </div>
                      </div>"""

code = code.replace(old_variant_img, new_variant_img)


# 5. Fix Image Upload Logic inside handleSave
old_save = """      let coverUrl = formData.coverImage;
      let hoverUrl = formData.hoverImage;
      let galleryUrls = [...formData.galleryImages];

      if (coverUrl && coverUrl.startsWith('data:image')) coverUrl = await uploadImageToSupabase(coverUrl, 'covers');
      if (hoverUrl && hoverUrl.startsWith('data:image')) hoverUrl = await uploadImageToSupabase(hoverUrl, 'hovers');
      
      for (let i = 0; i < galleryUrls.length; i++) {
        if (galleryUrls[i].startsWith('data:image')) {
          galleryUrls[i] = await uploadImageToSupabase(galleryUrls[i], 'gallery');
        }
      }

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
      };"""

new_save = """      const uploadedVariants = [];
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
      }

      // Extract main images for legacy compatibility
      let coverUrl = '';
      let hoverUrl = '';
      let galleryUrls = [];
      const mainVariant = uploadedVariants.find(v => v.isMain) || uploadedVariants[0];
      if (mainVariant && mainVariant.images && mainVariant.images.length > 0) {
        coverUrl = mainVariant.images[0] || '';
        hoverUrl = mainVariant.images[1] || '';
        galleryUrls = mainVariant.images.slice(2);
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
        images: [coverUrl, hoverUrl, ...galleryUrls].filter(Boolean), // For legacy support
        id: initialData?.id
      };"""

code = code.replace(old_save, new_save)


# 6. Fix Cropper target handling
old_crop = """            if (cropState.target === 'cover') handleChange('coverImage', croppedBase64);
            if (cropState.target === 'hover') handleChange('hoverImage', croppedBase64);
            if (cropState.target === 'gallery') handleChange('galleryImages', [...formData.galleryImages, croppedBase64]);
            if (cropState.target.startsWith('variant-')) {
              const vIndex = parseInt(cropState.target.split('-')[1], 10);
              const newVariants = [...(formData.colorVariants || [])];
              newVariants[vIndex] = { ...newVariants[vIndex], image: croppedBase64 };
              handleChange('colorVariants', newVariants);
            }"""

new_crop = """            if (cropState.target.startsWith('variant-')) {
              const vIndex = parseInt(cropState.target.split('-')[1], 10);
              const newVariants = [...(formData.colorVariants || [])];
              if (!newVariants[vIndex].images) newVariants[vIndex].images = [];
              newVariants[vIndex].images.push(croppedBase64);
              handleChange('colorVariants', newVariants);
            }"""

code = code.replace(old_crop, new_crop)

# 7. Remove no color variant message since we enforce having at least one
code = code.replace("""{(formData.colorVariants || []).length === 0 ? (
              <div style={{ padding: '24px', background: '#f9fafb', borderRadius: '12px', textAlign: 'center', border: '1px dashed #e5e7eb' }}>
                <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>No color variants added. The default images will be used.</p>
              </div>
            ) : (""", "{(formData.colorVariants || []).length === 0 ? null : (")


with open('src/pages/admin/components/ProductEditorDrawer.jsx', 'w') as f:
    f.write(code)

