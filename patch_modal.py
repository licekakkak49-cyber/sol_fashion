import re

with open('src/pages/admin/components/HomepagePreviewModal.jsx', 'r') as f:
    code = f.read()

# Replace ProductsPage import with HomePage
code = code.replace("import ProductsPage from '../../ProductsPage';", "import HomePage from '../../HomePage';")

# Replace PreviewModal definition
code = code.replace("const PreviewModal = ({ sets, onClose }) => {", "const HomepagePreviewModal = ({ items, onClose }) => {")

# Replace the component render
code = code.replace("<ProductsPage previewSets={sets} />", "<HomePage previewItems={items} />")

# Replace the banner text
code = code.replace("Preview Mode — Showing only product grid.", "Preview Mode — Showing only homepage layout.")

# Replace export
code = code.replace("export default PreviewModal;", "export default HomepagePreviewModal;")

with open('src/pages/admin/components/HomepagePreviewModal.jsx', 'w') as f:
    f.write(code)
