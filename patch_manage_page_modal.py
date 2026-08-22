import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# 1. Add Import
old_import = "import InventoryList from './components/InventoryList';"
new_import = "import InventoryList from './components/InventoryList';\nimport CategoriesManagerModal from './components/CategoriesManagerModal';"
c = c.replace(old_import, new_import)

# 2. Add State for the Manager Modal
old_state = "const [categoryModal, setCategoryModal] = useState({ isOpen: false, type: '', action: '', oldName: '', mainName: '' });"
new_state = "const [categoryModal, setCategoryModal] = useState({ isOpen: false, type: '', action: '', oldName: '', mainName: '' });\n  const [isCategoriesManagerOpen, setIsCategoriesManagerOpen] = useState(false);"
c = c.replace(old_state, new_state)

# 3. Mount the modal next to other Modals
old_modal = """      <ProductEditorDrawer 
        isOpen={editorConfig.isOpen}"""
new_modal = """      <CategoriesManagerModal 
        isOpen={isCategoriesManagerOpen} 
        onClose={() => setIsCategoriesManagerOpen(false)} 
      />
      <ProductEditorDrawer 
        isOpen={editorConfig.isOpen}"""
c = c.replace(old_modal, new_modal)

# 4. Connect the Settings button
old_btn = """        <button 
          onClick={() => {
             // ...
          }}
          style={{
            padding: '8px',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            marginLeft: 'auto'
          }}
          title="Manage Categories"
        >
          <Settings size={18} />
        </button>"""

new_btn = """        <button 
          onClick={() => setIsCategoriesManagerOpen(true)}
          style={{
            padding: '8px',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            marginLeft: 'auto'
          }}
          title="Manage Categories"
        >
          <Settings size={18} />
        </button>"""
c = c.replace(old_btn, new_btn)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
