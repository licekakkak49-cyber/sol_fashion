import re
with open('src/components/GlobalFilterPanel.jsx', 'r') as f:
    code = f.read()

# Fix the open bracket that wasn't closed
# First remove the unclosed bracket:
code = code.replace("{dynamicFilterData.line && dynamicFilterData.line.length > 0 && (\n                <div className={styles.accordionItem}>\n                  <button className={styles.accordionHeader} onClick={() => toggleSection('LINE')}>", 
                    "<div className={styles.accordionItem}>\n                  <button className={styles.accordionHeader} onClick={() => toggleSection('LINE')}>")

# Now properly wrap the entire block
old_block = """                <div className={styles.accordionItem}>
                  <button className={styles.accordionHeader} onClick={() => toggleSection('LINE')}>
                    <span>LINE</span>
                    <ChevronDown size={14} strokeWidth={1.5} className={`${styles.chevron} ${openSection === 'LINE' ? styles.chevronOpen : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openSection === 'LINE' && (
                      <motion.div 
                        className={styles.accordionContent}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={styles.accordionInner}>
                          {renderBoxOptions('line', FILTER_DATA.line)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>"""

new_block = """                {dynamicFilterData.line && dynamicFilterData.line.length > 0 && (
                <div className={styles.accordionItem}>
                  <button className={styles.accordionHeader} onClick={() => toggleSection('LINE')}>
                    <span>LINE</span>
                    <ChevronDown size={14} strokeWidth={1.5} className={`${styles.chevron} ${openSection === 'LINE' ? styles.chevronOpen : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openSection === 'LINE' && (
                      <motion.div 
                        className={styles.accordionContent}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={styles.accordionInner}>
                          {renderBoxOptions('line', dynamicFilterData.line)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                )}"""

code = code.replace(old_block, new_block)

with open('src/components/GlobalFilterPanel.jsx', 'w') as f:
    f.write(code)
