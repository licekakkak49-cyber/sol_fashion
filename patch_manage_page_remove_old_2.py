import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# 1. Add Sub Category button
sub_btn = """        {activeMainCategory !== 'All' && (
          <button 
            onClick={() => {
              setCategoryInput('');
              setCategoryModal({ isOpen: true, type: 'sub', action: 'add', oldName: '', mainName: activeMainCategory });
            }}
            style={{
              padding: '0 0 12px 0',
              border: 'none',
              background: 'transparent',
              color: '#888',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            <Plus size={16} /> Add
          </button>
        )}"""
c = c.replace(sub_btn, "")

# 2. Add Main Category button
main_btn = """        <button 
          onClick={() => {
             setCategoryInput('');
             setCategoryModal({ isOpen: true, type: 'main', action: 'add', oldName: '', mainName: '' });
          }}
          style={{
            padding: '8px',
            border: 'none',
            borderRadius: '50%',
            background: '#f9fafb',
            color: '#111',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          title="Add Category"
        >
          <Plus size={18} />
        </button>"""
c = c.replace(main_btn, "")

# 3. Old Modal JSX (Find start and end)
start_str = "{/* Category Management Modal */}"
end_str = "    </div>\n  );\n};\n\nexport default ManageProductsPage;"
start_idx = c.find(start_str)
end_idx = c.find(end_str)

if start_idx != -1 and end_idx != -1:
    c = c[:start_idx] + end_str

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
