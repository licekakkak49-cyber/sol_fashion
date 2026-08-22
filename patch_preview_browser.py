import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/PreviewModal.jsx', 'r') as f:
    c = f.read()

old_container = """        <div style={{ 
          width: viewport, 
          background: '#fff', 
          height: 'fit-content', 
          minHeight: '100%',
          transition: 'width 0.3s ease',
          boxShadow: '0 0 40px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}>
          <Nav />
          <div style={{ paddingTop: '80px' }}>
             <ProductsPage previewSets={sets} />
          </div>
          <Footer />
        </div>"""

new_container = """        <div style={{ 
          width: viewport, 
          background: '#fff', 
          height: '100%', 
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
          boxShadow: '0 0 40px rgba(0,0,0,0.5)',
          borderRadius: viewport === '100%' ? '0' : '12px',
          overflow: 'hidden'
        }}>
          {/* Fake Browser Bar */}
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
          </div>

          {/* Scrollable Content */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Nav />
            <div style={{ paddingTop: '80px', paddingBottom: '40px' }}>
               <ProductsPage previewSets={sets} />
            </div>
            <Footer />
          </div>
        </div>"""

c = c.replace(old_container, new_container)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/PreviewModal.jsx', 'w') as f:
    f.write(c)
