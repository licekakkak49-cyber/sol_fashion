import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# 1. Remove categoryModal state
c = re.sub(r"const \[categoryModal, setCategoryModal\] = useState[^;]+;\n", "", c)
c = re.sub(r"const \[categoryInput, setCategoryInput\] = useState[^;]+;\n", "", c)

# 2. Remove "+ Add Main Category" button
main_btn_regex = r"""        <button \n          onClick=\{\(\) => \{\n             setCategoryInput\(''\);\n             setCategoryModal\(\{ isOpen: true, type: 'main', action: 'add', oldName: '', mainName: '' \}\);\n          \}\}\n          style=\{\{\n            padding: '8px',\n            border: 'none',\n            borderRadius: '50%',\n            background: '#f9fafb',\n            color: '#111',\n            cursor: 'pointer',\n            display: 'flex',\n            alignItems: 'center',\n            boxShadow: '0 1px 2px rgba\(0,0,0,0.05\)'\n          \}\}\n          title="Add Category"\n        >\n          <Plus size=\{18\} />\n        </button>"""
c = re.sub(main_btn_regex, "", c)

# 3. Remove "+ Add Sub Category" button
sub_btn_regex = r"""        \{activeMainCategory !== 'All' && \(\n          <button \n            onClick=\{\(\) => \{\n              setCategoryInput\(''\);\n              setCategoryModal\(\{ isOpen: true, type: 'sub', action: 'add', oldName: '', mainName: activeMainCategory \}\);\n            \}\}\n            style=\{\{\n              padding: '0 0 12px 0',\n              border: 'none',\n              background: 'transparent',\n              color: '#888',\n              cursor: 'pointer',\n              display: 'flex',\n              alignItems: 'center',\n              gap: '4px',\n              fontSize: '14px',\n              fontWeight: 500\n            \}\}\n          >\n            <Plus size=\{16\} /> Add\n          </button>\n        \)\}"""
c = re.sub(sub_btn_regex, "", c)

# 4. Remove the old Category Modal JSX at the bottom
modal_jsx_regex = r"""      \{/\* Category Management Modal \*/\}\n      \{categoryModal\.isOpen && \(\n        <div style=\{\{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba\(0,0,0,0.5\)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' \}\}>\n.*?\n        </div>\n      \)\}"""
c = re.sub(modal_jsx_regex, "", c, flags=re.DOTALL)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
