const fs = require('fs');
const path = 'src/pages/admin/components/ProductEditorDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldHighlight = `highlight: Array.isArray(initialData.highlight) ? initialData.highlight : [],`;
const newHighlight = `highlight: Array.isArray(initialData.tags) ? initialData.tags : (Array.isArray(initialData.highlight) ? initialData.highlight : []),`;

code = code.replace(oldHighlight, newHighlight);
fs.writeFileSync(path, code);
