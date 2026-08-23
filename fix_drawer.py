import re

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'r') as f:
    code = f.read()

replacement = """  useEffect(() => {
    if (initialData) {
      let type = initialData.contentType;
      if (!type || type === 'placeholder') {
         type = initialData.layoutSize === '4x1' ? 'text' : 'image';
      }
      setFormData({
        contentType: type,
        contentData: initialData.contentData || {}
      });
    }
  }, [initialData, isOpen]);"""

original = """  useEffect(() => {
    if (initialData) {
      setFormData({
        contentType: initialData.layoutSize === '4x1' ? 'text' : 'image',
        contentData: initialData.contentData || {}
      });
    }
  }, [initialData, isOpen]);"""

code = code.replace(original, replacement)

# We also need to let the user select between Image and Product!
# Let's add the Type Selector back!
# Where should we add it? Under "/* IMAGE MODULE FIELDS */" ?
# No, let's put it right at the top of the form.

type_selector = """            {initialData?.layoutSize !== '4x1' && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Block Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <TypeOption 
                    active={formData.contentType === 'image'} 
                    onClick={() => setFormData(p => ({ ...p, contentType: 'image' }))}
                    icon={<Layout size={18}/>} label="Image/Banner" 
                  />
                  <TypeOption 
                    active={formData.contentType === 'product'} 
                    onClick={() => setFormData(p => ({ ...p, contentType: 'product' }))}
                    icon={<Layout size={18}/>} label="Product" 
                  />
                </div>
              </div>
            )}

            {formData.contentType === 'image' && !isTextModule ? ("""

code = code.replace("            ) : (\n              // IMAGE MODULE FIELDS\n              <>", type_selector)

# Now we need to add the Product Module fields!
product_fields = """              </>
            ) : formData.contentType === 'product' && !isTextModule ? (
              <div>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Product ID</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', background: '#f9fafb', outline: 'none' }}
                  value={formData.contentData.productId || ''} 
                  onChange={e => handleDataChange('productId', e.target.value)}
                  placeholder="Paste Product ID here..."
                />
              </div>
            ) : null}"""

code = code.replace("              </>\n            )}\n\n          </form>", product_fields + "\n\n          </form>")

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'w') as f:
    f.write(code)
