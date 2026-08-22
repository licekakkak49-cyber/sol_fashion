import re

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'r') as f:
    c = f.read()

# Locate editSubCategory to insert our new functions after it
old_editSub = """  const editSubCategory = async (mainName, oldSubName, newSubName) => {
    if (!newSubName.trim() || oldSubName === newSubName) return;
    
    setCategories(prev => {
      const newP = { ...prev };
      if (newP[mainName]) {
        newP[mainName] = newP[mainName].map(sub => sub === oldSubName ? newSubName : sub);
      }
      return newP;
    });
  };"""

new_editSub = """  const editSubCategory = async (mainName, oldSubName, newSubName) => {
    if (!newSubName.trim() || oldSubName === newSubName) return;
    
    setCategories(prev => {
      const newP = { ...prev };
      if (newP[mainName]) {
        newP[mainName] = newP[mainName].map(sub => sub === oldSubName ? newSubName : sub);
      }
      return newP;
    });
  };

  const deleteCategory = async (mainName) => {
    setCategories(prev => {
      const newP = { ...prev };
      delete newP[mainName];
      return newP;
    });
  };

  const deleteSubCategory = async (mainName, subName) => {
    setCategories(prev => {
      const newP = { ...prev };
      if (newP[mainName]) {
        newP[mainName] = newP[mainName].filter(sub => sub !== subName);
      }
      return newP;
    });
  };

  const reorderCategories = async (newOrderKeys) => {
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

  const reorderSubCategories = async (mainName, newOrderArr) => {
    setCategories(prev => {
      const newP = { ...prev };
      if (newP[mainName]) {
        newP[mainName] = newOrderArr;
      }
      return newP;
    });
  };"""

c = c.replace(old_editSub, new_editSub)

# Update useAdmin exported object
old_export = """    editCategory,
    editSubCategory
  };"""

new_export = """    editCategory,
    editSubCategory,
    deleteCategory,
    deleteSubCategory,
    reorderCategories,
    reorderSubCategories
  };"""

c = c.replace(old_export, new_export)

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'w') as f:
    f.write(c)
