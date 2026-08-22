const fs = require('fs');
const path = 'src/pages/ProductsPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldFilter = `      // 0. Status check (exclude drafts)
      if (!previewSets && product.status === 'draft') return false;`;

const newFilter = `      // 0. Status check (exclude drafts)
      const pStatus = product.status || 'draft';
      if (!previewSets && pStatus === 'draft') return false;`;

code = code.replace(oldFilter, newFilter);

const oldSetFilter = `            if (!previewSets && product.status === 'draft') return null;`;
const newSetFilter = `            if (!previewSets && (product.status || 'draft') === 'draft') return null;`;

code = code.replace(oldSetFilter, newSetFilter);

fs.writeFileSync(path, code);
