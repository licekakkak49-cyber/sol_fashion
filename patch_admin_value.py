import re

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'r') as f:
    c = f.read()

old_val = """    categories,
    addCategory,
    addSubCategory,
    editCategory,
    editSubCategory,
    addContentArticle,"""

new_val = """    categories,
    addCategory,
    addSubCategory,
    editCategory,
    editSubCategory,
    deleteCategory,
    deleteSubCategory,
    reorderCategories,
    reorderSubCategories,
    addContentArticle,"""

c = c.replace(old_val, new_val)

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'w') as f:
    f.write(c)
