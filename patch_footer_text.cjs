const fs = require('fs');
const path = 'src/components/SizeGuideDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldText = 'Size, fit and measurements may vary from one style to another, which means there might be slight differences in items fit.';
const newText = 'Please note that measurements and fit may vary slightly depending on the specific design and cut of each item.';

code = code.replace(oldText, newText);
fs.writeFileSync(path, code);
