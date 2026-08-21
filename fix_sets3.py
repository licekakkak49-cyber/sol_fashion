with open('/Users/aliceer/.gemini/antigravity/brain/c3832bd1-ea44-4f9e-a271-d2a4e5b22ec6/scratch/sets_manager.jsx', 'r') as f:
    c = f.read()

import re

# Remove ImageCropper import
c = c.replace("import ImageCropper from '../../../components/ImageCropper';", "")

# Replace state
c = re.sub(r"const \[activePlaceholder, setActivePlaceholder\] = useState\(null\);.*?const \[imageWarning, setImageWarning\] = useState\(''\);", "", c, flags=re.DOTALL)

# Replace handlePlaceholderClick
old_click = """  const handlePlaceholderClick = (placeholder) => {
    setActivePlaceholder(placeholder);
    setSelectedCategory('');
    setShowCategoryModal(true);
  };"""
new_click = """  const handlePlaceholderClick = (placeholder) => {
    handleEdit(placeholder, set.id);
  };"""
c = c.replace(old_click, new_click)

# Delete from handleCategorySelect down to handleCropComplete
c = re.sub(r"  const handleCategorySelect =.*?const handleCropComplete = async.*?\}\;", "", c, flags=re.DOTALL)

# Delete ImageCropper block
c = re.sub(r"\{cropImageSrc && \(.*?</ImageCropper>.*?\}", "", c, flags=re.DOTALL)

# Delete file input
c = re.sub(r'<input type="file" ref=\{fileInputRef\}.*?/>', "", c)

# Delete Category Modal
c = re.sub(r"\{/\* Category Modal for Placeholder \*/\}.*?</div>.*?</div>.*?\}", "", c, flags=re.DOTALL)

# Remove input refs
c = c.replace("const fileInputRef = useRef(null);", "")

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
