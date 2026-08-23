import re

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'r') as f:
    code = f.read()

new_block = """            {/* Image Upload Area */}
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
                <span style={{ fontSize: '12px', color: '#888' }}>
                  {(formData.contentData.displayMode || 'normal') === 'normal' && 'Stays within the standard grid layout limits.'}
                  {formData.contentData.displayMode === 'edge-to-edge' && 'Touches the left and right edges of the standard container.'}
                  {formData.contentData.displayMode === 'full-width' && 'Breaks out to span 100% of the entire browser window.'}
                </span>
              </div>
            )}

            <div>"""

code = code.replace("{/* Image Upload Area */}\n            <div>", new_block)

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'w') as f:
    f.write(code)
