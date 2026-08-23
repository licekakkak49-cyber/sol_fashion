import re

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'r') as f:
    code = f.read()

code = code.replace("active={(formData.contentData.alignment || 'center') === 'left'}", "active={(formData.contentData.alignment || 'left') === 'left'}")
code = code.replace("active={(formData.contentData.alignment || 'center') === 'center'}", "active={(formData.contentData.alignment || 'left') === 'center'}")

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'w') as f:
    f.write(code)
