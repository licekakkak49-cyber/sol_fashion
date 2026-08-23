import re

with open('src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    code = f.read()


fast_update_fn = """  const handleFastUpdate = async (payload) => {
    if (!payload.id) return;
    try {
      const dbPayload = {
        stock: payload.stock,
        status: payload.status,
        color_variants: payload.colorVariants
      };
      
      const { error } = await supabase
        .from('products')
        .update(dbPayload)
        .eq('id', payload.id);
        
      if (error) throw error;
      fetchData(); // Reload inventory list
    } catch (err) {
      console.error('Error fast updating product:', err);
      alert('Failed to update stock. See console for details.');
    }
  };

  const handleSaveProduct = async (payload) => {"""

code = code.replace("  const handleSaveProduct = async (payload) => {", fast_update_fn)

# Add prop to InventoryList
code = code.replace(
    "<InventoryList products={filteredProducts} handleEdit={handleEdit} handleDelete={handleDelete} toggleProductStatus={toggleProductStatus} />",
    "<InventoryList products={filteredProducts} handleEdit={handleEdit} handleDelete={handleDelete} toggleProductStatus={toggleProductStatus} handleFastUpdate={handleFastUpdate} />"
)

with open('src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(code)
