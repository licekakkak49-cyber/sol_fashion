import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/PreviewModal.jsx', 'r') as f:
    c = f.read()

# 1. Remove Sticky Alert Banner from the bottom
old_banner_bottom = r"(      \{\/\* Sticky Alert Banner \*\/\}\n      <div style=\{\{\n        position: 'fixed',\n        bottom: 0,\n        left: 0,\n        width: '100%',\n        background: '#f59e0b',\n        color: '#fff',\n        textAlign: 'center',\n        padding: '12px',\n        fontWeight: 600,\n        fontSize: '14px',\n        zIndex: 10000,\n        boxShadow: '0 -4px 12px rgba\(0,0,0,0\.2\)'\n      \}\}>\n        <span style=\{\{ marginRight: '8px' \}\}>👁️<\/span>\n        PREVIEW MODE — You are viewing a simulation\. Changes are not live until published\.\n      <\/div>\n    <\/div>)"

c = re.sub(old_banner_bottom, "    </div>", c, flags=re.DOTALL)

# 2. Add Banner at the top
top_banner = """      {/* Top Control Bar */}
      <div style={{
        height: '60px', background: '#111', color: '#fff', display: 'flex', 
        alignItems: 'center', justifyContent: 'space-between', padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 600 }}>Live Preview</span>
          <div style={{ display: 'flex', gap: '4px', background: '#333', padding: '4px', borderRadius: '8px' }}>
            <button onClick={() => setViewport('100%')} style={{ background: viewport === '100%' ? '#555' : 'transparent', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Monitor size={16} /> Desktop
            </button>
            <button onClick={() => setViewport('768px')} style={{ background: viewport === '768px' ? '#555' : 'transparent', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tablet size={16} /> Tablet
            </button>
            <button onClick={() => setViewport('375px')} style={{ background: viewport === '375px' ? '#555' : 'transparent', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Smartphone size={16} /> Mobile
            </button>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <X size={20} /> Close
        </button>
      </div>
      
      {/* Soft Top Banner */}
      <div style={{
        background: '#fef3c7',
        color: '#92400e',
        textAlign: 'center',
        padding: '10px',
        fontWeight: 500,
        fontSize: '13px',
        borderBottom: '1px solid #fde68a'
      }}>
        <span style={{ marginRight: '6px' }}>👁️</span>
        Preview Mode — Showing only product grid. Changes are not live until published.
      </div>"""

# Replace Top Control Bar with Top Control Bar + Soft Banner
c = re.sub(r"      \{\/\* Top Control Bar \*\/\}.*?<\/button>\n      <\/div>", top_banner, c, flags=re.DOTALL)


# 3. Remove Nav and Footer
c = c.replace("<Nav />", "")
c = c.replace("<Footer />", "")
c = c.replace("paddingTop: '80px'", "paddingTop: '40px'")

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/PreviewModal.jsx', 'w') as f:
    f.write(c)
