const fs = require('fs');
const path = 'src/pages/ProductDetailPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const badInjection = `  const getAvailableSizes = () => {
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

code = code.replace(badInjection, '');

const target = `  return (
    <div className={styles.page}>`;

const correctInjection = `  const getAvailableSizes = () => {
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

  return (
    <div className={styles.page}>`;

code = code.replace(target, correctInjection);
fs.writeFileSync(path, code);
