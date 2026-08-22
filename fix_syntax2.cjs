const fs = require('fs');
const path = 'src/pages/ProductDetailPage.jsx';
let code = fs.readFileSync(path, 'utf8');

// Find the index of `{(() => {`
const idx = code.indexOf('{(() => {');
if (idx > -1) {
  // It's still there! That means my previous replace didn't work.
  const startToReplace = code.substring(idx - 100, idx + 100);
  console.log("Found:", startToReplace);
}

// Let's just fix it manually.
const badCode = `{availableSizes.map((size) => (
                                        {(() => {`;
const goodCode = `{availableSizes.map((size) => {
                                        const hasVariant = !!activeVariant;
                                        const isOutOfStock = hasVariant && (!activeVariant.stock || !activeVariant.stock[size] || activeVariant.stock[size] < 1);
                                        return (`;

code = code.replace(badCode, goodCode);

const badEnd = `                            </button>
                          );
                        })()}
                      ))}`;
const goodEnd = `                            </button>
                          );
                      })}`;

code = code.replace(badEnd, goodEnd);

fs.writeFileSync(path, code);
