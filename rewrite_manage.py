import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# Add import
c = c.replace("import SetsManager from './components/SetsManager';", "import SetsManager from './components/SetsManager';\nimport ProductEditorDrawer from './components/ProductEditorDrawer';")

# Remove old state
c = re.sub(r"const \[modalStep, setModalStep\] = useState\(1\);", "", c)
c = re.sub(r"const \[isAdding, setIsAdding\] = useState\(false\);", "", c)
c = re.sub(r"const \[editingId, setEditingId\] = useState\(null\);", "", c)
c = re.sub(r"const \[formError, setFormError\] = useState\(''\);", "", c)
c = re.sub(r"const \[cropImageSrc, setCropImageSrc\] = useState\(null\);", "", c)
c = re.sub(r"const \[imageWarning, setImageWarning\] = useState\(''\);", "", c)
c = re.sub(r"const \[formData, setFormData\] = useState\(\{.*?\}\);", "", c, flags=re.DOTALL)

# Add new state
new_state = """
  const [editorConfig, setEditorConfig] = useState({ isOpen: false, initialData: null, targetSetId: null });
"""
c = c.replace("const [activeSubCategory, setActiveSubCategory] = useState('All');", "const [activeSubCategory, setActiveSubCategory] = useState('All');" + new_state)

# Replace handleAddNew, handleEdit, handleSave
old_handlers = re.compile(r"const handleAddNew = \(\) => \{.*?const resetForm = \(\) => \{.*?\}\;", re.DOTALL)

new_handlers = """
  const handleAddNew = () => {
    setEditorConfig({
      isOpen: true,
      initialData: { mainCategory: activeMainCategory !== 'All' ? activeMainCategory : '', subCategory: activeSubCategory !== 'All' ? activeSubCategory : '' },
      targetSetId: null
    });
  };

  const handleEdit = (product, setId = null) => {
    setEditorConfig({
      isOpen: true,
      initialData: product,
      targetSetId: setId
    });
  };

  const handleSaveProduct = async (payload) => {
    const isPlaceholder = payload.id && payload.id.startsWith('draft-');
    let finalId = payload.id;
    
    if (isPlaceholder || !payload.id) {
      // It's a new product
      const newPayload = { ...payload };
      delete newPayload.id; // Let AdminContext generate it
      const added = await addProduct(newPayload);
      finalId = added.id;
      
      // If it was created from a grid placeholder, update the set
      if (editorConfig.targetSetId && isPlaceholder) {
        updateProductInSet(editorConfig.targetSetId, payload.id, { productId: finalId });
      }
    } else {
      // It's an existing product
      updateProduct(payload.id, payload);
    }
  };
"""
# Since old_handlers might not match exactly due to my regex, I'll find start and end
# Let's find "const handleAddNew" to "const resetForm" ... wait.
