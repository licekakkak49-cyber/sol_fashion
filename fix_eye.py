import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

# Fix the JSX usage
code = code.replace("<Trash2, Eye size={16} />", "<Trash2 size={16} />")

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
