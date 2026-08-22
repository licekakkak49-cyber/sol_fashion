const fs = require('fs');
const path = 'src/context/AdminContext.jsx';
let code = fs.readFileSync(path, 'utf8');

// Replace the products state manually using regex
const regex = /const \[products, setProducts\] = useState\(\(\) => \{[\s\S]*?\}\);/m;
code = code.replace(regex, 'const [products, setProducts] = useState([]);');

fs.writeFileSync(path, code);
