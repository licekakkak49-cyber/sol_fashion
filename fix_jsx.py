with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'r') as f:
    code = f.read()

code = code.replace("{formData.contentType === 'image' && !isTextModule ? (\n                {initialData?.layoutSize === '4x2'", "{formData.contentType === 'image' && !isTextModule ? (\n              <>\n                {initialData?.layoutSize === '4x2'")
with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'w') as f:
    f.write(code)
