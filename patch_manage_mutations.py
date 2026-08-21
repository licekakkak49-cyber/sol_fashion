with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

import re

# Add the new mutation functions
old_funcs = """  const updateProductInSet = async (setId, productId, updatedData) => {
    // This is mainly for removing or hiding in SetsManager
    const { data: set } = await supabase.from('sets').select('*').eq('id', setId).single();
    if (set) {
      const newItems = set.items.map(item => item.productId === productId ? { ...item, ...updatedData } : item);
      await supabase.from('sets').update({ items: newItems }).eq('id', setId);
      fetchData();
    }
  };"""

new_funcs = """  const updateProductInSet = async (setId, productId, updatedData) => {
    const { data: set } = await supabase.from('sets').select('*').eq('id', setId).single();
    if (set) {
      const newItems = set.items.map(item => item.productId === productId ? { ...item, ...updatedData } : item);
      await supabase.from('sets').update({ items: newItems }).eq('id', setId);
      fetchData();
    }
  };

  const addSet = async (newSet) => {
    await supabase.from('sets').insert([newSet]);
    fetchData();
  };

  const updateSet = async (setId, name) => {
    await supabase.from('sets').update({ name }).eq('id', setId);
    fetchData();
  };

  const removeProductFromSet = async (setId, productId) => {
    const { data: set } = await supabase.from('sets').select('*').eq('id', setId).single();
    if (set) {
      const newItems = set.items.map(item => {
        if (item.productId === productId) {
           return { productId: `draft-${Date.now()}-${Math.random()}`, layoutSize: item.layoutSize, isHidden: true };
        }
        return item;
      });
      await supabase.from('sets').update({ items: newItems }).eq('id', setId);
      fetchData();
    }
  };

  const changeProductOrderInSet = async (setId, productId, newIndex, updatedData = null) => {
    const { data: set } = await supabase.from('sets').select('*').eq('id', setId).single();
    if (set) {
      const currentIndex = set.items.findIndex(i => i.productId === productId);
      if (currentIndex === -1) return;
      const newItems = [...set.items];
      const [movedItem] = newItems.splice(currentIndex, 1);
      const itemToInsert = updatedData ? { ...movedItem, ...updatedData } : movedItem;
      newItems.splice(newIndex, 0, itemToInsert);
      await supabase.from('sets').update({ items: newItems }).eq('id', setId);
      fetchData();
    }
  };"""

c = c.replace(old_funcs, new_funcs)

# Update SetsManager props
c = c.replace(
    "<SetsManager \n            handleEdit={handleEdit} \n            activeMainCategory={activeMainCategory}\n            activeSubCategory={activeSubCategory}\n          />",
    """<SetsManager 
            handleEdit={handleEdit} 
            activeMainCategory={activeMainCategory}
            activeSubCategory={activeSubCategory}
            products={products}
            sets={sets}
            addSet={addSet}
            updateSet={updateSet}
            deleteSet={deleteSet}
            removeProductFromSet={removeProductFromSet}
            updateProductInSet={updateProductInSet}
            changeProductOrderInSet={changeProductOrderInSet}
          />"""
)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)

