const fs = require('fs');
const path = 'src/components/SizeGuideDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldIntro = "<p style={{ marginBottom: '24px' }}>In order to select the correct clothing size, we recommend you take the following measurements using a soft tape measure. If necessary, ask someone else to help.</p>";
const newIntro = "<p style={{ marginTop: '16px', marginBottom: '32px' }}>In order to select the correct clothing size, we recommend you take the following measurements using a soft tape measure. If necessary, ask someone else to help.</p>";

code = code.replace(oldIntro, newIntro);
fs.writeFileSync(path, code);
