const fs = require('fs');
const path = 'src/pages/ProductDetailPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const badBlock = `{availableSizes.map((size) => {
                                        const hasVariant = !!activeVariant;
                                        const isOutOfStock = hasVariant && (!activeVariant.stock || !activeVariant.stock[size] || activeVariant.stock[size] < 1);
                                        return (
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
                      })()}
                ))}`;
                
const goodBlock = `{availableSizes.map((size) => {
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
                })}`;

code = code.replace(badBlock, goodBlock);
fs.writeFileSync(path, code);
