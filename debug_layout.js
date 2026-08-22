const items = [
  { id: 1, layoutSize: 'small' },
  { id: 2, layoutSize: 'small' },
  { id: 3, layoutSize: 'small' },
  { id: 4, layoutSize: 'small' },
  { id: 5, layoutSize: 'large' }
];

const buildRows = (items) => {
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
    const layoutSize = product.layoutSize || 'small';
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
};

console.log(JSON.stringify(buildRows(items), null, 2));

const items2 = [
  { id: 5, layoutSize: 'large' },
  { id: 1, layoutSize: 'small' },
  { id: 2, layoutSize: 'small' },
  { id: 3, layoutSize: 'small' },
  { id: 4, layoutSize: 'small' }
];
console.log("-----");
console.log(JSON.stringify(buildRows(items2), null, 2));

