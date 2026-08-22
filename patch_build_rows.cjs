const fs = require('fs');

const path = 'src/pages/ProductsPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldBuildRows = `    const buildRows = (items) => {
      const rows = [];
      let currentBlock = [];
      let currentCapacity = 4;
      let currentBlocksInRow = [];
      let currentRowType = null;

      const pushCurrentBlock = () => {
        if (currentBlock.length > 0) {
          currentBlocksInRow.push({ type: currentRowType || 'standard', items: currentBlock });
          currentBlock = [];
          currentCapacity = 4;
        }
        
        const maxBlocks = currentRowType === 'wide' ? 1 : 2;
        
        if (currentBlocksInRow.length === maxBlocks) {
          rows.push({ type: currentRowType || 'standard', blocks: currentBlocksInRow });
          currentBlocksInRow = [];
          currentRowType = null;
        }
      };

      items.forEach(product => {
        const layoutSize = product.layoutSize || (product.isLarge ? 'large' : 'small');
        const productType = layoutSize === 'wide' ? 'wide' : 'standard';
        const requiredCapacity = layoutSize === 'large' ? 4 : 1;
        
        if (currentRowType !== null && currentRowType !== productType) {
          pushCurrentBlock();
          if (currentBlocksInRow.length > 0) {
            rows.push({ type: currentRowType, blocks: currentBlocksInRow });
            currentBlocksInRow = [];
          }
        }
        
        currentRowType = productType;
        
        if (requiredCapacity > currentCapacity && currentBlock.length > 0) {
          pushCurrentBlock();
        }

        currentBlock.push(product);
        currentCapacity -= requiredCapacity;

        if (currentCapacity === 0) {
          pushCurrentBlock();
        }
      });

      if (currentBlock.length > 0) {
        currentBlocksInRow.push({ type: currentRowType || 'standard', items: currentBlock });
      }
      if (currentBlocksInRow.length > 0) {
        rows.push({ type: currentRowType || 'standard', blocks: currentBlocksInRow });
      }

      return rows;
    };`;

const newBuildRows = `    const buildRows = (items) => {
      const rows = [];
      let i = 0;
      
      while (i < items.length) {
        const getLayoutSize = (item) => item.layoutSize || (item.isLarge ? 'large' : 'small');
        
        // Pattern 1: 4 smalls + 1 large (Large on right)
        if (
          i + 4 < items.length &&
          getLayoutSize(items[i]) === 'small' &&
          getLayoutSize(items[i+1]) === 'small' &&
          getLayoutSize(items[i+2]) === 'small' &&
          getLayoutSize(items[i+3]) === 'small' &&
          getLayoutSize(items[i+4]) === 'large'
        ) {
          rows.push({
            type: 'standard',
            blocks: [
              { type: 'standard', items: [items[i], items[i+1], items[i+2], items[i+3]] },
              { type: 'standard', items: [items[i+4]] }
            ]
          });
          i += 5;
        }
        // Pattern 2: 1 large + 4 smalls (Large on left)
        else if (
          i + 4 < items.length &&
          getLayoutSize(items[i]) === 'large' &&
          getLayoutSize(items[i+1]) === 'small' &&
          getLayoutSize(items[i+2]) === 'small' &&
          getLayoutSize(items[i+3]) === 'small' &&
          getLayoutSize(items[i+4]) === 'small'
        ) {
          rows.push({
            type: 'standard',
            blocks: [
              { type: 'standard', items: [items[i]] },
              { type: 'standard', items: [items[i+1], items[i+2], items[i+3], items[i+4]] }
            ]
          });
          i += 5;
        }
        // Pattern 3: 4 smalls (Row)
        else if (
          i + 3 < items.length &&
          getLayoutSize(items[i]) === 'small' &&
          getLayoutSize(items[i+1]) === 'small' &&
          getLayoutSize(items[i+2]) === 'small' &&
          getLayoutSize(items[i+3]) === 'small'
        ) {
          rows.push({
            type: 'standard',
            blocks: [
              { type: 'standard', items: [items[i], items[i+1], items[i+2], items[i+3]] }
            ]
          });
          i += 4;
        }
        // Fallback: Pack remaining items greedily (like old algorithm but strictly enforcing capacity)
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
        }
      }
      return rows;
    };`;

code = code.replace(oldBuildRows, newBuildRows);

fs.writeFileSync(path, code);
