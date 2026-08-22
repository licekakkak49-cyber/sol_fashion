const fs = require('fs');
const path = 'src/components/SizeGuideDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace('<th>SOL Fashion</th>', '<th>SOL</th>');

fs.writeFileSync(path, code);
