const fs = require('fs');

// 1. Patch ProductsPage.jsx
const path1 = 'src/pages/ProductsPage.jsx';
let code1 = fs.readFileSync(path1, 'utf8');

const oldPattern1 = `        // Pattern 1: 4 smalls + 1 large (Large on right)
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
        }`;

const newPattern1 = `        // Pattern 1: 4 smalls + 1 large (Large on right)
        if (
          i + 4 < items.length &&
          getLayoutSize(items[i]) === 'small' &&
          getLayoutSize(items[i+1]) === 'small' &&
          (
            (getLayoutSize(items[i+2]) === 'small' && getLayoutSize(items[i+3]) === 'small' && getLayoutSize(items[i+4]) === 'large') ||
            (getLayoutSize(items[i+2]) === 'large' && getLayoutSize(items[i+3]) === 'small' && getLayoutSize(items[i+4]) === 'small')
          )
        ) {
          const smalls = [items[i], items[i+1], items[i+2], items[i+3], items[i+4]].filter(item => getLayoutSize(item) === 'small');
          const large = [items[i], items[i+1], items[i+2], items[i+3], items[i+4]].find(item => getLayoutSize(item) === 'large');
          
          rows.push({
            type: 'standard',
            blocks: [
              { type: 'standard', items: smalls },
              { type: 'standard', items: [large] }
            ]
          });
          i += 5;
        }`;

code1 = code1.replace(oldPattern1, newPattern1);
fs.writeFileSync(path1, code1);

// 2. Patch SetsManager.jsx
const path2 = 'src/pages/admin/components/SetsManager.jsx';
let code2 = fs.readFileSync(path2, 'utf8');

const oldPattern2 = `       // Look ahead: Game Map pattern (4 smalls + 1 large)
       if (
         i + 4 < setProducts.length &&
         setProducts[i].layoutSize === 'small' &&
         setProducts[i+1].layoutSize === 'small' &&
         setProducts[i+2].layoutSize === 'small' &&
         setProducts[i+3].layoutSize === 'small' &&
         setProducts[i+4].layoutSize === 'large'
       ) {
          blockMarkers.push({ y: currentY, startIndex: i, length: 5, type: '4+1' });
          layout.push({ i: setProducts[i].id,   x: 0, y: currentY, w: 1, h: 1 });
          layout.push({ i: setProducts[i+1].id, x: 1, y: currentY, w: 1, h: 1 });
          layout.push({ i: setProducts[i+2].id, x: 0, y: currentY+1, w: 1, h: 1 });
          layout.push({ i: setProducts[i+3].id, x: 1, y: currentY+1, w: 1, h: 1 });
          layout.push({ i: setProducts[i+4].id, x: 2, y: currentY, w: 2, h: 2 });
          
          for(let j=0; j<5; j++) renderItems.push({ isPlaceholder: setProducts[i+j].isPlaceholder, product: setProducts[i+j] });
          i += 5;
          currentY += 2;
       }`;

const newPattern2 = `       // Look ahead: Game Map pattern (4 smalls + 1 large)
       if (
         i + 4 < setProducts.length &&
         setProducts[i].layoutSize === 'small' &&
         setProducts[i+1].layoutSize === 'small' &&
         (
           (setProducts[i+2].layoutSize === 'small' && setProducts[i+3].layoutSize === 'small' && setProducts[i+4].layoutSize === 'large') ||
           (setProducts[i+2].layoutSize === 'large' && setProducts[i+3].layoutSize === 'small' && setProducts[i+4].layoutSize === 'small')
         )
       ) {
          const blockItems = [setProducts[i], setProducts[i+1], setProducts[i+2], setProducts[i+3], setProducts[i+4]];
          const smalls = blockItems.filter(p => p.layoutSize === 'small');
          const large = blockItems.find(p => p.layoutSize === 'large');
          
          blockMarkers.push({ y: currentY, startIndex: i, length: 5, type: '4+1' });
          layout.push({ i: smalls[0].id, x: 0, y: currentY, w: 1, h: 1 });
          layout.push({ i: smalls[1].id, x: 1, y: currentY, w: 1, h: 1 });
          layout.push({ i: smalls[2].id, x: 0, y: currentY+1, w: 1, h: 1 });
          layout.push({ i: smalls[3].id, x: 1, y: currentY+1, w: 1, h: 1 });
          layout.push({ i: large.id, x: 2, y: currentY, w: 2, h: 2 });
          
          for(let j=0; j<5; j++) renderItems.push({ isPlaceholder: blockItems[j].isPlaceholder, product: blockItems[j] });
          i += 5;
          currentY += 2;
       }`;

code2 = code2.replace(oldPattern2, newPattern2);
fs.writeFileSync(path2, code2);

