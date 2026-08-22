const fs = require('fs');
const path = 'src/pages/ProductDetailPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldDisplayImages = `  const displayImages = product 
    ? (product.hoverImage ? [product.image, product.hoverImage] : [product.image]) 
    : MOCK_IMAGES;`;

const newDisplayImages = `  const displayImages = product 
    ? [product.image, product.hoverImage, ...(product.galleryImages || [])].filter(Boolean)
    : MOCK_IMAGES;`;

code = code.replace(oldDisplayImages, newDisplayImages);
fs.writeFileSync(path, code);
