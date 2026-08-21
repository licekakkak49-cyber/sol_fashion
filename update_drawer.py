with open('/Users/aliceer/sol_fashion/src/pages/admin/components/ProductEditorDrawer.jsx', 'r') as f:
    c = f.read()

import re

# Update handleFileChange
old_file_change = """      if (target === 'cover' || target === 'hover') {
        setCropState({ src: reader.result, target });
      } else if (target === 'gallery') {
        // Direct add
        handleChange('galleryImages', [...formData.galleryImages, reader.result]);
      }"""
new_file_change = """      setCropState({ src: reader.result, target });"""
c = c.replace(old_file_change, new_file_change)

# Update ImageCropper render
old_cropper = """      {cropState.src && (
        <ImageCropper 
          imageSrc={cropState.src} 
          aspectRatio={3 / 4}
          showFocusBox={false}
          onCropComplete={(croppedBase64) => {
            if (cropState.target === 'cover') handleChange('coverImage', croppedBase64);
            if (cropState.target === 'hover') handleChange('hoverImage', croppedBase64);
            setCropState({ src: null, target: null });
          }}
          onCancel={() => setCropState({ src: null, target: null })}
        />
      )}"""

new_cropper = """      {cropState.src && (
        <ImageCropper 
          imageSrc={cropState.src} 
          aspectRatio={3/4}
          allowAspectChange={cropState.target === 'gallery'}
          showFocusBox={false}
          onCropComplete={(croppedBase64) => {
            if (cropState.target === 'cover') handleChange('coverImage', croppedBase64);
            if (cropState.target === 'hover') handleChange('hoverImage', croppedBase64);
            if (cropState.target === 'gallery') handleChange('galleryImages', [...formData.galleryImages, croppedBase64]);
            setCropState({ src: null, target: null });
          }}
          onCancel={() => setCropState({ src: null, target: null })}
        />
      )}"""

c = c.replace(old_cropper, new_cropper)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/ProductEditorDrawer.jsx', 'w') as f:
    f.write(c)

