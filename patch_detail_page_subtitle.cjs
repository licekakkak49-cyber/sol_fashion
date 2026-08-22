const fs = require('fs');
const path = 'src/pages/ProductDetailPage.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Subtitle
const oldTitleRow = `<h1 className={styles.title}>{product ? product.name : 'Mori 02(BR)'}</h1>
                <p className={styles.subtitle}>Ruched fitted dress.</p>`;
const newTitleRow = `<h1 className={styles.title}>{product ? product.name : 'Mori 02(BR)'}</h1>
                {product?.subtitle && <p className={styles.subtitle}>{product.subtitle}</p>}`;
code = code.replace(oldTitleRow, newTitleRow);

// 2. Dynamic Details description
const oldDetails = `<div className={styles.accordionContentInner}>
                      <p>Crafted with precision, this signature piece is designed for both comfort and understated elegance.</p>
                      <br />
                      <p>
                        • Premium quality fabric<br/>
                        • True to size fit<br/>
                        • Dry clean only<br/>
                        • Made in Italy
                      </p>
                    </div>`;
const newDetails = `<div className={styles.accordionContentInner}>
                      <p style={{ whiteSpace: 'pre-wrap' }}>
                        {product?.description || 'No details provided.'}
                      </p>
                    </div>`;
code = code.replace(oldDetails, newDetails);

// 3. Dynamic Sizes Helper
const dynamicSizesLogic = `
  const getAvailableSizes = () => {
    if (!product) return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    if (product.mainCategory === 'Ready to Wear' || product.mainCategory === 'Clothing') {
      return ['XS', 'S', 'M', 'L', 'XL'];
    }
    if (product.mainCategory === 'Accessories & Shoes' && product.subCategory) {
      if (['Sandals', 'Heels', 'Flats', 'Shoes'].includes(product.subCategory)) {
        return ['35', '36', '37', '38', '39', '40', '41', '42'];
      }
      return ['One Size']; 
    }
    if (product.mainCategory === 'Bags') {
      return ['One Size'];
    }
    return ['One Size'];
  };
  const availableSizes = getAvailableSizes();
`;

// Insert the logic before the return statement of the component
const returnIdx = code.indexOf('return (');
code = code.slice(0, returnIdx) + dynamicSizesLogic + '\n  ' + code.slice(returnIdx);

// Replace hardcoded sizes in desktop
const oldDesktopSizes = `                <div className={styles.sizeOptions}>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (`;
const newDesktopSizes = `                <div className={styles.sizeOptions}>
                  {availableSizes.map(size => (`;
code = code.replace(oldDesktopSizes, newDesktopSizes);

// Replace hardcoded sizes in mobile drawer
const oldMobileSizes = `              <div className={styles.mobileSizeDrawerContent}>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (`;
const newMobileSizes = `              <div className={styles.mobileSizeDrawerContent}>
                {availableSizes.map((size) => (`;
code = code.replace(oldMobileSizes, newMobileSizes);

fs.writeFileSync(path, code);
