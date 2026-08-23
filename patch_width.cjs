const fs = require('fs');
const path = 'src/pages/admin/components/ProductEditorDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/<div style=\{\{ width: '100%' \}\}>/g, "<div style={{ flex: '1 1 auto', minWidth: '320px' }}>");
code = code.replace(/<div style=\{\{ flex: 1 \}\}>/g, "<div style={{ flex: '1 1 auto', minWidth: '300px' }}>");
// Change the outer flex to allow wrap
code = code.replace(/<div style=\{\{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '16px' \}\}>/g, "<div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start', marginBottom: '16px' }}>");

fs.writeFileSync(path, code);
