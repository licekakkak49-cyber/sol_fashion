const fs = require('fs');
const path = 'src/pages/ProductsPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldGetCategoryCount = `  const getCategoryCount = (cat) => {
    if (cat === 'View all') return products?.length || 0;
    const mockCounts = {
      'New In': 24,
      'SOL Fall 2026': 42,
      'Bags': 18,
      'Dresses': 12,
      'Tops': 20,
      'Bottoms': 15,
      'Accessories': 32
    };
    return mockCounts[cat] || 0;
  };`;

const newGetCategoryCount = `  const getCategoryCount = (cat) => {
    if (!products) return 0;
    
    return products.filter(p => {
       // Must not be draft
       if (!previewSets && (p.status || 'draft').toLowerCase() === 'draft') return false;
       
       if (cat === 'View all') {
          if (mainParam && mainParam !== 'Explore' && mainParam !== 'New In') {
             return p.mainCategory === mainParam;
          }
          if (mainParam === 'New In') {
             return p.tags && (p.tags.includes('new') || p.tags.includes('New In'));
          }
          return true;
       }
       
       if (cat === 'New In') {
          return p.tags && (p.tags.includes('new') || p.tags.includes('New In'));
       }
       
       if (mainParam && mainParam !== 'Explore' && mainParam !== 'New In') {
          if (p.mainCategory !== mainParam) return false;
       }
       
       return p.subCategory === cat || p.mainCategory === cat;
    }).length;
  };`;

code = code.replace(oldGetCategoryCount, newGetCategoryCount);
fs.writeFileSync(path, code);
