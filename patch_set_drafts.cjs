const fs = require('fs');
const path = 'src/pages/ProductsPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldSetItems = `            const product = (products || []).find(p => p.id === setItem.productId);
            return product ? { ...product, layoutSize: setItem.layoutSize } : null;`;

const newSetItems = `            const product = (products || []).find(p => p.id === setItem.productId);
            if (!product) return null;
            if (!previewSets && product.status === 'draft') return null;
            return { ...product, layoutSize: setItem.layoutSize };`;

code = code.replace(oldSetItems, newSetItems);
fs.writeFileSync(path, code);
