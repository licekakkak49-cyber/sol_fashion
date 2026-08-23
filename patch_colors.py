import re
with open('src/pages/admin/components/InventoryList.jsx', 'r') as f:
    code = f.read()

# Fix Show Variants link color and visibility
old_show = """                        <span onClick={() => toggleRow(product.id)} style={{ color: '#4f46e5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 500 }}>
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />} 
                          {isExpanded ? 'Hide Variants' : 'Show Variants'}
                        </span>"""
new_show = """                        {product.colorVariants && product.colorVariants.length > 0 && (
                          <span onClick={() => toggleRow(product.id)} style={{ color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 500, borderBottom: '1px solid #d1d5db', paddingBottom: '1px' }}>
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />} 
                            {isExpanded ? 'Hide Variants' : 'Show Variants'}
                          </span>
                        )}"""
code = code.replace(old_show, new_show)

# Fix Quick Restock button color
old_restock_btn = """                      style={{ padding: '6px 10px', background: '#e0e7ff', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}"""
new_restock_btn = """                      style={{ padding: '6px 10px', background: '#111', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}"""
code = code.replace(old_restock_btn, new_restock_btn)

# Fix Modal Save button color just in case it was blue
old_modal_save = """<button onClick={handleRestockSave} disabled={isSavingFast} style={{ padding: '8px 24px', borderRadius: '100px', background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>"""
new_modal_save = """<button onClick={handleRestockSave} disabled={isSavingFast} style={{ padding: '8px 24px', borderRadius: '100px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>"""
code = code.replace(old_modal_save, new_modal_save)

with open('src/pages/admin/components/InventoryList.jsx', 'w') as f:
    f.write(code)
