const fs = require('fs');
const path = 'src/pages/admin/components/ProductEditorDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Inject getAvailableSizes
const getSizesLogic = `
  const getAvailableSizes = () => {
    if (!formData.mainCategory) return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    if (formData.mainCategory === 'Ready to Wear' || formData.mainCategory === 'Clothing') {
      return ['XS', 'S', 'M', 'L', 'XL'];
    }
    if (formData.mainCategory === 'Accessories & Shoes' && formData.subCategory) {
      if (['Sandals', 'Heels', 'Flats', 'Shoes'].includes(formData.subCategory)) {
        return ['35', '36', '37', '38', '39', '40', '41', '42'];
      }
      return ['One Size']; 
    }
    if (formData.mainCategory === 'Bags') {
      return ['One Size'];
    }
    return ['One Size'];
  };

`;

if (!code.includes('getAvailableSizes = ()')) {
  // insert before const handleChange
  code = code.replace('const handleChange = (field, val) => {', getSizesLogic + '  const handleChange = (field, val) => {');
}

// 2. Modify "Add Color" to init with empty stock and isMain false
const oldAdd = `onClick={() => handleChange('colorVariants', [...(formData.colorVariants || []), { id: Date.now(), name: '', hex: '#000000', image: '' }])}`;
const newAdd = `onClick={() => handleChange('colorVariants', [...(formData.colorVariants || []), { id: Date.now(), name: '', hex: '#000000', image: '', isMain: (formData.colorVariants || []).length === 0, stock: {} }])}`;
code = code.replace(oldAdd, newAdd);

// 3. Inject isMain radio and stock matrix below the Variant Cover Image
const oldVariantHTML = `
                    <div>
                      <label style={labelStyle}>Variant Cover Image (3:4)</label>
                      <input type="file" accept="image/*" id={\`variant-\${idx}-upload\`} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, \`variant-\${idx}\`)} />
                      {variant.image ? (
                        <div style={{ position: 'relative', width: '80px', height: '106px', borderRadius: '8px', overflow: 'hidden' }}>
                          <img src={variant.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Variant Cover" />
                          <button onClick={() => {
                            const newV = [...formData.colorVariants];
                            newV[idx].image = '';
                            handleChange('colorVariants', newV);
                          }} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}><X size={12} /></button>
                        </div>
                      ) : (
                        <label htmlFor={\`variant-\${idx}-upload\`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80px', height: '106px', background: '#f9fafb', border: '1px dashed #ccc', borderRadius: '8px', cursor: 'pointer' }}>
                          <UploadCloud size={20} color="#888" />
                        </label>
                      )}
                    </div>
`;

const newVariantHTML = `
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <label style={labelStyle}>Variant Cover Image (3:4)</label>
                        <input type="file" accept="image/*" id={\`variant-\${idx}-upload\`} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, \`variant-\${idx}\`)} />
                        {variant.image ? (
                          <div style={{ position: 'relative', width: '80px', height: '106px', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src={variant.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Variant Cover" />
                            <button onClick={() => {
                              const newV = [...formData.colorVariants];
                              newV[idx].image = '';
                              handleChange('colorVariants', newV);
                            }} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}><X size={12} /></button>
                          </div>
                        ) : (
                          <label htmlFor={\`variant-\${idx}-upload\`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80px', height: '106px', background: '#f9fafb', border: '1px dashed #ccc', borderRadius: '8px', cursor: 'pointer' }}>
                            <UploadCloud size={20} color="#888" />
                          </label>
                        )}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                          <input 
                            type="radio" 
                            id={\`main-\${idx}\`}
                            name="mainColor" 
                            checked={variant.isMain || false} 
                            onChange={() => {
                              const newV = [...formData.colorVariants].map((v, i) => ({...v, isMain: i === idx}));
                              handleChange('colorVariants', newV);
                            }}
                          />
                          <label htmlFor={\`main-\${idx}\`} style={{ fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Set as Main Default Color</label>
                        </div>
                        
                        <label style={labelStyle}>Stock by Size</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {getAvailableSizes().map(size => (
                            <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '60px' }}>
                              <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>{size}</span>
                              <input 
                                type="number" 
                                min="0" 
                                value={variant.stock?.[size] || 0} 
                                onChange={(e) => {
                                  const newV = [...formData.colorVariants];
                                  if (!newV[idx].stock) newV[idx].stock = {};
                                  newV[idx].stock[size] = parseInt(e.target.value) || 0;
                                  handleChange('colorVariants', newV);
                                }}
                                style={{ ...inputStyle, padding: '8px', textAlign: 'center' }} 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
`;

code = code.replace(oldVariantHTML, newVariantHTML);
fs.writeFileSync(path, code);
