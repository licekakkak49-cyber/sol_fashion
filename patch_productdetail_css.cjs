const fs = require('fs');
const path = 'src/pages/ProductDetailPage.module.css';
let css = fs.readFileSync(path, 'utf8');

const newCSS = `
.disabledSizeBtn {
  opacity: 0.3 !important;
  cursor: not-allowed !important;
  text-decoration: line-through;
  background-color: #f9f9f9 !important;
  color: #ccc !important;
  border-color: #eee !important;
}
`;

if (!css.includes('.disabledSizeBtn')) {
  fs.writeFileSync(path, css + newCSS);
}
