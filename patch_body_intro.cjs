const fs = require('fs');
const path = 'src/components/SizeGuideDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldIntro = '<p style={{ marginBottom: \'16px\' }}>To choose the correct size for you, measure your body as follows:</p>';
const newIntro = '<p style={{ marginBottom: \'16px\' }}>In order to select the correct clothing size, we recommend you take the following measurements using a soft tape measure. If necessary, ask someone else to help.</p>';

code = code.replace(oldIntro, newIntro);
fs.writeFileSync(path, code);
