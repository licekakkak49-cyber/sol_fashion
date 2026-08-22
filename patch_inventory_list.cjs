const fs = require('fs');

// 1. ManageProductsPage.jsx
const managePath = 'src/pages/admin/ManageProductsPage.jsx';
let manageCode = fs.readFileSync(managePath, 'utf8');

const toggleStatusFunc = `  const toggleProductStatus = async (product) => {
    const newStatus = (product.status || 'draft').toLowerCase() === 'draft' ? 'active' : 'draft';
    await supabase.from('products').update({ status: newStatus }).eq('id', product.id);
    fetchData(); // Refresh list
  };

  const deleteProduct = async (id) => {`;

manageCode = manageCode.replace(`  const deleteProduct = async (id) => {`, toggleStatusFunc);

const oldInventory = `<InventoryList 
            products={filteredProducts} 
            handleEdit={handleEdit} 
            handleDelete={deleteProduct} 
          />`;
const newInventory = `<InventoryList 
            products={filteredProducts} 
            handleEdit={handleEdit} 
            handleDelete={deleteProduct} 
            toggleProductStatus={toggleProductStatus}
          />`;
manageCode = manageCode.replace(oldInventory, newInventory);
fs.writeFileSync(managePath, manageCode);

// 2. InventoryList.jsx
const invPath = 'src/pages/admin/components/InventoryList.jsx';
let invCode = fs.readFileSync(invPath, 'utf8');

invCode = invCode.replace(`export default function InventoryList({ products, handleEdit, handleDelete }) {`, `export default function InventoryList({ products, handleEdit, handleDelete, toggleProductStatus }) {`);

const oldBadge = `<span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    padding: '4px 10px', 
                    borderRadius: '100px', 
                    fontSize: '12px', 
                    fontWeight: 600,
                    background: product.status === 'active' ? '#e0e7ff' : '#f3f4f6',
                    color: product.status === 'active' ? '#4f46e5' : '#4b5563',
                    textTransform: 'capitalize'
                  }}>
                    {product.status || 'draft'}
                  </span>`;

const newBadge = `<span 
                    onClick={(e) => { e.stopPropagation(); if (toggleProductStatus) toggleProductStatus(product); }}
                    style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    padding: '4px 10px', 
                    borderRadius: '100px', 
                    fontSize: '12px', 
                    fontWeight: 600,
                    background: product.status === 'active' ? '#e0e7ff' : '#f3f4f6',
                    color: product.status === 'active' ? '#4f46e5' : '#4b5563',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.2s'
                  }}>
                    {product.status === 'active' ? 'Published' : 'Draft'}
                  </span>`;

invCode = invCode.replace(oldBadge, newBadge);
fs.writeFileSync(invPath, invCode);
