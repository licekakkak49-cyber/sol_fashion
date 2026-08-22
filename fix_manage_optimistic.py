import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

old_addSet = """  const addSet = async (newSet) => {
    const dbPayload = {
      id: Date.now().toString(),
      name: newSet.name,
      status: newSet.status,
      items: newSet.items,
      main_category: newSet.mainCategory,
      sub_category: newSet.subCategory
    };
    const { error } = await supabase.from('sets').insert([dbPayload]);
    if (error) {
      console.error('Error adding set:', error);
      alert('Failed to create set: ' + error.message);
    }
    fetchData();
  };"""

new_addSet = """  const addSet = async (newSet) => {
    const dbPayload = {
      id: Date.now().toString(),
      name: newSet.name,
      status: newSet.status,
      items: newSet.items,
      main_category: newSet.mainCategory,
      sub_category: newSet.subCategory
    };
    
    // Optimistic Update
    setSets(prev => [{
      ...newSet, 
      id: dbPayload.id,
      mainCategory: newSet.mainCategory,
      subCategory: newSet.subCategory
    }, ...prev]);

    const { error } = await supabase.from('sets').insert([dbPayload]);
    if (error) {
      console.error('Error adding set:', error);
      alert('Failed to create set: ' + error.message);
      fetchData(); // Rollback
    }
  };"""

c = c.replace(old_addSet, new_addSet)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
