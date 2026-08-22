import re

# 1. Patch AdminContext.jsx
with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'r') as f:
    c = f.read()

old_sets_map = """      const { data: setsData } = await supabase.from('sets').select('*').order('created_at', { ascending: false });
      if (setsData && setsData.length > 0) {
        setSets(setsData.map(s => ({
          ...s,
          scheduledDate: s.scheduled_date
        })));
      }"""

new_sets_map = """      const { data: setsData } = await supabase.from('sets').select('*').order('created_at', { ascending: false });
      if (setsData && setsData.length > 0) {
        setSets(setsData.map(s => ({
          ...s,
          mainCategory: s.main_category,
          subCategory: s.sub_category,
          scheduledDate: s.scheduled_date
        })));
      }"""
c = c.replace(old_sets_map, new_sets_map)

# Also update addSet and updateSet in AdminContext.jsx to include main_category and sub_category
old_addSet = """    supabase.from('sets').insert({
      id: newId,
      name: set.name,
      items: newSet.items,
      status: newSet.status,
      scheduled_date: newSet.scheduledDate
    })"""
new_addSet = """    supabase.from('sets').insert({
      id: newId,
      name: set.name,
      items: newSet.items,
      status: newSet.status,
      main_category: newSet.mainCategory,
      sub_category: newSet.subCategory,
      scheduled_date: newSet.scheduledDate
    })"""
c = c.replace(old_addSet, new_addSet)

old_updateSet = """    const dbUpdate = {};
    if (updatedData.name !== undefined) dbUpdate.name = updatedData.name;
    if (updatedData.items !== undefined) dbUpdate.items = updatedData.items;
    if (updatedData.status !== undefined) dbUpdate.status = updatedData.status;
    if (updatedData.scheduledDate !== undefined) dbUpdate.scheduled_date = updatedData.scheduledDate;"""
new_updateSet = """    const dbUpdate = {};
    if (updatedData.name !== undefined) dbUpdate.name = updatedData.name;
    if (updatedData.items !== undefined) dbUpdate.items = updatedData.items;
    if (updatedData.status !== undefined) dbUpdate.status = updatedData.status;
    if (updatedData.mainCategory !== undefined) dbUpdate.main_category = updatedData.mainCategory;
    if (updatedData.subCategory !== undefined) dbUpdate.sub_category = updatedData.subCategory;
    if (updatedData.scheduledDate !== undefined) dbUpdate.scheduled_date = updatedData.scheduledDate;"""
c = c.replace(old_updateSet, new_updateSet)

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'w') as f:
    f.write(c)


# 2. Patch ManageProductsPage.jsx
with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

old_manage_map = """      setProducts(mappedProducts);
      setSets(sData || []);"""

new_manage_map = """      setProducts(mappedProducts);
      setSets((sData || []).map(s => ({
        ...s,
        mainCategory: s.main_category,
        subCategory: s.sub_category,
        scheduledDate: s.scheduled_date
      })));"""
c = c.replace(old_manage_map, new_manage_map)

old_manage_addSet = """  const addSet = async (newSet) => {
    newSet.id = Date.now().toString();
    const { error } = await supabase.from('sets').insert([newSet]);"""
new_manage_addSet = """  const addSet = async (newSet) => {
    const dbPayload = {
      id: Date.now().toString(),
      name: newSet.name,
      status: newSet.status,
      items: newSet.items,
      main_category: newSet.mainCategory,
      sub_category: newSet.subCategory
    };
    const { error } = await supabase.from('sets').insert([dbPayload]);"""
c = c.replace(old_manage_addSet, new_manage_addSet)

old_manage_updateSet = """  const updateSet = async (setId, updatedData) => {
    // Optimistic UI update
    setSets(prev => prev.map(s => s.id === setId ? { ...s, ...updatedData } : s));
    
    // Background DB update
    const { error } = await supabase.from('sets').update(updatedData).eq('id', setId);"""

new_manage_updateSet = """  const updateSet = async (setId, updatedData) => {
    // Optimistic UI update
    setSets(prev => prev.map(s => s.id === setId ? { ...s, ...updatedData } : s));
    
    const dbUpdate = { ...updatedData };
    if (updatedData.mainCategory !== undefined) { dbUpdate.main_category = updatedData.mainCategory; delete dbUpdate.mainCategory; }
    if (updatedData.subCategory !== undefined) { dbUpdate.sub_category = updatedData.subCategory; delete dbUpdate.subCategory; }
    
    // Background DB update
    const { error } = await supabase.from('sets').update(dbUpdate).eq('id', setId);"""
c = c.replace(old_manage_updateSet, new_manage_updateSet)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
