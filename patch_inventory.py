import re

with open('src/pages/admin/components/InventoryList.jsx', 'r') as f:
    code = f.read()

# 1. Add imports (ChevronDown, ChevronUp, AlertCircle, Save, X)
old_imports = "import { Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Package } from 'lucide-react';"
new_imports = "import { Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Package, ChevronDown, ChevronUp, AlertCircle, Save, X, Box } from 'lucide-react';"
code = code.replace(old_imports, new_imports)

# 2. Add states for expandedRows and restockModal
old_props = "export default function InventoryList({ products, handleEdit, handleDelete, toggleProductStatus }) {"
new_props = "export default function InventoryList({ products, handleEdit, handleDelete, toggleProductStatus, handleFastUpdate }) {"
code = code.replace(old_props, new_props)

old_state = "const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });"
new_state = """const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [expandedRows, setExpandedRows] = useState({});
  const [restockModalData, setRestockModalData] = useState(null);
  const [isSavingFast, setIsSavingFast] = useState(false);"""
code = code.replace(old_state, new_state)


# 3. Add Fast Save Logic
fast_save_logic = """
  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getMissingSizes = (product) => {
    const missing = [];
    (product.colorVariants || []).forEach(v => {
      if (v.stock) {
        Object.entries(v.stock).forEach(([size, qty]) => {
          if (qty === 0) missing.push(`${v.name || 'Original'} - ${size}`);
        });
      }
    });
    return missing;
  };

  const handleRestockSave = async () => {
    if (!restockModalData || !handleFastUpdate) return;
    setIsSavingFast(true);
    
    try {
      // Calculate new total stock
      let totalStock = 0;
      restockModalData.colorVariants.forEach(v => {
        if (v.stock) {
          totalStock += Object.values(v.stock).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
        }
      });
      
      const payload = {
        ...restockModalData,
        stock: totalStock,
        status: totalStock > 0 ? 'In Stock' : 'Out of Stock'
      };
      
      await handleFastUpdate(payload);
      setRestockModalData(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingFast(false);
    }
  };
"""
code = code.replace("const sortedProducts = useMemo(", fast_save_logic + "\n  const sortedProducts = useMemo(")


# 4. Modify the mapping in tbody
# I will find the `return (` inside `sortedProducts.map`
# Wait, let's use string split and replace
old_tbody_open = """        <tbody>
          {sortedProducts.map((product, index) => {"""

new_tbody_open = """        <tbody>
          {sortedProducts.map((product, index) => {
            const isExpanded = !!expandedRows[product.id];
            const missingSizes = getMissingSizes(product);
            const hasMissing = missingSizes.length > 0;
"""
code = code.replace(old_tbody_open, new_tbody_open)


old_tr = """              <tr key={product.id} style={{ borderBottom: index === sortedProducts.length - 1 ? 'none' : '1px solid #e5e7eb', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>"""
new_tr = """              <React.Fragment key={product.id}>
              <tr style={{ borderBottom: isExpanded ? 'none' : (index === sortedProducts.length - 1 ? 'none' : '1px solid #e5e7eb'), transition: 'background 0.2s', background: isExpanded ? '#f9fafb' : 'transparent' }} onMouseOver={(e) => {if(!isExpanded) e.currentTarget.style.background = '#f9fafb'}} onMouseOut={(e) => {if(!isExpanded) e.currentTarget.style.background = 'transparent'}}>"""
code = code.replace(old_tr, new_tr)


old_name_col = """                    <div>
                      <div style={{ fontWeight: 500, color: '#111', fontSize: '14px' }}>{product.name || 'Unnamed Product'}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {product.id.substring(0, 8)}</div>
                    </div>
                  </div>
                </td>"""

new_name_col = """                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ fontWeight: 500, color: '#111', fontSize: '14px' }}>{product.name || 'Unnamed Product'}</div>
                        {hasMissing && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}><AlertCircle size={10} /> Missing Sizes</div>}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ID: {product.id.substring(0, 8)}
                        <span onClick={() => toggleRow(product.id)} style={{ color: '#4f46e5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 500 }}>
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />} 
                          {isExpanded ? 'Hide Variants' : 'Show Variants'}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>"""
