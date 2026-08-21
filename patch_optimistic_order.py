import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

old_order = """  const changeProductOrderInSet = async (setId, productId, newIndex, updatedData = null) => {
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

new_order = """  const changeProductOrderInSet = async (setId, productId, newIndex, updatedData = null) => {
    // 1. Optimistic UI update
    setSets(prev => prev.map(s => {
      if (s.id !== setId) return s;
      const currentIndex = s.items.findIndex(i => i.productId === productId);
      if (currentIndex === -1) return s;
      const newItems = [...s.items];
      const [movedItem] = newItems.splice(currentIndex, 1);
      const itemToInsert = updatedData ? { ...movedItem, ...updatedData } : movedItem;
      newItems.splice(newIndex, 0, itemToInsert);
      
      // 2. Background DB update
      supabase.from('sets').update({ items: newItems }).eq('id', setId).then(({ error }) => {
        if (error) {
          console.error("changeProductOrderInSet error:", error);
          fetchData(); // Rollback
        }
      });
      
      return { ...s, items: newItems };
    }));
  };"""

c = c.replace(old_order, new_order)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)

