import re

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'r') as f:
    c = f.read()

old_editSub = """  const editSubCategory = (mainName, oldSub, newSub) => {
    if (!mainName || !oldSub || !newSub || !categories[mainName]) return false;
    if (categories[mainName].includes(newSub)) return false;
    setCategories(prev => ({
      ...prev,
      [mainName]: prev[mainName].map(sub => sub === oldSub ? newSub : sub)
    }));
    setProducts(prev => prev.map(p => (p.mainCategory === mainName && p.subCategory === oldSub) ? { ...p, subCategory: newSub } : p));
    return true;
  };"""

new_editSub = """  const editSubCategory = (mainName, oldSub, newSub) => {
    if (!mainName || !oldSub || !newSub || !categories[mainName]) return false;
    if (categories[mainName].includes(newSub)) return false;
    setCategories(prev => ({
      ...prev,
      [mainName]: prev[mainName].map(sub => sub === oldSub ? newSub : sub)
    }));
    setProducts(prev => prev.map(p => (p.mainCategory === mainName && p.subCategory === oldSub) ? { ...p, subCategory: newSub } : p));
    return true;
  };

  const deleteCategory = (mainName) => {
    setCategories(prev => {
      const newP = { ...prev };
      delete newP[mainName];
      return newP;
    });
  };

  const deleteSubCategory = (mainName, subName) => {
    setCategories(prev => {
      const newP = { ...prev };
      if (newP[mainName]) {
        newP[mainName] = newP[mainName].filter(sub => sub !== subName);
      }
      return newP;
    });
  };

  const reorderCategories = (newOrderKeys) => {
    setCategories(prev => {
      const newP = {};
      newOrderKeys.forEach(key => {
        if (prev[key]) newP[key] = prev[key];
      });
      // Ensure any missing keys are appended at the end
      Object.keys(prev).forEach(key => {
        if (!newP[key]) newP[key] = prev[key];
      });
      return newP;
    });
  };

  const reorderSubCategories = (mainName, newOrderArr) => {
    setCategories(prev => {
      const newP = { ...prev };
      if (newP[mainName]) {
        newP[mainName] = newOrderArr;
      }
      return newP;
    });
  };"""

c = c.replace(old_editSub, new_editSub)

old_export = """    editCategory,
    editSubCategory,
    contentArticles,"""

new_export = """    editCategory,
    editSubCategory,
    deleteCategory,
    deleteSubCategory,
    reorderCategories,
    reorderSubCategories,
    contentArticles,"""

c = c.replace(old_export, new_export)

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'w') as f:
    f.write(c)
