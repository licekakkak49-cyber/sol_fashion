const fs = require('fs');
const path = 'src/components/SizeGuideDrawer.module.css';
let css = fs.readFileSync(path, 'utf8');

const oldTableCss = `.sizeTable th,
.sizeTable td {
  padding: 16px 8px;
  text-align: center;
  font-family: 'Futura PT', sans-serif;
  font-size: 13px;
  color: #444;
  border-bottom: 1px solid #e5e5e5;
}

.sizeTable th:first-child,
.sizeTable td:first-child {
  text-align: left;
  font-weight: 500;
  color: #111;
  border-right: 1px solid #999;
  width: 100px;
}

.sizeTable th {
  font-weight: 500;
  color: #111;
}`;

const newTableCss = `.sizeTable th {
  padding: 16px 8px;
  text-align: center;
  font-family: 'Futura PT', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #111;
  border-bottom: 1px solid #e5e5e5;
}

.sizeTable td {
  padding: 16px 8px;
  text-align: center;
  font-family: 'Futura PT', sans-serif;
  font-size: 13px;
  color: #888;
  border-bottom: 1px solid #e5e5e5;
}

.sizeTable th:first-child,
.sizeTable td:first-child {
  text-align: left;
  font-weight: 500;
  color: #111;
  border-right: 1px solid #999;
  width: 100px;
}`;

css = css.replace(oldTableCss, newTableCss);
fs.writeFileSync(path, css);
