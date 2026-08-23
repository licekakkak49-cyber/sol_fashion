import re

with open('src/pages/admin/components/ProductEditorDrawer.jsx', 'r') as f:
    code = f.read()

old_validation = "if (!formData.coverImage) return setError('⚠️ Cover Image (3:4) is required.');"

new_validation = """const mainVariant = (formData.colorVariants || []).find(v => v.isMain) || (formData.colorVariants || [])[0];
    const hasCover = mainVariant && mainVariant.images && mainVariant.images.length > 0;
    if (!hasCover) return setError('⚠️ Cover Image for the Main Color is required.');"""

code = code.replace(old_validation, new_validation)

with open('src/pages/admin/components/ProductEditorDrawer.jsx', 'w') as f:
    f.write(code)
