const fs = require('fs');
const path = 'src/pages/ProductsPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldFallback = `        // Fallback: Pack remaining items greedily (like old algorithm but strictly enforcing capacity)
        else {
          const blocks = [];
          let currentBlock = [];
          let currentCapacity = 4;
          
          while (i < items.length && blocks.length < 2) {
            const size = getLayoutSize(items[i]);
            const req = size === 'large' ? 4 : (size === 'wide' ? 8 : 1); // wide unsupported here really
            
            if (req > currentCapacity && currentBlock.length > 0) {
              blocks.push({ type: 'standard', items: currentBlock });
              currentBlock = [];
              currentCapacity = 4;
              if (blocks.length === 2) break; // Row is full
            }
            
            if (req === 4) { // large item takes whole block
              if (currentBlock.length > 0) {
                blocks.push({ type: 'standard', items: currentBlock });
                currentBlock = [];
              }
              if (blocks.length < 2) {
                blocks.push({ type: 'standard', items: [items[i]] });
                i++;
              }
              break; // Row is full if we added it, or we continue on next row
            } else {
              currentBlock.push(items[i]);
              currentCapacity -= req;
              i++;
              
              if (currentCapacity === 0) {
                blocks.push({ type: 'standard', items: currentBlock });
                currentBlock = [];
                currentCapacity = 4;
              }
            }
          }
          
          if (currentBlock.length > 0 && blocks.length < 2) {
            blocks.push({ type: 'standard', items: currentBlock });
          }
          
          if (blocks.length > 0) {
            rows.push({ type: 'standard', blocks });
          }
        }`;

const newFallback = `        // Wide support
        else if (getLayoutSize(items[i]) === 'wide') {
          rows.push({
            type: 'wide',
            blocks: [{ type: 'wide', items: [items[i]] }]
          });
          i++;
        }
        // Fallback: Pack remaining items greedily (like old algorithm but strictly enforcing capacity)
        else {
          const blocks = [];
          let currentBlock = [];
          let currentCapacity = 4;
          
          while (i < items.length && blocks.length < 2) {
            const size = getLayoutSize(items[i]);
            if (size === 'wide') break; // break out to handle wide in next iteration
            
            const req = size === 'large' ? 4 : 1;
            
            if (req > currentCapacity && currentBlock.length > 0) {
              blocks.push({ type: 'standard', items: currentBlock });
              currentBlock = [];
              currentCapacity = 4;
              if (blocks.length === 2) break; // Row is full
            }
            
            if (req === 4) { // large item takes whole block
              if (currentBlock.length > 0) {
                blocks.push({ type: 'standard', items: currentBlock });
                currentBlock = [];
              }
              if (blocks.length < 2) {
                blocks.push({ type: 'standard', items: [items[i]] });
                i++;
              }
              break; // Row is full if we added it, or we continue on next row
            } else {
              currentBlock.push(items[i]);
              currentCapacity -= req;
              i++;
              
              if (currentCapacity === 0) {
                blocks.push({ type: 'standard', items: currentBlock });
                currentBlock = [];
                currentCapacity = 4;
              }
            }
          }
          
          if (currentBlock.length > 0 && blocks.length < 2) {
            blocks.push({ type: 'standard', items: currentBlock });
          }
          
          if (blocks.length > 0) {
            rows.push({ type: 'standard', blocks });
          }
        }`;

code = code.replace(oldFallback, newFallback);
fs.writeFileSync(path, code);
