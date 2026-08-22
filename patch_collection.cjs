const fs = require('fs');
const path = 'src/components/CollectionHighlight.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldLogic = `  const { products } = useAdmin();
  const featuredProducts = products.slice(3, 7); // Using items 3-6 which are Look 1-4`;

const newLogic = `  // Hardcoded homepage highlights (ignoring database)
  const featuredProducts = [
    {"id": "4", "name": "Everyday Crossbody", "price": 7463, "image": "https://alemais.com/cdn/shop/files/8230A-1_6000x.jpg?v=1783657629"},
    {"id": "5", "name": "Woven Beach Tote", "price": 7742, "image": "https://alemais.com/cdn/shop/files/alemais-sustainable-jacket-spur-denim-jacket-1253883487_6000x.jpg?v=1786475956"},
    {"id": "6", "name": "Quilted Mini Bag", "price": 8078, "image": "https://alemais.com/cdn/shop/files/8076D_c7fc4759-d747-4c18-bf25-389f7b0219b0_6000x.jpg?v=1786332923"},
    {"id": "7", "name": "Slouchy Shoulder Bag", "price": 1935, "image": "https://alemais.com/cdn/shop/files/8116S_2b259435-913b-40d0-820f-da3729472494_6000x.jpg?v=1786333610"}
  ];`;

code = code.replace(oldLogic, newLogic);
code = code.replace(`import { useAdmin } from '../context/AdminContext';\n`, '');

fs.writeFileSync(path, code);