code = code.replace(old_name_col, new_name_col)


old_actions_col = """                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button 
                      onClick={() => handleEdit(product)}
                      style={{ padding: '6px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', color: sortConfig.key === '' ? '#111' : '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Edit Product"
                    >"""

new_actions_col = """                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button 
                      onClick={() => setRestockModalData(JSON.parse(JSON.stringify(product)))}
                      style={{ padding: '6px 10px', background: '#e0e7ff', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}
                      title="Quick Restock"
                    >
                      <Box size={14} /> Restock
                    </button>
                    <button 
                      onClick={() => handleEdit(product)}
                      style={{ padding: '6px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Edit Product"
                    >"""
code = code.replace(old_actions_col, new_actions_col)


# Close fragment and add expanded row
old_close_tr = """              </tr>
            );"""

new_close_tr = """              </tr>
              {isExpanded && (
                <tr style={{ background: '#f9fafb', borderBottom: index === sortedProducts.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                  <td colSpan={6} style={{ padding: '0 16px 16px 68px' }}>
                    <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '16px' }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#111' }}>Variant Stock Breakdown</h4>
                      {(!product.colorVariants || product.colorVariants.length === 0) ? (
                        <div style={{ fontSize: '12px', color: '#666' }}>No variants configured.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {product.colorVariants.map((v, vIdx) => (
                            <div key={vIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                              <div style={{ width: '120px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500 }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: v.hex || '#000', border: '1px solid #e5e7eb' }} />
                                {v.name || 'Original'}
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
                                {v.stock ? Object.entries(v.stock).map(([size, qty]) => (
                                  <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: qty === 0 ? '#fee2e2' : '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                    <span style={{ fontWeight: 600, color: '#4b5563' }}>{size}</span>
                                    <span style={{ color: qty === 0 ? '#dc2626' : '#111', fontWeight: qty === 0 ? 600 : 400 }}>{qty}</span>
                                  </div>
                                )) : <div style={{ fontSize: '12px', color: '#999' }}>No stock data</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
              </React.Fragment>
            );"""
code = code.replace(old_close_tr, new_close_tr)


# 5. Add Modal at the end of the file
old_end = """    </div>
  );
}"""

new_end = """    </div>

      {restockModalData && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '500px', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Quick Restock</h2>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{restockModalData.name}</div>
              </div>
              <button onClick={() => setRestockModalData(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}><X size={20} color="#666" /></button>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {(!restockModalData.colorVariants || restockModalData.colorVariants.length === 0) ? (
                <div style={{ textAlign: 'center', color: '#666', padding: '24px' }}>No variants found for this product.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {restockModalData.colorVariants.map((v, vIdx) => (
                    <div key={vIdx}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: v.hex || '#000', border: '1px solid #e5e7eb' }} />
                        {v.name || 'Original'}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {v.stock && Object.keys(v.stock).length > 0 ? (
                          Object.keys(v.stock).map(size => (
                            <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '60px' }}>
                              <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>{size}</span>
                              <input 
                                type="number" 
                                min="0" 
                                value={v.stock[size] || 0} 
                                onChange={(e) => {
                                  const newData = { ...restockModalData };
                                  newData.colorVariants[vIdx].stock[size] = parseInt(e.target.value) || 0;
                                  setRestockModalData(newData);
                                }}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', textAlign: 'center', boxSizing: 'border-box' }}
                              />
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: '12px', color: '#999' }}>No sizes tracked for this color. Please edit product fully.</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ padding: '16px 20px', borderTop: '1px solid #eaeaea', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#f9fafb', borderRadius: '0 0 12px 12px' }}>
              <button onClick={() => setRestockModalData(null)} style={{ padding: '8px 16px', borderRadius: '100px', background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleRestockSave} disabled={isSavingFast} style={{ padding: '8px 24px', borderRadius: '100px', background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Save size={16} /> {isSavingFast ? 'Saving...' : 'Save Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
  </div>
  );
}"""
code = code.replace(old_end, new_end)

with open('src/pages/admin/components/InventoryList.jsx', 'w') as f:
    f.write(code)
