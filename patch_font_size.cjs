const fs = require('fs');
const path = 'src/pages/admin/components/ProductEditorDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/fontSize:'9px'/g, "fontSize:'11px', padding:'2px'");

fs.writeFileSync(path, code);
