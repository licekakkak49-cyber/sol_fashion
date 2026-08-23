import re

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'r') as f:
    code = f.read()

alignment_html = """              <>
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

"""

code = code.replace("              <>\n<div>", alignment_html + "<div>")

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'w') as f:
    f.write(code)
