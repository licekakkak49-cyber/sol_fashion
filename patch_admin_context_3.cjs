const fs = require('fs');
const path = 'src/context/AdminContext.jsx';
let code = fs.readFileSync(path, 'utf8');

// I will just use sed or vim or script to clean it up perfectly.
const startIndex = code.indexOf('const [products, setProducts] = useState([');
const endIndex = code.indexOf('  const [categories, setCategories]');
if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + 'const [products, setProducts] = useState([]);\n\n' + code.substring(endIndex);
  fs.writeFileSync(path, code);
}
