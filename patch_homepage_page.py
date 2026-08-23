import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

# Replace the content area wrapper to use negative margins to negate AdminLayout padding
code = code.replace(
    "<div className={styles.contentArea} style={{ padding: '20px 0', backgroundColor: '#f9fafb' }}>",
    "<div className={styles.contentArea} style={{ margin: '0 -12px 0 -20px', backgroundColor: '#fff' }}>"
)

# Remove the max-width and box shadow
code = code.replace(
    "<div style={{ maxWidth: '1440px', margin: '0 auto', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>",
    "<div style={{ width: '100%', background: '#fff' }}>"
)

# Move the floating controls to the right side so they don't get cut off
code = code.replace(
    "<div style={{ position: 'absolute', left: '-50px', top: '24px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>",
    "<div style={{ position: 'absolute', right: '16px', top: '16px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>"
)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
