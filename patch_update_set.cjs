const fs = require('fs');
const path = 'src/pages/admin/ManageProductsPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldUpdateSet = `  const updateSet = async (setId, updatedData) => {
    // Optimistic UI update
    setSets(prev => prev.map(s => s.id === setId ? { ...s, ...updatedData } : s));
    
    const dbUpdate = { ...updatedData };
    if (updatedData.mainCategory !== undefined) { dbUpdate.main_category = updatedData.mainCategory; delete dbUpdate.mainCategory; }
    if (updatedData.subCategory !== undefined) { dbUpdate.sub_category = updatedData.subCategory; delete dbUpdate.subCategory; }
    
    // Background DB update
    const { error } = await supabase.from('sets').update(dbUpdate).eq('id', setId);
    if (error) {
      console.error("Update set error:", error);
      fetchData(); // Rollback if error
    }
  };`;

const newUpdateSet = `  const updateSet = async (setId, updatedData) => {
    // Optimistic UI update
    setSets(prev => prev.map(s => s.id === setId ? { ...s, ...updatedData } : s));
    
    const dbUpdate = { ...updatedData };
    if (updatedData.mainCategory !== undefined) { dbUpdate.main_category = updatedData.mainCategory; delete dbUpdate.mainCategory; }
    if (updatedData.subCategory !== undefined) { dbUpdate.sub_category = updatedData.subCategory; delete dbUpdate.subCategory; }
    
    // Background DB update
    const { error } = await supabase.from('sets').update(dbUpdate).eq('id', setId);
    
    // Cascade status to all products in the set
    if (updatedData.status !== undefined) {
      const setToUpdate = sets.find(s => s.id === setId);
      if (setToUpdate && setToUpdate.items) {
        const productIds = setToUpdate.items
          .filter(item => !item.isPlaceholder && item.productId)
          .map(item => item.productId);
          
        if (productIds.length > 0) {
          const newProductStatus = updatedData.status === 'published' ? 'active' : 'draft';
          await supabase.from('products').update({ status: newProductStatus }).in('id', productIds);
          // Optimistically update products state
          setProducts(prev => prev.map(p => productIds.includes(p.id) ? { ...p, status: newProductStatus } : p));
        }
      }
    }

    if (error) {
      console.error("Update set error:", error);
      fetchData(); // Rollback if error
    } else if (updatedData.status !== undefined) {
      // Re-fetch to ensure product list updates properly
      fetchData();
    }
  };`;

code = code.replace(oldUpdateSet, newUpdateSet);
fs.writeFileSync(path, code);
