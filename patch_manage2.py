import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# Add Drawer import
if "ProductEditorDrawer" not in c:
    c = c.replace("import SetsManager from './components/SetsManager';", "import SetsManager from './components/SetsManager';\nimport ProductEditorDrawer from './components/ProductEditorDrawer';")

# Delete old state block and handlers
start_str = "const [modalStep, setModalStep] = useState(1);"
end_str = "const validProducts = Array.isArray(products) ? products.filter(Boolean) : [];"

start_idx = c.find(start_str)
end_idx = c.find(end_str)

new_state_and_handlers = """
  const [editorConfig, setEditorConfig] = useState({ isOpen: false, initialData: null, targetSetId: null });

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
      const newPayload = { ...payload };
      delete newPayload.id;
      const added = await addProduct(newPayload);
      finalId = added.id;
      
      if (editorConfig.targetSetId && isPlaceholder) {
        updateProductInSet(editorConfig.targetSetId, payload.id, { productId: finalId, isHidden: false });
      }
    } else {
      updateProduct(payload.id, payload);
    }
  };
"""

if start_idx != -1 and end_idx != -1:
    c = c[:start_idx] + new_state_and_handlers + "\n  " + c[end_idx:]

# Find the "Add Product" button that calls `setIsAdding(true)` and `resetForm()`
# Let's replace onClick={() => { setIsAdding(true); resetForm(); }} with onClick={handleAddNew}
c = re.sub(r"onClick=\{\(\) => \{ setIsAdding\(true\); resetForm\(\); \}\}", "onClick={handleAddNew}", c)

# Strip out the `{isAdding && (...)` block
start_jsx = "{isAdding && ("
end_jsx = "</div>\n        </div>\n      )}\n    </div>"
# Wait, this might be fragile. I'll just find the exact index.
start_jsx_idx = c.find(start_jsx)
if start_jsx_idx != -1:
    # We want to replace everything from {isAdding && ( down to the very last </div> for the component
    # Actually let's search for "        </div>\n      )}\n"
    search_end = c.find("        </div>\n      )}\n", start_jsx_idx)
    if search_end != -1:
        end_of_block = search_end + len("        </div>\n      )}\n")
        
        # Inject our Drawer here
        drawer_jsx = """
      <ProductEditorDrawer 
        isOpen={editorConfig.isOpen}
        onClose={() => setEditorConfig({ ...editorConfig, isOpen: false })}
        onSave={handleSaveProduct}
        initialData={editorConfig.initialData}
        categories={categories}
        brands={brands}
        config={{ defaultMainCategory: activeMainCategory, defaultSubCategory: activeSubCategory, targetSetId: editorConfig.targetSetId }}
      />
"""
        c = c[:start_jsx_idx] + drawer_jsx + c[end_of_block:]

# Also remove `<ImageCropper` that might be lingering around line 1082
c = re.sub(r"\{cropImageSrc && \(.*?</ImageCropper>\s*\)\}", "", c, flags=re.DOTALL)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)

