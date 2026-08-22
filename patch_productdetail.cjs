const fs = require('fs');
const path = 'src/pages/ProductDetailPage.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Setup useEffect to initialize activeVariant
const oldInit = `const [activeVariant, setActiveVariant] = useState(null);`;
const newInit = `const [activeVariant, setActiveVariant] = useState(null);

  useEffect(() => {
    if (product?.colorVariants?.length > 0) {
      const mainVar = product.colorVariants.find(v => v.isMain);
      setActiveVariant(mainVar || product.colorVariants[0]);
    }
  }, [product]);`;
code = code.replace(oldInit, newInit);

// 2. Add size selection and check stock for rendering size buttons
const oldDesktopSizeBtn = `<button 
                        key={size}
                        className={\`\${styles.sizeOptionBtn} \${selectedSize === size ? styles.selected : ''}\`}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                      >
                        {size}
                      </button>`;
const newDesktopSizeBtn = `
                      {(() => {
                        const hasVariant = !!activeVariant;
                        const stockAmt = hasVariant && activeVariant.stock ? activeVariant.stock[size] : 1; // if no stock defined, assume 1 to be safe, but generally it should be 0 if tracking
                        const isOutOfStock = hasVariant && (!activeVariant.stock || !activeVariant.stock[size] || activeVariant.stock[size] < 1);
                        return (
                          <button 
                            key={size}
                            className={\`\${styles.sizeOptionBtn} \${selectedSize === size ? styles.selected : ''} \${isOutOfStock ? styles.disabledSizeBtn : ''}\`}
                            onClick={() => {
                              if (isOutOfStock) return;
                              setSelectedSize(size);
                              setSizeError(false);
                            }}
                            disabled={isOutOfStock}
                            title={isOutOfStock ? 'Out of stock' : ''}
                          >
                            {size}
                          </button>
                        );
                      })()}
`;
// Need to carefully replace this. I'll use a regex or string replacement.
code = code.replace(/<button[^>]*key=\{size\}[^>]*className=\{`\$\{styles\.sizeOptionBtn\}.*?<\/button>/s, newDesktopSizeBtn);

// Also patch the mobile size drawer
const oldMobileSizeBtn = `<button 
                        key={size}
                        className={\`\${styles.mobileSizeOption} \${selectedSize === size ? styles.mobileSelected : ''}\`}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                          setIsMobileSizeDrawerOpen(false);
                        }}
                      >
                        <span>{size}</span>
                      </button>`;
const newMobileSizeBtn = `                      {(() => {
                        const hasVariant = !!activeVariant;
                        const isOutOfStock = hasVariant && (!activeVariant.stock || !activeVariant.stock[size] || activeVariant.stock[size] < 1);
                        return (
                          <button 
                            key={size}
                            className={\`\${styles.mobileSizeOption} \${selectedSize === size ? styles.mobileSelected : ''} \${isOutOfStock ? styles.disabledSizeBtn : ''}\`}
                            onClick={() => {
                              if (isOutOfStock) return;
                              setSelectedSize(size);
                              setSizeError(false);
                              setIsMobileSizeDrawerOpen(false);
                            }}
                            disabled={isOutOfStock}
                          >
                            <span style={{ textDecoration: isOutOfStock ? 'line-through' : 'none' }}>{size}</span>
                            {isOutOfStock && <span style={{fontSize: '12px', color: '#999', marginLeft: 'auto'}}>Out of stock</span>}
                          </button>
                        );
                      })()}`;
code = code.replace(/<button[^>]*key=\{size\}[^>]*className=\{`\$\{styles\.mobileSizeOption\}.*?<\/button>/s, newMobileSizeBtn);


fs.writeFileSync(path, code);
