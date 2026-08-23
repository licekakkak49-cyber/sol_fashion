import re

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'r') as f:
    code = f.read()

code = code.replace("import { X, UploadCloud, Link } from 'lucide-react';", "import { X, UploadCloud, Link, Layout } from 'lucide-react';")

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'w') as f:
    f.write(code)
