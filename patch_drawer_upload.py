with open('/Users/aliceer/sol_fashion/src/pages/admin/components/ProductEditorDrawer.jsx', 'r') as f:
    c = f.read()

import re

# Add import
c = c.replace("import ImageCropper from '../../../components/ImageCropper';", "import ImageCropper from '../../../components/ImageCropper';\nimport { uploadImageToSupabase } from '../../../utils/supabaseStorage';")

# Add isUploading state
c = c.replace("const [error, setError] = useState('');", "const [error, setError] = useState('');\n  const [isUploading, setIsUploading] = useState(false);")

old_save = """  const handleSave = () => {
    if (!formData.name.trim()) return setError('⚠️ Product Name is required.');
    if (!formData.price) return setError('⚠️ Price is required.');
    if (!formData.mainCategory) return setError('⚠️ Main Category is required.');
    if (!formData.coverImage) return setError('⚠️ Cover Image (3:4) is required.');

    // Construct final payload
    const payload = {
      ...formData,
      status: parseInt(formData.stock) > 0 ? 'In Stock' : 'Out of Stock',
      image: formData.coverImage,
      images: [formData.coverImage, ...formData.galleryImages], // For legacy support
      id: initialData?.id
    };

    onSave(payload, config);
    onClose();
  };"""

new_save = """  const handleSave = async () => {
    if (!formData.name.trim()) return setError('⚠️ Product Name is required.');
    if (!formData.price) return setError('⚠️ Price is required.');
    if (!formData.mainCategory) return setError('⚠️ Main Category is required.');
    if (!formData.coverImage) return setError('⚠️ Cover Image (3:4) is required.');

    setIsUploading(true);
    setError('');
    
    try {
      const coverUrl = await uploadImageToSupabase(formData.coverImage, 'covers');
      const hoverUrl = formData.hoverImage ? await uploadImageToSupabase(formData.hoverImage, 'hovers') : '';
      
      const galleryUrls = [];
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
      };

      await onSave(payload, config);
      onClose();
    } catch (err) {
      console.error(err);
      setError('⚠️ Failed to upload images to Supabase. Make sure you have set up the project correctly.');
    } finally {
      setIsUploading(false);
    }
  };"""

c = c.replace(old_save, new_save)

# Update Save button text
c = c.replace("Save Product", "{isUploading ? 'Saving...' : 'Save Product'}")
# Disable button when uploading
c = c.replace(
    "background: '#111', color: '#fff', border: 'none', borderRadius: '100px', cursor: 'pointer'",
    "background: isUploading ? '#666' : '#111', color: '#fff', border: 'none', borderRadius: '100px', cursor: isUploading ? 'not-allowed' : 'pointer'"
)
c = c.replace("onClick={handleSave}", "onClick={handleSave} disabled={isUploading}")

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/ProductEditorDrawer.jsx', 'w') as f:
    f.write(c)
