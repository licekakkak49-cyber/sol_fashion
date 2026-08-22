const fs = require('fs');
const path = 'src/pages/ProductsPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldFilter = `      // 1. Navigation & Category Pill Filtering
      if (mainParam === 'New In' || activeCategory === 'New In') {`;

const newFilter = `      // 0. Status check (exclude drafts)
      if (!previewSets && product.status === 'draft') return false;

      // 1. Navigation & Category Pill Filtering
      if (mainParam === 'New In' || activeCategory === 'New In') {`;

code = code.replace(oldFilter, newFilter);
fs.writeFileSync(path, code);
