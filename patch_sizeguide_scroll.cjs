const fs = require('fs');

// 1. Update JSX Data
const jsxPath = 'src/components/SizeGuideDrawer.jsx';
let jsxCode = fs.readFileSync(jsxPath, 'utf8');

const oldRtw = `  const rtwData = {
    brands: ['XXS/32', 'XS/34', 'S/36', 'M/38', 'L/40'],
    denim: ['23', '24-25', '26-27', '28-29', '30-31'],
    uk: ['4', '6', '8', '10', '12'],
    us: ['0', '2', '4', '6', '8'],
    france: ['32', '34', '36', '38', '40'],
    italy: ['36', '38', '40', '42', '44'],
    japan: ['1', '3', '5', '7', '9'],
    korea: ['33', '44', '55', '66', '77']
  };`;

const newRtw = `  const rtwData = {
    brands: ['XXS/32', 'XS/34', 'S/36', 'M/38', 'L/40', 'XL/42', 'XXL/44', 'XXXL/46'],
    denim: ['23', '24-25', '26-27', '28-29', '30-31', '32-33', '34-35', '36-37'],
    uk: ['4', '6', '8', '10', '12', '14', '16', '18'],
    us: ['0', '2', '4', '6', '8', '10', '12', '14'],
    france: ['32', '34', '36', '38', '40', '42', '44', '46'],
    italy: ['36', '38', '40', '42', '44', '46', '48', '50'],
    japan: ['1', '3', '5', '7', '9', '11', '13', '15'],
    korea: ['33', '44', '55', '66', '77', '88', '99', '110']
  };`;

jsxCode = jsxCode.replace(oldRtw, newRtw);

const oldShoe = `  const shoeData = {
    eu: ['35', '36', '37', '38', '39', '40'],
    uk: ['2', '3', '4', '5', '6', '7'],
    us: ['4', '5', '6', '7', '8', '9'],
    japan: ['22', '23', '24', '25', '26', '27'],
    china: ['35', '36', '37', '38', '39', '40']
  };`;

const newShoe = `  const shoeData = {
    eu: ['35', '36', '37', '38', '39', '40', '41'],
    uk: ['2', '3', '4', '5', '6', '7', '8'],
    us: ['4', '5', '6', '7', '8', '9', '10'],
    japan: ['22', '23', '24', '25', '26', '27', '28'],
    china: ['35', '36', '37', '38', '39', '40', '41']
  };`;

jsxCode = jsxCode.replace(oldShoe, newShoe);
fs.writeFileSync(jsxPath, jsxCode);


// 2. Update CSS Data
const cssPath = 'src/components/SizeGuideDrawer.module.css';
let cssCode = fs.readFileSync(cssPath, 'utf8');

const oldTd = `.sizeTable td {
  padding: 16px 8px;
  text-align: center;
  font-family: 'Futura PT', sans-serif;
  font-size: 13px;
  color: #888;
  border-bottom: 1px solid #e5e5e5;
}`;

const newTd = `.sizeTable td {
  padding: 16px 8px;
  text-align: center;
  font-family: 'Futura PT', sans-serif;
  font-size: 13px;
  color: #888;
  border-bottom: 1px solid #e5e5e5;
  white-space: nowrap;
}`;

cssCode = cssCode.replace(oldTd, newTd);

const oldTh = `.sizeTable th {
  padding: 16px 8px;
  text-align: center;
  font-family: 'Futura PT', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #111;
  border-bottom: 1px solid #e5e5e5;
}`;

const newTh = `.sizeTable th {
  padding: 16px 12px;
  text-align: center;
  font-family: 'Futura PT', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #111;
  border-bottom: 1px solid #e5e5e5;
  white-space: nowrap;
}`;

cssCode = cssCode.replace(oldTh, newTh);

// Remove min-width to let white-space: nowrap determine the table width naturally
cssCode = cssCode.replace('min-width: 400px;', '/* min-width removed to let content dictate size */');

fs.writeFileSync(cssPath, cssCode);
