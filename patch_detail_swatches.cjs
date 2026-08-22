const fs = require('fs');
const path = 'src/pages/ProductDetailPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldSwatches = `            {/* Color Swatches */}
            <div className={styles.colorSection}>
              <div className={styles.colorHeader}>
                <div className={styles.swatches}>
                  <button className={\`\${styles.swatchWrapper} \${styles.activeSwatch}\`}>
                    <div className={styles.swatch} style={{ background: '#111' }} />
                  </button>
                  <button className={\`\${styles.swatchWrapper}\`}>
                    <div className={styles.swatch} style={{ background: '#fff', border: '1px solid #ddd' }} />
                  </button>
                </div>
                <span className={styles.colorLabel}>Black</span>
              </div>
              <div className={styles.sectionDivider}></div>
            </div>`;

const newSwatches = `            {/* Color Swatches */}
            {product?.color_variants && product.color_variants.length > 0 && (
              <div className={styles.colorSection}>
                <div className={styles.colorHeader}>
                  <div className={styles.swatches}>
                    {/* Default Product Color (if we want to show it) or just loop variants */}
                    {/* For simplicity, we just loop the variants */}
                    {product.color_variants.map((variant, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveVariant(activeVariant === variant ? null : variant)}
                        className={\`\${styles.swatchWrapper} \${activeVariant === variant ? styles.activeSwatch : ''}\`}
                        title={variant.name}
                      >
                        <div className={styles.swatch} style={{ background: variant.hex, border: variant.hex.toLowerCase() === '#ffffff' ? '1px solid #ddd' : 'none' }} />
                      </button>
                    ))}
                  </div>
                  <span className={styles.colorLabel}>{activeVariant ? activeVariant.name : 'Select a color'}</span>
                </div>
                <div className={styles.sectionDivider}></div>
              </div>
            )}`;

code = code.replace(oldSwatches, newSwatches);
fs.writeFileSync(path, code);
