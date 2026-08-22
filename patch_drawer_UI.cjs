const fs = require('fs');
const path = 'src/pages/admin/components/ProductEditorDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

const targetSection = `          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Categorization</h3>`;

const uiCode = `          {/* Color Variants Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Color Variants</h3>
              <button 
                onClick={() => handleChange('colorVariants', [...(formData.colorVariants || []), { id: Date.now(), name: '', hex: '#000000', image: '' }])}
                style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '100px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} /> Add Color
              </button>
            </div>
            
            {(formData.colorVariants || []).length === 0 ? (
              <div style={{ padding: '24px', background: '#f9fafb', borderRadius: '12px', textAlign: 'center', border: '1px dashed #e5e7eb' }}>
                <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>No color variants added. The default images will be used.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(formData.colorVariants || []).map((variant, idx) => (
                  <div key={variant.id || idx} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Variant #{idx + 1}</span>
                      <button 
                        onClick={() => handleChange('colorVariants', formData.colorVariants.filter((_, i) => i !== idx))}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                      >
                        Remove
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={labelStyle}>Color Name</label>
                        <input type="text" value={variant.name} onChange={(e) => {
                          const newV = [...formData.colorVariants];
                          newV[idx].name = e.target.value;
                          handleChange('colorVariants', newV);
                        }} style={inputStyle} placeholder="e.g. Midnight Blue" />
                      </div>
                      <div>
                        <label style={labelStyle}>Hex Code</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input type="color" value={variant.hex} onChange={(e) => {
                            const newV = [...formData.colorVariants];
                            newV[idx].hex = e.target.value;
                            handleChange('colorVariants', newV);
                          }} style={{ width: '36px', height: '36px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                          <input type="text" value={variant.hex} onChange={(e) => {
                            const newV = [...formData.colorVariants];
                            newV[idx].hex = e.target.value;
                            handleChange('colorVariants', newV);
                          }} style={{ ...inputStyle, flex: 1 }} />
                        </div>
                      </div>
                    </div>
                    
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
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Categorization</h3>`;

code = code.replace(targetSection, uiCode);
fs.writeFileSync(path, code);
