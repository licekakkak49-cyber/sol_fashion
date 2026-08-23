import re

with open('src/pages/admin/components/ProductEditorDrawer.jsx', 'r') as f:
    code = f.read()

legacy_upload = """      const coverUrl = await uploadImageToSupabase(formData.coverImage, 'covers');
      const hoverUrl = formData.hoverImage ? await uploadImageToSupabase(formData.hoverImage, 'hovers') : '';
      
      const galleryUrls = [];
      for (const img of (formData.galleryImages || [])) {
        galleryUrls.push(await uploadImageToSupabase(img, 'gallery'));
      }"""

legacy_upload_2 = """      const coverUrl = await uploadImageToSupabase(formData.coverImage, 'covers');
      const hoverUrl = formData.hoverImage ? await uploadImageToSupabase(formData.hoverImage, 'hovers') : '';
      
      const galleryUrls = [];
      for (const img of formData.galleryImages) {
        galleryUrls.push(await uploadImageToSupabase(img, 'gallery'));
      }"""

code = code.replace(legacy_upload, "")
code = code.replace(legacy_upload_2, "")

with open('src/pages/admin/components/ProductEditorDrawer.jsx', 'w') as f:
    f.write(code)
