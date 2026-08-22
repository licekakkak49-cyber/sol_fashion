import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/PreviewModal.jsx', 'r') as f:
    c = f.read()

browser_bar = """          {/* Fake Browser Bar */}
          <div style={{
            background: '#e5e7eb',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: '12px',
            borderBottom: '1px solid #d1d5db',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f87171' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fbbf24' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#34d399' }}></div>
            </div>
            <div style={{
              flex: 1,
              background: '#fff',
              height: '24px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: 500
            }}>
              🔒 solfashion.com/shop (Preview Mode)
            </div>
            <div style={{ width: '48px' }}></div> {/* Spacer to center URL bar */}
          </div>\n\n"""

c = c.replace(browser_bar, "")

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/PreviewModal.jsx', 'w') as f:
    f.write(c)
