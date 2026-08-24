with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    content = f.read()

old_header = """        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>Homepage Layout</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>Design your asymmetric grid layout. Drag to reorder.</p>
          </div>
        </div>"""

new_header = """        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>Homepage Layout</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>Design your asymmetric grid layout. Drag to reorder.</p>
          </div>
          <button 
            onClick={() => setIsPreviewOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
          >
            👁️ Preview
          </button>
        </div>"""

if old_header in content:
    content = content.replace(old_header, new_header)
    with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
        f.write(content)
    print("Fixed!")
else:
    print("Could not find old_header!")
