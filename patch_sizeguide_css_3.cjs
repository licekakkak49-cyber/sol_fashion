const fs = require('fs');
const path = 'src/components/SizeGuideDrawer.module.css';
let css = fs.readFileSync(path, 'utf8');

// We will remove max-width: 480px and margin: 0 auto from .innerContainer
// and just let it use normal padding.
css = css.replace('max-width: 480px;', '/* removed */');
css = css.replace('margin: 0 auto;', '/* removed */');

fs.writeFileSync(path, css);
