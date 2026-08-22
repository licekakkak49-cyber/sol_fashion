import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

old_btn = """        <button 
          onClick={() => {
             setCategoryInput('');
             setCategoryModal({ isOpen: true, type: 'main', action: 'add', oldName: '', mainName: '' });
          }}
          style={{
            padding: '8px',
            border: 'none',
            borderRadius: '50%',
            background: 'transparent',
            color: '#888',
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
            border: 'none',
            borderRadius: '50%',
            background: 'transparent',
            color: '#888',
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
