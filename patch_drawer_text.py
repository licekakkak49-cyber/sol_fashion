import re

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'r') as f:
    code = f.read()

replacement = """                <div>
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
                </div>"""

# Replace the heading/subtitle block
code = re.sub(r"                <div>\n                  <label .*?>Heading</label>.*?</div>\n                \n                <div>\n                  <label .*?>Paragraph \(Subtitle\)</label>.*?</div>", replacement.strip(), code, flags=re.DOTALL)

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'w') as f:
    f.write(code)
