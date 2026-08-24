import re

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'r') as f:
    content = f.read()

# Add imports
if 'useAdmin' not in content:
    content = content.replace("import { uploadImageToSupabase } from '../../../utils/supabaseStorage';", "import { uploadImageToSupabase } from '../../../utils/supabaseStorage';\nimport { useAdmin } from '../../../context/AdminContext';")

if 'Search' not in content:
    content = content.replace("import { X, UploadCloud, Link, Layout, AlignLeft, AlignCenter } from 'lucide-react';", "import { X, UploadCloud, Link, Layout, AlignLeft, AlignCenter, Search } from 'lucide-react';")

# Add state
if 'const [productSearch' not in content:
    content = content.replace("const fileInputRef = useRef(null);", "const fileInputRef = useRef(null);\n  const { products } = useAdmin();\n  const [productSearch, setProductSearch] = useState('');")

# Replace product ID input
old_product_block = """            ) : formData.contentType === 'product' ? (
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
            ) : ("""

new_product_block = """            ) : formData.contentType === 'product' ? (
              <div>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Select Product</label>
                
                {/* Search Bar */}
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#888' }} />
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '12px 16px 12px 40px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', background: '#f9fafb', outline: 'none' }}
                    value={productSearch} 
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="Search by product name..."
                  />
                </div>

                {/* Selected Product Preview */}
                {formData.contentData.productId && (
                  <div style={{ marginBottom: '16px', padding: '12px', border: '1px solid #000', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', background: '#fafafa' }}>
                    <img src={products?.find(p => p.id === formData.contentData.productId)?.image || 'https://via.placeholder.com/50'} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{products?.find(p => p.id === formData.contentData.productId)?.name || 'Unknown Product'}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>ID: {formData.contentData.productId.substring(0, 8)}...</div>
                    </div>
                  </div>
                )}

                {/* Scrolling Grid of Products */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px', paddingBottom: '20px' }}>
                  {products?.filter(p => p.name?.toLowerCase().includes(productSearch.toLowerCase())).map(product => {
                     const isSelected = formData.contentData.productId === product.id;
                     return (
                       <div 
                         key={product.id} 
                         onClick={() => handleDataChange('productId', product.id)}
                         style={{ 
                           border: isSelected ? '2px solid #000' : '1px solid #e5e7eb',
                           borderRadius: '8px', 
                           padding: '8px',
                           cursor: 'pointer',
                           opacity: isSelected ? 1 : 0.6,
                           transition: 'all 0.2s',
                           background: isSelected ? '#fafafa' : '#fff'
                         }}
                       >
                         <img src={product.image} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />
                         <div style={{ fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                         <div style={{ fontSize: '11px', color: '#888' }}>{product.price} THB</div>
                       </div>
                     );
                  })}
                </div>

              </div>
            ) : ("""

content = content.replace(old_product_block, new_product_block)

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'w') as f:
    f.write(content)

print("Drawer UI updated!")
