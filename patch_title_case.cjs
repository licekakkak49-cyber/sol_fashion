const fs = require('fs');
const path = 'src/components/SizeGuideDrawer.module.css';
let css = fs.readFileSync(path, 'utf8');

css = css.replace('text-transform: uppercase;', '/* text-transform removed */');

fs.writeFileSync(path, css);
