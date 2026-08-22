const fs = require('fs');
const path = 'src/context/AdminContext.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove MOCK_PRODUCTS block
const mockProductsRegex = /const MOCK_PRODUCTS = \[[^\]]+\];/s;
code = code.replace(mockProductsRegex, 'const MOCK_PRODUCTS = [];');

// 2. Change sets initial state
const oldSetsState = `  const [sets, setSets] = useState(() => {
    const saved = localStorage.getItem('sol_sets_v1');
    return saved ? JSON.parse(saved) : [];
  });`;
const newSetsState = `  const [sets, setSets] = useState([]);`;
code = code.replace(oldSetsState, newSetsState);

// 3. Remove sets localStorage save
const oldSetsEffect = `  useEffect(() => {
    localStorage.setItem('sol_sets_v1', JSON.stringify(sets));
  }, [sets]);`;
code = code.replace(oldSetsEffect, '');

// 4. Change products initial state
const oldProductsState = `  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('sol_products_v6');
    let parsed = saved ? JSON.parse(saved) : MOCK_PRODUCTS;
    
    // Auto-inject the new items if they don't exist yet
    if (!parsed.find(p => p.id === '8')) {
      const existingIds = parsed.map(p => p.id);
      const newMocks = MOCK_PRODUCTS.filter(m => !existingIds.includes(m.id));
      parsed = [...parsed, ...newMocks];
    }
    
    return parsed;
  });`;
const newProductsState = `  const [products, setProducts] = useState([]);`;
code = code.replace(oldProductsState, newProductsState);

// 5. Remove products localStorage save
const oldProductsEffect = `  useEffect(() => {
    try { localStorage.setItem('sol_products_v6', JSON.stringify(products)); } catch (e) { console.error('LocalStorage Quota Exceeded:', e); alert('Storage limit reached! Please delete some old products to free up space.'); }
  }, [products]);`;
code = code.replace(oldProductsEffect, '');

fs.writeFileSync(path, code);
