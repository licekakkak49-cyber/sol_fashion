import re
with open('src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    code = f.read()

old_prop = """          <InventoryList 
            products={filteredProducts} 
            handleEdit={handleEdit} 
            handleDelete={deleteProduct} 
            toggleProductStatus={toggleProductStatus}
          />"""

new_prop = """          <InventoryList 
            products={filteredProducts} 
            handleEdit={handleEdit} 
            handleDelete={deleteProduct} 
            toggleProductStatus={toggleProductStatus}
            handleFastUpdate={handleFastUpdate}
          />"""

code = code.replace(old_prop, new_prop)

with open('src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(code)
