import re

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'r') as f:
    code = f.read()

start_marker = '<form id="homepage-editor-form" onSubmit={handleSubmit} style={{ display: \'flex\', flexDirection: \'column\', gap: \'32px\' }}>'
end_marker = '</form>'

form_content = """
            {initialData?.layoutSize !== '4x1' && (
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

            {isTextModule ? (
              <>
                <div>
                  <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Alignment</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
                    <TypeOption 
                      active={(formData.contentData.alignment || 'left') === 'left'} 
                      onClick={() => handleDataChange('alignment', 'left')}
                      icon={<AlignLeft size={18}/>} label="Align Left" 
                    />
                    <TypeOption 
                      active={(formData.contentData.alignment || 'left') === 'center'} 
                      onClick={() => handleDataChange('alignment', 'center')}
                      icon={<AlignCenter size={18}/>} label="Align Center" 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Heading</label>
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', background: '#f9fafb', outline: 'none' }}
                    value={formData.contentData.title || ''} 
                    onChange={e => handleDataChange('title', e.target.value)}
                    placeholder="SOL Fall 2026"
                  />
                </div>
                
                <div>
                  <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Link Text</label>
                  <input 
                    type="text"
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', background: '#f9fafb', outline: 'none' }}
                    value={formData.contentData.linkText || ''} 
                    onChange={e => handleDataChange('linkText', e.target.value)}
                    placeholder="DISCOVER THE COLLECTION"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <Link size={14} /> Link URL
                  </label>
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', background: '#f9fafb', outline: 'none' }}
                    value={formData.contentData.linkUrl || ''} 
                    onChange={e => handleDataChange('linkUrl', e.target.value)}
                    placeholder="/collections/fall-2026"
                  />
                </div>
              </>
            ) : formData.contentType === 'product' ? (
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
            ) : (
              <>
                {initialData?.layoutSize === '4x2' && (
                  <div>
                    <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Banner Layout Mode</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <TypeOption 
                        active={(formData.contentData.displayMode || 'normal') === 'normal'} 
                        onClick={() => handleDataChange('displayMode', 'normal')}
                        icon={<Layout size={18}/>} label="Normal" 
                      />
                      <TypeOption 
                        active={formData.contentData.displayMode === 'edge-to-edge'} 
                        onClick={() => handleDataChange('displayMode', 'edge-to-edge')}
                        icon={<Layout size={18}/>} label="Touch Edges" 
                      />
                      <TypeOption 
                        active={formData.contentData.displayMode === 'full-width'} 
                        onClick={() => handleDataChange('displayMode', 'full-width')}
                        icon={<Layout size={18}/>} label="Full Screen" 
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Image (Required)</label>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageFileChange}
                  />
                  
                  {!formData.contentData.imageUrl ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      style={{ width: '100%', aspectRatio: expectedRatio, border: '2px dashed #e5e7eb', borderRadius: '12px', background: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '12px', transition: 'border 0.2s', overflow: 'hidden' }}
                    >
                      <UploadCloud size={32} color="#888" />
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#111', fontWeight: 600, display: 'block' }}>Upload Image</span>
                        <span style={{ fontSize: '12px', color: '#888' }}>Cropped to {expectedRatio === 3/2 ? '3:2 (Landscape)' : '3:4 (Portrait)'}</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eaeaea' }}>
                      <img src={formData.contentData.imageUrl} alt="Preview" style={{ width: '100%', aspectRatio: expectedRatio, objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'opacity 0.2s' }} 
                           onMouseEnter={e => e.currentTarget.style.opacity = 1} 
                           onMouseLeave={e => e.currentTarget.style.opacity = 0}
                           onClick={() => fileInputRef.current?.click()}>
                        <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><UploadCloud size={18}/> Replace Image</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <Link size={14} /> Action Link (Optional)
                  </label>
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', background: '#f9fafb', outline: 'none' }}
                    value={formData.contentData.linkUrl || ''} 
                    onChange={e => handleDataChange('linkUrl', e.target.value)}
                    placeholder="/collections/new-arrivals"
                  />
                </div>
              </>
            )}
"""

pattern = r"(<form id=\"homepage-editor-form\" onSubmit=\{handleSubmit\} style=\{\{ display: 'flex', flexDirection: 'column', gap: '32px' \}\}>).*?(</form>)"
code = re.sub(pattern, r"\1\n" + form_content + r"\n\2", code, flags=re.DOTALL)

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'w') as f:
    f.write(code)
