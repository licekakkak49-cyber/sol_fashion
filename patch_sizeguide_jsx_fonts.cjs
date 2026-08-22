const fs = require('fs');
const path = 'src/components/SizeGuideDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

// replace 13px with 14px in body tab
code = code.replace(/fontSize: '13px'/g, "fontSize: '14px'");

// remove <strong> tags from 1. Bust, 2. Waist, 3. Hips
code = code.replace(/<strong>/g, '');
code = code.replace(/<\/strong>/g, '');

fs.writeFileSync(path, code);
