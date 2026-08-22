const fs = require('fs');
const path = 'src/pages/admin/components/ProductEditorDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldHighlights = `const highlightOptions = [{label: 'New Arrival', value: 'New Arrival'}, {label: 'Best Seller', value: 'Best Seller'}];`;
const newHighlights = `const highlightOptions = [{label: 'New', value: 'new'}];`;

code = code.replace(oldHighlights, newHighlights);
fs.writeFileSync(path, code);
