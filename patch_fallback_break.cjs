const fs = require('fs');
const path = 'src/pages/ProductsPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldFallback = `            if (req === 4) { // large item takes whole block
              if (currentBlock.length > 0) {
                blocks.push({ type: 'standard', items: currentBlock });
                currentBlock = [];
              }
              if (blocks.length < 2) {
                blocks.push({ type: 'standard', items: [items[i]] });
                i++;
              }
              break; // Row is full if we added it, or we continue on next row
            } else {`;

const newFallback = `            if (req === 4) { // large item takes whole block
              if (currentBlock.length > 0) {
                blocks.push({ type: 'standard', items: currentBlock });
                currentBlock = [];
                currentCapacity = 4;
              }
              if (blocks.length < 2) {
                blocks.push({ type: 'standard', items: [items[i]] });
                i++;
              }
              if (blocks.length === 2) break;
              continue;
            } else {`;

code = code.replace(oldFallback, newFallback);
fs.writeFileSync(path, code);
