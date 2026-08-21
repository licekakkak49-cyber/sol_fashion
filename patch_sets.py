import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

# Remove imports
c = c.replace("import ImageCropper from '../../../components/ImageCropper';", "")

# Remove local state for cropping
state_remove = """  const [activePlaceholder, setActivePlaceholder] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [imageWarning, setImageWarning] = useState('');"""
c = c.replace(state_remove, "")

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

# Remove handleCategorySelect, handleFileChange, handleCropComplete
# We will use regex to remove everything from handleCategorySelect to right before handleDragStop
to_remove_regex = r"const handleCategorySelect =.*?const handleDragStop = "
# Actually, I'll just find the exact strings to be safe
c = re.sub(r"const handleCategorySelect =.*?const handleDragStop", "const handleDragStop", c, flags=re.DOTALL)

# Remove JSX for ImageCropper and CategoryModal
c = re.sub(r"\{cropImageSrc && \(.*?</ImageCropper>.*?\}", "", c, flags=re.DOTALL)
c = re.sub(r"\{/\* Category Modal for Placeholder \*/\}.*?</div>.*?</div>.*?\}", "", c, flags=re.DOTALL)

# Remove input file ref
c = c.replace("const fileInputRef = useRef(null);", "")
c = c.replace('<input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: \'none\' }} />', "")

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)

