import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

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
            }}
            title="Manage Subcategories"
          >
            <Settings size={14} />
          </button>
        )}"""
c = c.replace(sub_btn, "")

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
