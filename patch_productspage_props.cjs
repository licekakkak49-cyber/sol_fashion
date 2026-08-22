const fs = require('fs');
const path = 'src/pages/ProductsPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldProps = `                            colors={product.colors}
                            selectedColor={product.selectedColor}
                            extraColorsCount={product.extraColorsCount}`;

const newProps = `                            colors={product.colors}
                            colorVariants={product.colorVariants}
                            selectedColor={product.selectedColor}
                            extraColorsCount={product.extraColorsCount}`;

code = code.replace(oldProps, newProps);
fs.writeFileSync(path, code);
