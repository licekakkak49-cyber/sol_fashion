import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# 1. Replace the old mock arrays
old_arrays = '''  const frameColors = ['Black', 'Silver', 'Brown', 'Clear', 'White', 'Gold', 'Tortoise'].map(c => ({ label: c, value: c }));
  const lensColors = ['Black', 'Gray', 'Brown', 'Green', 'Blue', 'Clear', 'Pink'].map(c => ({ label: c, value: c }));
  const shapes = ['Square', 'Oval', 'Round', 'Cat-eye', 'Aviator'].map(c => ({ label: c, value: c }));
  const materials = ['Acetate', 'Metal', 'Mixed', 'Nylon'].map(c => ({ label: c, value: c }));
  const genders = ['Men', 'Women', 'Unisex', 'Kids'].map(c => ({ label: c, value: c }));
  const polarizeOptions = [{label: 'Yes', value: 'Yes'}, {label: 'No', value: 'No'}];
  const highlightOptions = [{label: 'New Arrival', value: 'New Arrival'}, {label: 'Best Seller', value: 'Best Seller'}];
  const brandOptions = (brands || []).map(b => ({ label: b?.name || '', value: b?.slug || '' }));'''

new_arrays = '''  const rtwSizes = ['XS', 'S', 'M', 'L', 'XL'].map(c => ({ label: c, value: c }));
  const rtwFits = ['Oversized', 'Slim Fit', 'Relaxed', 'Cropped'].map(c => ({ label: c, value: c }));
  const bagHardware = ['Gold-tone', 'Silver-tone', 'Matte Black'].map(c => ({ label: c, value: c }));
  const shoeSizes = ['35', '36', '37', '38', '39', '40', '41', '42'].map(c => ({ label: c, value: c }));
  const heelHeights = ['Flat', '55mm', '85mm', '100mm'].map(c => ({ label: c, value: c }));
  const accSizes = ['One Size', 'S', 'M', 'L'].map(c => ({ label: c, value: c }));
  const materials = ['Cotton', 'Silk', 'Leather', 'Calfskin', 'Suede', 'Canvas', 'Nylon'].map(c => ({ label: c, value: c }));
  const highlightOptions = [{label: 'New Arrival', value: 'New Arrival'}, {label: 'Best Seller', value: 'Best Seller'}];
  const brandOptions = (brands || []).map(b => ({ label: b?.name || '', value: b?.slug || '' }));'''

c = c.replace(old_arrays, new_arrays)

# 2. Replace icons in Step 1
old_icons = "{cat === 'Bags' ? <Package size={24} /> : cat === 'Shoes' ? <Hexagon size={24} /> : cat === 'Lenses' ? <Eye size={24} /> : cat === 'Bespoke' ? <LayoutGrid size={24} /> : <Tag size={24} />}"
new_icons = "{cat === 'Bags' ? <Briefcase size={24} /> : cat === 'Shoes' ? <Hexagon size={24} /> : cat === 'Ready-to-Wear' ? <Shirt size={24} /> : <Glasses size={24} />}"
c = c.replace(old_icons, new_icons)

# 3. Replace Step 3 Dynamic UI
start_str = "{(formData.mainCategory === 'Lenses' || formData.mainCategory === 'Bespoke') && ("
end_str = "<MultiPillSelector label=\"Collection Highlight\" options={highlightOptions} selectedValues={formData.highlight} onChange={(val) => handleChange('highlight', val)} />"
start_idx = c.find(start_str)
end_idx = c.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_dynamic_ui = '''{formData.mainCategory === 'Ready-to-Wear' && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                          <PillSelector label="Size" options={rtwSizes} selectedValue={formData.size} onChange={(val) => handleChange('size', val)} />
                          <PillSelector label="Fit & Silhouette" options={rtwFits} selectedValue={formData.fit} onChange={(val) => handleChange('fit', val)} />
                          <PillSelector label="Material" options={materials} selectedValue={formData.material} onChange={(val) => handleChange('material', val)} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
                          <div><label style={labelStyle}>Model Info</label><input type="text" value={formData.modelInfo || ''} onChange={(e) => handleChange('modelInfo', e.target.value)} style={inputStyle} placeholder="e.g. Model is 178cm and wears size S" /></div>
                          <div><label style={labelStyle}>Care Instructions</label><input type="text" value={formData.careInstructions || ''} onChange={(e) => handleChange('careInstructions', e.target.value)} style={inputStyle} placeholder="e.g. Dry clean only" /></div>
                        </div>
                      </>
                    )}

                    {formData.mainCategory === 'Bags' && (
                      <>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={labelStyle}>Dimensions (cm)</label>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            <input type="number" value={formData.dimLength || ''} onChange={(e) => handleChange('dimLength', e.target.value)} style={inputStyle} placeholder="Length" />
                            <input type="number" value={formData.dimHeight || ''} onChange={(e) => handleChange('dimHeight', e.target.value)} style={inputStyle} placeholder="Height" />
                            <input type="number" value={formData.dimWidth || ''} onChange={(e) => handleChange('dimWidth', e.target.value)} style={inputStyle} placeholder="Width" />
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                          <div><label style={labelStyle}>Strap Drop (cm)</label><input type="number" value={formData.strapDrop || ''} onChange={(e) => handleChange('strapDrop', e.target.value)} style={inputStyle} placeholder="e.g. 50" /></div>
                          <PillSelector label="Hardware" options={bagHardware} selectedValue={formData.hardware} onChange={(val) => handleChange('hardware', val)} />
                          <PillSelector label="Material" options={materials} selectedValue={formData.material} onChange={(val) => handleChange('material', val)} />
                        </div>
                      </>
                    )}

                    {formData.mainCategory === 'Shoes' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <PillSelector label="EU Size" options={shoeSizes} selectedValue={formData.size} onChange={(val) => handleChange('size', val)} />
                        <PillSelector label="Heel Height" options={heelHeights} selectedValue={formData.heelHeight} onChange={(val) => handleChange('heelHeight', val)} />
                        <PillSelector label="Material" options={materials} selectedValue={formData.material} onChange={(val) => handleChange('material', val)} />
                      </div>
                    )}
                    
                    {formData.mainCategory === 'Accessories' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <PillSelector label="Size" options={accSizes} selectedValue={formData.size} onChange={(val) => handleChange('size', val)} />
                        <PillSelector label="Material" options={materials} selectedValue={formData.material} onChange={(val) => handleChange('material', val)} />
                      </div>
                    )}
                    
                    '''
    c = c[:start_idx] + new_dynamic_ui + c[end_idx:]


with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
