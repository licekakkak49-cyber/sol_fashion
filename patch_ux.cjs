const fs = require('fs');
const path = 'src/pages/admin/components/ProductEditorDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Force initial variant creation for new products
code = code.replace(
  "if (variants.length === 0 && (coverImg || gallImgs.length > 0)) {",
  "if (variants.length === 0) {"
);

// 2. Increase sizes of the images from 60x80 to 100x133
// The container was width: 200px. Let's make it wider, e.g., flex: 1.
// Actually, earlier it was: <div style={{ width: '200px' }}>
// Let's replace width: '200px' with width: '100%'
code = code.replace(/<div style=\{\{ width: '200px' \}\}>/g, "<div style={{ width: '100%' }}>");

// Change 60px to 100px and 80px to 133px for the image wrappers
code = code.replace(/width: '60px', height: '80px'/g, "width: '100px', height: '133px'");

fs.writeFileSync(path, code);
