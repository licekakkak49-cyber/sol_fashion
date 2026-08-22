const fs = require('fs');
const path = 'src/pages/ProductsPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldUnassignedLogic = `    const unassignedItems = [];
    for (let product of filteredProducts) {
       if (!assignedProductIds.has(product.id) && displayProductCount < visibleCount) {
          unassignedItems.push(product);
          displayProductCount++;
       }
    }`;

const newUnassignedLogic = `    // Gather ALL product IDs that belong to ANY set (published, draft, or filtered out)
    const allAssignedProductIds = new Set();
    (sets || []).forEach(s => {
       (s.items || []).forEach(item => {
          if (!item.isPlaceholder && item.productId) {
             allAssignedProductIds.add(item.productId);
          }
       });
    });

    const unassignedItems = [];
    for (let product of filteredProducts) {
       // Only show products that are NOT in ANY set
       if (!allAssignedProductIds.has(product.id) && displayProductCount < visibleCount) {
          unassignedItems.push(product);
          displayProductCount++;
       }
    }`;

code = code.replace(oldUnassignedLogic, newUnassignedLogic);
fs.writeFileSync(path, code);
