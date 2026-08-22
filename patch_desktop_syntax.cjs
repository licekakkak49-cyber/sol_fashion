const fs = require('fs');
const path = 'src/pages/ProductDetailPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldDesktop = `{availableSizes.map(size => (
                    <button 
                      key={size} 
                      className={\`\${styles.sizeBtn} \${selectedSize === size ? styles.activeSizeBtn : ''}\`}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                    >
                      {size}
                    </button>
                  ))}`;
                  
const newDesktop = `{availableSizes.map(size => {
                    const hasVariant = !!activeVariant;
                    const isOutOfStock = hasVariant && (!activeVariant.stock || !activeVariant.stock[size] || activeVariant.stock[size] < 1);
                    return (
                      <button 
                        key={size} 
                        className={\`\${styles.sizeBtn} \${selectedSize === size ? styles.activeSizeBtn : ''} \${isOutOfStock ? styles.disabledSizeBtn : ''}\`}
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
                  })}`;

code = code.replace(oldDesktop, newDesktop);
fs.writeFileSync(path, code);
