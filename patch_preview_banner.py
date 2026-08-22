import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/PreviewModal.jsx', 'r') as f:
    c = f.read()

banner_code = """
      {/* Sticky Alert Banner */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        background: '#f59e0b',
        color: '#fff',
        textAlign: 'center',
        padding: '12px',
        fontWeight: 600,
        fontSize: '14px',
        zIndex: 10000,
        boxShadow: '0 -4px 12px rgba(0,0,0,0.2)'
      }}>
        <span style={{ marginRight: '8px' }}>👁️</span>
        PREVIEW MODE — You are viewing a simulation. Changes are not live until published.
      </div>
    </div>
  );
};"""

c = c.replace("""    </div>
  );
};""", banner_code)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/PreviewModal.jsx', 'w') as f:
    f.write(c)
