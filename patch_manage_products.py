import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

old_addSet = """  const addSet = async (newSet) => {
    const { error } = await supabase.from('sets').insert([newSet]);"""

new_addSet = """  const addSet = async (newSet) => {
    newSet.id = Date.now().toString();
    const { error } = await supabase.from('sets').insert([newSet]);"""

c = c.replace(old_addSet, new_addSet)

old_saveProduct = """      if (isPlaceholder || !payload.id) {
        // Insert new product
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([dbPayload])
          .select()
          .single();"""

new_saveProduct = """      if (isPlaceholder || !payload.id) {
        // Insert new product
        dbPayload.id = Date.now().toString();
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([dbPayload])
          .select()
          .single();"""

c = c.replace(old_saveProduct, new_saveProduct)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
