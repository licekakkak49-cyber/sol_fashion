const fs = require('fs');
const path = 'src/pages/ProductDetailPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldDisplayImages = `  const displayImages = product 
    ? [product.image, product.hoverImage, ...(product.galleryImages || [])].filter(Boolean)
    : MOCK_IMAGES;`;

const newDisplayImages = `  const [activeVariant, setActiveVariant] = useState(null);
  
  const displayImages = product 
    ? [
        activeVariant ? activeVariant.image : product.image, 
        activeVariant ? null : product.hoverImage, 
        ...(product.galleryImages || [])
      ].filter(Boolean)
    : MOCK_IMAGES;`;

code = code.replace(oldDisplayImages, newDisplayImages);
fs.writeFileSync(path, code);
