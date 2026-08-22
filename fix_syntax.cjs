const fs = require('fs');
const path = 'src/pages/ProductDetailPage.jsx';
let code = fs.readFileSync(path, 'utf8');

// Fix Desktop
code = code.replace('{availableSizes.map((size) => (\n                      {(() => {', '{availableSizes.map((size) => {\n                      const hasVariant = !!activeVariant;\n                      const stockAmt = hasVariant && activeVariant.stock ? activeVariant.stock[size] : 1;\n                      const isOutOfStock = hasVariant && (!activeVariant.stock || !activeVariant.stock[size] || activeVariant.stock[size] < 1);\n                      return (\n                        <button');

// We need to remove the trailing \n                      })()}\n                    ))}' for desktop
// Wait, the easiest way is to use regex.
