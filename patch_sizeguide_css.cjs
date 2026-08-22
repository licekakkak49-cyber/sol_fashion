const fs = require('fs');
const path = 'src/components/SizeGuideDrawer.module.css';
let css = fs.readFileSync(path, 'utf8');

const oldContent = `.content {
  flex: 1;
  overflow-y: auto;
  padding: 0 32px 32px;
}`;

const newContent = `.content {
  flex: 1;
  overflow-y: auto;
  padding: 0 32px 32px;
  display: flex;
  flex-direction: column;
}`;

css = css.replace(oldContent, newContent);
fs.writeFileSync(path, css);
