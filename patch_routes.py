import re

with open('src/App.jsx', 'r') as f:
    app_jsx = f.read()

# Add import
app_jsx = app_jsx.replace(
    "import ManageContentEditor from './pages/admin/ManageContentEditor';",
    "import ManageContentEditor from './pages/admin/ManageContentEditor';\nimport ManageHomepagePage from './pages/admin/ManageHomepagePage';"
)

# Add route
app_jsx = app_jsx.replace(
    "<Route index element={<Navigate to=\"/admin/products\" replace />} />",
    "<Route index element={<Navigate to=\"/admin/products\" replace />} />\n          <Route path=\"homepage\" element={<ManageHomepagePage />} />"
)

with open('src/App.jsx', 'w') as f:
    f.write(app_jsx)

with open('src/pages/admin/AdminLayout.jsx', 'r') as f:
    layout = f.read()

# Add NavLink
layout = layout.replace(
    '</nav>',
    '  <NavLink to="/admin/homepage" className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : \'\'}`}>\n            <Globe size={18} />\n            <span>Homepage</span>\n          </NavLink>\n        </nav>'
)
# Make sure Globe is imported
if 'Globe' not in layout:
    layout = layout.replace(
        'import {',
        'import { Globe,'
    )

with open('src/pages/admin/AdminLayout.jsx', 'w') as f:
    f.write(layout)
